import React, { useState, useEffect } from 'react';
import { Plus, X, Download, Trash2, Filter, File } from 'lucide-react';

const FilesSection = () => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [formData, setFormData] = useState({
    fileName: '',
    fileUrl: '',
    fileType: '',
    description: '',
    category: 'Document',
    tags: ''
  });

  useEffect(() => {
    fetchFiles();
  }, [filterDept]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const url = filterDept === 'All'
        ? 'https://bcrm.100acress.com/api/activity/files'
        : `https://bcrm.100acress.com/api/activity/files/department/${filterDept}`;

      const response = await fetch(url);
      const data = await response.json();
      setFiles(data.data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const department = localStorage.getItem('activityDepartment');
      const email = localStorage.getItem('activityDepartmentEmail');

      const response = await fetch('https://bcrm.100acress.com/api/activity/files', {
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
        setFormData({ fileName: '', fileUrl: '', fileType: '', description: '', category: 'Document', tags: '' });
        setShowModal(false);
        fetchFiles();
      }
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Document': 'bg-blue-100 text-blue-800',
      'Image': 'bg-purple-100 text-purple-800',
      'Video': 'bg-red-100 text-red-800',
      'Spreadsheet': 'bg-green-100 text-green-800',
      'Presentation': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Shared Files</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Share File
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
          <p className="text-gray-600">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <File size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No files shared yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2 truncate">{file.fileName}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(file.category)}`}>
                      {file.category}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {file.department}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{file.description}</p>
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {file.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">By {file.sharedBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t">
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded hover:bg-green-200 transition-colors">
                  <Download size={16} />
                  Download
                </button>
                <button className="p-2 hover:bg-red-100 rounded transition-colors">
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Share File</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Name</label>
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                <input
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Document</option>
                    <option>Image</option>
                    <option>Video</option>
                    <option>Spreadsheet</option>
                    <option>Presentation</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <input
                    type="text"
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    placeholder="e.g., PDF, DOCX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., important, urgent, review"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Share File
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

export default FilesSection;
