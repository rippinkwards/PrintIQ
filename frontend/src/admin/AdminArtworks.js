import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Upload,
  Eye,
  Menu,
  X,
  Search,
  Filter
} from 'lucide-react';
import { adminApi, publicApi } from '../utils/api';
import toast from 'react-hot-toast';

const AdminArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    image_url: '',
    etsy_url: '',
    gumroad_url: '',
    featured: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminApi.isLoggedIn()) {
      navigate('/admin');
      return;
    }
    fetchArtworks();
  }, [navigate]);

  const fetchArtworks = async () => {
    try {
      const response = await publicApi.getArtworks(false, 100);
      setArtworks(response.data.artworks || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminApi.uploadImage(file);
      setFormData({ ...formData, image_url: response.data.image_url });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const artworkData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      if (editingArtwork) {
        await adminApi.updateArtwork(editingArtwork.id, artworkData);
        toast.success('Artwork updated successfully!');
      } else {
        await adminApi.createArtwork(artworkData);
        toast.success('Artwork created successfully!');
      }
      
      setShowModal(false);
      setEditingArtwork(null);
      resetForm();
      fetchArtworks();
    } catch (error) {
      console.error('Error saving artwork:', error);
      toast.error('Failed to save artwork');
    }
  };

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title || '',
      description: artwork.description || '',
      price: artwork.price || '',
      category: artwork.category || '',
      tags: artwork.tags?.join(', ') || '',
      image_url: artwork.image_url || '',
      etsy_url: artwork.etsy_url || '',
      gumroad_url: artwork.gumroad_url || '',
      featured: artwork.featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (artwork) => {
    if (!window.confirm(`Are you sure you want to delete "${artwork.title}"?`)) {
      return;
    }

    try {
      await adminApi.deleteArtwork(artwork.id);
      toast.success('Artwork deleted successfully!');
      fetchArtworks();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast.error('Failed to delete artwork');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      tags: '',
      image_url: '',
      etsy_url: '',
      gumroad_url: '',
      featured: false
    });
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || artwork.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'abstract', 'landscape', 'portrait', 'geometric', 'nature', 'urban'];

  const sidebarItems = [
    { icon: Eye, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Plus, label: 'Artworks', path: '/admin/artworks', active: true },
    { icon: Eye, label: 'Contacts', path: '/admin/contacts' },
    { icon: Eye, label: 'Settings', path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 admin-sidebar transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-primary-700">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-primary-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active 
                        ? 'bg-accent-600 text-white' 
                        : 'text-primary-300 hover:bg-primary-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Manage Artworks</h1>
              </div>
              <button
                onClick={() => {
                  setEditingArtwork(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="btn btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Artwork</span>
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="text-gray-600 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <main className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="admin-card p-4">
                  <div className="loading-shimmer aspect-square rounded-lg mb-4" />
                  <div className="loading-shimmer h-4 rounded mb-2" />
                  <div className="loading-shimmer h-3 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="admin-card overflow-hidden group"
                >
                  <div className="relative aspect-square">
                    <img 
                      src={artwork.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    {artwork.featured && (
                      <div className="absolute top-2 left-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(artwork)}
                        className="p-2 bg-white rounded-full text-accent-600 hover:bg-accent-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(artwork)}
                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{artwork.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-accent-600">${artwork.price}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{artwork.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredArtworks.length === 0 && !loading && (
            <div className="text-center py-12">
              <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No artworks found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first artwork</p>
              <button
                onClick={() => {
                  setEditingArtwork(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="btn btn-primary"
              >
                Add Artwork
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Artwork Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="textarea"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="modern, abstract, colorful"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.image_url ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="max-w-48 max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Upload an image or enter URL</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                        id="imageUpload"
                        disabled={uploading}
                      />
                      <label 
                        htmlFor="imageUpload" 
                        className="btn btn-secondary cursor-pointer inline-block"
                      >
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </label>
                      <div className="mt-4">
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="Or enter image URL"
                          className="input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etsy URL</label>
                  <input
                    type="url"
                    value={formData.etsy_url}
                    onChange={(e) => setFormData({ ...formData, etsy_url: e.target.value })}
                    placeholder="https://etsy.com/listing/..."
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gumroad URL</label>
                  <input
                    type="url"
                    value={formData.gumroad_url}
                    onChange={(e) => setFormData({ ...formData, gumroad_url: e.target.value })}
                    placeholder="https://gumroad.com/l/..."
                    className="input"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Featured artwork (show on homepage)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingArtwork(null);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {editingArtwork ? 'Update' : 'Create'} Artwork
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtworks;