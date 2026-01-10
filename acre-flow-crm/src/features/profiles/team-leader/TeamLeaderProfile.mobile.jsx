import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/SuperAdminProfile.css';

import {
  User, Mail, Phone, Shield, Building2, Users, Ticket, Eye, TrendingUp, Activity, PieChart, Calendar, Clock
} from 'lucide-react';

import { Badge } from '@/layout/badge';
import { Card, CardContent } from '@/layout/card';
import MobileLayout from '@/layout/MobileLayout';
import io from 'socket.io-client';

const TeamLeaderProfileMobile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardStats, setDashboardStats] = useState({
    myTeamLeads: 0,
    teamSize: 0,
    myPendingTasks: 0,
    teamTargetAchieved: 0,
    teamMembers: [],
    recentActivities: []
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Mobile Team Leader Socket.IO client connected:', s);
    s.emit('requestTeamLeaderStats');

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('teamLeaderUpdate', (stats) => {
      console.log('Mobile Team Leader received update:', stats);
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    socket.on('teamUpdate', (members) => {
      console.log('Mobile Team Leader received team update:', members);
      setDashboardStats(prev => ({
        ...prev,
        teamMembers: members
      }));
    });

    return () => {
      socket.off('teamLeaderUpdate');
      socket.off('teamUpdate');
    };
  }, [socket]);

  // Mobile-optimized HTTP fetching
  useEffect(() => {
    const fetchMobileTeamLeaderData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch team members
        const teamResponse = await fetch('https://bcrm.100acress.com/api/my-team?limit=10', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const teamData = await teamResponse.json();
        
        // Fetch team leads
        const leadsResponse = await fetch('https://bcrm.100acress.com/api/team-leads?limit=15', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();

        setDashboardStats(prev => ({
          ...prev,
          teamMembers: teamData.data || [],
          myTeamLeads: leadsData.data?.length || 0,
          teamSize: teamData.data?.length || 0,
          teamTargetAchieved: Math.floor(Math.random() * 40) + 60 // Mock target achievement
        }));

      } catch (error) {
        console.error('Mobile Team Leader error fetching data:', error);
      }
    };

    fetchMobileTeamLeaderData();
  }, []);

  const teamLeaderData = {
    name: localStorage.getItem('userName') || 'Team Leader',
    email: localStorage.getItem('userEmail') || 'teamleader@100acres.com',
    phone: '+91 9876543212',
    role: 'Team Leader',
    company: '100acres.com',
    joinDate: '2024-02-01',
    permissions: [
      'Manage Team Members',
      'Assign Leads',
      'Track Performance',
      'Submit Reports',
      'Approve Tasks'
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
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Team Leads</p>
                <p className="text-2xl font-bold">{dashboardStats.myTeamLeads}</p>
              </div>
              <Ticket size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Team Size</p>
                <p className="text-2xl font-bold">{dashboardStats.teamSize}</p>
              </div>
              <TeamIcon size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Pending</p>
                <p className="text-2xl font-bold">{dashboardStats.myPendingTasks}</p>
              </div>
              <Target size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Target</p>
                <p className="text-2xl font-bold">{dashboardStats.teamTargetAchieved}%</p>
              </div>
              <TrendingUp size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Team Performance</h3>
          <div className="space-y-2">
            {dashboardStats.teamMembers.slice(0, 3).map((member, index) => (
              <div key={member._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{member.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold">{Math.floor(Math.random() * 40) + 60}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">My Team</h2>
      {dashboardStats.teamMembers.map((member) => (
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
                <p className="text-xs text-gray-500 mt-1">{member.leadsCount || 0} leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLeadsTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Team Leads</h2>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">Lead #{i}</p>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="text-sm text-gray-600">client{i}@example.com</p>
                <p className="text-xs text-gray-500">Assigned to Team Member {i}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">Task #{i}</p>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <p className="text-sm text-gray-600">Review team performance</p>
                <p className="text-xs text-gray-500">Due: Today</p>
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
              <p className="text-sm text-gray-600">{teamLeaderData.name}</p>
              <p className="text-sm text-gray-600">{teamLeaderData.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Permissions</p>
              <div className="mt-2 space-y-1">
                {teamLeaderData.permissions.slice(0, 3).map((permission, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Shield size={14} className="text-green-600" />
                    <span className="text-sm text-gray-600">{permission}</span>
                  </div>
                ))}
                {teamLeaderData.permissions.length > 3 && (
                  <p className="text-xs text-gray-500">+{teamLeaderData.permissions.length - 3} more permissions</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MobileLayout userRole="team-leader" activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'team' && renderTeamTab()}
      {activeTab === 'leads' && renderLeadsTab()}
      {activeTab === 'tasks' && renderTasksTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </MobileLayout>
  );
};

export default TeamLeaderProfileMobile;
