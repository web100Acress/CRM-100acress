
import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Clock, 
  DollarSign,
  Users,
  Calendar,
  FileText,
  Building
} from 'lucide-react';

const HrSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    companyName: '100acres.com',
    companyAddress: 'Sector 62, Noida, UP, India',
    companyPhone: '+91 120 456 7890',
    companyEmail: 'hr@100acres.com',
    timeZone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    
    // Working Hours
    workingDaysPerWeek: 5,
    standardWorkingHours: 9,
    weekStartDay: 'Monday',
    workStartTime: '09:00',
    workEndTime: '18:00',
    lunchBreakDuration: 60,
    
    // Leave Settings
    annualLeaves: 21,
    sickLeaves: 12,
    casualLeaves: 12,
    maternityLeaves: 180,
    paternityLeaves: 15,
    
    // Payroll Settings
    salaryProcessingDay: 1,
    pfContribution: 12,
    esicContribution: 3.25,
    tdsDeduction: true,
    bonusPercentage: 8.33,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    leaveApprovalNotifications: true,
    payrollNotifications: true,
    birthdayReminders: true,
    
    // Security Settings
    passwordComplexity: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    dataBackup: true,
    auditLogs: true
  });

  const settingSections = [
    { id: 'general', name: 'General Settings', icon: Settings },
    { id: 'working', name: 'Working Hours', icon: Clock },
    { id: 'leave', name: 'Leave Policies', icon: Calendar },
    { id: 'payroll', name: 'Payroll Settings', icon: DollarSign },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>General Settings</h3>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Company Name</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => handleSettingChange('companyName', e.target.value)}
          />
        </div>
        
        <div className="setting-group">
          <label>Company Email</label>
          <input
            type="email"
            value={settings.companyEmail}
            onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
          />
        </div>
        
        <div className="setting-group">
          <label>Company Phone</label>
          <input
            type="tel"
            value={settings.companyPhone}
            onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
          />
        </div>
        
        <div className="setting-group">
          <label>Time Zone</label>
          <select
            value={settings.timeZone}
            onChange={(e) => handleSettingChange('timeZone', e.target.value)}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
        </div>
        
        <div className="setting-group">
          <label>Date Format</label>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div className="setting-group">
          <label>Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
        
        <div className="setting-group full-width">
          <label>Company Address</label>
          <textarea
            value={settings.companyAddress}
            onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderWorkingHours = () => (
    <div className="settings-section">
      <h3>Working Hours & Schedule</h3>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Working Days Per Week</label>
          <select
            value={settings.workingDaysPerWeek}
            onChange={(e) => handleSettingChange('workingDaysPerWeek', parseInt(e.target.value))}
          >
            <option value={5}>5 Days</option>
            <option value={6}>6 Days</option>
            <option value={7}>7 Days</option>
          </select>
        </div>
        
        <div className="setting-group">
          <label>Standard Working Hours</label>
          <input
            type="number"
            min="6"
            max="12"
            value={settings.standardWorkingHours}
            onChange={(e) => handleSettingChange('standardWorkingHours', parseInt(e.target.value))}
          />
        </div>
        
        <div className="setting-group">
          <label>Week Start Day</label>
          <select
            value={settings.weekStartDay}
            onChange={(e) => handleSettingChange('weekStartDay', e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        
        <div className="setting-group">
          <label>Work Start Time</label>
          <input
            type="time"
            value={settings.workStartTime}
            onChange={(e) => handleSettingChange('workStartTime', e.target.value)}
          />
        </div>
        
        <div className="setting-group">
          <label>Work End Time</label>
          <input
            type="time"
            value={settings.workEndTime}
            onChange={(e) => handleSettingChange('workEndTime', e.target.value)}
          />
        </div>
        
        <div className="setting-group">
          <label>Lunch Break (minutes)</label>
          <input
            type="number"
            min="30"
            max="120"
            value={settings.lunchBreakDuration}
            onChange={(e) => handleSettingChange('lunchBreakDuration', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );

  const renderLeaveSettings = () => (
    <div className="settings-section">
      <h3>Leave Policies</h3>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Annual Leaves (per year)</label>
          <input
            type="number"
            min="15"
            max="30"
            value={settings.annualLeaves}
            onChange={(e) => handleSettingChange('annualLeaves', parseInt(e.target.value))}
          />
        </div>
        
        <div className="setting-group">
          <label>Sick Leaves (per year)</label>
          <input
            type="number"
            min="10"
            max="20"
            value={settings.sickLeaves}
            onChange={(e) => handleSettingChange('sickLeaves', parseInt(e.target.value))}
          />
        </div>
        
        <div className="setting-group">
          <label>Casual Leaves (per year)</label>
          <input
            type="number"
            min="10"
            max="20"
            value={settings.casualLeaves}
            onChange={(e) => handleSettingChange('casualLeaves', parseInt(e.target.value))}
          />
        </div>
        
        <div className="setting-group">
          <label>Maternity Leave (days)</label>
          <input
            type="number"
            min="90"
            max="240"
            value={settings.maternityLeaves}
            onChange={(e) => handleSettingChange('maternityLeaves', parseInt(e.target.value))}
          />
        </div>
        
        <div className="setting-group">
          <label>Paternity Leave (days)</label>
          <input
            type="number"
            min="7"
            max="30"
            value={settings.paternityLeaves}
            onChange={(e) => handleSettingChange('paternityLeaves', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );

  const renderPayrollSettings = () => (
    <div className="settings-section">
      <h3>Payroll Configuration</h3>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Salary Processing Day</label>
          <select
            value={settings.salaryProcessingDay}
            onChange={(e) => handleSettingChange('salaryProcessingDay', parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 10, 15, 25, 30].map(day => (
              <option key={day} value={day}>{day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of month</option>
            ))}
          </select>
        </div>
        
        <div className="setting-group">
          <label>PF Contribution (%)</label>
          <input
            type="number"
            min="10"
            max="15"
            step="0.1"
            value={settings.pfContribution}
            onChange={(e) => handleSettingChange('pfContribution', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="setting-group">
          <label>ESIC Contribution (%)</label>
          <input
            type="number"
            min="3"
            max="5"
            step="0.25"
            value={settings.esicContribution}
            onChange={(e) => handleSettingChange('esicContribution', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="setting-group">
          <label>Bonus Percentage (%)</label>
          <input
            type="number"
            min="8"
            max="20"
            step="0.1"
            value={settings.bonusPercentage}
            onChange={(e) => handleSettingChange('bonusPercentage', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="setting-group toggle">
          <label>Enable TDS Deduction</label>
          <input
            type="checkbox"
            checked={settings.tdsDeduction}
            onChange={(e) => handleSettingChange('tdsDeduction', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="settings-list">
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Email Notifications</label>
            <p>Send notifications via email</p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
          />
        </div>
        
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>SMS Notifications</label>
            <p>Send notifications via SMS</p>
          </div>
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
          />
        </div>
        
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Leave Approval Notifications</label>
            <p>Notify managers about leave requests</p>
          </div>
          <input
            type="checkbox"
            checked={settings.leaveApprovalNotifications}
            onChange={(e) => handleSettingChange('leaveApprovalNotifications', e.target.checked)}
          />
        </div>
        
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Payroll Notifications</label>
            <p>Notify about salary processing</p>
          </div>
          <input
            type="checkbox"
            checked={settings.payrollNotifications}
            onChange={(e) => handleSettingChange('payrollNotifications', e.target.checked)}
          />
        </div>
        
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Birthday Reminders</label>
            <p>Send birthday wishes to employees</p>
          </div>
          <input
            type="checkbox"
            checked={settings.birthdayReminders}
            onChange={(e) => handleSettingChange('birthdayReminders', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Security Configuration</h3>
      <div className="settings-list">
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Password Complexity Requirements</label>
            <p>Enforce strong password policies</p>
          </div>
          <input
            type="checkbox"
            checked={settings.passwordComplexity}
            onChange={(e) => handleSettingChange('passwordComplexity', e.target.checked)}
          />
        </div>
        
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Two-Factor Authentication</label>
            <p>Require 2FA for all users</p>
          </div>
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
          />
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Session Timeout</label>
            <p>Auto logout after inactivity (minutes)</p>
          </div>
          <input
            type="number"
            min="15"
            max="120"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="small-input"
          />
        </div>
        
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Automatic Data Backup</label>
            <p>Enable daily automated backups</p>
          </div>
          <input
            type="checkbox"
            checked={settings.dataBackup}
            onChange={(e) => handleSettingChange('dataBackup', e.target.checked)}
          />
        </div>
        
        <div className="setting-item toggle">
          <div className="setting-info">
            <label>Audit Logs</label>
            <p>Track all system activities</p>
          </div>
          <input
            type="checkbox"
            checked={settings.auditLogs}
            onChange={(e) => handleSettingChange('auditLogs', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'working':
        return renderWorkingHours();
      case 'leave':
        return renderLeaveSettings();
      case 'payroll':
        return renderPayrollSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="hr-settings">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>HR Settings</h2>
          <p>Configure HR system preferences and policies</p>
        </div>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={20} />
          Save All Settings
        </button>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {settingSections.map(section => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon size={20} />
              <span>{section.name}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>

      <style>{`
        .hr-settings {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .header-left p {
          margin: 0;
          color: #64748b;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #dc2626;
        }

        .settings-container {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          min-height: 600px;
        }

        .settings-nav {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          height: fit-content;
          position: sticky;
          top: 2rem;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: none;
          border: none;
          color: #6b7280;
          text-align: left;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #374151;
        }

        .nav-item.active {
          background: #ef4444;
          color: white;
        }

        .settings-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .settings-section h3 {
          margin: 0 0 2rem 0;
          color: #1e293b;
          font-size: 1.3rem;
          font-weight: 600;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .setting-group.full-width {
          grid-column: 1 / -1;
        }

        .setting-group.toggle {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }

        .setting-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .setting-group input,
        .setting-group select,
        .setting-group textarea {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .setting-group input:focus,
        .setting-group select:focus,
        .setting-group textarea:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .setting-group input[type="checkbox"] {
          width: 40px;
          height: 20px;
          appearance: none;
          background: #e5e7eb;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .setting-group input[type="checkbox"]:checked {
          background: #ef4444;
        }

        .setting-group input[type="checkbox"]:before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .setting-group input[type="checkbox"]:checked:before {
          left: 22px;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
        }

        .setting-item.toggle {
          align-items: flex-start;
        }

        .setting-info {
          flex: 1;
        }

        .setting-info label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .setting-info p {
          margin: 0;
          color: #6b7280;
          font-size: 0.8rem;
        }

        .small-input {
          width: 80px;
          margin-left: 1rem;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .settings-container {
            grid-template-columns: 1fr;
          }
          
          .settings-nav {
            position: static;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.5rem;
          }
          
          .nav-item {
            margin-bottom: 0;
            justify-content: center;
            text-align: center;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.75rem 0.5rem;
          }
          
          .settings-grid {
            grid-template-columns: 1fr;
          }
          
          .setting-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .setting-item.toggle {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default HrSettings;