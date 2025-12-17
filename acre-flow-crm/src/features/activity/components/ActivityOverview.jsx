import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Share2, Lightbulb, Users, TrendingUp } from 'lucide-react';

const ActivityOverview = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    totalFiles: 0,
    totalContent: 0,
    totalThoughts: 0,
    activeDepartments: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [reports, files, content, thoughts, departments] = await Promise.all([
        fetch('http://localhost:5001/api/activity/reports').then(r => r.json()),
        fetch('http://localhost:5001/api/activity/files').then(r => r.json()),
        fetch('http://localhost:5001/api/activity/content').then(r => r.json()),
        fetch('http://localhost:5001/api/activity/thoughts').then(r => r.json()),
        fetch('http://localhost:5001/api/activity/departments').then(r => r.json())
      ]);

      setStats({
        totalReports: reports.data?.length || 0,
        totalFiles: files.data?.length || 0,
        totalContent: content.data?.length || 0,
        totalThoughts: thoughts.data?.length || 0,
        activeDepartments: departments.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: BarChart3,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Shared Files',
      value: stats.totalFiles,
      icon: FileText,
      color: 'bg-green-500',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Content Posts',
      value: stats.totalContent,
      icon: Share2,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Thoughts Shared',
      value: stats.totalThoughts,
      icon: Lightbulb,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50'
    },
    {
      title: 'Active Departments',
      value: stats.activeDepartments,
      icon: Users,
      color: 'bg-red-500',
      bgLight: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <Icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Welcome to Activity Hub</h3>
          <p className="text-gray-600 mb-4">
            The Activity Hub is a collaborative platform where all departments can share reports, files, content, and thoughts. Everything shared here is visible to all departments, promoting transparency and collaboration.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Submit Reports</p>
                <p className="text-sm text-gray-600">Share department reports with all teams</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Share Files</p>
                <p className="text-sm text-gray-600">Upload and organize important documents</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Post Content</p>
                <p className="text-sm text-gray-600">Share articles, news, and updates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-orange-600 font-bold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Share Thoughts</p>
                <p className="text-sm text-gray-600">Discuss ideas and get feedback</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Most Active Department</p>
                <p className="text-lg font-bold text-gray-900">IT</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Recent Activity</p>
                <p className="text-lg font-bold text-gray-900">Today</p>
              </div>
              <Share2 className="text-blue-500" size={24} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Collaboration Score</p>
                <p className="text-lg font-bold text-gray-900">85%</p>
              </div>
              <Users className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityOverview;
