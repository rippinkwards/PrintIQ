import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Palette } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gradient-primary flex items-center">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Art */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-8xl md:text-9xl font-bold text-primary-200 mb-4"
            >
              404
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <Palette className="w-32 h-32 text-accent-500 mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-primary-600">
              It looks like this page has been moved, deleted, or doesn't exist.
            </p>
            <p className="text-primary-500">
              But don't worry, there's plenty of beautiful art waiting for you!
            </p>
          </motion.div>

          {/* Navigation Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="btn btn-primary inline-flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <Link 
                to="/gallery"
                className="btn btn-secondary inline-flex items-center justify-center space-x-2"
              >
                <Palette className="w-5 h-5" />
                <span>Browse Gallery</span>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="pt-8 border-t border-primary-300">
              <p className="text-primary-600 mb-4">Or try one of these popular sections:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/about" 
                  className="text-accent-600 hover:text-accent-700 underline"
                >
                  About the Artist
                </Link>
                <Link 
                  to="/contact" 
                  className="text-accent-600 hover:text-accent-700 underline"
                >
                  Contact
                </Link>
                <a 
                  href="https://etsy.com/shop/YourShopName" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-600 hover:text-accent-700 underline"
                >
                  Etsy Shop
                </a>
              </div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-400 rounded-full opacity-50"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary-400 rounded-full opacity-30"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent-300 rounded-full opacity-40"></div>
            <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-primary-300 rounded-full opacity-20"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;