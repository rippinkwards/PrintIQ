import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for admin routes
api.interceptors.request.use((config) => {
  // Add basic auth for admin routes
  if (config.url.includes('/admin/')) {
    const credentials = localStorage.getItem('adminCredentials');
    if (credentials) {
      const { username, password } = JSON.parse(credentials);
      config.auth = { username, password };
    }
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.includes('/admin/')) {
      localStorage.removeItem('adminCredentials');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Public API calls
export const publicApi = {
  // Get all artworks or featured only
  getArtworks: (featuredOnly = false, limit = 50) => 
    api.get(`/api/artworks?featured_only=${featuredOnly}&limit=${limit}`),
  
  // Get single artwork
  getArtwork: (id) => 
    api.get(`/api/artworks/${id}`),
  
  // Submit contact form
  submitContact: (data) => 
    api.post('/api/contact', data),
  
  // Newsletter signup
  newsletterSignup: (data) => 
    api.post('/api/newsletter', data),
  
  // Get site settings
  getSiteSettings: () => 
    api.get('/api/settings'),
};

// Admin API calls
export const adminApi = {
  // Login (test credentials)
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      // Store credentials for future requests
      localStorage.setItem('adminCredentials', JSON.stringify({ username, password }));
      
      // Test the credentials by making a request
      api.get('/api/admin/contacts', {
        auth: { username, password }
      }).then(() => {
        resolve({ message: 'Login successful' });
      }).catch((error) => {
        localStorage.removeItem('adminCredentials');
        reject(error);
      });
    });
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('adminCredentials');
    window.location.href = '/admin';
  },
  
  // Check if logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('adminCredentials');
  },
  
  // Artworks
  getArtworks: () => 
    api.get('/api/artworks'),
  
  createArtwork: (data) => 
    api.post('/api/admin/artworks', data),
  
  updateArtwork: (id, data) => 
    api.put(`/api/admin/artworks/${id}`, data),
  
  deleteArtwork: (id) => 
    api.delete(`/api/admin/artworks/${id}`),
  
  // Upload image
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Get contacts
  getContacts: () => 
    api.get('/api/admin/contacts'),
  
  // Get newsletter subscribers
  getNewsletterSubscribers: () => 
    api.get('/api/admin/newsletter'),
  
  // Update site settings
  updateSiteSettings: (data) => 
    api.put('/api/admin/settings', data),
};

export default api;