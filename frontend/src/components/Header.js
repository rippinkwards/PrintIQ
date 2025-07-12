import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Palette } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl lg:text-2xl font-bold text-primary-900 hover:text-accent-600 transition-colors"
          >
            <Palette className="w-8 h-8 lg:w-10 lg:h-10" />
            <span className="font-serif">ArtistPortfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors relative ${
                  isActive(item.href)
                    ? 'text-accent-600'
                    : 'text-primary-700 hover:text-accent-600'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="https://etsy.com/shop/YourShopName" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Shop Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary-700 hover:text-accent-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-primary-200">
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-accent-600'
                      : 'text-primary-700 hover:text-accent-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-primary-200">
                <a 
                  href="https://etsy.com/shop/YourShopName" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full text-center"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;