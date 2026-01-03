import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import AddEditUserModal from '@/layout/AddEditUserModal';
import DeleteUserModal from '@/layout/DeleteUserModal';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/layout/DashboardLayout';
import '@/styles/UserManagement.css';

const USERS_PER_PAGE_CONSTANT = 20; // Reduced for mobile

const UserManagementMobile = ({ userRole = 'super-admin' }) => {
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
  const [showFilters, setShowFilters] = useState(false);

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
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          {/* Search and Filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {isExporting ? '...' : 'Export'}
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t pt-3 mb-4 space-y-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Roles</option>
                <option value="super-admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="head-admin">Head Admin</option>
                <option value="team-leader">Team Leader</option>
                <option value="employee">Employee</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            {paginatedUsers.map((user) => (
              <div key={user._id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{user.role}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowViewModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-xs text-gray-600">
                {((currentPage - 1) * USERS_PER_PAGE_CONSTANT) + 1}-{Math.min(currentPage * USERS_PER_PAGE_CONSTANT, filteredUsers.length)} of {filteredUsers.length}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="px-2 py-1 text-xs">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-xs"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddEditUserModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              window.location.reload();
            }}
          />
        )}

        {showEditModal && selectedUser && (
          <AddEditUserModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false);
              window.location.reload();
            }}
            user={selectedUser}
          />
        )}

        {showDeleteModal && selectedUser && (
          <DeleteUserModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={() => {
              setShowDeleteModal(false);
              window.location.reload();
            }}
            user={selectedUser}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagementMobile;
