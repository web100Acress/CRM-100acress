import React, { useState, useEffect } from "react";
import { UserPlus, Save, X, Info } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
            `http://localhost:5001/api/users?role=${roleToFetch}`,
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
      const response = await fetch("http://localhost:5001/api/users", {
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

      <style>{`
        /* Google Fonts - Poppins */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .role-form-container {
          font-family: 'Poppins', sans-serif;
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Align to start for better scrolling on smaller screens */
          min-height: 100vh; /* Ensure it takes full viewport height */
          padding: 40px 20px;
          background: #f8fafc; /* Lighter background */
          box-sizing: border-box; /* Include padding in element's total width and height */
        }

        .role-form-card {
          width: 100%;
          max-width: 800px; /* Increased max-width for better layout */
          background: #fff;
          border-radius: 12px; /* Slightly more rounded corners */
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* More pronounced shadow */
          border: 1px solid #e2e8f0; /* Subtle border */
          padding: 30px; /* Increased padding */
          animation: fadeIn 0.5s ease-out; /* Add a fade-in animation */
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .role-form-header {
         display: flex;
  flex-direction: column; /* Add this line to stack items vertically if needed */
  align-items: center;   /* Changed from 'flex-start' or no specific alignment to 'center' */
  justify-content: center; /* This will center content horizontally if flex-direction is row */
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
  text-align: center; /* This will center text, useful if it's not a flex item */
}

.role-form-header h2 {
  margin: 0; /* Remove default margin for h2 to prevent unwanted spacing */
  font-size: 26px; /* Keeping the larger font size as previously set */
  font-weight: 700;
  color: #1e293b;
  /* No need for text-align: center here if parent is handling it */
}

.role-form-header .header-icon {
  color: #2563eb;
  margin-right: 0; /* Remove right margin to center icon below text if using column flow */
  margin-bottom: 10px; /* Add some space below the icon if stacking */
  font-size: 28px;
  animation: pulse 1.5s infinite;
}
        .role-form-header h2 {
          margin: 0;
          font-size: 26px; /* Larger title */
          font-weight: 700; /* Bolder title */
          color: #1e293b; /* Darker text */
        }

        .role-form-header .header-icon {
          color: #2563eb; /* Primary blue color */
          margin-right: 12px; /* Increased margin */
          font-size: 28px; /* Larger icon */
          animation: pulse 1.5s infinite; /* Gentle pulse animation */
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .info-box {
          display: flex;
          align-items: flex-start;
          background: #e0f2fe; /* Light blue background */
          color: #0284c7; /* Darker blue text */
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 14px;
          border: 1px solid #bfdbfe; /* Matching border */
        }

        .info-box .info-icon {
          color: #3b82f6; /* A slightly different blue for the icon */
          margin-right: 10px;
          flex-shrink: 0; /* Prevent icon from shrinking */
        }
        .info-box p {
            margin: 0;
            line-height: 1.5;
        }

        .role-form {
          display: flex;
          flex-direction: column;
          gap: 25px; /* Increased gap between form sections */
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Adjusted minmax for better responsiveness */
          gap: 20px; /* Gap between grid items */
        }

        label {
          display: block;
          font-weight: 600; /* Bolder labels */
          margin-bottom: 8px; /* Increased margin */
          color: #334155; /* Darker gray for labels */
          font-size: 14px;
        }

        input, select {
          width: 100%;
          padding: 12px 15px; /* Increased padding */
          border: 1px solid #cbd5e1; /* Lighter border */
          border-radius: 8px; /* More rounded input fields */
          font-size: 15px;
          color: #334155;
          transition: border-color 0.2s, box-shadow 0.2s; /* Smooth transitions */
          background-color: #fcfcfc; /* Slightly off-white background for inputs */
        }

        input:focus, select:focus {
          outline: none;
          border-color: #3b82f6; /* Blue border on focus */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); /* Blue glow on focus */
        }

        select {
          appearance: none; /* Remove default select arrow */
          background-image: url('data:image/svg+xml;utf8,<svg fill="%236B7280" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill-rule="evenodd"></path></svg>');
          background-repeat: no-repeat;
          background-position: right 15px center; /* Position arrow on the right */
          background-size: 1.2em; /* Size of the arrow */
        }

        .permissions-label {
            margin-bottom: 12px; /* Increased space for permissions label */
        }

        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Adjusted for more columns if space allows */
          gap: 12px; /* Gap between checkboxes */
          background: #f9fafb; /* Light background for permission section */
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px; /* Space between checkbox and text */
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          user-select: none; /* Prevent text selection */
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          border: 1px solid #94a3b8;
          border-radius: 4px;
          appearance: none;
          -webkit-appearance: none;
          background-color: #fff;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease-in-out;
          flex-shrink: 0;
        }

        .checkbox-label input[type="checkbox"]:checked {
          background-color: #2563eb; /* Blue when checked */
          border-color: #2563eb;
        }

        .checkbox-label input[type="checkbox"]:checked::after {
          content: '✔'; /* Checkmark symbol */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .checkbox-label input[type="checkbox"]:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
            outline: none;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          border-top: 1px solid #e2e8f0;
          padding-top: 25px;
          margin-top: 15px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px; /* Space between icon and text */
          padding: 12px 22px; /* Increased padding */
          border: none;
          font-weight: 600; /* Bolder text */
          border-radius: 8px; /* More rounded buttons */
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s; /* Smooth transitions */
          box-shadow: 0 4px 10px rgba(0,0,0,0.05); /* Subtle button shadow */
        }

        .btn.btn-cancel {
          background: #e2e8f0; /* Light gray background */
          color: #475569; /* Darker gray text */
        }
        .btn.btn-cancel:hover {
          background: #cbd5e1; /* Darker gray on hover */
          transform: translateY(-1px);
        }

        .btn.btn-submit {
          background: #2563eb; /* Primary blue background */
          color: #fff; /* White text */
        }
        .btn.btn-submit:hover {
          background: #1d4ed8; /* Darker blue on hover */
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.2); /* More prominent shadow on hover */
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .role-form-card {
            padding: 20px;
            margin: 0 10px; /* Add some horizontal margin on smaller screens */
          }
          .form-grid {
            grid-template-columns: 1fr; /* Single column layout for smaller screens */
          }
          .role-form-header h2 {
            font-size: 22px;
            
          }
          .btn {
            width: 100%; /* Full width buttons on small screens */
            justify-content: center;
          }
          .form-actions {
            flex-direction: column; /* Stack buttons vertically */
            gap: 10px;
          }
          .permissions-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Adjust for smaller screens */
          }
        }
        @media (max-width: 480px) {
            .role-form-container {
                padding: 20px 10px;
            }
            .role-form-card {
                padding: 15px;
            }
            .role-form-header h2 {
                font-size: 20px;
            }
            input, select, .btn {
                font-size: 14px;
                padding: 10px 12px;
            }
            .info-box {
                padding: 10px;
                font-size: 13px;
            }
            .checkbox-label {
                font-size: 13px;
            }
        }
      `}</style>
    </div>
  );
};

export default RoleCreationForms;
