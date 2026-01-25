import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight, Download, Filter, Menu, X, User, Home, Users, Settings, LogOut, BarChart3, TrendingUp, Shield, Building2, Briefcase, Calendar, Activity, Bell, Clock } from 'lucide-react';
import AddEditUserModalMobile from '@/layout/AddEditUserModal.mobile';
import DeleteUserModal from '@/layout/DeleteUserModal';
import MobileSidebar from '@/layout/MobileSidebar';
import MobileBottomNav from '@/layout/MobileBottomNav';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import { apiUrl, API_ENDPOINTS } from '@/config/apiConfig';
import { Popover, PopoverContent, PopoverTrigger } from '@/layout/popover';
import useProfileImage from '@/hooks/useProfileImage';

const USERS_PER_PAGE_CONSTANT = 20; // Reduced for mobile

const UserManagementMobile = ({ userRole = 'super-admin' }) => {
  const navigate = useNavigate();
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
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const profileImage = useProfileImage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0
  });

  const { toast } = useToast();

  // Fetch users and stats
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const usersData = data.data || [];
          setUsers(usersData);

          // Calculate stats
          const totalUsers = usersData.length;
          const activeUsers = usersData.filter(user => user.isActive).length;
          const inactiveUsers = usersData.filter(user => !user.isActive).length;
          const adminUsers = usersData.filter(user =>
            user.role === 'super-admin' || user.role === 'boss' || user.role === 'admin' || user.role === 'head-admin' || user.role === 'hod'
          ).length;

          setStats({
            totalUsers,
            activeUsers,
            inactiveUsers,
            adminUsers
          });
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data || []);
        setUnreadNotificationsCount(result.data?.filter(n => !n.isRead).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_READ(id), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS_READ_ALL, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadNotificationsCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Helper function to get initials
  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  // Banner images
  const bannerImages = [
    'https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/small-banners/1766217374273-max-antara-361.webp'
  ];

  const [currentBannerIndex] = useState(0);

  const renderMobileHeader = () => (
    <div className="relative">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRightMenuOpen(!rightMenuOpen)}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {rightMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">User Management</h1>

            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 hover:bg-white/30 transition-all duration-200 overflow-hidden"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-white" />
              )}
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200">
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-indigo-600 min-w-[18px] flex items-center justify-center">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl mt-2 overflow-hidden bg-white z-[100]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto bg-white">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Bell className="mx-auto mb-2 opacity-20" size={32} />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-indigo-50/30 font-semibold' : ''}`}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                          <p className="text-sm text-slate-800">{notification.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{notification.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={10} /> {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={bannerImages[currentBannerIndex]}
          alt="User Management Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Banner Text Overlay */}

      </div>

      {/* Stats Cards */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Total Users</p>
                <p className="text-white text-lg font-bold">{stats.totalUsers}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Active</p>
                <p className="text-white text-lg font-bold">{stats.activeUsers}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <UserCheck size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Inactive</p>
                <p className="text-white text-lg font-bold">{stats.inactiveUsers}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <UserX size={16} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs">Admins</p>
                <p className="text-white text-lg font-bold">{stats.adminUsers}</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 rounded-lg border border-white/30 focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-white/20 text-white border border-white/30">All Roles</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">BOSS</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Admin</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">HOD</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Team Leader</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">Developer</Badge>
            <Badge className="bg-white/20 text-white border border-white/30">BD</Badge>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        userRole={userRole}
        isOpen={rightMenuOpen}
        onClose={() => setRightMenuOpen(false)}
      />
    </div>
  );

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
      const response = await fetch(`${apiUrl}/api/users/export`, {
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
      <div className="min-h-screen bg-gray-50">
        {renderMobileHeader()}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderMobileHeader()}

      {/* Users List */}
      <div className="p-4 space-y-3 pb-20 md:pb-4">
        {paginatedUsers.map((user) => (
          <Card key={user._id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* User Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">{getInitials(user.name)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <Badge className={`text-xs mt-1 ${user.isActive
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role:</span>
                  <Badge className={`text-xs ${user.role === 'super-admin' || user.role === 'boss' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      user.role === 'head-admin' || user.role === 'hod' ? 'bg-green-100 text-green-800 border-green-200' :
                        user.role === 'team-leader' || user.role === 'tl' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          user.role === 'developer' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                    {user.role === 'super-admin' || user.role === 'boss' ? 'BOSS' :
                     user.role === 'admin' ? 'Admin' :
                      user.role === 'head-admin' || user.role === 'hod' ? 'HOD' :
                        user.role === 'team-leader' || user.role === 'tl' ? 'Team Leader' :
                          user.role === 'developer' ? 'Developer' : 'BD'}
                  </Badge>
                </div>
                {user.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{user.phone}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Department:</span>
                    <span className="text-sm font-medium">{user.department}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joined:</span>
                  <span className="text-sm font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4">
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * USERS_PER_PAGE_CONSTANT) + 1} to{' '}
              {Math.min(currentPage * USERS_PER_PAGE_CONSTANT, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {paginatedUsers.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Users size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">No users found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddEditUserModalMobile
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            window.location.reload();
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <AddEditUserModalMobile
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

      <MobileBottomNav
        userRole={localStorage.getItem('userRole')}
        activePath="/users"
        onMenuToggle={() => setRightMenuOpen(!rightMenuOpen)}
      />
    </div>
  );
};

export default UserManagementMobile;
