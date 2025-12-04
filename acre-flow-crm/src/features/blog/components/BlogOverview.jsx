import React from 'react';
import { FileText, Eye, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';

const BlogOverview = () => {
  const stats = [
    {
      title: 'Published Posts',
      value: '24',
      change: '+3 this month',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Views',
      value: '12.5K',
      change: '+2.3K this month',
      icon: Eye,
      color: 'bg-green-500',
    },
    {
      title: 'Total Likes',
      value: '3.2K',
      change: '+450 this month',
      icon: ThumbsUp,
      color: 'bg-pink-500',
    },
    {
      title: 'Comments',
      value: '856',
      change: '+120 this month',
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
  ];

  const topPosts = [
    { title: 'Getting Started with React', views: 2500, likes: 450, comments: 120 },
    { title: 'Advanced JavaScript Tips', views: 1800, likes: 320, comments: 85 },
    { title: 'Web Design Best Practices', views: 1200, likes: 250, comments: 60 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Posts and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Posts</h3>
          <div className="space-y-4">
            {topPosts.map((post, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <h4 className="font-medium text-gray-900 mb-3">{post.title}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Views</p>
                      <p className="font-bold text-gray-900">{post.views}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp size={18} className="text-pink-600" />
                    <div>
                      <p className="text-xs text-gray-600">Likes</p>
                      <p className="font-bold text-gray-900">{post.likes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Comments</p>
                      <p className="font-bold text-gray-900">{post.comments}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Trend</h3>
          <div className="space-y-4">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{week}</span>
                  <span className="text-sm text-gray-600">{2500 + i * 300}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${60 + i * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New post published', title: 'React Hooks Guide', time: '2 hours ago' },
            { action: 'Comment received', title: 'Advanced JavaScript Tips', time: '4 hours ago' },
            { action: 'Post updated', title: 'Web Design Best Practices', time: '1 day ago' },
            { action: 'New post published', title: 'CSS Grid Tutorial', time: '2 days ago' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.title}</p>
              </div>
              <p className="text-xs text-gray-600">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogOverview;
