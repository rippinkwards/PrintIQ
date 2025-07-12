import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Calendar, 
  User,
  Search,
  Eye,
  Menu,
  X,
  Download,
  Filter
} from 'lucide-react';
import { adminApi } from '../utils/api';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('contacts');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminApi.isLoggedIn()) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [contactsRes, subscribersRes] = await Promise.all([
        adminApi.getContacts(),
        adminApi.getNewsletterSubscribers()
      ]);

      setContacts(contactsRes.data.contacts || []);
      setSubscribers(subscribersRes.data.subscribers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sidebarItems = [
    { icon: Eye, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Eye, label: 'Artworks', path: '/admin/artworks' },
    { icon: Mail, label: 'Contacts', path: '/admin/contacts', active: true },
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
                <h1 className="text-2xl font-bold text-gray-900">Messages & Subscribers</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contacts'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contact Messages ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscribers'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Newsletter Subscribers ({subscribers.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => exportData(
                activeTab === 'contacts' ? filteredContacts : filteredSubscribers,
                `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
              )}
              className="btn btn-secondary inline-flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="admin-card p-6">
                  <div className="loading-shimmer h-4 rounded mb-2" />
                  <div className="loading-shimmer h-3 rounded w-3/4 mb-2" />
                  <div className="loading-shimmer h-3 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Contact Messages */}
              {activeTab === 'contacts' && (
                <div className="space-y-4">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="admin-card p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-accent-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                              <p className="text-sm text-gray-600">{contact.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(contact.submitted_at)}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{contact.message}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <a
                            href={`mailto:${contact.email}?subject=Re: Your message from portfolio&body=Hi ${contact.name},%0D%0A%0D%0AThank you for your message...`}
                            className="btn btn-primary text-sm"
                          >
                            Reply via Email
                          </a>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search criteria' : 'No contact messages yet'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Newsletter Subscribers */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  {filteredSubscribers.length > 0 ? (
                    <div className="grid gap-4">
                      {filteredSubscribers.map((subscriber, index) => (
                        <motion.div
                          key={subscriber.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="admin-card p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Mail className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {subscriber.name || 'Anonymous'}
                              </p>
                              <p className="text-sm text-gray-600">{subscriber.email}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Subscribed {formatDate(subscriber.subscribed_at)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscribers found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search criteria' : 'No newsletter subscribers yet'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminContacts;