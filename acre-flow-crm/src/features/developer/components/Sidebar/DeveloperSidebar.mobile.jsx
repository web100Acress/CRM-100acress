import React from 'react';
import { Code, X, Shield, LogOut } from 'lucide-react';

const DeveloperSidebarMobile = ({ 
  isDark, 
  sidebarOpen,
  setSidebarOpen,
  activeTab, 
  setActiveTab, 
  toggleTheme, 
  handleLogout, 
  developerName, 
  tabs 
}) => {
  return (
    <>
      {sidebarOpen && (
        <div className={`crm-mobile-sidebar ${isDark ? 'is-dark' : 'is-light'}`}>
          <div className="crm-mobile-header">
            <div className="crm-mobile-brand">
              <div className="crm-panel-brand-icon">
                <Code className="crm-panel-brand-icon-svg" />
              </div>
              <div className="crm-panel-brand-text">
                <div className="crm-panel-brand-title">Developer Console</div>
                <div className="crm-panel-brand-sub">System Management</div>
              </div>
            </div>
            <button className="crm-mobile-close" onClick={() => setSidebarOpen(false)}><X /></button>
          </div>

          <div className="crm-mobile-nav">
            <div className="crm-panel-group">
              <div className="crm-panel-heading">Developer Tools</div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`crm-panel-link ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span className="crm-panel-link-icon"><tab.icon className="crm-panel-icon" /></span>
                  <span className="crm-panel-link-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="crm-panel-footer">
            <div className="crm-panel-user">
              <div className="crm-panel-user-avatar"><Shield className="crm-panel-user-icon" /></div>
              <div className="crm-panel-user-meta">
                <div className="crm-panel-user-name">{developerName}</div>
                <div className="crm-panel-user-role">Developer</div>
              </div>
            </div>

            <div className="crm-panel-footer-actions">
              <button type="button" onClick={toggleTheme} className="crm-panel-toggle">
                <span className="crm-panel-toggle-label">Dark Mode</span>
                <span className={`crm-panel-toggle-pill ${isDark ? 'on' : 'off'}`}>
                  <span className="crm-panel-toggle-dot" />
                </span>
              </button>

              <button type="button" className="crm-panel-logout" onClick={handleLogout}>
                <LogOut className="crm-panel-logout-icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperSidebarMobile;
