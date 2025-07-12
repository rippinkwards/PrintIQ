# Digital Artist Portfolio Website

A modern, responsive portfolio website for digital artists with an admin interface for content management. Built with React frontend, FastAPI backend, and MongoDB database.

## Features

### Public Website
- **Homepage**: Hero section with featured artwork carousel and newsletter signup
- **Gallery**: Filterable artwork collection with search functionality
- **About**: Artist bio and creative process showcase
- **Contact**: Contact form with email validation
- **Responsive Design**: Mobile-first approach with beautiful animations

### Admin Dashboard
- **Secure Login**: Basic authentication for admin access
- **Artwork Management**: Upload images, create/edit/delete artworks
- **Contact Management**: View and respond to contact form submissions
- **Newsletter Management**: View and export newsletter subscribers
- **Site Settings**: Update homepage content, bio, and store links

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion, React Router
- **Backend**: FastAPI, Python 3.9+
- **Database**: MongoDB
- **File Upload**: Local storage with image optimization
- **Authentication**: HTTP Basic Auth for admin routes

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB
- Yarn package manager

### Installation

1. **Backend Setup**
   ```bash
   cd /app/backend
   pip install -r requirements.txt
   ```

2. **Frontend Setup**
   ```bash
   cd /app/frontend
   yarn install
   ```

3. **Environment Configuration**
   
   Backend `.env` file (`/app/backend/.env`):
   ```
   MONGO_URL=mongodb://localhost:27017/portfolio_db
   SECRET_KEY=your-secret-key-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   UPLOAD_DIR=/app/frontend/public/uploads
   ```

   Frontend `.env` file (`/app/frontend/.env`):
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

### Running the Application

#### Using Supervisor (Recommended)
```bash
sudo supervisorctl restart all
sudo supervisorctl status
```

#### Manual Start
1. **Start Backend**:
   ```bash
   cd /app/backend
   python server.py
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd /app/frontend
   yarn start
   ```

### Access URLs
- **Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin
- **API Docs**: http://localhost:8001/docs

## Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change these credentials in production by updating the `.env` file.

## API Endpoints

### Public Endpoints
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/{id}` - Get single artwork
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Newsletter signup
- `GET /api/settings` - Get site settings

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/artworks` - Create artwork
- `PUT /api/admin/artworks/{id}` - Update artwork
- `DELETE /api/admin/artworks/{id}` - Delete artwork
- `POST /api/admin/upload` - Upload image
- `GET /api/admin/contacts` - Get contact submissions
- `GET /api/admin/newsletter` - Get newsletter subscribers
- `PUT /api/admin/settings` - Update site settings

## Customization

### Adding New Artworks
1. Login to admin panel
2. Go to "Artworks" section
3. Click "Add Artwork"
4. Upload image and fill in details
5. Mark as "Featured" to show on homepage

### Updating Site Content
1. Login to admin panel
2. Go to "Settings" section
3. Update site information, homepage content, and links
4. Save changes

### Custom Styling
- Modify `/app/frontend/src/index.css` for global styles
- Update `/app/frontend/tailwind.config.js` for theme customization
- Colors can be changed in the Tailwind config

## Deployment

### Netlify Deployment
1. Build the frontend:
   ```bash
   cd /app/frontend
   yarn build
   ```
2. Deploy the `build` folder to Netlify
3. Set up backend hosting separately (Heroku, DigitalOcean, etc.)

### GitHub Pages
1. Add homepage field to `package.json`
2. Install gh-pages: `yarn add --dev gh-pages`
3. Add deploy script: `"deploy": "gh-pages -d build"`
4. Run: `yarn deploy`

## Content Management

### Image Guidelines
- Recommended size: 1200x800px or larger
- Supported formats: JPG, PNG, WebP
- Images are automatically optimized on upload

### SEO Optimization
- Update meta tags in `/app/frontend/public/index.html`
- Customize Open Graph and Twitter Card data
- Add structured data for better search visibility

## Support

For questions or issues:
1. Check the admin logs: `tail -f /var/log/supervisor/backend.err.log`
2. Check frontend console for client-side errors
3. Verify MongoDB connection and data

## License

This project is created for portfolio use. Customize and deploy as needed for your artistic endeavors!

---

**Built with ❤️ for digital artists everywhere**
