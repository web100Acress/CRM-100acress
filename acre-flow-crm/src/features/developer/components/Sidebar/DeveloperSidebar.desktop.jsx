import React from 'react';
import { Code, Sun, Moon, LogOut, Shield } from 'lucide-react';

const DeveloperSidebarDesktop = ({ 
  isDark, 
  sidebarOpen, 
  activeTab, 
  setActiveTab, 
  toggleTheme, 
  handleLogout, 
  developerName, 
  tabs 
}) => {
  return (
    <div
      className={`crm-sidebar ${isDark ? 'is-dark' : 'is-light'} ${sidebarOpen ? 'is-collapsed' : ''} ${
        false ? 'hidden' : 'flex'
      }`}
    >
      <div className="crm-sidebar-rail">
        <div className="crm-rail-top">
          <div className="crm-rail-logo" title="100acres CRM">
            <Code className="crm-rail-logo-icon" />
          </div>
        </div>

        <div className="crm-rail-nav">
          {tabs.map((tab, idx) => (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`crm-rail-link ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon className="crm-rail-icon" />
              </button>
              {idx < tabs.length - 1 && <div className="crm-rail-divider" />}
            </React.Fragment>
          ))}
        </div>

        <div className="crm-rail-bottom">
          <button
            type="button"
            onClick={toggleTheme}
            className="crm-rail-action"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="crm-rail-icon" /> : <Moon className="crm-rail-icon" />}
          </button>
          <button type="button" onClick={handleLogout} className="crm-rail-action" title="Logout">
            <LogOut className="crm-rail-icon" />
          </button>
        </div>
      </div>

      {!sidebarOpen && (
        <div className="crm-sidebar-panel">
          <div className="crm-panel-header">
            <div className="crm-panel-brand">
              <div className="crm-panel-brand-icon">
                <Code className="crm-panel-brand-icon-svg" />
              </div>
              <div className="crm-panel-brand-text">
                <div className="crm-panel-brand-title">Developer Console</div>
                <div className="crm-panel-brand-sub">System Management</div>
              </div>
            </div>
          </div>

          <div className="crm-panel-nav">
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
    </div>
  );
};

export default DeveloperSidebarDesktop;
