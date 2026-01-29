import React from 'react';
import { Menu, Bell, Settings, Code } from 'lucide-react';

const MobileHeader = ({ sidebarOpen, onToggleSidebar, developerName }) => {
  return (
    <header className="mobile-dashboard-header">
      <div className="mobile-header-left">
        <button onClick={onToggleSidebar} className="mobile-menu-button">
          <Menu className="mobile-menu-icon" />
        </button>
        <div className="mobile-header-brand">
          <Code className="mobile-brand-icon" />
          <span className="mobile-brand-text">Dev</span>
        </div>
      </div>

      <div className="mobile-header-right">
        <button className="mobile-notification-button" title="Notifications">
          <Bell className="mobile-bell-icon" />
          <span className="mobile-notification-dot"></span>
        </button>
        
        <button className="mobile-settings-button" title="Settings">
          <Settings className="mobile-settings-icon" />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;