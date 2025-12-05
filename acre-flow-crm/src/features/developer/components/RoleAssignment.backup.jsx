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
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          department: formData.department,
          role: formData.role,
          name: formData.email.split('@')[0], // Generate name from email
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ email: '', password: '', department: '', role: '' });
        setShowForm(false);
        setMessage('✅ User created and assigned successfully!');
        setTimeout(() => setMessage(''), 3000);
        // Refresh the list to show the new user
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

  const handleDelete = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const getDepartmentColor = (deptId) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept?.color || 'bg-gray-500';
  };

  const getDepartmentLabel = (deptId) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept?.label || deptId;
  };

  // Fetch users from backend
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (response.ok && data.success && Array.isArray(data.data)) {
        // Map backend users to assignments format
        const mappedAssignments = data.data
          .filter(user => user.role && user.department) // Only show users with role and department
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
       
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
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 transition">
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
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignment;
