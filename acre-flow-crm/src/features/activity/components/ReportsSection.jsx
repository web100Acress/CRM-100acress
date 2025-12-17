import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Download, Filter, Paperclip, Image as ImageIcon, Send, ChevronDown, ChevronUp } from 'lucide-react';

const ReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [loggedInDept, setLoggedInDept] = useState('');
  const [showComposerAdvanced, setShowComposerAdvanced] = useState(false);
  const allDepartments = ['IT', 'Sales', 'Developer', 'HR', 'Marketing', 'Finance', 'Operations'];
  const visibleDepartments = loggedInDept ? [loggedInDept] : ['All', ...allDepartments];
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
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

  const submitReport = async () => {
    try {
      const department = localStorage.getItem('activityDepartment');
      const email = localStorage.getItem('activityDepartmentEmail');

      const trimmedContent = (formData.content || '').trim();
      if (!trimmedContent) return;

      const finalTitle = (formData.title || '').trim() || trimmedContent.split('\n')[0].slice(0, 60) || 'Report';
      const finalDescription = (formData.description || '').trim();

      const response = await fetch('http://localhost:5001/api/activity/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: finalTitle,
          description: finalDescription,
          content: trimmedContent,
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
        setShowComposerAdvanced(false);
        fetchReports();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitReport();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <button
          onClick={() => setShowComposerAdvanced((v) => !v)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {showComposerAdvanced ? 'Hide Options' : 'Report Options'}
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
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col h-[70vh]">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-700">
                  {loggedInDept ? `Chat feed (logged in as ${loggedInDept})` : 'Chat feed'}
                </p>
              </div>

              <div className="p-4 space-y-3 bg-gray-50 overflow-y-auto flex-1">
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

              <div className="border-t border-gray-200 bg-white">
                {showComposerAdvanced && (
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
                        <input
                          type="text"
                          value={formData.submitterName}
                          onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                          placeholder="Enter your name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Report Type</label>
                        <select
                          value={formData.reportType}
                          onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                          <option>Quarterly</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title (optional)</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Auto-generated if empty"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Short summary"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(formData.files.length > 0 || formData.images.length > 0) && (
                  <div className="px-3 pt-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.files.map((f, idx) => (
                        <div key={`f-${idx}`} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                          <Paperclip size={14} className="text-gray-500" />
                          <span className="max-w-[180px] truncate">{f.name}</span>
                          <button type="button" onClick={() => removeFile(idx, 'files')} className="text-gray-500 hover:text-red-600">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {formData.images.map((f, idx) => (
                        <div key={`i-${idx}`} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                          <ImageIcon size={14} className="text-gray-500" />
                          <span className="max-w-[180px] truncate">{f.name}</span>
                          <button type="button" onClick={() => removeFile(idx, 'images')} className="text-gray-500 hover:text-red-600">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 flex items-end gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'files')}
                    className="hidden"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'images')}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                    title="Attach files"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                    title="Attach images"
                  >
                    <ImageIcon size={20} />
                  </button>

                  <div className="flex-1">
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      onKeyDown={handleComposerKeyDown}
                      rows={1}
                      placeholder="Type a message"
                      className="w-full resize-none px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Press Enter to send • Shift+Enter for new line</p>
                  </div>

                  <button
                    type="button"
                    onClick={submitReport}
                    disabled={!String(formData.content || '').trim()}
                    className="p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-600"
                    title="Send"
                  >
                    <Send size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowComposerAdvanced((v) => !v)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                    title="More options"
                  >
                    {showComposerAdvanced ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;
