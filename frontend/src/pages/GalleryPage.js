import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Star, Eye } from 'lucide-react';
import { publicApi } from '../utils/api';
import toast from 'react-hot-toast';

const GalleryPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    filterArtworks();
  }, [artworks, searchTerm, selectedCategory]);

  const fetchArtworks = async () => {
    try {
      const response = await publicApi.getArtworks(false, 100);
      const artworksData = response.data.artworks || [];
      
      // Add demo artworks if none exist
      if (artworksData.length === 0) {
        const demoArtworks = [
          {
            id: '1',
            title: 'Abstract Dreams',
            description: 'A vibrant abstract piece that brings energy to any space',
            price: 25.00,
            category: 'abstract',
            tags: ['colorful', 'modern', 'abstract'],
            image_url: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=600&h=800&fit=crop',
            featured: true
          },
          {
            id: '2',
            title: 'Minimalist Landscape',
            description: 'Clean lines and peaceful colors for a serene atmosphere',
            price: 20.00,
            category: 'landscape',
            tags: ['minimal', 'peaceful', 'nature'],
            image_url: 'https://images.unsplash.com/photo-1649406458887-2b6561c36a4d?w=600&h=600&fit=crop',
            featured: false
          },
          {
            id: '3',
            title: 'Digital Portrait',
            description: 'Modern digital art with striking visual impact',
            price: 30.00,
            category: 'portrait',
            tags: ['digital', 'modern', 'portrait'],
            image_url: 'https://images.pexels.com/photos/301792/pexels-photo-301792.jpeg?w=600&h=700&fit=crop',
            featured: true
          },
          {
            id: '4',
            title: 'Geometric Patterns',
            description: 'Bold geometric design perfect for contemporary spaces',
            price: 22.00,
            category: 'geometric',
            tags: ['geometric', 'bold', 'contemporary'],
            image_url: 'https://images.pexels.com/photos/4238493/pexels-photo-4238493.jpeg?w=600&h=800&fit=crop',
            featured: false
          },
          {
            id: '5',
            title: 'Nature Inspired',
            description: 'Organic forms and natural colors bring the outdoors in',
            price: 18.00,
            category: 'nature',
            tags: ['nature', 'organic', 'calming'],
            image_url: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=500&h=700&fit=crop',
            featured: false
          },
          {
            id: '6',
            title: 'Urban Vibes',
            description: 'City-inspired art for the modern urbanite',
            price: 28.00,
            category: 'urban',
            tags: ['urban', 'city', 'modern'],
            image_url: 'https://images.unsplash.com/photo-1649406458887-2b6561c36a4d?w=600&h=900&fit=crop',
            featured: true
          }
        ];
        setArtworks(demoArtworks);
      } else {
        setArtworks(artworksData);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast.error('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const filterArtworks = () => {
    let filtered = artworks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(artwork => artwork.category === selectedCategory);
    }

    setFilteredArtworks(filtered);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'geometric', label: 'Geometric' },
    { value: 'nature', label: 'Nature' },
    { value: 'urban', label: 'Urban' }
  ];

  const openArtworkModal = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeArtworkModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-primary-200">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Art Gallery
            </h1>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Explore our collection of unique digital artwork, perfect for your home or office
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-primary-200">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="text-primary-600 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-primary-600">
              {loading ? 'Loading...' : `${filteredArtworks.length} artworks`}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="masonry">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="masonry-item">
                  <div className="loading-shimmer aspect-photo rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredArtworks.length > 0 ? (
            <div className="masonry">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="masonry-item"
                >
                  <div 
                    className="gallery-item bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    onClick={() => openArtworkModal(artwork)}
                  >
                    <div className="relative">
                      <img 
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-auto object-cover"
                        style={{ aspectRatio: `${Math.random() * 0.5 + 0.75}/1` }}
                      />
                      <div className="gallery-overlay">
                        <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                        <p className="text-sm opacity-90 mb-3">{artwork.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-accent-400 font-bold">${artwork.price}</span>
                          <div className="flex items-center space-x-2">
                            {artwork.featured && (
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            )}
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-primary-900 mb-2">
                        {artwork.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {artwork.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-accent-600 font-semibold">${artwork.price}</span>
                        <button className="text-primary-600 hover:text-accent-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-900 mb-2">No artworks found</h3>
              <p className="text-primary-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeArtworkModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative">
                <img 
                  src={selectedArtwork.image_url}
                  alt={selectedArtwork.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <button
                  onClick={closeArtworkModal}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold text-primary-900">{selectedArtwork.title}</h2>
                    {selectedArtwork.featured && (
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-lg text-primary-600 mb-4">{selectedArtwork.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedArtwork.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-primary-200 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-accent-600">${selectedArtwork.price}</span>
                    <span className="text-sm text-primary-500 bg-primary-100 px-3 py-1 rounded-full">
                      {selectedArtwork.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <a 
                      href="https://etsy.com/shop/YourShopName"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full inline-flex items-center justify-center space-x-2"
                    >
                      <span>Buy on Etsy</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://gumroad.com/YourName"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary w-full inline-flex items-center justify-center space-x-2"
                    >
                      <span>Buy on Gumroad</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="mt-6 text-sm text-primary-600">
                    <p>• Instant digital download</p>
                    <p>• High resolution files</p>
                    <p>• Multiple format options</p>
                    <p>• Print at home or professionally</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryPage;