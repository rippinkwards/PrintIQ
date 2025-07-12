import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Palette, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { publicApi } from '../utils/api';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [artworksRes, settingsRes] = await Promise.all([
        publicApi.getArtworks(true, 6), // Get featured artworks
        publicApi.getSiteSettings()
      ]);
      
      setFeaturedArtworks(artworksRes.data.artworks || []);
      setSiteSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set default data for demo
      setSiteSettings({
        site_title: "Digital Artist Portfolio",
        artist_name: "Creative Artist",
        hero_title: "Welcome to my world of digital art",
        hero_subtitle: "Discover unique wall art and printables that transform your space",
        etsy_shop_url: "https://etsy.com/shop/YourShopName",
        gumroad_url: "https://gumroad.com/YourName"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribing(true);
    try {
      await publicApi.newsletterSignup({ email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 leading-tight">
                  {siteSettings.hero_title || "Welcome to my world of digital art"}
                </h1>
                <p className="text-xl text-primary-600 max-w-lg">
                  {siteSettings.hero_subtitle || "Discover unique wall art and printables that transform your space"}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={siteSettings.etsy_shop_url || "https://etsy.com/shop/YourShopName"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center justify-center space-x-2"
                >
                  <span>Shop on Etsy</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <Link to="/gallery" className="btn btn-secondary inline-flex items-center justify-center space-x-2">
                  <span>View Gallery</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0fGVufDB8fHx8MTc1MjMxOTQ3MHww&ixlib=rb-4.1.0&q=85"
                  alt="Digital Art"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Featured Artwork
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Discover some of my most popular digital art pieces, perfect for your walls
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="loading-shimmer aspect-square rounded-xl" />
              ))}
            </div>
          ) : featuredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden rounded-t-xl">
                    <img 
                      src={artwork.image_url || `https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&h=400&fit=crop`}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-primary-900 mb-2">
                      {artwork.title}
                    </h3>
                    <p className="text-primary-600 text-sm mb-4 line-clamp-2">
                      {artwork.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent-600 font-semibold">
                        ${artwork.price || '15.00'}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-primary-600">Featured</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-primary-400 mx-auto mb-4" />
              <p className="text-primary-600 text-lg">No featured artworks yet. Check back soon!</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/gallery" className="btn btn-primary inline-flex items-center space-x-2">
              <span>View All Artwork</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section bg-gradient-primary">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                About {siteSettings.artist_name || "The Artist"}
              </h2>
              <p className="text-lg text-primary-700 mb-6 leading-relaxed">
                {siteSettings.bio || "I'm passionate about creating digital art that brings joy and inspiration to everyday spaces. Each piece is carefully crafted with attention to detail and a love for beautiful design."}
              </p>
              <Link to="/about" className="btn btn-primary inline-flex items-center space-x-2">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Download className="w-8 h-8 text-accent-600 mb-3" />
                  <h3 className="font-semibold text-primary-900 mb-2">Instant Download</h3>
                  <p className="text-sm text-primary-600">Get your art immediately after purchase</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Palette className="w-8 h-8 text-accent-600 mb-3" />
                  <h3 className="font-semibold text-primary-900 mb-2">Unique Designs</h3>
                  <p className="text-sm text-primary-600">Original artwork you won't find elsewhere</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Star className="w-8 h-8 text-accent-600 mb-3" />
                  <h3 className="font-semibold text-primary-900 mb-2">High Quality</h3>
                  <p className="text-sm text-primary-600">Print-ready files in multiple formats</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section bg-primary-900 text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-primary-300 mb-8">
              Get notified about new artwork, special offers, and creative inspiration
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
                required
              />
              <button 
                type="submit"
                disabled={subscribing}
                className="btn bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 disabled:opacity-50"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;