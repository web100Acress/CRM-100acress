import React, { useState, useEffect } from "react";
import { UserPlus, Save, X, Info } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import '@/styles/RoleCreationForms.css'

const RoleCreationForms = ({ userRole, formType }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    reportingTo: "",
    permissions: [],
    password: "",
  });

  const [reportingToOptions, setReportingToOptions] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const formConfigs = {
    "create-admin": {
      title: "Create Head Admin",
      role: "head-admin",
      departments: [
        "Sales",
        "Marketing",
        "Operations",
        "Customer Success",
        "HR",
        "Finance",
      ],
      permissions: [
        "manage_team_leaders",
        "assign_leads",
        "view_reports",
        "create_tickets",
        "manage_users",
        "audit_logs",
      ],
    },
    "create-leader": {
      title: "Create Team Leader",
      role: "team-leader",
      departments: [
        "Sales Team A",
        "Sales Team B",
        "Marketing Team",
        "Support Team",
        "Product Team",
      ],
      permissions: [
        "manage_employees",
        "assign_leads",
        "create_tickets",
        "view_team_reports",
        "manage_team_leads",
      ],
    },
    "create-employee": {
      title: "Add Employee",
      role: "employee",
      departments: [
        "Inside Sales",
        "Field Sales",
        "Customer Support",
        "Marketing Assistant",
        "Product Support",
      ],
      permissions: [
        "view_assigned_leads",
        "update_lead_status",
        "manage_tickets",
        "log_activities",
      ],
    },
  };

  const config = formConfigs[formType] || formConfigs["create-employee"];

  useEffect(() => {
    const fetchReportingToOptions = async () => {
      let roleToFetch = "";
      if (config.role === "team-leader") {
        roleToFetch = "head-admin";
      } else if (config.role === "employee") {
        roleToFetch = "team-leader";
      }

      if (roleToFetch) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `https://crm.100acress.com/api/users?role=${roleToFetch}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            setReportingToOptions(data.data);
          } else {
            console.error("Failed to fetch reportingTo users:", data.message);
          }
        } catch (error) {
          console.error("Error fetching reportingTo users:", error);
        }
      } else {
        setReportingToOptions([]);
      }
    };

    fetchReportingToOptions();
  }, [config.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://crm.100acress.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, role: config.role }),
      });
      const data = await response.json();
      if (data.success) {
        alert("User created successfully!");
        navigate("/");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const formatPermission = (perm) => {
    return perm.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="role-form-container">
      <div className="role-form-card">
        <div className="role-form-header">
          <UserPlus className="header-icon" />
          <h2>{config.title}</h2>
        </div>

        {userRole === "super-admin" && formType === "create-admin" && (
          <div className="info-box">
            <Info className="info-icon" />
            <p>
              <strong>Super Admin Action:</strong> You are creating a Head Admin
              user. This role has broad management capabilities.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="role-form">
          <div className="form-grid">
            <div>
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="e.g., example@company.com"
              />
            </div>
            <div>
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="e.g., +91-9876543210"
              />
            </div>
            <div>
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Set a secure password"
              />
            </div>
            <div>
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                required
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {config.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="reportingTo">Reporting To</label>
              <select
                id="reportingTo"
                value={formData.reportingTo}
                onChange={(e) =>
                  setFormData({ ...formData, reportingTo: e.target.value })
                }
              >
                <option value="">Select Manager (Optional)</option>
                {reportingToOptions.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} (
                    {user.role
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    )
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="permissions-label">Assign Permissions</label>
            <div className="permissions-grid">
              {config.permissions.map((permission) => (
                <label key={permission} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                  />
                  {formatPermission(permission)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel">
              <X size={18} />
              Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              <Save size={18} />
              Create{" "}
              {config.role
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          </div>
        </form>
      </div>

     
    </div>
  );
};

export default RoleCreationForms;
