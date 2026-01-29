import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import AddEditUserModal from '@/layout/AddEditUserModal';
import DeleteUserModal from '@/layout/DeleteUserModal';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/layout/DashboardLayout';
import '@/styles/UserManagement.css';

const USERS_PER_PAGE_CONSTANT = 100;

const UserManagementDesktop = ({ userRole = 'super-admin' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://bcrm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data || []);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch users",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Network error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && user.isActive) ||
                           (statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE_CONSTANT);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE_CONSTANT,
    currentPage * USERS_PER_PAGE_CONSTANT
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://bcrm.100acress.com/api/users/export', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: "Users exported successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to export users",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Export failed",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole={userRole}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="super-admin">BOSS</option>
              <option value="boss">BOSS</option>
              <option value="admin">Admin</option>
              <option value="head-admin">HOD</option>
              <option value="hod">HOD</option>
              <option value="team-leader">Team Leader</option>
              <option value="tl">Team Leader</option>
              <option value="developer">Developer</option>
              <option value="employee">BD</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="text-left py-3 px-4">USER</th>
                  <th className="text-left py-3 px-4">LOGIN</th>
                  <th className="text-left py-3 px-4">ROLE</th>
                  <th className="text-left py-3 px-4">TIME</th>
                  <th className="text-left py-3 px-4">STATUS</th>
                  <th className="text-left py-3 px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      {/* Debug: Log actual role value */}
                      {console.log(`User: ${user.name}, Actual Role: "${user.role}"`)}
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                        user.role === 'super-admin' || user.role === 'boss' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        user.role === 'head-admin' || user.role === 'hod' ? 'bg-green-100 text-green-800 border border-green-200' :
                        user.role === 'team-leader' || user.role === 'tl' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        user.role === 'developer' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {user.role === 'super-admin' || user.role === 'boss' ? 'BOSS' :
                         user.role === 'admin' ? 'Admin' :
                         user.role === 'head-admin' || user.role === 'hod' ? 'HOD' :
                         user.role === 'team-leader' || user.role === 'tl' ? 'Team Leader' :
                         user.role === 'developer' ? 'Developer' : 'BD'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Profile</span>
                            <span className="text-xs font-medium text-gray-900">
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                user.isActive ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: user.isActive ? '75%' : '25%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * USERS_PER_PAGE_CONSTANT) + 1} to{' '}
                {Math.min(currentPage * USERS_PER_PAGE_CONSTANT, filteredUsers.length)} of{' '}
                {filteredUsers.length} users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {showViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <UserX size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {selectedUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedUser?.name}</h4>
                    <p className="text-gray-600">{selectedUser?.email}</p>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                      selectedUser?.role === 'super-admin' || selectedUser?.role === 'boss' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      selectedUser?.role === 'admin' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      selectedUser?.role === 'head-admin' || selectedUser?.role === 'hod' ? 'bg-green-100 text-green-800 border border-green-200' :
                      selectedUser?.role === 'team-leader' || selectedUser?.role === 'tl' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      selectedUser?.role === 'developer' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {selectedUser?.role === 'super-admin' || selectedUser?.role === 'boss' ? 'BOSS' :
                       selectedUser?.role === 'admin' ? 'Admin' :
                       selectedUser?.role === 'head-admin' || selectedUser?.role === 'hod' ? 'HOD' :
                       selectedUser?.role === 'team-leader' || selectedUser?.role === 'tl' ? 'Team Leader' :
                       selectedUser?.role === 'developer' ? 'Developer' : 'BD'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-2">CONTACT INFORMATION</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-medium">{selectedUser?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm font-medium">{selectedUser?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Department</span>
                        <span className="text-sm font-medium">{selectedUser?.department || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-2">SYSTEM INFORMATION</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">User ID</span>
                        <span className="text-sm font-medium">{selectedUser?._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Join Date</span>
                        <span className="text-sm font-medium">{selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Active</span>
                        <span className="text-sm font-medium">{selectedUser?.lastActive ? new Date(selectedUser.lastActive).toLocaleDateString() : 'Never'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`text-sm font-medium ${
                          selectedUser?.isActive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedUser?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <AddEditUserModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              // Refresh users list
              window.location.reload();
            }}
          />
        )}

        {showEditModal && (
          <AddEditUserModal
            user={selectedUser}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false);
              // Refresh users list
              window.location.reload();
            }}
          />
        )}

        {showDeleteModal && (
          <DeleteUserModal
            user={selectedUser}
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={() => {
              setShowDeleteModal(false);
              // Refresh users list
              window.location.reload();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagementDesktop;
