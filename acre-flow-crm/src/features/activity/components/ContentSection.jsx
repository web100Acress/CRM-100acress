import React, { useState, useEffect } from 'react';
import { Plus, X, Heart, MessageCircle, Filter, Share2 } from 'lucide-react';

const ContentSection = () => {
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentType: 'Article',
    tags: ''
  });

  useEffect(() => {
    fetchContent();
  }, [filterDept]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const url = filterDept === 'All'
        ? 'https://bcrm.100acress.com/api/activity/content'
        : `https://bcrm.100acress.com/api/activity/content/department/${filterDept}`;

      const response = await fetch(url);
      const data = await response.json();
      setContents(data.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const department = localStorage.getItem('activityDepartment');
      const email = localStorage.getItem('activityDepartmentEmail');

      const response = await fetch('https://bcrm.100acress.com/api/activity/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()),
          department,
          sharedBy: department,
          sharedByEmail: email
        })
      });

      if (response.ok) {
        setFormData({ title: '', content: '', contentType: 'Article', tags: '' });
        setShowModal(false);
        fetchContent();
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const handleLike = async (contentId) => {
    try {
      await fetch(`https://bcrm.100acress.com/api/activity/content/${contentId}/like`, {
        method: 'POST'
      });
      fetchContent();
    } catch (error) {
      console.error('Error liking content:', error);
    }
  };

  const handleAddComment = async (contentId) => {
    if (!commentText.trim()) return;

    try {
      const department = localStorage.getItem('activityDepartment');
      const email = localStorage.getItem('activityDepartmentEmail');

      await fetch(`https://bcrm.100acress.com/api/activity/content/${contentId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: department,
          authorEmail: email,
          text: commentText
        })
      });

      setCommentText('');
      setShowCommentForm(false);
      fetchContent();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getContentTypeColor = (type) => {
    const colors = {
      'Article': 'bg-blue-100 text-blue-800',
      'News': 'bg-red-100 text-red-800',
      'Update': 'bg-green-100 text-green-800',
      'Announcement': 'bg-purple-100 text-purple-800',
      'Tutorial': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors['Other'];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          Post Content
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <p className="text-gray-600">Loading content...</p>
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Share2 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No content shared yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contents.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getContentTypeColor(item.contentType)}`}>
                    {item.contentType}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {item.department}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">By {item.sharedBy}</p>
                <p className="text-gray-700 mb-3">{item.content}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
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
                    setSelectedContent(item._id);
                    setShowCommentForm(!showCommentForm);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">{item.comments?.length || 0}</span>
                </button>
              </div>

              {item.comments && item.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <p className="text-sm font-medium text-gray-700">Comments</p>
                  {item.comments.map((comment, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {showCommentForm && selectedContent === item._id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    <button
                      onClick={() => handleAddComment(item._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Post
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
              <h3 className="text-xl font-bold text-gray-900">Post Content</h3>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Article</option>
                  <option>News</option>
                  <option>Update</option>
                  <option>Announcement</option>
                  <option>Tutorial</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., technology, update, important"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Post Content
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

export default ContentSection;
