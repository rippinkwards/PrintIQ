import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Heart, Award, Download, Users, Clock } from 'lucide-react';
import { publicApi } from '../utils/api';

const AboutPage = () => {
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await publicApi.getSiteSettings();
      setSiteSettings(response.data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Set default data for demo
      setSiteSettings({
        artist_name: "Creative Artist",
        bio: "I'm a passionate digital artist who believes that art has the power to transform spaces and inspire emotions. My journey began with traditional art, but I found my true calling in the digital realm where creativity knows no bounds.",
        contact_email: "hello@artistportfolio.com"
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Palette, number: "500+", label: "Artworks Created" },
    { icon: Users, number: "2,500+", label: "Happy Customers" },
    { icon: Download, number: "10,000+", label: "Downloads" },
    { icon: Award, number: "50+", label: "Featured Pieces" }
  ];

  const process = [
    {
      step: "01",
      title: "Inspiration",
      description: "I find inspiration in everyday moments, nature, and the world around us. Each piece starts with a spark of creativity.",
      icon: Heart
    },
    {
      step: "02", 
      title: "Creation",
      description: "Using professional digital tools, I bring ideas to life with careful attention to color, composition, and emotion.",
      icon: Palette
    },
    {
      step: "03",
      title: "Refinement",
      description: "Every artwork goes through multiple iterations to ensure it meets the highest standards of quality and beauty.",
      icon: Award
    },
    {
      step: "04",
      title: "Delivery",
      description: "Once complete, artworks are optimized for printing and delivered as high-quality digital files ready for your walls.",
      icon: Download
    }
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="section bg-gradient-primary">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">
                About {siteSettings.artist_name || "The Artist"}
              </h1>
              <p className="text-xl text-primary-700 mb-8 leading-relaxed">
                {siteSettings.bio || "I'm a passionate digital artist who believes that art has the power to transform spaces and inspire emotions. My journey began with traditional art, but I found my true calling in the digital realm where creativity knows no bounds."}
              </p>
              <div className="flex items-center space-x-6 text-primary-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Est. 2020</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Made with love</span>
                </div>
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
                  src="https://images.unsplash.com/photo-1649406458887-2b6561c36a4d?w=600&h=600&fit=crop"
                  alt="Artist workspace"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 text-accent-600 rounded-full mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-primary-900 mb-2">{stat.number}</div>
                <div className="text-primary-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-primary-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              My Creative Process
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Every piece of art is created with intention, passion, and attention to detail
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg">
                    <step.icon className="w-8 h-8 text-accent-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">{step.title}</h3>
                <p className="text-primary-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.pexels.com/photos/301792/pexels-photo-301792.jpeg?w=300&h=400&fit=crop"
                  alt="Digital art creation"
                  className="rounded-xl shadow-lg"
                />
                <img 
                  src="https://images.pexels.com/photos/4238493/pexels-photo-4238493.jpeg?w=300&h=300&fit=crop"
                  alt="Art supplies"
                  className="rounded-xl shadow-lg mt-8"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                My Mission
              </h2>
              <p className="text-lg text-primary-700 mb-6 leading-relaxed">
                I believe that everyone deserves to live in a space that inspires them. Through my digital art, 
                I aim to make beautiful, affordable artwork accessible to everyone, regardless of their budget or location.
              </p>
              <p className="text-lg text-primary-700 mb-8 leading-relaxed">
                Each piece is designed to be more than just decoration—it's meant to evoke emotion, 
                spark conversation, and bring joy to your everyday life.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  </div>
                  <p className="text-primary-700">Affordable art that doesn't compromise on quality</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  </div>
                  <p className="text-primary-700">Instant downloads for immediate gratification</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                  </div>
                  <p className="text-primary-700">Unique designs you won't find anywhere else</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-accent-600 text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's Create Something Beautiful Together
            </h2>
            <p className="text-xl text-accent-100 mb-8">
              Ready to transform your space with unique digital art? Browse our collection or get in touch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/gallery"
                className="btn bg-white text-accent-600 hover:bg-accent-50"
              >
                Browse Gallery
              </a>
              <a 
                href="/contact"
                className="btn bg-accent-700 text-white hover:bg-accent-800 border border-accent-700"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;