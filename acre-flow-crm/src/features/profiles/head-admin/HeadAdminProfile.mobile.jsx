import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';
import { useToast } from '@/hooks/use-toast';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, TrendingUp, Activity, PieChart, Calendar, Clock, Users as TeamIcon, Target, CheckCircle, BarChart3
} from 'lucide-react';

import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import MobileLayout from '@/layout/MobileLayout';
import io from 'socket.io-client';

const HeadAdminProfileMobile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardStats, setDashboardStats] = useState({
    managedLeads: 0,
    totalTeams: 0,
    pendingApprovals: 0,
    overallConversion: 0,
    teamMembers: [],
    recentActivities: [],
    recentLeads: [],
    assignedLeads: 0,
    unassignedLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Mobile Head Admin Socket.IO client connected:', s);
    s.emit('requestHeadAdminStats');

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('headAdminUpdate', (stats) => {
      console.log('Mobile Head Admin received update:', stats);
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    socket.on('teamMemberUpdate', (members) => {
      console.log('Mobile Head Admin received team update:', members);
      setDashboardStats(prev => ({
        ...prev,
        teamMembers: members
      }));
    });

    return () => {
      socket.off('headAdminUpdate');
      socket.off('teamMemberUpdate');
    };
  }, [socket]);

  // Mobile-optimized HTTP fetching
  useEffect(() => {
    const fetchMobileHeadAdminData = async () => {
      try {
        const token = localStorage.getItem('token');

        const usersResponse = await fetch('https://bcrm.100acress.com/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();

        const leadsResponse = await fetch('https://bcrm.100acress.com/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();

        const leads = Array.isArray(leadsData?.data) ? leadsData.data : [];
        const recentLeads = leads.slice(0, 10);
        const assignedLeads = leads.filter((l) => l?.assignedTo && l.assignedTo !== 'Unassigned').length;
        const unassignedLeads = leads.length - assignedLeads;
        const hotLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'hot').length;
        const warmLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'warm').length;
        const coldLeads = leads.filter((l) => (l?.status || '').toLowerCase() === 'cold').length;

        setDashboardStats(prev => ({
          ...prev,
          teamMembers: usersData.data || [],
          managedLeads: leads.length,
          totalTeams: usersData.data?.length || 0,
          overallConversion: prev.overallConversion,
          recentLeads,
          assignedLeads,
          unassignedLeads,
          hotLeads,
          warmLeads,
          coldLeads,
        }));

      } catch (error) {
        console.error('Mobile Head Admin error fetching data:', error);
      }
    };

    fetchMobileHeadAdminData();
  }, []);

  const headAdminData = {
    name: localStorage.getItem('userName') || 'HOD',
    email: localStorage.getItem('userEmail') || 'hod@100acres.com',
    phone: '+91 9876543211',
    role: 'HOD',
    company: '100acres.com',
    joinDate: '2024-01-15',
    permissions: [
      'Manage Team Leaders',
      'Approve Leads',
      'View Team Reports',
      'Assign Tasks',
      'Monitor Performance'
    ]
  };

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
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Managed Leads</p>
                <p className="text-2xl font-bold">{dashboardStats.managedLeads}</p>
              </div>
              <Ticket size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Team Members</p>
                <p className="text-2xl font-bold">{dashboardStats.totalTeams}</p>
              </div>
              <TeamIcon size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Assigned</p>
                <p className="text-2xl font-bold">{dashboardStats.assignedLeads}</p>
              </div>
              <Users size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Unassigned</p>
                <p className="text-2xl font-bold">{dashboardStats.unassignedLeads}</p>
              </div>
              <Activity size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-3">
            <p className="text-xs opacity-80">Hot</p>
            <p className="text-xl font-bold">{dashboardStats.hotLeads}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-3">
            <p className="text-xs opacity-80">Warm</p>
            <p className="text-xl font-bold">{dashboardStats.warmLeads}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-sky-500 to-sky-600 text-white">
          <CardContent className="p-3">
            <p className="text-xs opacity-80">Cold</p>
            <p className="text-xl font-bold">{dashboardStats.coldLeads}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Pending</p>
                <p className="text-2xl font-bold">{dashboardStats.pendingApprovals}</p>
              </div>
              <Target size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Conversion</p>
                <p className="text-2xl font-bold">{dashboardStats.overallConversion}%</p>
              </div>
              <CheckCircle size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setActiveTab('team')} className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              <Users size={18} className="mx-auto mb-1" />
              <span className="text-xs block">View Team</span>
            </button>
            <button onClick={() => setActiveTab('leads')} className="p-3 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors">
              <Ticket size={18} className="mx-auto mb-1" />
              <span className="text-xs block">New Lead</span>
            </button>
            <button onClick={() => setActiveTab('approvals')} className="p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
              <Target size={18} className="mx-auto mb-1" />
              <span className="text-xs block">Approvals</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
              <BarChart3 size={18} className="mx-auto mb-1" />
              <span className="text-xs block">Settings</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
      {dashboardStats.teamMembers.slice(0, 10).map((member) => (
        <Card key={member._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{getInitials(member.name)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">{member.role}</Badge>
                <p className="text-xs text-gray-500 mt-1">{member.status || 'Active'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLeadsTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Managed Leads</h2>
      <div className="space-y-2">
        {dashboardStats.recentLeads.map((lead) => (
          <Card key={lead._id || lead.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{lead.name || 'Lead'}</p>
                  <Badge variant="outline">{lead.status || 'New'}</Badge>
                </div>
                <p className="text-sm text-gray-600">{lead.email || lead.phone || ''}</p>
                <p className="text-xs text-gray-500">{lead.property || ''}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderApprovalsTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">Approval Request #{i}</p>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <p className="text-sm text-gray-600">Lead conversion request</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200">
                    Reject
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900">Account Information</p>
              <p className="text-sm text-gray-600">{headAdminData.name}</p>
              <p className="text-sm text-gray-600">{headAdminData.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Permissions</p>
              <div className="mt-2 space-y-1">
                {headAdminData.permissions.slice(0, 3).map((permission, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Shield size={14} className="text-purple-600" />
                    <span className="text-sm text-gray-600">{permission}</span>
                  </div>
                ))}
                {headAdminData.permissions.length > 3 && (
                  <p className="text-xs text-gray-500">+{headAdminData.permissions.length - 3} more permissions</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MobileLayout userRole="hod" activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'team' && renderTeamTab()}
      {activeTab === 'leads' && renderLeadsTab()}
      {activeTab === 'approvals' && renderApprovalsTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </MobileLayout>
  );
};

export default HeadAdminProfileMobile;
