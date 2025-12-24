import React, { useState, useEffect } from 'react';
import { Users, DollarSign, FileText, Award, Plus, Trash2, RefreshCw, Edit2, Save, X, Eye } from 'lucide-react';

const RoleAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    department: '',
    role: '',
    allowedModules: [],
    permissions: [],
  });
  const [editFormData, setEditFormData] = useState({
    department: '',
    role: '',
    allowedModules: [],
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState('');

  const MODULE_OPTIONS = [
    { id: 'Admin', label: 'Admin' },
    { id: 'HR', label: 'HR' },
    { id: 'Blog', label: 'Blog' },
    { id: 'Sales', label: 'Sales' },
  ];

  const normalizeModules = (value) => {
    if (!Array.isArray(value)) return [];
    return value.filter(Boolean);
  };

  const normalizePermissions = (value) => {
    if (!Array.isArray(value)) return [];
    return value.filter(Boolean);
  };

  const PERMISSION_OPTIONS = [
    { module: 'Sales', id: 'sales.dashboard', label: 'Sales Dashboard' },
    { module: 'Sales', id: 'sales.leads', label: 'Leads' },

    { module: 'HR', id: 'hr.dashboard', label: 'HR Dashboard' },
    { module: 'HR', id: 'hr.all_users', label: 'All Users' },
    { module: 'HR', id: 'hr.all_jobs', label: 'All Jobs' },
    { module: 'HR', id: 'hr.leave_management', label: 'Leave Management' },
    { module: 'HR', id: 'hr.onboarding', label: 'Onboarding' },
    { module: 'HR', id: 'hr.offboarding', label: 'Offboarding' },

    { module: 'Blog', id: 'blog.dashboard', label: 'Blog Dashboard' },
    { module: 'Blog', id: 'blog.all_blogs', label: 'All Blogs' },
    { module: 'Blog', id: 'blog.users', label: 'Blog Users' },
    { module: 'Blog', id: 'blog.add_blog', label: 'Add Blog' },
    { module: 'Blog', id: 'blog.manage_blog', label: 'Manage Blog' },

    { module: 'Admin', id: 'admin.dashboard', label: 'Admin Dashboard' },
    { module: 'Admin', id: 'admin.register_user', label: 'Register User' },
    { module: 'Admin', id: 'admin.project_enquiries', label: 'Project Enquiries' },
    { module: 'Admin', id: 'admin.listed_projects', label: 'Listed Projects' },
    { module: 'Admin', id: 'admin.listed_properties', label: 'Listed Properties' },
    { module: 'Admin', id: 'admin.project_order_management', label: 'Project Order Management' },
    { module: 'Admin', id: 'admin.project_order_manager', label: 'Project Order Manager' },
    { module: 'Admin', id: 'admin.resale_enquiries', label: 'Resale Enquiries' },
    { module: 'Admin', id: 'admin.s3_manager', label: 'S3 Manager' },
    { module: 'Admin', id: 'admin.contact_cards', label: 'Contact Cards' },
    { module: 'Admin', id: 'admin.sitemap_manager', label: 'Sitemap Manager' },
    { module: 'Admin', id: 'admin.blog_post', label: 'Blog Post' },
    { module: 'Admin', id: 'admin.banner_management', label: 'Banner Management' },
    { module: 'Admin', id: 'admin.short_setting', label: 'Short setting' },
  ];

  const getDefaultPermissionsForModules = (mods) => {
    const allowed = new Set(normalizeModules(mods));
    return PERMISSION_OPTIONS.filter((p) => allowed.has(p.module)).map((p) => p.id);
  };

  const getDefaultModulesForDepartment = (dept) => {
    switch (dept) {
      case 'admin':
        return ['Admin'];
      case 'hr':
        return ['HR'];
      case 'blog':
        return ['Blog'];
      case 'sales':
        return ['Sales'];
      default:
        return [];
    }
  };

  const getPermissionsForSelectedModules = (mods) => {
    const allowed = new Set(normalizeModules(mods));
    return PERMISSION_OPTIONS.filter((p) => allowed.has(p.module));
  };

  const departments = [
    { id: 'sales', label: 'Sales', icon: DollarSign, color: 'bg-blue-500' },
    { id: 'hr', label: 'HR', icon: Users, color: 'bg-purple-500' },
    { id: 'blog', label: 'Blog', icon: FileText, color: 'bg-orange-500' },
    { id: 'admin', label: 'Admin', icon: Award, color: 'bg-red-500' },
  ];

  const rolesByDepartment = {
    sales: [
      { id: 'sales_head', label: 'Sales Head' },
      { id: 'sales_executive', label: 'Sales Executive' },
    ],
    hr: [
      { id: 'hr_manager', label: 'HR Manager' },
      { id: 'hr_executive', label: 'HR Executive' },
    ],
    blog: [
      { id: 'blog_manager', label: 'Blog Manager' },
      { id: 'blog_writer', label: 'Blog Writer' },
    ],
    admin: [
      { id: 'admin', label: 'Admin' },
      { id: 'crm_admin', label: 'CRM Admin' },
      { id: 'super-admin', label: 'Super Admin' },
    ],
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();

    if (!formData.department || !formData.role) {
      setMessage('❌ Please select both Department and Role before assigning.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://bcrm.100acress.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: formData.role,
          allowedModules: normalizeModules(formData.allowedModules),
          permissions: normalizePermissions(formData.permissions),
          name: formData.email.split('@')[0],
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ email: '', password: '', department: '', role: '', allowedModules: [], permissions: [] });
        setShowForm(false);
        setMessage('✅ User created and assigned successfully!');
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => fetchAssignments(), 500);
      } else {
        setMessage(`❌ Error: ${data.message || 'Failed to create user'}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (assignment) => {
    setEditingAssignment(assignment.id);
    setEditFormData({
      department: assignment.department,
      role: assignment.role,
      allowedModules: normalizeModules(assignment.allowedModules),
      permissions: normalizePermissions(assignment.permissions),
    });
  };

  const handleEditSave = async (assignmentId) => {
    setEditLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/users/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          department: editFormData.department,
          role: editFormData.role,
          permissions: normalizePermissions(editFormData.permissions),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        try {
          const token2 = localStorage.getItem('token');
          await fetch(`https://bcrm.100acress.com/api/users/${assignmentId}/modules`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token2}`,
            },
            body: JSON.stringify({
              allowedModules: normalizeModules(editFormData.allowedModules),
            }),
          });
        } catch (e) {
          // ignore
        }
        setMessage('✅ User role and department updated successfully!');
        setEditingAssignment(null);
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => fetchAssignments(), 500);
      } else {
        setMessage(`❌ Error: ${data.message || 'Failed to update user'}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingAssignment(null);
    setEditFormData({ department: '', role: '', allowedModules: [], permissions: [] });
  };

  const handleDelete = async (id) => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAssignments(assignments.filter((a) => a.id !== id));
        setMessage('✅ User deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error: Failed to delete user');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const getDepartmentColor = (deptId) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept?.color || 'bg-gray-500';
  };

  const getDepartmentLabel = (deptId) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept?.label || deptId;
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const token = localStorage.getItem('token');

      const response = await fetch('https://bcrm.100acress.com/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.data)) {
        const mappedAssignments = data.data
          .filter(user => user.role && user.department)
          .map((user, index) => ({
            id: user._id || index,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            department: user.department,
            role: user.role,
            allowedModules: normalizeModules(user.allowedModules),
            permissions: normalizePermissions(user.permissions),
            assignedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }));
        setAssignments(mappedAssignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleRefresh = () => {
    fetchAssignments();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Role Assignment</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={20} />
            Assign Role
          </button>
        </div>
      </div>

      {/* Department Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => {
          const count = assignments.filter((a) => a.department === dept.id).length;
          const Icon = dept.icon;
          return (
            <div key={dept.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${dept.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{dept.label}</h3>
              <p className="text-sm text-gray-600 mt-1">Users assigned</p>
            </div>
          );
        })}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={message.includes('✅') ? 'text-green-800' : 'text-red-800'}>{message}</p>
        </div>
      )}

      {/* Assignment Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Assign New Role</h3>
          <form onSubmit={handleAddAssignment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <select
              value={formData.department}
              onChange={(e) => {
                const dept = e.target.value;
                const defaultModules = getDefaultModulesForDepartment(dept);
                setFormData({
                  ...formData,
                  department: dept,
                  role: '',
                  allowedModules: defaultModules,
                  permissions: getDefaultPermissionsForModules(defaultModules),
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.label}
                </option>
              ))}
            </select>
            <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Module Access</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allModules = MODULE_OPTIONS.map((x) => x.id);
                        setFormData({
                          ...formData,
                          allowedModules: allModules,
                          permissions: getDefaultPermissionsForModules(allModules),
                        });
                      }}
                      className="text-xs font-medium text-blue-700 hover:text-blue-800"
                    >
                      Select All
                    </button>
                    <span className="text-xs text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, allowedModules: [], permissions: [] })}
                      className="text-xs font-medium text-gray-600 hover:text-gray-800"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MODULE_OPTIONS.map((m) => {
                    const checked = formData.allowedModules.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition ${
                          checked
                            ? 'bg-green-50 border-green-300 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={(e) => {
                            const nextModules = e.target.checked
                              ? [...formData.allowedModules, m.id]
                              : formData.allowedModules.filter((x) => x !== m.id);
                            const allowedSet = new Set(normalizeModules(nextModules));
                            const nextPermissions = formData.permissions.filter((p) => {
                              const meta = PERMISSION_OPTIONS.find((x) => x.id === p);
                              return meta ? allowedSet.has(meta.module) : true;
                            });
                            setFormData({
                              ...formData,
                              allowedModules: nextModules,
                              permissions: nextPermissions,
                            });
                          }}
                        />
                        <span className="font-medium">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Allowed Sidebar Options</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allowed = normalizeModules(formData.allowedModules);
                        const allPerms = getPermissionsForSelectedModules(allowed).map((p) => p.id);
                        setFormData({
                          ...formData,
                          permissions: Array.from(new Set(allPerms)),
                        });
                      }}
                      className="text-xs font-medium text-blue-700 hover:text-blue-800"
                      disabled={normalizeModules(formData.allowedModules).length === 0}
                    >
                      Select All
                    </button>
                    <span className="text-xs text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, permissions: [] })}
                      className="text-xs font-medium text-gray-600 hover:text-gray-800"
                      disabled={formData.permissions.length === 0}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-56 overflow-auto pr-1">
                  <div className="grid grid-cols-1 gap-2">
                    {getPermissionsForSelectedModules(formData.allowedModules).map((p) => {
                      const checked = formData.permissions.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition ${
                            checked
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...formData.permissions, p.id]
                                : formData.permissions.filter((x) => x !== p.id);
                              setFormData({ ...formData, permissions: next });
                            }}
                          />
                          <span className="font-medium">{p.module}</span>
                          <span className="text-gray-500">/</span>
                          <span className="truncate">{p.label}</span>
                        </label>
                      );
                    })}
                    {getPermissionsForSelectedModules(formData.allowedModules).length === 0 && (
                      <p className="text-xs text-gray-500">Select a module to configure options</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={!formData.department}
            >
              <option value="">Select Role</option>
              {formData.department &&
                rolesByDepartment[formData.department]?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating User...' : 'Assign Role'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments Table - Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingAssignments ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-600">
                    No assignments yet
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50 transition">
                    {editingAssignment === assignment.id ? (
                      <td colSpan="6" className="px-6 py-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-gray-900">{assignment.name}</p>
                              <p className="text-sm text-gray-600">{assignment.email}</p>
                              <p className="text-xs text-gray-500 mt-1">Assigned: {assignment.assignedDate}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSave(assignment.id)}
                                disabled={editLoading}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                <Save size={16} />
                                Save
                              </button>
                              <button
                                onClick={handleEditCancel}
                                disabled={editLoading}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                                <select
                                  value={editFormData.department}
                                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value, role: '' })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                      {dept.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
                                <select
                                  value={editFormData.role}
                                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Role</option>
                                  {editFormData.department &&
                                    rolesByDepartment[editFormData.department]?.map((role) => (
                                      <option key={role.id} value={role.id}>
                                        {role.label}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-sm font-semibold text-gray-900">Module Access</p>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const allModules = MODULE_OPTIONS.map((x) => x.id);
                                        setEditFormData({
                                          ...editFormData,
                                          allowedModules: allModules,
                                          permissions: getDefaultPermissionsForModules(allModules),
                                        });
                                      }}
                                      className="text-xs font-medium text-blue-700 hover:text-blue-800"
                                    >
                                      Select All
                                    </button>
                                    <span className="text-xs text-gray-300">|</span>
                                    <button
                                      type="button"
                                      onClick={() => setEditFormData({ ...editFormData, allowedModules: [], permissions: [] })}
                                      className="text-xs font-medium text-gray-600 hover:text-gray-800"
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  {MODULE_OPTIONS.map((m) => {
                                    const checked = editFormData.allowedModules.includes(m.id);
                                    return (
                                      <label
                                        key={m.id}
                                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition ${
                                          checked
                                            ? 'bg-green-50 border-green-300 text-green-800'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          className="h-4 w-4"
                                          checked={checked}
                                          onChange={(e) => {
                                            const nextModules = e.target.checked
                                              ? [...editFormData.allowedModules, m.id]
                                              : editFormData.allowedModules.filter((x) => x !== m.id);
                                            const allowedSet = new Set(normalizeModules(nextModules));
                                            const nextPermissions = editFormData.permissions.filter((p) => {
                                              const meta = PERMISSION_OPTIONS.find((x) => x.id === p);
                                              return meta ? allowedSet.has(meta.module) : true;
                                            });
                                            setEditFormData({
                                              ...editFormData,
                                              allowedModules: nextModules,
                                              permissions: nextPermissions,
                                            });
                                          }}
                                        />
                                        <span className="font-medium">{m.label}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-sm font-semibold text-gray-900">Allowed Sidebar Options</p>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const allowed = normalizeModules(editFormData.allowedModules);
                                        const allPerms = getPermissionsForSelectedModules(allowed).map((p) => p.id);
                                        setEditFormData({
                                          ...editFormData,
                                          permissions: Array.from(new Set(allPerms)),
                                        });
                                      }}
                                      className="text-xs font-medium text-blue-700 hover:text-blue-800"
                                      disabled={normalizeModules(editFormData.allowedModules).length === 0}
                                    >
                                      Select All
                                    </button>
                                    <span className="text-xs text-gray-300">|</span>
                                    <button
                                      type="button"
                                      onClick={() => setEditFormData({ ...editFormData, permissions: [] })}
                                      className="text-xs font-medium text-gray-600 hover:text-gray-800"
                                      disabled={editFormData.permissions.length === 0}
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </div>
                                <div className="max-h-56 overflow-auto pr-1">
                                  <div className="grid grid-cols-1 gap-2">
                                    {getPermissionsForSelectedModules(editFormData.allowedModules).map((p) => {
                                      const checked = editFormData.permissions.includes(p.id);
                                      return (
                                        <label
                                          key={p.id}
                                          className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition ${
                                            checked
                                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            checked={checked}
                                            onChange={(e) => {
                                              const next = e.target.checked
                                                ? [...editFormData.permissions, p.id]
                                                : editFormData.permissions.filter((x) => x !== p.id);
                                              setEditFormData({ ...editFormData, permissions: next });
                                            }}
                                          />
                                          <span className="font-medium">{p.module}</span>
                                          <span className="text-gray-500">/</span>
                                          <span className="truncate">{p.label}</span>
                                        </label>
                                      );
                                    })}
                                    {getPermissionsForSelectedModules(editFormData.allowedModules).length === 0 && (
                                      <p className="text-xs text-gray-500">Select a module to configure options</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{assignment.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{assignment.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 ${getDepartmentColor(assignment.department)} text-white rounded-full text-sm font-medium`}>
                            {getDepartmentLabel(assignment.department)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-medium">{assignment.role.replace(/_/g, ' ').toUpperCase()}</p>
                          {Array.isArray(assignment.allowedModules) && assignment.allowedModules.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {assignment.allowedModules.slice(0, 4).map((m) => (
                                <span key={m} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  {m}
                                </span>
                              ))}
                              {assignment.allowedModules.length > 4 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  +{assignment.allowedModules.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{assignment.assignedDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditStart(assignment)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition"
                            >
                              <Edit2 size={18} className="text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(assignment.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Name and View Button */}
      <div className="md:hidden space-y-2">
        {loadingAssignments ? (
          <div className="text-center text-gray-600 py-4">Loading...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center text-gray-600 py-4">No assignments yet</div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-3">
              <p className="font-medium text-gray-900 flex-1 truncate text-sm sm:text-base">{assignment.name}</p>
              <button
                onClick={() => setViewingAssignment(assignment)}
                className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                <Eye size={14} className="sm:hidden" />
                <Eye size={16} className="hidden sm:block" />
                <span className="hidden xs:inline">View Details</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal Popup for Mobile View */}
      {viewingAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Assignment Details</h2>
              <button
                onClick={() => setViewingAssignment(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">Name</p>
                <p className="text-gray-900 font-medium">{viewingAssignment.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Email</p>
                <p className="text-gray-900">{viewingAssignment.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Department</p>
                <span className={`inline-block px-3 py-1 ${getDepartmentColor(viewingAssignment.department)} text-white rounded-full text-sm font-medium mt-1`}>
                  {getDepartmentLabel(viewingAssignment.department)}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Role</p>
                <p className="text-gray-900 font-medium">{viewingAssignment.role.replace(/_/g, ' ').toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Modules</p>
                {Array.isArray(viewingAssignment.allowedModules) && viewingAssignment.allowedModules.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {viewingAssignment.allowedModules.map((m) => (
                      <span key={m} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">—</p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Assigned Date</p>
                <p className="text-gray-900">{viewingAssignment.assignedDate}</p>
              </div>
            </div>

            <div className="pt-4 flex gap-2 border-t border-gray-200">
              <button
                onClick={() => {
                  handleEditStart(viewingAssignment);
                  setViewingAssignment(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(viewingAssignment.id);
                  setViewingAssignment(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleAssignment;