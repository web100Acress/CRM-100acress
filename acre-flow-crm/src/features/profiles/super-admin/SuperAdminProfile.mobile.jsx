import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';
import { useToast } from '@/hooks/use-toast';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, TrendingUp, Activity, PieChart, Calendar, Clock, BarChart3, Settings, Home, Briefcase, Menu
} from 'lucide-react';

import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import MobileLayout from '@/layout/MobileLayout';
import io from 'socket.io-client';

const SuperAdminProfileMobile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeLeads: 0,
    leadsByStatus: {},
    recentActivities: [],
    leadSources: [],
    upcomingTasks: []
  });

  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Mobile Socket.IO client connected:', s);
    s.emit('requestDashboardStats');

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('dashboardUpdate', (stats) => {
      console.log('Mobile received dashboardUpdate:', stats);
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    socket.on('userUpdate', (users) => {
      console.log('Mobile received userUpdate:', users);
      setUsers(users);
    });

    return () => {
      socket.off('dashboardUpdate');
      socket.off('userUpdate');
    };
  }, [socket]);

  // Mobile-optimized HTTP fetching
  useEffect(() => {
    const fetchMobileDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch users with mobile optimization
        const usersResponse = await fetch('https://bcrm.100acress.com/api/users?limit=20', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();
        setUsers(usersData.data || []);

        // Fetch leads with mobile optimization
        const leadsResponse = await fetch('https://bcrm.100acress.com/api/leads?limit=20', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.data || []);

        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          totalUsers: usersData.data?.length || 0,
          activeLeads: leadsData.data?.length || 0,
          systemHealth: 'Good'
        }));

      } catch (error) {
        console.error('Mobile error fetching dashboard data:', error);
      }
    };

    fetchMobileDashboardData();
  }, []);

  const superAdminData = {
    name: localStorage.getItem('userName') || 'Super Administrator',
    email: localStorage.getItem('userEmail') || 'superadmin@100acres.com',
    phone: '+91 9876543210',
    role: 'Super Admin',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'Full System Access',
      'Create Head Admins',
      'Manage All Users',
      'View All Reports',
      'System Configuration',
      'Access All Data'
    ]
  };

  const topStatuses = useMemo(() => {
    const entries = Object.entries(dashboardStats.leadsByStatus || {});
    return entries
      .map(([k, v]) => ({
        key: k,
        name: k ? (k.charAt(0).toUpperCase() + k.slice(1)) : 'Other',
        value: typeof v === 'number' ? v : Number(v) || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3); // Mobile: show only top 3
  }, [dashboardStats.leadsByStatus]);

  const topAssignees = useMemo(() => {
    const counts = new Map();
    (leads || []).forEach((l) => {
      const name =
        l?.assignedTo?.name ||
        l?.assignedToName ||
        l?.assignedUserName ||
        l?.assignedTo?.email ||
        l?.assignedToEmail ||
        'Unassigned';
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Mobile: show only top 3
  }, [leads]);

  const getInitials = (name) => {
    const s = (name || '').trim();
    if (!s) return 'U';
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* Mobile Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/users')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg rounded-lg p-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-medium">Total Users</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.totalUsers}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={12} className="text-blue-200" />
                    <span className="text-xs text-blue-200">+12%</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => navigate('/leads')}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg rounded-lg p-0 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs font-medium">Active Leads</p>
                  <p className="text-2xl font-bold mt-1">{dashboardStats.activeLeads}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={12} className="text-green-200" />
                    <span className="text-xs text-green-200">+8%</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Activity size={20} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Quick Actions
          </h3>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/leads')}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10 flex flex-col items-center">
              <Users size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Create Lead</span>
              <span className="text-xs text-blue-100 mt-1">New</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/users/manage')}
            className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10 flex flex-col items-center">
              <Settings size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Manage User</span>
              <span className="text-xs text-green-100 mt-1">Admin</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/users')}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10 flex flex-col items-center">
              <Eye size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">View User</span>
              <span className="text-xs text-orange-100 mt-1">List</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/bd-analytics')}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10 flex flex-col items-center">
              <BarChart3 size={24} className="mb-2 transform group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">BD Analytics</span>
              <span className="text-xs text-purple-100 mt-1">Reports</span>
            </div>
          </button>
        </div>
      </div>

      {/* Lead Status Chart */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <PieChart size={18} className="text-blue-600" />
              Lead Status
            </h3>
            <Badge className="bg-blue-100 text-blue-800 text-xs">Live</Badge>
          </div>
          <div className="space-y-3">
            {topStatuses.map((status, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500'];
              const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-orange-50'];
              return (
                <div key={status.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                    <span className="text-sm font-medium text-gray-700">{status.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-20 h-2 ${bgColors[index]} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full ${colors[index]} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min((status.value / Math.max(...topStatuses.map(s => s.value))) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{status.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              Top Performers
            </h3>
            <Badge className="bg-green-100 text-green-800 text-xs">This Week</Badge>
          </div>
          <div className="space-y-3">
            {topAssignees.map((assignee, index) => (
              <div key={assignee.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                    }`}>
                    {getInitials(assignee.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{assignee.name}</p>
                    <p className="text-xs text-gray-500">{assignee.count} leads</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {index === 0 && <span className="text-xs">🥇</span>}
                  {index === 1 && <span className="text-xs">🥈</span>}
                  {index === 2 && <span className="text-xs">🥉</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-purple-600" />
              Recent Activity
            </h3>
            <Badge className="bg-purple-100 text-purple-800 text-xs">Live</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Ticket size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Lead converted</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-4">
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Users Management
            </h3>
            <Badge className="bg-blue-100 text-blue-800 text-xs">{users.length} Total</Badge>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map((user, index) => (
              <div key={user._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'head-admin' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderLeadsTab = () => (
    <div className="space-y-4">
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={18} className="text-orange-600" />
              Leads Overview
            </h3>
            <Badge className="bg-orange-100 text-orange-800 text-xs">{leads.length} Total</Badge>
          </div>
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead, index) => (
              <div key={lead._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{getInitials(lead.name || lead.contactName)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name || lead.contactName}</p>
                    <p className="text-xs text-gray-500">{lead.email || lead.contactEmail}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${lead.status === 'hot' ? 'bg-red-100 text-red-800' :
                    lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'cold' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                  }`}>
                  {lead.status || 'new'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings size={18} className="text-purple-600" />
              Account Settings
            </h3>
            <Badge className="bg-purple-100 text-purple-800 text-xs">Admin</Badge>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
              <p className="font-medium text-gray-900 mb-2">Account Information</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-purple-600" />
                  <span className="text-sm text-gray-700">{superAdminData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-purple-600" />
                  <span className="text-sm text-gray-700">{superAdminData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-purple-600" />
                  <span className="text-sm text-gray-700">{superAdminData.phone}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-900 mb-3">System Permissions</p>
              <div className="space-y-2">
                {superAdminData.permissions.slice(0, 4).map((permission, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                    <Shield size={14} className="text-green-600" />
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
                {superAdminData.permissions.length > 4 && (
                  <p className="text-xs text-gray-500 p-2">+{superAdminData.permissions.length - 4} more permissions</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20 md:pb-0">
        <MobileLayout userRole="super-admin" activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'leads' && renderLeadsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </MobileLayout>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => navigate('/super-admin-dashboard')}
            className="flex flex-col items-center p-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => navigate('/leads')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Activity size={20} />
            <span className="text-xs mt-1">Leads</span>
          </button>

          <button
            onClick={() => navigate('/users')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Users size={20} />
            <span className="text-xs mt-1">Users</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Menu size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfileMobile;
