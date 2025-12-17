import React, { useState, useEffect } from 'react';
import { Plus, X, Heart, MessageCircle, Filter, Lightbulb } from 'lucide-react';

const ThoughtsSection = () => {
  const [thoughts, setThoughts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [selectedThought, setSelectedThought] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    thought: '',
    category: 'Idea',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchThoughts();
  }, [filterDept]);

  const fetchThoughts = async () => {
    try {
      setLoading(true);
      const url = filterDept === 'All'
        ? 'https://bcrm.100acress.com/api/activity/thoughts'
        : `https://bcrm.100acress.com/api/activity/thoughts/department/${filterDept}`;

      const response = await fetch(url);
      const data = await response.json();
      setThoughts(data.data || []);
    } catch (error) {
      console.error('Error fetching thoughts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const department = localStorage.getItem('activityDepartment');
      const email = localStorage.getItem('activityDepartmentEmail');

      const response = await fetch('https://bcrm.100acress.com/api/activity/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          department,
          sharedBy: department,
          sharedByEmail: email
        })
      });

      if (response.ok) {
        setFormData({ title: '', thought: '', category: 'Idea', priority: 'Medium' });
        setShowModal(false);
        fetchThoughts();
      }
    } catch (error) {
      console.error('Error sharing thought:', error);
    }
  };

  const handleLike = async (thoughtId) => {
    try {
      await fetch(`https://bcrm.100acress.com/api/activity/thoughts/${thoughtId}/like`, {
        method: 'POST'
      });
      fetchThoughts();
    } catch (error) {
      console.error('Error liking thought:', error);
    }
  };

  const handleAddReply = async (thoughtId) => {
    if (!replyText.trim()) return;

    try {
      const department = localStorage.getItem('activityDepartment');
      const email = localStorage.getItem('activityDepartmentEmail');

      await fetch(`https://bcrm.100acress.com/api/activity/thoughts/${thoughtId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: department,
          authorEmail: email,
          text: replyText
        })
      });

      setReplyText('');
      setShowReplyForm(false);
      fetchThoughts();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Idea': 'bg-blue-100 text-blue-800',
      'Suggestion': 'bg-green-100 text-green-800',
      'Feedback': 'bg-purple-100 text-purple-800',
      'Discussion': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors['Medium'];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Thoughts & Ideas</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Share Thought
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option>All</option>
          <option>IT</option>
          <option>Sales</option>
          <option>Developer</option>
          <option>HR</option>
          <option>Marketing</option>
          <option>Finance</option>
          <option>Operations</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading thoughts...</p>
        </div>
      ) : thoughts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No thoughts shared yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {thoughts.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(item.priority)}`}>
                    {item.priority} Priority
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {item.department}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">By {item.sharedBy}</p>
                <p className="text-gray-700">{item.thought}</p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleLike(item._id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Heart size={18} />
                  <span className="text-sm">{item.likes}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedThought(item._id);
                    setShowReplyForm(!showReplyForm);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">{item.replies?.length || 0}</span>
                </button>
              </div>

              {item.replies && item.replies.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <p className="text-sm font-medium text-gray-700">Replies</p>
                  {item.replies.map((reply, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-900">{reply.author}</p>
                      <p className="text-sm text-gray-700 mt-1">{reply.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {showReplyForm && selectedThought === item._id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Add your reply..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                    <button
                      onClick={() => handleAddReply(item._id)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Share a Thought</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Idea</option>
                    <option>Suggestion</option>
                    <option>Feedback</option>
                    <option>Discussion</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Thought</label>
                <textarea
                  value={formData.thought}
                  onChange={(e) => setFormData({ ...formData, thought: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Share Thought
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThoughtsSection;
