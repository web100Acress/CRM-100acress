
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ItInfrastructure.css'
import { 
  Code, 
  Search, 
  Video, 
  Megaphone, 
  Settings, 
  LogOut,
  Building,
  PieChart,
  TrendingUp,
  Users,
  CheckSquare,
  Calendar,
  FileText,
  Monitor,
  Camera,
  Mic,
  Globe,
  Smartphone,
  Palette,
  BarChart3
} from 'lucide-react';
import SoftwareDevelopment from '../components/it/SoftwareDevelopment';
import SeoDigitalMarketing from '../components/it/SeoDigitalMarketing';
import VideoEditing from '../components/it/VideoEditing';
import AnchorRecording from '../components/it/AnchorRecording';
import AdsAdvertisement from '../components/it/AdsAdvertisement';
import ItSettings from '../components/it/ItSettings';

const ItInfrastructure = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isItLoggedIn");
    localStorage.removeItem("itEmail");
    localStorage.removeItem("itName");
    localStorage.removeItem("itRole");
    navigate("/login");
    window.location.reload();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'software-dev', label: 'Software Development', icon: Code },
    { id: 'seo-marketing', label: 'SEO & Digital Marketing', icon: Search },
    { id: 'video-editing', label: 'Video Editing', icon: Video },
    { id: 'anchor-recording', label: 'Anchor & Recording', icon: Mic },
    { id: 'ads-advertisement', label: 'Ads & Advertisement', icon: Megaphone },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'software-dev':
        return <SoftwareDevelopment />;
      case 'seo-marketing':
        return <SeoDigitalMarketing />;
      case 'video-editing':
        return <VideoEditing />;
      case 'anchor-recording':
        return <AnchorRecording />;
      case 'ads-advertisement':
        return <AdsAdvertisement />;
      case 'settings':
        return <ItSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="it-infrastructure-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <Building className="company-icon" />
          <h2>100acres.com</h2>
          <p>IT Infrastructure Portal</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} className="nav-icon" />
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
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>{menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}</h1>
          <div className="user-info">
            <span>Welcome, IT Team</span>
          </div>
        </div>

        <div className="content-body">
          {renderContent()}
        </div>
      </div>

      <style>{`
        .it-infrastructure-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .sidebar {
          width: 280px;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: white;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .company-icon {
          color: #3b82f6;
          margin-bottom: 1rem;
        }

        .sidebar-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #3b82f6;
        }

        .sidebar-header p {
          font-size: 0.9rem;
          opacity: 0.8;
          margin: 0;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: white;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
        }

        .nav-item.active {
          background: #3b82f6;
          border-right: 4px solid #2563eb;
        }

        .nav-icon {
          margin-right: 0.75rem;
          opacity: 0.8;
        }

        .nav-item.active .nav-icon {
          opacity: 1;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(59,130,246,0.2);
          border: 1px solid #3b82f6;
          color: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #3b82f6;
        }

        .logout-btn svg {
          margin-right: 0.5rem;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .content-header {
          background: white;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .content-header h1 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .user-info {
          color: #64748b;
          font-size: 0.9rem;
        }

        .content-body {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .it-infrastructure-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
          }
          
          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 1rem 0;
          }
          
          .nav-item {
            min-width: 120px;
            flex-direction: column;
            padding: 0.5rem;
            font-size: 0.8rem;
          }
          
          .nav-icon {
            margin-right: 0;
            margin-bottom: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const stats = [
    { title: 'Active Projects', value: '15', icon: Code, color: '#3b82f6', trend: '+3' },
    { title: 'SEO Campaigns', value: '8', icon: Search, color: '#10b981', trend: '+2' },
    { title: 'Videos Editing', value: '12', icon: Video, color: '#f59e0b', trend: '+5' },
    { title: 'Ad Campaigns', value: '6', icon: Megaphone, color: '#ef4444', trend: '+1' }
  ];

  const recentActivities = [
    { type: 'dev', message: 'New website project started for client ABC Corp', time: '2 hours ago' },
    { type: 'seo', message: 'SEO audit completed for 5 client websites', time: '4 hours ago' },
    { type: 'video', message: 'Product demo video editing completed', time: '6 hours ago' },
    { type: 'ads', message: 'Facebook ad campaign launched for real estate client', time: '1 day ago' }
  ];

  const projectProgress = [
    { name: 'E-commerce Website', progress: 85, status: 'In Progress', deadline: '2024-02-15' },
    { name: 'Mobile App Development', progress: 60, status: 'In Progress', deadline: '2024-03-01' },
    { name: 'SEO Optimization', progress: 90, status: 'Almost Done', deadline: '2024-01-25' },
    { name: 'Video Marketing Campaign', progress: 45, status: 'In Progress', deadline: '2024-02-10' }
  ];

  return (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{backgroundColor: stat.color + '20', color: stat.color}}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className="stat-trend" style={{color: stat.trend.includes('+') ? '#10b981' : '#ef4444'}}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Progress */}
      <div className="dashboard-section">
        <h2>Project Progress</h2>
        <div className="progress-list">
          {projectProgress.map((project, index) => (
            <div key={index} className="progress-item">
              <div className="progress-header">
                <h4>{project.name}</h4>
                <div className="progress-info">
                  <span className="progress-percentage">{project.progress}%</span>
                  <span className="progress-status">{project.status}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${project.progress}%`}}
                ></div>
              </div>
              <div className="progress-deadline">
                <Calendar size={14} />
                <span>Deadline: {project.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="dashboard-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-content">
                <p>{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn">
            <Code size={20} />
            <span>New Project</span>
          </button>
          <button className="action-btn">
            <Search size={20} />
            <span>SEO Audit</span>
          </button>
          <button className="action-btn">
            <Video size={20} />
            <span>Video Project</span>
          </button>
          <button className="action-btn">
            <Megaphone size={20} />
            <span>Ad Campaign</span>
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default ItInfrastructure;