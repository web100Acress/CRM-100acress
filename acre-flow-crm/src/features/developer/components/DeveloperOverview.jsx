import React from 'react';
import { 
  Server, 
  Database, 
  Activity, 
  Zap, 
  Globe, 
  BarChart3, 
  Package, 
  Shield 
} from 'lucide-react';

const DeveloperOverview = ({ developerName, systemStats, handleAction }) => {
  return (
    <div className="developer-overview">
      {/* Enhanced Header Section */}
      <div className="overview-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="developer-profile">
            <div className="profile-avatar">
              <div className="avatar-glow">
                <div className="avatar-initial">
                  {developerName.charAt(0).toUpperCase()}
                </div>
                <div className="status-indicator online"></div>
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-title">
                Welcome back, <span className="developer-name">{developerName}</span>! 👨‍💻
              </h1>
              <p className="profile-subtitle">System Administrator & Developer</p>
              <div className="profile-badges">
                <span className="badge premium">Premium Access</span>
                <span className="badge active">Active Now</span>
                <span className="badge level">Level 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions Section */}
      <div className="actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <button onClick={() => handleAction('Cache Clear')} className="action-card primary">
            <div className="action-icon">
              <Zap className="icon" />
            </div>
            <div className="action-content">
              <h3>Clear Cache</h3>
              <p>Clear system cache and temporary files</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button onClick={() => handleAction('DB Optimize')} className="action-card secondary">
            <div className="action-icon">
              <Database className="icon" />
            </div>
            <div className="action-content">
              <h3>Optimize Database</h3>
              <p>Improve database performance and speed</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button onClick={() => handleAction('Backup Create')} className="action-card tertiary">
            <div className="action-icon">
              <Package className="icon" />
            </div>
            <div className="action-content">
              <h3>Create Backup</h3>
              <p>Generate system backup and restore points</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button onClick={() => handleAction('Security Scan')} className="action-card warning">
            <div className="action-icon">
              <Shield className="icon" />
            </div>
            <div className="action-content">
              <h3>Security Scan</h3>
              <p>Run comprehensive security analysis</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <h2 className="section-title">Recent System Activities</h2>
        <div className="activities-timeline">
          <div className="timeline-item">
            <div className="timeline-dot success"></div>
            <div className="timeline-content">
              <div className="activity-header">
                <h4>Database Backup Completed</h4>
                <span className="activity-time">2 hours ago</span>
              </div>
              <p>Successfully created backup of all system databases (2.4 GB)</p>
              <div className="activity-tags">
                <span className="tag success">Completed</span>
                <span className="tag">Database</span>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot warning"></div>
            <div className="timeline-content">
              <div className="activity-header">
                <h4>Security Scan Detected Issues</h4>
                <span className="activity-time">4 hours ago</span>
              </div>
              <p>Found 3 minor security vulnerabilities in API endpoints</p>
              <div className="activity-tags">
                <span className="tag warning">Attention Required</span>
                <span className="tag">Security</span>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot info"></div>
            <div className="timeline-content">
              <div className="activity-header">
                <h4>System Update Deployed</h4>
                <span className="activity-time">1 day ago</span>
              </div>
              <p>Successfully deployed version 2.1.0 with performance improvements</p>
              <div className="activity-tags">
                <span className="tag info">Deployed</span>
                <span className="tag">Update</span>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot success"></div>
            <div className="timeline-content">
              <div className="activity-header">
                <h4>Performance Optimization Complete</h4>
                <span className="activity-time">2 days ago</span>
              </div>
              <p>Improved API response time by 35% through code optimization</p>
              <div className="activity-tags">
                <span className="tag success">Optimized</span>
                <span className="tag">Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperOverview;
