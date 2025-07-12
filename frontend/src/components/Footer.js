import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Twitter, Facebook, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold mb-4">
                <span className="font-serif">ArtistPortfolio</span>
              </Link>
              <p className="text-primary-300 mb-6 max-w-md">
                Creating unique digital art, wall prints, and printables that inspire and transform your space. 
                Discover the perfect piece for your home or office.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-800 rounded-lg hover:bg-accent-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-800 rounded-lg hover:bg-accent-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-800 rounded-lg hover:bg-accent-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:youremail@example.com"
                  className="p-2 bg-primary-800 rounded-lg hover:bg-accent-600 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-primary-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-primary-300 hover:text-white transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-primary-300 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-primary-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Shop</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://etsy.com/shop/YourShopName" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>Etsy Store</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://gumroad.com/YourName" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>Gumroad Store</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-400 text-sm">
              © {currentYear} ArtistPortfolio. All rights reserved.
            </p>
            <p className="text-primary-400 text-sm flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-accent-500" />
              <span>for art lovers everywhere</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;