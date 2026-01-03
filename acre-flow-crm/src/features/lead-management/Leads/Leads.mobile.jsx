import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/layout/MobileLayout';
import LeadTableMobile from '@/layout/LeadTable.mobile';
import { Plus, Search, Filter, Download, RefreshCw, TrendingUp, Users, Phone, Mail, Calendar, Menu, X, User, Home, Activity, Bell, Settings, LogOut, BarChart3 } from 'lucide-react';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';

const LeadsMobile = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all-leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    hotLeads: 0,
    convertedLeads: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch real stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://bcrm.100acress.com/api/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const leads = json.data || [];
        
        // Calculate real stats
        const totalLeads = leads.length;
        const newLeads = leads.filter(lead => lead.status?.toLowerCase() === 'new').length;
        const hotLeads = leads.filter(lead => lead.status?.toLowerCase() === 'hot').length;
        const convertedLeads = leads.filter(lead => lead.status?.toLowerCase() === 'converted').length;
        
        setStats({
          totalLeads,
          newLeads,
          hotLeads,
          convertedLeads
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to get initials from name
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  // Get role-specific dashboard title
  const getDashboardTitle = () => {
    switch (userRole) {
      case 'super-admin':
        return 'Super Admin Dashboard';
      case 'head-admin':
      case 'head':
        return 'Head Dashboard';
      case 'team-leader':
        return 'Team Leader Dashboard';
      case 'employee':
        return 'Employee Dashboard';
      default:
        return 'Dashboard';
    }
  };

  // Get role-specific dashboard description
  const getDashboardDescription = () => {
    switch (userRole) {
      case 'super-admin':
        return 'Manage entire system and all users';
      case 'head-admin':
      case 'head':
        return 'Manage teams and performance';
      case 'team-leader':
        return 'Lead your team to success';
      case 'employee':
        return 'Track your performance and tasks';
      default:
        return 'Welcome to your workspace';
    }
  };

  // Banner images from S3
  const bannerImages = [
    'https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/small-banners/1766217374273-max-antara-361.webp'
  ];
  
  const [currentBannerIndex] = useState(0);

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section - Above Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Leads Management</h1>
              <p className="text-xs text-blue-100">Mobile Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-white text-sm font-bold">{getInitials(localStorage.getItem('userName') || 'User')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={bannerImages[currentBannerIndex]} 
          alt="Dashboard Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Banner Text Overlay */}
        {/* <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold drop-shadow-lg">
            {getDashboardDescription()}
          </h2>
          <p className="text-white/90 text-sm drop-shadow-md">
            Manage your leads efficiently
          </p>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Total Leads</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.totalLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">New Today</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.newLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Hot Leads</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.hotLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Phone size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Converted</p>
                <p className="text-white text-lg font-bold">
                  {loading ? '...' : stats.convertedLeads}
                </p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Mail size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 rounded-lg border border-white/30 focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Filter size={18} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200">
            <RefreshCw size={18} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200">
            <Download size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-white/20 text-white border border-white/30">All Status</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">New</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Hot</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Cold</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Converted</Badge>
          </div>
        )}
      </div>

      {/* Unified Slide Menu */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transform transition-transform z-50 ${
        rightMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Profile Section */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Menu</h3>
            <button
              onClick={() => setRightMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{localStorage.getItem('userName') || 'User'}</h4>
              <p className="text-sm text-gray-500">{localStorage.getItem('userEmail') || 'user@example.com'}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h4>
          <nav className="space-y-1">
            <button 
              onClick={() => { navigate('/dashboard'); setRightMenuOpen(false); }}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Home size={18} className="text-blue-600" />
              <span className="text-gray-700">Dashboard</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-600 transition-colors flex items-center gap-3">
              <Users size={18} className="text-green-600" />
              <span className="text-gray-700">Leads</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Activity size={18} className="text-purple-600" />
              <span className="text-gray-700">Tasks</span>
            </button>
          </nav>
        </div>

        {/* Quick Actions Section */}
        <div className="p-4 border-t">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h4>
          <nav className="space-y-1">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Bell size={18} className="text-gray-600" />
              <span className="text-gray-700">Notifications</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Search size={18} className="text-gray-600" />
              <span className="text-gray-700">Search</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Settings size={18} className="text-gray-600" />
              <span className="text-gray-700">Settings</span>
            </button>
          </nav>
        </div>

        {/* Account Section */}
        <div className="p-4 border-t">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h4>
          <nav className="space-y-1">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
              <User size={18} className="text-gray-600" />
              <span className="text-gray-700">Edit Profile</span>
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                navigate('/login');
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3"
            >
              <LogOut size={18} />
              <span className="text-red-600">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {rightMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setRightMenuOpen(false)}
        />
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all-leads':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 p-4 pb-0">All Leads</h3>
              <LeadTableMobile userRole={userRole} />
            </div>
          </div>
        );
      case 'my-leads':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">My Leads</h3>
              <LeadTableMobile userRole={userRole} />
            </div>
          </div>
        );
      case 'new-leads':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">New Leads</h3>
              <LeadTableMobile userRole={userRole} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MobileLayout userRole={userRole} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderMobileHeader()}
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('all-leads')}
            className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'all-leads'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Leads ({stats.totalLeads})
          </button>
          <button
            onClick={() => setActiveTab('my-leads')}
            className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'my-leads'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Leads
          </button>
          <button
            onClick={() => setActiveTab('new-leads')}
            className={`px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'new-leads'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            New Leads ({stats.newLeads})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {renderTabContent()}
      </div>
    </MobileLayout>
  );
};

export default LeadsMobile;
