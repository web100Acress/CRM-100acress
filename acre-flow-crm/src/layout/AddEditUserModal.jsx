import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, User } from 'lucide-react';
import '@/styles/AddEditUserModal.css'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/layout/alert-dialog'; // Assuming these are from a UI library that renders standard HTML elements

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
    'BD', 'Marketing', 'Operations', 'Customer Support',
    'HR', 'Finance', 'IT', 'Management'
  ];

  const roles = [
    { value: 'super-admin', label: 'BOSS' },
    { value: 'head-admin', label: 'HOD' },
    { value: 'team-leader', label: 'Team Leader' },
    { value: 'employee', label: 'BD' }
  ];

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
              <UserPlus className="input-icon" />
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
              <UserPlus className="input-icon" />
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
              <UserPlus className="input-icon" />
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
            <AlertDialogCancel
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              <X className="button-icon" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              className="btn-submit"
            >
              <Save className="button-icon" />
              {user ? 'Update User' : 'Create User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>

     
    </AlertDialog>
  );
};

export default AddEditUserModal;