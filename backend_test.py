#!/usr/bin/env python3
"""
Backend API Testing for Digital Artist Portfolio
Tests all public and admin endpoints
"""

import requests
import sys
import json
from datetime import datetime
from base64 import b64encode

class PortfolioAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_auth = None
        
        # Setup admin auth
        credentials = b64encode(b"admin:admin123").decode("ascii")
        self.admin_auth = {"Authorization": f"Basic {credentials}"}

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")
        return success

    def test_endpoint(self, name, method, endpoint, expected_status=200, data=None, headers=None, auth=False):
        """Generic endpoint tester"""
        url = f"{self.base_url}{endpoint}"
        request_headers = {"Content-Type": "application/json"}
        
        if headers:
            request_headers.update(headers)
        if auth and self.admin_auth:
            request_headers.update(self.admin_auth)

        try:
            if method == "GET":
                response = requests.get(url, headers=request_headers, timeout=10)
            elif method == "POST":
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=request_headers, timeout=10)
            elif method == "DELETE":
                response = requests.delete(url, headers=request_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if success and response.content:
                try:
                    response_data = response.json()
                    details += f", Response: {json.dumps(response_data, indent=2)[:200]}..."
                except:
                    details += f", Response: {response.text[:100]}..."
            elif not success:
                details += f", Error: {response.text[:200]}"

            return self.log_test(name, success, details), response.json() if success and response.content else {}

        except Exception as e:
            return self.log_test(name, False, f"Exception: {str(e)}"), {}

    def test_public_endpoints(self):
        """Test all public API endpoints"""
        print("\n🔍 Testing Public Endpoints...")
        
        # Test root endpoint
        self.test_endpoint("Root API", "GET", "/")
        
        # Test settings endpoint
        self.test_endpoint("Get Settings", "GET", "/api/settings")
        
        # Test artworks endpoint
        self.test_endpoint("Get All Artworks", "GET", "/api/artworks")
        self.test_endpoint("Get Featured Artworks", "GET", "/api/artworks?featured_only=true")
        
        # Test contact form
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "This is a test message from backend testing"
        }
        self.test_endpoint("Submit Contact Form", "POST", "/api/contact", 200, contact_data)
        
        # Test newsletter signup
        newsletter_data = {
            "email": "newsletter@example.com",
            "name": "Newsletter Test"
        }
        self.test_endpoint("Newsletter Signup", "POST", "/api/newsletter", 200, newsletter_data)

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n🔒 Testing Admin Endpoints...")
        
        # Test admin endpoints without auth (should fail)
        self.test_endpoint("Admin Artworks (No Auth)", "GET", "/api/admin/contacts", 401, auth=False)
        
        # Test admin endpoints with auth
        self.test_endpoint("Get Admin Contacts", "GET", "/api/admin/contacts", 200, auth=True)
        self.test_endpoint("Get Newsletter Subscribers", "GET", "/api/admin/newsletter", 200, auth=True)
        
        # Test artwork CRUD operations
        artwork_data = {
            "title": "Test Artwork",
            "description": "This is a test artwork created during backend testing",
            "price": 29.99,
            "category": "digital",
            "tags": ["test", "backend"],
            "image_url": "/uploads/test-image.jpg",
            "featured": True
        }
        
        success, response = self.test_endpoint("Create Artwork", "POST", "/api/admin/artworks", 200, artwork_data, auth=True)
        
        if success and "id" in response:
            artwork_id = response["id"]
            
            # Test get single artwork
            self.test_endpoint("Get Single Artwork", "GET", f"/api/artworks/{artwork_id}")
            
            # Test update artwork
            updated_data = artwork_data.copy()
            updated_data["title"] = "Updated Test Artwork"
            self.test_endpoint("Update Artwork", "PUT", f"/api/admin/artworks/{artwork_id}", 200, updated_data, auth=True)
            
            # Test delete artwork
            self.test_endpoint("Delete Artwork", "DELETE", f"/api/admin/artworks/{artwork_id}", 200, auth=True)
        
        # Test settings update
        settings_data = {
            "site_title": "Test Portfolio",
            "artist_name": "Test Artist",
            "bio": "Test bio for backend testing",
            "hero_title": "Test Hero Title",
            "hero_subtitle": "Test Hero Subtitle",
            "etsy_shop_url": "https://etsy.com/shop/test",
            "gumroad_url": "https://gumroad.com/test",
            "contact_email": "test@example.com"
        }
        self.test_endpoint("Update Settings", "PUT", "/api/admin/settings", 200, settings_data, auth=True)

    def test_error_cases(self):
        """Test error handling"""
        print("\n⚠️ Testing Error Cases...")
        
        # Test non-existent artwork
        self.test_endpoint("Get Non-existent Artwork", "GET", "/api/artworks/non-existent-id", 404)
        
        # Test invalid contact form data
        invalid_contact = {"name": "Test", "email": "invalid-email", "message": "Test"}
        self.test_endpoint("Invalid Contact Email", "POST", "/api/contact", 422, invalid_contact)
        
        # Test invalid newsletter email
        invalid_newsletter = {"email": "invalid-email"}
        self.test_endpoint("Invalid Newsletter Email", "POST", "/api/newsletter", 422, invalid_newsletter)

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Digital Artist Portfolio Backend API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test if backend is running
        try:
            response = requests.get(f"{self.base_url}/", timeout=5)
            if response.status_code != 200:
                print(f"❌ Backend not responding properly at {self.base_url}")
                return False
        except Exception as e:
            print(f"❌ Cannot connect to backend at {self.base_url}: {str(e)}")
            return False
        
        print("✅ Backend is responding")
        
        # Run test suites
        self.test_public_endpoints()
        self.test_admin_endpoints()
        self.test_error_cases()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️ {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    """Main test runner"""
    # Use the public endpoint from frontend .env
    tester = PortfolioAPITester("http://localhost:8001")
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())