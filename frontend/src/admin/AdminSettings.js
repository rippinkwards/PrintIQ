import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Save, 
  Eye,
  Menu,
  X,
  User,
  Globe,
  Mail,
  Link2
} from 'lucide-react';
import { adminApi, publicApi } from '../utils/api';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    site_title: '',
    artist_name: '',
    bio: '',
    hero_title: '',
    hero_subtitle: '',
    etsy_shop_url: '',
    gumroad_url: '',
    contact_email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminApi.isLoggedIn()) {
      navigate('/admin');
      return;
    }
    fetchSettings();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const response = await publicApi.getSiteSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminApi.updateSiteSettings(settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sidebarItems = [
    { icon: Eye, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Eye, label: 'Artworks', path: '/admin/artworks' },
    { icon: Eye, label: 'Contacts', path: '/admin/contacts' },
    { icon: SettingsIcon, label: 'Settings', path: '/admin/settings', active: true }
  ];

  const settingSections = [
    {
      title: 'Site Information',
      icon: Globe,
      fields: [
        {
          key: 'site_title',
          label: 'Site Title',
          type: 'text',
          placeholder: 'Digital Artist Portfolio',
          description: 'The main title of your portfolio website'
        },
        {
          key: 'artist_name',
          label: 'Artist Name',
          type: 'text',
          placeholder: 'Your Name',
          description: 'Your name or artistic alias'
        }
      ]
    },
    {
      title: 'Homepage Content',
      icon: User,
      fields: [
        {
          key: 'hero_title',
          label: 'Hero Title',
          type: 'text',
          placeholder: 'Welcome to my world of digital art',
          description: 'Main headline on your homepage'
        },
        {
          key: 'hero_subtitle',
          label: 'Hero Subtitle',
          type: 'text',
          placeholder: 'Discover unique wall art and printables',
          description: 'Supporting text below the main headline'
        },
        {
          key: 'bio',
          label: 'Artist Bio',
          type: 'textarea',
          placeholder: 'Tell your story...',
          description: 'A brief description about yourself and your art'
        }
      ]
    },
    {
      title: 'Contact & Links',
      icon: Link2,
      fields: [
        {
          key: 'contact_email',
          label: 'Contact Email',
          type: 'email',
          placeholder: 'hello@example.com',
          description: 'Your main contact email address'
        },
        {
          key: 'etsy_shop_url',
          label: 'Etsy Shop URL',
          type: 'url',
          placeholder: 'https://etsy.com/shop/YourShopName',
          description: 'Link to your Etsy store'
        },
        {
          key: 'gumroad_url',
          label: 'Gumroad URL',
          type: 'url',
          placeholder: 'https://gumroad.com/YourName',
          description: 'Link to your Gumroad store'
        }
      ]
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary inline-flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Site</span>
              </a>
            </div>
          </div>
        </header>

        {/* Settings Form */}
        <main className="p-6">
          {loading ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="admin-card p-6">
                  <div className="loading-shimmer h-6 rounded mb-4 w-1/4" />
                  <div className="space-y-4">
                    <div className="loading-shimmer h-4 rounded" />
                    <div className="loading-shimmer h-4 rounded w-3/4" />
                    <div className="loading-shimmer h-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {settingSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                    className="admin-card p-6"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-accent-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map((field) => (
                        <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                          <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              id={field.key}
                              value={settings[field.key] || ''}
                              onChange={(e) => handleChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              rows="4"
                              className="textarea"
                            />
                          ) : (
                            <input
                              type={field.type}
                              id={field.key}
                              value={settings[field.key] || ''}
                              onChange={(e) => handleChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="input"
                            />
                          )}
                          {field.description && (
                            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex justify-end"
                >
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary inline-flex items-center space-x-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;