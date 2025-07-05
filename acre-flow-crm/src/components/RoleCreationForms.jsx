import React, { useState } from 'react';
import { UserPlus, Save, X } from 'lucide-react';

const RoleCreationForms = ({ userRole, formType }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    reportingTo: '',
    permissions: [],
    password: ''
  });

  const formConfigs = {
    'create-admin': {
      title: 'Create Head Admin',
      role: 'head-admin',
      departments: ['Sales', 'Marketing', 'Operations', 'Customer Success'],
      permissions: ['manage_team_leaders', 'assign_leads', 'view_reports', 'create_tickets']
    },
    'create-leader': {
      title: 'Create Team Leader',
      role: 'team-leader',
      departments: ['Sales Team A', 'Sales Team B', 'Marketing Team', 'Support Team'],
      permissions: ['manage_employees', 'assign_leads', 'create_tickets', 'view_team_reports']
    },
    'create-employee': {
      title: 'Add Employee',
      role: 'employee',
      departments: ['Inside Sales', 'Field Sales', 'Customer Support', 'Marketing'],
      permissions: ['view_assigned_leads', 'update_lead_status', 'manage_tickets']
    }
  };

  const config = formConfigs[formType] || formConfigs['create-employee'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, role: config.role }),
      });
      const data = await response.json();
      if (data.success) {
        alert('User created successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          reportingTo: '',
          permissions: [],
          password: ''
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <div className="role-form-container">
      <div className="role-form-card">
        <div className="role-form-header">
          <UserPlus className="icon" />
          <h2>{config.title}</h2>
        </div>

        {userRole === 'super-admin' && formType === 'create-admin' && (
          <div className="info-box">
            <strong>Super Admin Action:</strong> You are creating a Head Admin user.
          </div>
        )}

        <form onSubmit={handleSubmit} className="role-form">
          <div className="form-grid">
            <div>
              <label>Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label>Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label>Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label>Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label>Department *</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {config.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Reporting To</label>
              <input
                type="text"
                value={formData.reportingTo}
                onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label>Permissions</label>
            <div className="permissions-grid">
              {config.permissions.map(permission => (
                <label key={permission} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                  />
                  {permission.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn cancel">
              <X size={16} />
              Cancel
            </button>
            <button type="submit" className="btn submit">
              <Save size={16} />
              Create {config.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .role-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }
        .role-form-card {
          width: 100%;
          max-width: 700px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border: 1px solid #ddd;
          padding: 24px;
        }
        .role-form-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .role-form-header h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
        }
        .role-form-header .icon {
          color: #1d4ed8;
          margin-right: 10px;
        }
        .info-box {
          background: #e0f2fe;
          color: #0369a1;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .role-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        label {
          display: block;
          font-weight: 500;
          margin-bottom: 6px;
          color: #333;
        }
        input, select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border: none;
          font-weight: 500;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }
        .btn.cancel {
          background: #f3f4f6;
          color: #333;
        }
        .btn.submit {
          background: #2563eb;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default RoleCreationForms;
