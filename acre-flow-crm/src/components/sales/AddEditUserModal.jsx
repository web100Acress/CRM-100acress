import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Building } from 'lucide-react';
import { Button } from '../ui/button'; // Assuming this Button component is also custom styled or generic
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '../ui/alert-dialog'; // Assuming these are from a UI library that renders standard HTML elements

const AddEditUserModal = ({ isOpen, onClose, user = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'employee',
    department: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'employee',
        department: user.department || '',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'employee',
        department: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: user?.id || Date.now(), // Use _id if available from backend, otherwise fallback
        createdAt: user?.createdAt || new Date().toISOString().split('T')[0],
        lastLogin: user?.lastLogin || new Date().toISOString().split('T')[0]
      });
      onClose();
    }
  };

  const departments = [
    'Sales', 'Marketing', 'Operations', 'Customer Support',
    'HR', 'Finance', 'IT', 'Management'
  ];

  const roles = [
    { value: 'super-admin', label: 'Super Admin' },
    { value: 'head-admin', label: 'Head Admin' },
    { value: 'team-leader', label: 'Team Leader' },
    { value: 'employee', label: 'Employee' }
  ];

  // The AlertDialog component itself will handle rendering based on `isOpen`
  // so we don't need `if (!isOpen) return null;` here.

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="add-edit-modal-content"> {/* Apply custom class here */}
        <AlertDialogHeader className="modal-header">
          <AlertDialogTitle className="modal-title">
            {user ? 'Edit User' : 'Add New User'}
          </AlertDialogTitle>
          {/* Icon is now part of the title's content via CSS or placed directly */}
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <User className="input-icon" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter full name"
              />
            </div>
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-with-icon">
              <Mail className="input-icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter email address"
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <div className="input-with-icon">
              <Phone className="input-icon" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`input-field ${errors.phone ? 'input-error' : ''}`}
                placeholder="+91 9876543210"
              />
            </div>
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="select-field"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <div className="input-with-icon">
              <Building className="input-icon" />
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className={`select-field ${errors.department ? 'input-error' : ''}`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            {errors.department && <p className="error-message">{errors.department}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="select-field"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <AlertDialogFooter className="modal-footer">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="btn-cancel"
            >
              <X className="button-icon" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-submit"
            >
              <Save className="button-icon" />
              {user ? 'Update User' : 'Create User'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>

      <style>{`
        /* Google Fonts - Poppins */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        /* General Modal Styling */
        .add-edit-modal-content {
          font-family: 'Poppins', sans-serif;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          width: 90%; /* Responsive width */
          max-width: 480px; /* Small form type */
          z-index: 1000; /* Ensure it's above other content */
          animation: modalFadeIn 0.3s ease-out forwards;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem; /* Space between header, form, and footer */
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        /* Modal Header */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .modal-title {
          font-size: 1.75rem; /* Larger title */
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-title .lucide-user { /* Specific icon styling */
          color: #2563eb; /* Primary blue */
          height: 1.75rem;
          width: 1.75rem;
        }

        /* Form Styling */
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* Space between form groups */
        }

        .form-group {
          margin-bottom: 0.5rem; /* Slight space below each group */
        }

        .form-label {
          display: block;
          font-size: 0.875rem; /* text-sm */
          font-weight: 500;
          margin-bottom: 0.375rem; /* mb-1 */
          color: #334155;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem; /* left-3 */
          top: 50%;
          transform: translateY(-50%);
          height: 1rem; /* h-4 */
          width: 1rem; /* w-4 */
          color: #94a3b8; /* text-gray-400 */
        }

        .input-field,
        .select-field {
          width: 100%;
          padding: 0.625rem 0.75rem; /* py-2 px-3 */
          padding-left: 2.5rem; /* pl-10 for icon */
          border: 1px solid #e2e8f0; /* border-gray-200 */
          border-radius: 0.5rem; /* rounded-lg */
          font-size: 1rem;
          color: #334155;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background-color: #fcfcfc;
        }

        .select-field {
          padding-left: 0.75rem; /* Remove extra padding for select if no icon */
          appearance: none; /* Remove default arrow */
          background-image: url('data:image/svg+xml;utf8,<svg fill="%236B7280" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill-rule="evenodd"></path></svg>');
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1em;
        }

        .input-field:focus,
        .select-field:focus {
          outline: none;
          border-color: #22c55e; /* focus:border-green-500 */
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); /* focus:ring-green-500 */
        }

        .input-error {
          border-color: #ef4444; /* border-red-500 */
        }

        .error-message {
          color: #ef4444; /* text-red-500 */
          font-size: 0.75rem; /* text-xs */
          margin-top: 0.25rem; /* mt-1 */
        }

        /* Modal Footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem; /* gap-2 */
          padding-top: 1rem; /* pt-4 */
          border-top: 1px solid #f1f5f9;
        }

        .btn-cancel,
        .btn-submit {
          display: flex;
          align-items: center;
          gap: 0.5rem; /* gap-2 */
          padding: 0.625rem 1rem; /* py-2 px-4 */
          border-radius: 0.5rem; /* rounded-lg */
          font-size: 0.95rem; /* text-base */
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
        }

        .btn-cancel {
          background-color: #f1f5f9; /* variant="outline" default */
          color: #475569;
          border: 1px solid #cbd5e1;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .btn-cancel:hover {
          background-color: #e2e8f0;
          transform: translateY(-1px);
        }

        .btn-submit {
          background-color: #22c55e; /* bg-green-600 */
          color: #ffffff;
          border: none;
          box-shadow: 0 2px 5px rgba(34, 197, 94, 0.2);
        }
        .btn-submit:hover {
          background-color: #16a34a; /* hover:bg-green-700 */
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);
        }

        .button-icon {
          height: 1rem; /* h-4 */
          width: 1rem; /* w-4 */
        }

        /* Responsive adjustments */
        @media (max-width: 600px) {
          .add-edit-modal-content {
            width: 95%;
            padding: 1.5rem;
            gap: 1rem;
          }
          .modal-title {
            font-size: 1.5rem;
            gap: 0.5rem;
          }
          .modal-title .lucide-user {
            height: 1.5rem;
            width: 1.5rem;
          }
          .input-field,
          .select-field {
            font-size: 0.9rem;
            padding: 0.5rem 0.75rem;
            padding-left: 2.25rem; /* Adjust for smaller icon */
          }
          .input-icon {
            left: 0.6rem;
            height: 0.9rem;
            width: 0.9rem;
          }
          .btn-cancel,
          .btn-submit {
            font-size: 0.85rem;
            padding: 0.5rem 0.8rem;
            gap: 0.4rem;
          }
          .button-icon {
            height: 0.9rem;
            width: 0.9rem;
          }
          .modal-footer {
            flex-direction: column; /* Stack buttons on small screens */
            gap: 0.5rem;
          }
          .btn-cancel, .btn-submit {
            width: 100%; /* Full width buttons when stacked */
            justify-content: center;
          }
        }
      `}</style>
    </AlertDialog>
  );
};

export default AddEditUserModal;