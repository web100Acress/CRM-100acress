import React, { useState, useEffect } from 'react';
import { Plus, X, Eye, Download, Filter, Upload } from 'lucide-react';

const ReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [loggedInDept, setLoggedInDept] = useState('');
  const allDepartments = ['IT', 'Sales', 'Developer', 'HR', 'Marketing', 'Finance', 'Operations'];
  const visibleDepartments = loggedInDept ? [loggedInDept] : ['All', ...allDepartments];
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    reportType: 'Custom',
    submitterName: '',
    files: [],
    images: []
  });

  useEffect(() => {
    const department = localStorage.getItem('activityDepartment');
    if (department) {
      setLoggedInDept(department);
      setFilterDept(department);
    }
    fetchReports();
  }, []);

  const setDeptFilter = (dept) => {
    if (loggedInDept) {
      setFilterDept(loggedInDept);
      return;
    }
    setFilterDept(dept);
  };

  useEffect(() => {
    fetchReports();
  }, [filterDept]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = filterDept === 'All' 
        ? 'http://localhost:5001/api/activity/reports'
        : `http://localhost:5001/api/activity/reports/department/${filterDept}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setReports(data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'files') {
      setFormData({ ...formData, files: [...formData.files, ...files] });
    } else if (type === 'images') {
      setFormData({ ...formData, images: [...formData.images, ...files] });
    }
  };

  const removeFile = (index, type) => {
    if (type === 'files') {
      setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) });
    } else if (type === 'images') {
      setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const department = localStorage.getItem('activityDepartment');
      const email = localStorage.getItem('activityDepartmentEmail');

      const response = await fetch('http://localhost:5001/api/activity/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          reportType: formData.reportType,
          submitterName: formData.submitterName,
          attachments: [...formData.files.map(f => f.name), ...formData.images.map(f => f.name)],
          department,
          submittedBy: formData.submitterName || department,
          submittedByEmail: email
        })
      });

      if (response.ok) {
        setFormData({ 
          title: '', 
          description: '', 
          content: '', 
          reportType: 'Custom',
          submitterName: '',
          files: [],
          images: []
        });
        setShowModal(false);
        fetchReports();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Submit Report
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={filterDept}
          onChange={(e) => setDeptFilter(e.target.value)}
          disabled={Boolean(loggedInDept)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {visibleDepartments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No reports found</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <aside className="hidden md:block col-span-4 lg:col-span-3">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">Departments</p>
                <p className="text-xs text-gray-600 mt-0.5">Select to filter chat</p>
              </div>
              <div className="p-2">
                {visibleDepartments
                  .filter((d) => d !== 'All')
                  .map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDeptFilter(d)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filterDept === d
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{d}</span>
                      {loggedInDept && d === loggedInDept ? (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${filterDept === d ? 'bg-white/20' : 'bg-green-100 text-green-700'}`}>
                          You
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-700">
                  {loggedInDept ? `Chat feed (logged in as ${loggedInDept})` : 'Chat feed'}
                </p>
              </div>

              <div className="p-4 space-y-3 bg-gray-50 max-h-[65vh] overflow-y-auto">
                {[...reports]
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((report) => {
                    const isMine = Boolean(loggedInDept) && report.department === loggedInDept;
                    const senderLabel = isMine ? 'You' : (report.submittedBy || report.department);

                    return (
                      <div key={report._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={
                            `max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ` +
                            (isMine ? 'bg-green-100' : 'bg-white border border-gray-200')
                          }
                        >
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-700 truncate">
                                {senderLabel} • {report.department}
                              </p>
                            </div>
                            <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded-full">
                              {report.reportType}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-gray-900 break-words">{report.title}</p>

                          {report.description ? (
                            <p className="text-sm text-gray-700 mt-1 break-words">{report.description}</p>
                          ) : null}

                          {report.content ? (
                            <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap break-words">{report.content}</p>
                          ) : null}

                          {Array.isArray(report.attachments) && report.attachments.length > 0 ? (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-semibold text-gray-700">Attachments</p>
                              <div className="space-y-1">
                                {report.attachments.map((name, idx) => (
                                  <div key={`${report._id}-att-${idx}`} className="flex items-center gap-2 text-xs text-gray-700">
                                    <Download size={14} className="text-gray-500" />
                                    <span className="break-all">{name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-gray-500">
                            <span>
                              {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
                              {report.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Submit Report</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'files')}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload files or drag and drop</span>
                  </label>
                </div>
                {formData.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx, 'files')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'images')}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload images or drag and drop</span>
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.images.map((image, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{image.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx, 'images')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Submit Report
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

export default ReportsSection;
