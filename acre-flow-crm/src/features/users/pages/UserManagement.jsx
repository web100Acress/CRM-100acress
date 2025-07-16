import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import AddEditUserModal from '@/layout/AddEditUserModal'; // Assuming this path
import DeleteUserModal from '@/layout/DeleteUserModal'; // Assuming this path
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/layout/DashboardLayout';
import '@/styles/UserManagement.css'

const USERS_PER_PAGE_CONSTANT = 4;

const UserManagementContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://crm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setUsers(data.data || []);
      } catch (err) {
        toast({
          title: "Error fetching users",
          description: "Could not load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super-admin': return 'Super Admin';
      case 'head-admin': return 'Head Admin';
      case 'team-leader': return 'Team Leader';
      case 'employee': return 'Employee';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role) => {
    return {
      'super-admin': 'user-management-badge-purple',
      'head-admin': 'user-management-badge-blue',
      'team-leader': 'user-management-badge-green',
      'employee': 'user-management-badge-gray',
    }[role] || 'user-management-badge-gray';
  };

  const getStatusBadgeColor = (status) =>
    status === 'active' ? 'user-management-badge-success' : 'user-management-badge-danger';

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / USERS_PER_PAGE_CONSTANT);
  }, [filteredUsers]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE_CONSTANT;
    const endIndex = startIndex + USERS_PER_PAGE_CONSTANT;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Department",
        "Role",
        "Status"
      ];

      const csvData = filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.department,
        user.role,
        user.status
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `users_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${filteredUsers.length} users exported to CSV successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the users.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggleStatus = (userToToggle) => async () => {
    const newStatus = userToToggle.status === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://crm.100acress.com/api/users/${userToToggle._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(users.map(user =>
          user._id === userToToggle._id ? { ...user, status: newStatus } : user
        ));
        toast({ title: "Status Updated", description: `${userToToggle.name} is now ${newStatus}` });
      } else {
        toast({
          title: "Status Update Failed",
          description: data.message || "Failed to update user status.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not connect to the server to update status.",
        variant: "destructive",
      });
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      let url = 'https://crm.100acress.com/api/users';
      let method = 'POST';

      if (selectedUser) {
        url = `${url}/${selectedUser._id}`;
        method = 'PUT';
        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        });
      } else {
        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        });
      }

      const data = await response.json();
      if (response.ok && data.success) {
        // Re-fetch all users to ensure pagination and filters are up-to-date
        const fetchResponse = await fetch('https://crm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const fetchedData = await fetchResponse.json();
        setUsers(fetchedData.data || []);

        if (selectedUser) {
          toast({ title: "User Updated", description: `${userData.name} updated successfully` });
        } else {
          toast({ title: "User Created", description: `${userData.name} added to the system` });
        }
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedUser(null);
      } else {
        toast({
          title: selectedUser ? "Update Failed" : "Creation Failed",
          description: data.message || `Failed to ${selectedUser ? 'update' : 'create'} user.`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: `Could not connect to server to ${selectedUser ? 'update' : 'create'} user.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://crm.100acress.com/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Re-fetch all users to ensure pagination and filters are up-to-date
        const fetchResponse = await fetch('https://crm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const fetchedData = await fetchResponse.json();
        setUsers(fetchedData.data || []);

        toast({ title: "User Deleted", description: `${selectedUser.name} has been removed`, variant: "destructive" });
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        toast({
          title: "Deletion Failed",
          description: data.message || "Failed to delete user.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not connect to the server to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (totalPages <= 1) {
      return null;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="user-management-pagination-controls">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="user-management-pagination-button"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {startPage > 1 && (
          <>
            <button onClick={() => setCurrentPage(1)} className="user-management-pagination-button">1</button>
            {startPage > 2 && <span className="user-management-pagination-dots">...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`user-management-pagination-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="user-management-pagination-dots">...</span>}
            <button onClick={() => setCurrentPage(totalPages)} className="user-management-pagination-button">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="user-management-pagination-button"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="user-management-main-wrapper">
        <div className="user-management-loading-spinner"></div>
        <p className="user-management-loading-text">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management-main-wrapper">
      <div className="user-management-filter-sticky">
        <div className="user-management-filter-bar">
          <div className="user-management-search-box">
            <Search className="user-management-search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="user-management-filter-select">
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="head-admin">Head Admin</option>
            <option value="team-leader">Team Leader</option>
            <option value="employee">Employee</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="user-management-filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={exportToCSV}
            disabled={isExporting || filteredUsers.length === 0}
            className="user-management-export-button"
          >
            <Download className="user-management-export-icon" />
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </button>
          
          {/* Add User Button - Uncomment if needed */}
          {/* <button className="user-management-add-button" onClick={() => { setSelectedUser(null); setShowAddModal(true); }}>
            <Plus size={18} /> Add User
          </button> */}
        </div>
      </div>

      <div className="user-management-table-container">
        <div className="user-management-table-info"></div>
        {paginatedUsers.length === 0 ? (
          <div className="user-management-no-users-message">
            <p>No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="user-management-grid">
            <div className="user-management-grid-header">
              <div>User Info</div>
              <div>Role</div>
              <div>Department</div>
              <div>Status</div>
              <div>Last Login</div>
              <div>Created At</div>
              <div>Actions</div>
            </div>
            {paginatedUsers.map(user => (
              <div key={user._id} className="user-management-grid-row">
                <div data-label="User Info">
                  <strong>{user.name || '-'}</strong>
                  <br /><small>{user.email || '-'}</small>
                  {user.phone ? <><br /><small>{user.phone}</small></> : null}
                </div>
                <div data-label="Role">
                  <span className={`user-management-badge ${getRoleBadgeColor(user.role)}`}>{getRoleDisplayName(user.role) || '-'}</span>
                </div>
                <div data-label="Department">
                  {user.department || '-'}
                </div>
                <div data-label="Status">
                  <span className={`user-management-badge ${getStatusBadgeColor(user.status)}`}>{user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}</span>
                </div>
                <div data-label="Last Login">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}
                </div>
                <div data-label="Created At">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </div>
                <div data-label="Actions" className="user-management-actions">
                  <button onClick={handleToggleStatus(user)} className={`user-management-action-button user-management-toggle-status-button ${user.status === 'active' ? 'deactivate' : ''}`} title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}>
                    {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                  </button>
                  <button onClick={() => handleEditUser(user)} className="user-management-action-button user-management-edit-button" title="Edit User">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteClick(user)} className="user-management-action-button user-management-delete-button" title="Delete User">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination />

      <AddEditUserModal
        isOpen={showAddModal || showEditModal}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); setSelectedUser(null); }}
        user={selectedUser}
        onSave={handleSaveUser}
      />
      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelectedUser(null); }}
        user={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

const UserManagement = ({ userRole = 'super-admin' }) => {
  return (
    <DashboardLayout userRole={userRole}>
      <UserManagementContent userRole={userRole} />
    </DashboardLayout>
  );
};

export default UserManagement;
