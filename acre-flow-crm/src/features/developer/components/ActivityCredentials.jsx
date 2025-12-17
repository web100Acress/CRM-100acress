import React, { useState, useEffect } from 'react';
import { Plus, X, Eye, EyeOff, Copy, Check, Trash2, Mail, Edit } from 'lucide-react';

const ActivityCredentials = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [editingCred, setEditingCred] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    email: '',
    password: '',
    userName: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    description: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://bcrm.100acress.com/api/activity/departments');
      const data = await response.json();
      setDepartments(data.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://bcrm.100acress.com/api/activity/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ name: '', email: '', password: '', description: '', color: '#3B82F6' });
        setShowModal(false);
        fetchDepartments();
        alert('Department created successfully! Credentials sent to email.');
      } else {
        alert(data.message || 'Error creating department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Error creating department');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleUpdateCredential = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://bcrm.100acress.com/api/activity/departments/${editingCred.departmentId}/credentials/${editingCred._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: editFormData.email,
          password: editFormData.password,
          userName: editFormData.userName
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setEditModal(false);
        setEditingCred(null);
        fetchDepartments();
        alert('Credential updated successfully! Email sent to user.');
      } else {
        alert(data.message || 'Error updating credential');
      }
    } catch (error) {
      console.error('Error updating credential:', error);
      alert('Error updating credential');
    }
  };

  const departmentOptions = ['IT', 'Sales', 'Developer', 'HR', 'Marketing', 'Finance', 'Operations'];
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Departments</h2>
          <p className="text-gray-600 mt-1">Create and manage department credentials for the Activity Hub</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Department
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No departments created yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create First Department
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {departments.map((dept) => (
            <div key={dept._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    ></div>
                    <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Department Credentials</div>
                {dept.credentials && dept.credentials.length > 0 ? (
                  dept.credentials.map((cred) => (
                    <div key={cred._id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm font-mono text-gray-900">{cred.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(cred.email, `email-${cred._id}`)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                          >
                            {copied === `email-${cred._id}` ? (
                              <Check size={18} className="text-green-600" />
                            ) : (
                              <Copy size={18} className="text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const credWithDept = {...cred, departmentId: dept._id};
                              setEditingCred(credWithDept);
                              setEditFormData({
                                email: cred.email,
                                password: cred.password,
                                userName: cred.userName
                              });
                              setEditModal(true);
                            }}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Edit size={18} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600">Password</p>
                          <p className="text-sm font-mono text-gray-900">
                            {showPassword[cred._id] ? cred.password : '•••••••'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowPassword({
                              ...showPassword,
                              [cred._id]: !showPassword[cred._id]
                            })}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                          >
                            {showPassword[cred._id] ? (
                              <EyeOff size={18} className="text-gray-600" />
                            ) : (
                              <Eye size={18} className="text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(cred.password, `pass-${cred._id}`)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                          >
                            {copied === `pass-${cred._id}` ? (
                              <Check size={18} className="text-green-600" />
                            ) : (
                              <Copy size={18} className="text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Username: {cred.userName || cred.email.split('@')[0]}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No credentials created for this department
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <a
                  href="/activity-login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Mail size={16} />
                  Test Login
                </a>
                <button className="p-2 hover:bg-red-100 rounded transition-colors">
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Created: {new Date(dept.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Create Activity Department</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                <select
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="department@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter or generate password"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Department description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Department
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Credential</h3>
              <button
                onClick={() => setEditModal(false)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={editFormData.userName}
                  onChange={(e) => setEditFormData({ ...editFormData, userName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateCredential}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update Credential
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCredentials;