import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import AddEditUserModal from '../components/sales/AddEditUserModal'; // Assuming this path
import DeleteUserModal from '../components/sales/DeleteUserModal'; // Assuming this path
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../components/sales/DashboardLayout';
import '../style/UserManagement.css'

const USERS_PER_PAGE_CONSTANT = 4; // Changed variable name to avoid conflict, keeping your desired 4

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
  // Removed the duplicate USERS_PER_PAGE = 10; here

  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/users', {
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
      'super-admin': 'badge badge-purple',
      'head-admin': 'badge badge-blue',
      'team-leader': 'badge badge-green',
      'employee': 'badge badge-gray',
    }[role] || 'badge badge-gray';
  };

  const getStatusBadgeColor = (status) =>
    status === 'active' ? 'badge badge-success' : 'badge badge-danger';

  // Moved these useMemo hooks out of the Pagination component
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

  // Adjust currentPage if the number of filtered items changes or current page becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages); // Go to last valid page
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1); // Reset to first page if no results
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
      const response = await fetch(`http://localhost:5001/api/users/${userToToggle._id}/status`, {
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
      let url = 'http://localhost:5001/api/users';
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
        const fetchResponse = await fetch('http://localhost:5001/api/users', {
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
      const response = await fetch(`http://localhost:5001/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Re-fetch all users to ensure pagination and filters are up-to-date
        const fetchResponse = await fetch('http://localhost:5001/api/users', {
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

  // Moved Pagination component outside and at the top level
  const Pagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // How many page number buttons to show directly

    // Determine start and end page numbers for display
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage is limited by totalPages
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Only render pagination if there's more than one page
    if (totalPages <= 1) {
      return null;
    }


    return (
      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {/* Render "1" and "..." if necessary */}
        {startPage > 1 && (
          <>
            <button onClick={() => setCurrentPage(1)} className="pagination-btn">1</button>
            {startPage > 2 && <span className="pagination-dots">...</span>}
          </>
        )}

        {/* Render the core page numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}

        {/* Render "..." and last page if necessary */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-dots">...</span>}
            <button onClick={() => setCurrentPage(totalPages)} className="pagination-btn">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="user-mgmt-wrapper">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-mgmt-wrapper">
      <div className="filter-bar-sticky-container">
        <div className="filter-bar">
          <div className="search-box">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-select">
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="head-admin">Head Admin</option>
            <option value="team-leader">Team Leader</option>
            <option value="employee">Employee</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

 <button
            onClick={exportToCSV}
            disabled={isExporting || filteredUsers.length === 0}
            className="export-btn"
          >
            <Download className="export-icon" />
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </button>
          
          {/* <button className="add-user-btn" onClick={() => { setSelectedUser(null); setShowAddModal(true); }}>
            <Plus size={18} /> Add User
          </button> */}
        </div>
      </div>

      <div className="user-table-container">
        <div className="table-header-info"></div>
        {paginatedUsers.length === 0 ? (
          <div className="no-users-message">
            <p>No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="user-grid">
            <div className="user-grid-header">
              <div>User Info</div>
              <div>Role</div>
              <div>Department</div>
              <div>Status</div>
              <div>Last Login</div>
              <div>Created At</div>
              <div>Actions</div>
            </div>
            {paginatedUsers.map(user => (
              <div key={user._id} className="user-grid-row">
                <div data-label="User Info">
                  <strong>{user.name || '-'}</strong>
                  <br /><small>{user.email || '-'}</small>
                  {user.phone ? <><br /><small>{user.phone}</small></> : null}
                </div>
                <div data-label="Role">
                  <span className={getRoleBadgeColor(user.role)}>{getRoleDisplayName(user.role) || '-'}</span>
                </div>
                <div data-label="Department">
                  {user.department || '-'}
                </div>
                <div data-label="Status">
                  <span className={getStatusBadgeColor(user.status)}>{user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}</span>
                </div>
                <div data-label="Last Login">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}
                </div>
                <div data-label="Created At">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </div>
                <div data-label="Actions" className="user-actions" style={{textAlign: 'right'}}>
                  <button onClick={handleToggleStatus(user)} className="action-btn toggle-status-btn" title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}>
                    {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                  </button>
                  <button onClick={() => handleEditUser(user)} className="action-btn edit-btn" title="Edit User">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteClick(user)} className="action-btn delete-btn" title="Delete User">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Pagination component here */}
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