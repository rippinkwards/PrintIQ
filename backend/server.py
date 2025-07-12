from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import pymongo
from pymongo import MongoClient
import os
from datetime import datetime
import uuid
from PIL import Image
import secrets
import hashlib
from typing import List, Optional
from pydantic import BaseModel, EmailStr
import json
import aiofiles
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Digital Artist Portfolio API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/portfolio_db")
client = MongoClient(MONGO_URL)
db = client.portfolio_db

# Collections
artworks_collection = db.artworks
contacts_collection = db.contacts
newsletter_collection = db.newsletter
settings_collection = db.settings

# Security
security = HTTPBasic()
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/app/frontend/public/uploads")

# Ensure upload directory exists
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

# Pydantic models
class Artwork(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    price: Optional[float] = None
    category: str
    tags: List[str] = []
    image_url: str
    etsy_url: Optional[str] = None
    gumroad_url: Optional[str] = None
    featured: bool = False
    created_at: Optional[datetime] = None

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

class NewsletterSignup(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class SiteSettings(BaseModel):
    site_title: str = "Digital Artist Portfolio"
    artist_name: str = "Artist Name"
    bio: str = "Artist bio goes here"
    hero_title: str = "Welcome to my world of digital art"
    hero_subtitle: str = "Discover unique wall art and printables"
    etsy_shop_url: str = "https://etsy.com/shop/YourShopName"
    gumroad_url: str = "https://gumroad.com/YourName"
    contact_email: str = "youremail@example.com"

# Admin authentication
def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# Utility functions
def resize_image(image_path: str, max_size: tuple = (1200, 800)):
    """Resize image while maintaining aspect ratio"""
    with Image.open(image_path) as img:
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        img.save(image_path, optimize=True, quality=85)

# API Routes

# Public routes
@app.get("/api/artworks")
async def get_artworks(featured_only: bool = False, limit: int = 50):
    """Get all artworks or featured artworks only"""
    query = {"featured": True} if featured_only else {}
    artworks = list(artworks_collection.find(query).limit(limit))
    for artwork in artworks:
        artwork["_id"] = str(artwork["_id"])
    return {"artworks": artworks}

@app.get("/api/artworks/{artwork_id}")
async def get_artwork(artwork_id: str):
    """Get single artwork by ID"""
    artwork = artworks_collection.find_one({"id": artwork_id})
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    artwork["_id"] = str(artwork["_id"])
    return artwork

@app.post("/api/contact")
async def submit_contact_form(contact: ContactForm):
    """Submit contact form"""
    contact_data = contact.dict()
    contact_data["submitted_at"] = datetime.utcnow()
    contact_data["id"] = str(uuid.uuid4())
    
    contacts_collection.insert_one(contact_data)
    return {"message": "Contact form submitted successfully"}

@app.post("/api/newsletter")
async def newsletter_signup(signup: NewsletterSignup):
    """Newsletter signup"""
    # Check if email already exists
    existing = newsletter_collection.find_one({"email": signup.email})
    if existing:
        return {"message": "Email already subscribed"}
    
    signup_data = signup.dict()
    signup_data["subscribed_at"] = datetime.utcnow()
    signup_data["id"] = str(uuid.uuid4())
    
    newsletter_collection.insert_one(signup_data)
    return {"message": "Successfully subscribed to newsletter"}

@app.get("/api/settings")
async def get_site_settings():
    """Get site settings"""
    settings = settings_collection.find_one()
    if not settings:
        # Create default settings
        default_settings = SiteSettings().dict()
        default_settings["_id"] = "main"
        settings_collection.insert_one(default_settings)
        settings = default_settings
    settings.pop("_id", None)
    return settings

# Admin routes
@app.post("/api/admin/artworks")
async def create_artwork(artwork: Artwork, admin: str = Depends(verify_admin)):
    """Create new artwork (Admin only)"""
    artwork_data = artwork.dict()
    artwork_data["id"] = str(uuid.uuid4())
    artwork_data["created_at"] = datetime.utcnow()
    
    artworks_collection.insert_one(artwork_data)
    return {"message": "Artwork created successfully", "id": artwork_data["id"]}

@app.put("/api/admin/artworks/{artwork_id}")
async def update_artwork(artwork_id: str, artwork: Artwork, admin: str = Depends(verify_admin)):
    """Update artwork (Admin only)"""
    artwork_data = artwork.dict()
    artwork_data.pop("id", None)  # Don't update ID
    
    result = artworks_collection.update_one(
        {"id": artwork_id},
        {"$set": artwork_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    return {"message": "Artwork updated successfully"}

@app.delete("/api/admin/artworks/{artwork_id}")
async def delete_artwork(artwork_id: str, admin: str = Depends(verify_admin)):
    """Delete artwork (Admin only)"""
    result = artworks_collection.delete_one({"id": artwork_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    return {"message": "Artwork deleted successfully"}

@app.post("/api/admin/upload")
async def upload_image(file: UploadFile = File(...), admin: str = Depends(verify_admin)):
    """Upload image file (Admin only)"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1].lower()
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Resize image
    try:
        resize_image(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
    
    # Return relative URL
    image_url = f"/uploads/{filename}"
    return {"image_url": image_url, "filename": filename}

@app.get("/api/admin/contacts")
async def get_contacts(admin: str = Depends(verify_admin)):
    """Get all contact form submissions (Admin only)"""
    contacts = list(contacts_collection.find().sort("submitted_at", -1))
    for contact in contacts:
        contact["_id"] = str(contact["_id"])
    return {"contacts": contacts}

@app.get("/api/admin/newsletter")
async def get_newsletter_subscribers(admin: str = Depends(verify_admin)):
    """Get all newsletter subscribers (Admin only)"""
    subscribers = list(newsletter_collection.find().sort("subscribed_at", -1))
    for subscriber in subscribers:
        subscriber["_id"] = str(subscriber["_id"])
    return {"subscribers": subscribers}

@app.put("/api/admin/settings")
async def update_site_settings(settings: SiteSettings, admin: str = Depends(verify_admin)):
    """Update site settings (Admin only)"""
    settings_data = settings.dict()
    
    settings_collection.update_one(
        {"_id": "main"},
        {"$set": settings_data},
        upsert=True
    )
    
    return {"message": "Settings updated successfully"}

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
async def root():
    return {"message": "Digital Artist Portfolio API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)