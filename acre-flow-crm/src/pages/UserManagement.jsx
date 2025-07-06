import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import AddEditUserModal from '../components/AddEditUserModal'; // Assuming this path
import DeleteUserModal from '../components/DeleteUserModal'; // Assuming this path
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../components/DashboardLayout';

const USERS_PER_PAGE = 10;

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

  const filteredAndPaginatedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });

    if (currentPage > Math.ceil(filtered.length / USERS_PER_PAGE) && filtered.length > 0) {
      setCurrentPage(1);
    } else if (filtered.length === 0) {
      setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [users, searchTerm, roleFilter, statusFilter, currentPage]);

  const totalPages = useMemo(() => {
    const totalFiltered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    }).length;
    return Math.ceil(totalFiltered / USERS_PER_PAGE);
  }, [users, searchTerm, roleFilter, statusFilter]);


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
        setUsers(users.filter(user => user._id !== selectedUser._id));
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

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
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

        {startPage > 1 && (
          <>
            <button onClick={() => setCurrentPage(1)} className="pagination-btn">1</button>
            {startPage > 2 && <span className="pagination-dots">...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}

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
          {/* <button className="add-user-btn" onClick={() => { setSelectedUser(null); setShowAddModal(true); }}>
            <Plus size={18} /> Add User
          </button> */}
        </div>
      </div>

      <div className="user-table-container">
        <div className="table-header-info">
          {/* <h2>All Users <span className="user-count">({users.length})</span></h2> */}
          {/* <span className="active-count">{users.filter(u => u.status === 'active').length} Active Users</span> */}
        </div>

        {filteredAndPaginatedUsers.length === 0 ? (
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

            {filteredAndPaginatedUsers.map(user => (
              <div key={user._id} className="user-grid-row">
                <div data-label="User Info">
                  <strong>{user.name}</strong>
                  <br /><small>{user.email}</small>
                  {user.phone && <><br /><small>{user.phone}</small></>}
                </div>
                <div data-label="Role">
                  <span className={getRoleBadgeColor(user.role)}>{getRoleDisplayName(user.role)}</span>
                </div>
                <div data-label="Department">
                  {user.department || <span className="text-gray-400">N/A</span>}
                </div>
                <div data-label="Status">
                  <span className={getStatusBadgeColor(user.status)}>{user.status}</span>
                </div>
                <div data-label="Last Login">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : <span className="text-gray-400">-</span>}
                </div>
                <div data-label="Created At">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : <span className="text-gray-400">-</span>}
                </div>
                <div data-label="Actions" className="user-actions">
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

      {totalPages > 1 && <Pagination />}

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

      <style>{`
        /* Google Fonts - Poppins */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .user-mgmt-wrapper {
          font-family: 'Poppins', sans-serif;
          background-color: #f8fafc;
          min-height: calc(100vh - 60px);
        }

        /* --- Filter Bar & Search --- */
        .filter-bar-sticky-container {
            position: sticky;
            top: 0;
            z-index: 100;
            background-color: #f8fafc;
            // padding: 1.5rem 0 1rem 0;
            // margin-bottom: 2rem;
            // box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            border-bottom: 1px solid #e2e8f0;
        }

        .filter-bar {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          flex-wrap: wrap;
          background-color: #ffffff;
          padding: 1.25rem 2rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .search-box {
          display: flex;
          align-items: center;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fff;
          flex-grow: 1;
          max-width: 400px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-box:focus-within {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .search-box input {
          border: none;
          outline: none;
          margin-left: 0.75rem;
          font-size: 1rem;
          color: #334155;
          width: 100%;
        }
        .search-box input::placeholder {
            color: #94a3b8;
        }
        .filter-bar .icon {
          width: 1.125rem;
          height: 1.125rem;
          color: #64748b;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          background-color: #fff;
          font-size: 0.95rem;
          color: #334155;
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="%236B7280" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill-rule="evenodd"></path></svg>');
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1em;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .filter-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .add-user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .add-user-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .add-user-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }


        /* --- Table Container & Header --- */
        .user-table-container {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .table-header-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: .25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          background-color: #fcfcfc;
        }
        .table-header-info h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .table-header-info .user-count {
            font-weight: 500;
            color: #64748b;
            font-size: 1rem;
            margin-left: 0.5rem;
        }
        .table-header-info .active-count {
          font-size: 0.9rem;
          color: #22c55e;
          font-weight: 500;
          background-color: #ecfdf5;
          padding: 0.4rem 0.75rem;
          border-radius: 999px;
        }

        /* --- User Grid (Table replacement) --- */
        .user-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(100px, 1fr));
          gap: 1px;
          background-color: #e2e8f0;
          padding: 0 1px 1px 0;
        }

        .user-grid-header, .user-grid-row {
          display: contents;
        }

        .user-grid-header > div, .user-grid-row > div {
          background-color: white;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          border-right: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .user-grid-header > div:last-child, .user-grid-row > div:last-child {
            border-right: none;
        }
        .user-grid-row:last-of-type > div {
            border-bottom: none;
        }


        .user-grid-header > div {
          background-color: #f1f5f9;
          font-weight: 600;
          color: #475569;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .user-grid-row {
          font-size: 0.95rem;
          color: #334155;
          transition: background-color 0.2s ease;
        }
        .user-grid-row:hover {
          background-color: #f8fafc;
        }

        .user-grid-row strong {
          font-weight: 600;
          color: #1e293b;
        }
        .user-grid-row small {
          font-size: 0.8rem;
          color: #64748b;
        }

        .user-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .action-btn {
          background: none;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          padding: 0.4rem;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          background-color: #e2e8f0;
          color: #3b82f6;
          border-color: #93c5fd;
          transform: translateY(-1px);
        }
        .action-btn:active {
            transform: translateY(0);
        }
        .action-btn svg {
            width: 18px;
            height: 18px;
        }
        .toggle-status-btn:hover {
            color: #ef4444;
        }

        /* --- Badges --- */
        .badge {
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-transform: capitalize;
        }
        .badge-purple { background-color: #ede9fe; color: #6d28d9; }
        .badge-blue { background-color: #e0f2fe; color: #0284c7; }
        .badge-green { background-color: #dcfce7; color: #15803d; }
        .badge-gray { background-color: #f3f4f6; color: #4b5563; }
        .badge-success { background-color: #d1fae5; color: #059669; }
        .badge-danger { background-color: #fee2e2; color: #dc2626; }

        /* --- Pagination --- */
        .pagination-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            margin-top: 2rem;
            padding: 1rem;
            background-color: #fff;
            border-radius: 0.75rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }
        .pagination-btn {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.6rem 1rem;
            border: 1px solid #cbd5e1;
            border-radius: 0.5rem;
            background-color: #fff;
            color: #475569;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .pagination-btn:hover:not(:disabled) {
            background-color: #eff6ff;
            border-color: #93c5fd;
            color: #2563eb;
        }
        .pagination-btn.active {
            background-color: #2563eb;
            color: white;
            border-color: #2563eb;
        }
        .pagination-btn:disabled {
            background-color: #e2e8f0;
            color: #94a3b8;
            cursor: not-allowed;
            border-color: #e2e8f0;
        }
        .pagination-dots {
            color: #64748b;
            font-size: 1.2rem;
            font-weight: 600;
            padding: 0 0.25rem;
        }

        /* --- Loading States --- */
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 50px auto 10px auto;
        }
        .loading-text {
            text-align: center;
            color: #64748b;
            font-size: 1rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* --- No Users Message --- */
        .no-users-message {
            text-align: center;
            padding: 4rem 2rem;
            background-color: #fff;
            border-radius: 0.75rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            color: #64748b;
            font-size: 1.1rem;
            margin-top: 1.5rem;
            border: 1px solid #e2e8f0;
        }

        /* --- Modal Overlay (New CSS) --- */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6); /* Darker semi-transparent black */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000; /* Ensure it's above everything else */
          backdrop-filter: blur(4px); /* Optional: Adds a subtle blur to content behind */
        }

        .modal-content {
          background-color: white;
          padding: 2rem; /* Increased padding */
          border-radius: 0.75rem; /* More rounded corners */
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); /* More prominent shadow */
          width: 90%; /* Max width for responsiveness */
          max-width: 500px; /* Max width for desktop */
          z-index: 1001; /* Above the overlay */
          position: relative; /* For proper z-index stacking */
          display: flex;
          flex-direction: column;
          gap: 1.5rem; /* Space between modal elements */
        }

        .modal-content h2 {
            font-size: 1.75rem; /* Larger modal title */
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 1rem;
            text-align: center; /* Center the title */
        }

        .modal-close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            color: #64748b;
            font-size: 1.5rem;
            line-height: 1;
            transition: color 0.2s ease;
        }

        .modal-close-btn:hover {
            color: #ef4444; /* Red on hover */
        }


        /* --- Responsive Adjustments --- */
        @media (max-width: 1024px) {
            .user-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            .user-grid-header {
                display: none;
            }
            .user-grid-row {
                display: flex;
                flex-direction: column;
                border: 1px solid #e2e8f0;
                border-radius: 0.75rem;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                background-color: white;
            }
            .user-grid-row > div {
                border-bottom: 1px solid #f1f5f9;
                padding: 1rem 1.25rem;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            .user-grid-row > div:last-child {
                border-bottom: none;
            }
            .user-grid-row > div::before {
                content: attr(data-label);
                font-weight: 600;
                color: #475569;
                font-size: 0.8rem;
                margin-bottom: 0.3rem;
            }
            .user-actions {
                flex-direction: row;
                justify-content: flex-start;
                padding-top: 1rem;
            }
            .filter-bar {
                flex-direction: column;
                align-items: stretch;
                padding: 1rem 1.25rem;
                gap: 0.75rem;
            }
            .search-box, .filter-select, .add-user-btn {
                max-width: none;
                width: 100%;
            }
            .modal-content {
                width: 95%; /* Wider on smaller screens */
                padding: 1.5rem;
            }
        }

        @media (max-width: 768px) {
            .user-mgmt-wrapper {
                padding: 1.5rem;
            }
            .table-header-info {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            .table-header-info h2 {
                font-size: 1.3rem;
            }
            .pagination-btn {
                padding: 0.5rem 0.8rem;
                font-size: 0.8rem;
            }
            .pagination-controls {
                flex-wrap: wrap;
                justify-content: center;
            }
            .pagination-btn svg {
                width: 14px;
                height: 14px;
            }
        }
        @media (max-width: 480px) {
            .user-mgmt-wrapper {
                padding: 1rem;
            }
            .filter-bar-sticky-container {
                padding: 1rem 0;
            }
            .filter-bar {
                gap: 0.6rem;
                padding: 0.8rem 1rem;
            }
            .search-box, .filter-select, .add-user-btn {
                padding: 0.6rem 0.75rem;
                font-size: 0.85rem;
            }
            .search-box input {
                font-size: 0.9rem;
            }
            .table-header-info {
                padding: 1rem;
            }
            .user-grid-row > div {
                padding: 0.8rem 1rem;
            }
            .user-grid-row strong {
                font-size: 0.9rem;
            }
            .user-grid-row small {
                font-size: 0.75rem;
            }
            .action-btn {
                padding: 0.3rem;
            }
            .action-btn svg {
                width: 16px;
                height: 16px;
            }
            .badge {
                font-size: 0.65rem;
                padding: 0.2rem 0.5rem;
            }
             .modal-content h2 {
                font-size: 1.5rem;
            }
        }
      `}</style>
    </div>
  );
};

const UserManagement = () => {
  return (
    <DashboardLayout>
      <UserManagementContent />
    </DashboardLayout>
  );
};

export default UserManagement;