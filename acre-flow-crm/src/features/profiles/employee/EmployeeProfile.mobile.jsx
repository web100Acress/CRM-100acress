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

const EmployeeProfileMobile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardStats, setDashboardStats] = useState({
    myLeads: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todayFollowUps: 0,
    recentActivities: [],
    upcomingTasks: []
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io('https://bcrm.100acress.com');
    setSocket(s);
    console.log('Mobile Employee Socket.IO client connected:', s);
    s.emit('requestEmployeeStats');

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('employeeUpdate', (stats) => {
      console.log('Mobile Employee received update:', stats);
      setDashboardStats(prev => ({
        ...prev,
        ...stats
      }));
    });

    socket.on('taskUpdate', (tasks) => {
      console.log('Mobile Employee received task update:', tasks);
      setDashboardStats(prev => ({
        ...prev,
        upcomingTasks: tasks
      }));
    });

    return () => {
      socket.off('employeeUpdate');
      socket.off('taskUpdate');
    };
  }, [socket]);

  // Mobile-optimized HTTP fetching
  useEffect(() => {
    const fetchMobileEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch employee leads
        const leadsResponse = await fetch('https://bcrm.100acress.com/api/my-leads?limit=20', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const leadsData = await leadsResponse.json();
        
        // Fetch employee tasks
        const tasksResponse = await fetch('https://bcrm.100acress.com/api/my-tasks?limit=15', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const tasksData = await tasksResponse.json();

        setDashboardStats(prev => ({
          ...prev,
          myLeads: leadsData.data?.length || 0,
          upcomingTasks: tasksData.data || [],
          completedTasks: Math.floor(Math.random() * 10) + 5,
          pendingTasks: tasksData.data?.length || 0,
          todayFollowUps: Math.floor(Math.random() * 5) + 1
        }));

      } catch (error) {
        console.error('Mobile Employee error fetching data:', error);
      }
    };

    fetchMobileEmployeeData();
  }, []);

  const employeeData = {
    name: localStorage.getItem('userName') || 'Employee',
    email: localStorage.getItem('userEmail') || 'employee@100acres.com',
    phone: '+91 9876543213',
    role: 'Employee',
    company: '100acres.com',
    joinDate: '2024-03-01',
    permissions: [
      'View Assigned Leads',
      'Update Lead Status',
      'Submit Reports',
      'Manage Tasks',
      'View Dashboard'
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
        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">My Leads</p>
                <p className="text-2xl font-bold">{dashboardStats.myLeads}</p>
              </div>
              <Ticket size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Completed</p>
                <p className="text-2xl font-bold">{dashboardStats.completedTasks}</p>
              </div>
              <CheckCircle size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Pending</p>
                <p className="text-2xl font-bold">{dashboardStats.pendingTasks}</p>
              </div>
              <Target size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Today</p>
                <p className="text-2xl font-bold">{dashboardStats.todayFollowUps}</p>
              </div>
              <Calendar size={24} className="opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Today's Schedule</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <Clock size={16} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Follow-up with Client {i}</p>
                  <p className="text-xs text-gray-500">{10 + i}:00 AM</p>
                </div>
                <Badge variant="outline" className="text-xs">Scheduled</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLeadsTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">My Leads</h2>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">Lead #{i}</p>
                  <Badge variant="outline">New</Badge>
                </div>
                <p className="text-sm text-gray-600">client{i}@example.com</p>
                <p className="text-xs text-gray-500">Assigned on {new Date().toLocaleDateString()}</p>
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
        {dashboardStats.upcomingTasks.slice(0, 5).map((task, i) => (
          <Card key={task._id || i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{task.title || `Task ${i + 1}`}</p>
                  <Badge variant="outline">{task.status || 'Pending'}</Badge>
                </div>
                <p className="text-sm text-gray-600">{task.description || 'Complete assigned tasks'}</p>
                <p className="text-xs text-gray-500">Due: {task.dueDate || 'Today'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFollowUpsTab = () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Follow-ups</h2>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">Follow-up #{i}</p>
                  <Badge variant="outline">Today</Badge>
                </div>
                <p className="text-sm text-gray-600">Call client{i}@example.com</p>
                <p className="text-xs text-gray-500">Last contacted: {i} days ago</p>
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
              <p className="text-sm text-gray-600">{employeeData.name}</p>
              <p className="text-sm text-gray-600">{employeeData.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Permissions</p>
              <div className="mt-2 space-y-1">
                {employeeData.permissions.slice(0, 3).map((permission, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Shield size={14} className="text-indigo-600" />
                    <span className="text-sm text-gray-600">{permission}</span>
                  </div>
                ))}
                {employeeData.permissions.length > 3 && (
                  <p className="text-xs text-gray-500">+{employeeData.permissions.length - 3} more permissions</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MobileLayout userRole="employee" activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'leads' && renderLeadsTab()}
      {activeTab === 'tasks' && renderTasksTab()}
      {activeTab === 'followups' && renderFollowUpsTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </MobileLayout>
  );
};

export default EmployeeProfileMobile;
