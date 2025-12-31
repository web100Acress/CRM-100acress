import React from 'react';
import { Menu, Search, Bell, Settings, Code } from 'lucide-react';

const DeveloperHeader = ({ sidebarOpen, onToggleSidebar, developerName }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button onClick={onToggleSidebar} className="menu-button">
          <Menu className="menu-icon" />
        </button>
        <div className="header-title-section">
          <div className="header-brand">
            <Code className="header-brand-icon" />
            <div className="header-brand-text">
              <h1 className="header-title">Developer Console</h1>
              <p className="header-subtitle">System Management & Tools</p>
            </div>
          </div>
          <div className="user-greeting">
            Hello <span className="user-name">{developerName}</span> <span className="user-role">(Developer)</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search developer tools..."
            className="search-input"
          />
        </div>
        
        <button className="notification-button" title="Notifications">
          <Bell className="bell-icon" />
          <span className="notification-dot"></span>
        </button>
        
        <button className="settings-button" title="Settings">
          <Settings className="settings-icon" />
        </button>
      </div>
    </header>
  );
};

export default DeveloperHeader;
