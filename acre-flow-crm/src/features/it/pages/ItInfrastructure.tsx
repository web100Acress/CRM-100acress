import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/infra.css';
import {
  Code, Search, Video, Megaphone, Settings, LogOut, Building, Menu, X
} from 'lucide-react';

import SoftwareDevelopment from '@/features/it/components/SoftwareDevelopment';
import SeoDigitalMarketing from '@/features/it/components/SeoDigitalMarketing';
import VideoEditing from '@/features/it/components/VideoEditing';
import AnchorRecording from '@/features/it/components/AnchorRecording';
import AdsAdvertisement from '@/features/it/components/AdsAdvertisement';
import ItSettings from '@/features/it/components/ItSettings';

const ItInfrastructure = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Code },
    // { id: 'software-dev', label: 'Software Development', icon: Code },
    { id: 'seo-marketing', label: 'SEO & Digital Marketing', icon: Search },
    { id: 'video-editing', label: 'Video Editing', icon: Video },
    { id: 'anchor-recording', label: 'Anchor & Recording', icon: Megaphone },
    { id: 'ads-advertisement', label: 'Ads & Advertisement', icon: Megaphone },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      // case 'software-dev': return <SoftwareDevelopment />;
      case 'seo-marketing': return <SeoDigitalMarketing />;
      case 'video-editing': return <VideoEditing />;
      case 'anchor-recording': return <AnchorRecording />;
      case 'ads-advertisement': return <AdsAdvertisement />;
      case 'settings': return <ItSettings />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="it-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Building className="company-icon" />
            <h2>100acres.com</h2>
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="page-title">{menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}</h1>
          <span className="user-welcome">Welcome, IT Team</span>
        </header>

        <section className="content-body">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

// Dummy dashboard for preview
const DashboardOverview = () => {
  const stats = [
    { title: 'Active Projects', value: '15', icon: Code, color: '#3b82f6', trend: '+3' },
    { title: 'SEO Campaigns', value: '8', icon: Search, color: '#10b981', trend: '+2' },
    { title: 'Videos Editing', value: '12', icon: Video, color: '#f59e0b', trend: '+5' },
    { title: 'Ad Campaigns', value: '6', icon: Megaphone, color: '#ef4444', trend: '+1' }
  ];

  return (
    <div className="dashboard-cards">
      {stats.map((stat, idx) => (
        <div className="stat-card" key={idx}>
          <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
            <stat.icon size={24} />
          </div>
          <div className="stat-info">
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
            <span className="stat-trend" style={{ color: stat.trend.includes('+') ? '#10b981' : '#ef4444' }}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItInfrastructure;
