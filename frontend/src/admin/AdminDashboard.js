import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Mail, 
  Users, 
  Settings,
  TrendingUp,
  Eye,
  Download,
  Star,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { adminApi, publicApi } from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArtworks: 0,
    featuredArtworks: 0,
    totalContacts: 0,
    totalSubscribers: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminApi.isLoggedIn()) {
      navigate('/admin');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [artworksRes, contactsRes, subscribersRes] = await Promise.all([
        publicApi.getArtworks(false, 100),
        adminApi.getContacts(),
        adminApi.getNewsletterSubscribers()
      ]);

      const artworks = artworksRes.data.artworks || [];
      const contacts = contactsRes.data.contacts || [];
      const subscribers = subscribersRes.data.subscribers || [];

      setStats({
        totalArtworks: artworks.length,
        featuredArtworks: artworks.filter(art => art.featured).length,
        totalContacts: contacts.length,
        totalSubscribers: subscribers.length
      });

      setRecentContacts(contacts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminApi.logout();
    toast.success('Logged out successfully');
  };

  const sidebarItems = [
    { icon: TrendingUp, label: 'Dashboard', path: '/admin/dashboard', active: true },
    { icon: Palette, label: 'Artworks', path: '/admin/artworks' },
    { icon: Mail, label: 'Contacts', path: '/admin/contacts' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  const statCards = [
    {
      title: 'Total Artworks',
      value: stats.totalArtworks,
      icon: Palette,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Featured Artworks',
      value: stats.featuredArtworks,
      icon: Star,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Contact Messages',
      value: stats.totalContacts,
      icon: Mail,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.totalSubscribers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
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

          <div className="p-4 border-t border-primary-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-primary-300 hover:bg-primary-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary inline-flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Site</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="admin-card p-6">
                  <div className="loading-shimmer h-20 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="admin-card p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${card.bgColor}`}>
                        <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="admin-card p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      to="/admin/artworks"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      <Palette className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Manage Artworks</p>
                    </Link>
                    <Link
                      to="/admin/contacts"
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      <Mail className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">View Messages</p>
                    </Link>
                  </div>
                </motion.div>

                {/* Recent Contacts */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="admin-card p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Messages</h2>
                  {recentContacts.length > 0 ? (
                    <div className="space-y-3">
                      {recentContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-accent-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                            <p className="text-sm text-gray-600 truncate">{contact.message}</p>
                          </div>
                        </div>
                      ))}
                      <Link
                        to="/admin/contacts"
                        className="block text-center text-accent-600 hover:text-accent-700 text-sm font-medium"
                      >
                        View all messages →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">No messages yet</p>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;