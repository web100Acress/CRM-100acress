import React, { useState, useEffect } from 'react';
import { Users, DollarSign, FileText, Award, Plus, Trash2, RefreshCw, Edit2, Save, X } from 'lucide-react';

const RoleAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    department: '',
    role: '',
  });
  const [editFormData, setEditFormData] = useState({
    department: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      { id: 'super_admin', label: 'Super Admin' },
    ],
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
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
          name: formData.email.split('@')[0],
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ email: '', password: '', department: '', role: '' });
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
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
    setEditFormData({ department: '', role: '' });
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAddAssignment(e);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onChange={(e) => setFormData({ ...formData, department: e.target.value, role: '' })}
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
                onClick={handleFormSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating User...' : 'Assign Role'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      <>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{assignment.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{assignment.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editFormData.department}
                            onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value, role: '' })}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editFormData.role}
                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Role</option>
                            {editFormData.department &&
                              rolesByDepartment[editFormData.department]?.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.label}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{assignment.assignedDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSave(assignment.id)}
                              disabled={editLoading}
                              className="p-2 hover:bg-green-100 rounded-lg transition disabled:bg-gray-100"
                            >
                              <Save size={18} className="text-green-600" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              disabled={editLoading}
                              className="p-2 hover:bg-red-100 rounded-lg transition disabled:bg-gray-100"
                            >
                              <X size={18} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </>
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
    </div>
  );
};

export default RoleAssignment;