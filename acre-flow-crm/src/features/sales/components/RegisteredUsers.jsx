import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Mail, Phone, Calendar, Filter, Download } from 'lucide-react';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // API Base URL
  const API_BASE_URL = 'https://api.100acress.com';

  // Role options
  const ROLE_OPTIONS = [
    { label: "User", value: "user" },
    { label: "BlogManagement", value: "blog" },
    { label: "Admin", value: "admin" },
    { label: "Agent", value: "agent" },
    { label: "Owner", value: "owner" },
    { label: "Builder", value: "builder" },
    { label: "HR", value: "hr" },
    { label: "Sales Head", value: "sales_head" },
  ];

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('myToken') || localStorage.getItem('token');
        
        console.log('Fetching users from:', `${API_BASE_URL}/postPerson/view/allusers`);
        console.log('Token available:', !!token);
        console.log('Token value (first 10 chars):', token ? token.substring(0, 10) + '...' : 'none');
        
        // Try different approaches to handle CORS
        const fetchOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors', // Explicitly set CORS mode
        };

        console.log('Fetch options:', fetchOptions);
        
        const response = await fetch(`${API_BASE_URL}/postPerson/view/allusers`, fetchOptions);

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
          const data = await response.json();
          console.log('API Response data:', data);
          setUsers(data.data || []);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch users:', response.status, response.statusText);
          console.error('Error response:', errorText);
          // Fallback to mock data
          setUsers([
            { _id: '1', name: 'John Doe', email: 'john@example.com', mobile: '1234567890', role: 'user', emailVerified: true, createdAt: new Date().toISOString() },
            { _id: '2', name: 'Jane Smith', email: 'jane@example.com', mobile: '1234567891', role: 'admin', emailVerified: false, createdAt: new Date().toISOString() },
          ]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        // If CORS error, try without authentication first to test connectivity
        if (error.message === 'Failed to fetch') {
          console.log('Trying without authentication to test connectivity...');
          try {
            const testResponse = await fetch(`${API_BASE_URL}/postPerson/view/allusers`, {
              method: 'GET',
              mode: 'cors',
            });
            console.log('Test response (no auth):', testResponse.status);
          } catch (testError) {
            console.error('Test fetch also failed:', testError);
            console.log('This appears to be a CORS or network connectivity issue.');
          }
        }
        
        // Fallback to mock data
        setUsers([
          { _id: '1', name: 'John Doe', email: 'john@example.com', mobile: '1234567890', role: 'user', emailVerified: true, createdAt: new Date().toISOString() },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', mobile: '1234567891', role: 'admin', emailVerified: false, createdAt: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users
    .filter(user => {
      const searchMatch = !searchTerm || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.toString().includes(searchTerm);
      
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      
      return searchMatch && roleMatch;
    });

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get role badge classes
  const getRoleClasses = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'hr':
        return 'bg-green-100 text-green-700';
      case 'agent':
        return 'bg-emerald-100 text-emerald-700';
      case 'builder':
        return 'bg-yellow-100 text-yellow-700';
      case 'owner':
        return 'bg-purple-100 text-purple-700';
      case 'blog':
        return 'bg-blue-100 text-blue-700';
      case 'sales_head':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      
      await fetch(`${API_BASE_URL}/postPerson/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Mobile', 'Role', 'Email Verified', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name || '',
        user.email || '',
        user.mobile || '',
        user.role || '',
        user.emailVerified ? 'Yes' : 'No',
        formatDate(user.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
       
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          {ROLE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentRows.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-medium">
                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        {user.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        {user.mobile || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleClasses(user.role)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {ROLE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisteredUsers;
