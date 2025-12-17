import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Download, Filter, Paperclip, Image as ImageIcon, Send, ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { io } from 'socket.io-client';

const ReportsSection = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [loggedInDept, setLoggedInDept] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [showComposerAdvanced, setShowComposerAdvanced] = useState(false);
  const [chatTheme, setChatTheme] = useState('light');
  const [isMobile, setIsMobile] = useState(false);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
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
    // Initialize Socket.IO connection
    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5001' 
      : 'https://crm.100acress.com';
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to chat server');
      setSocketConnected(true);
      setSocket(newSocket);
    }); 

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
      setSocketConnected(false);
    });

    newSocket.on('newMessage', (message) => {
      console.log('📨 New message received:', message);
      setReports(prev => [...prev, message]);
    });

    newSocket.on('messageError', (error) => {
      console.error('❌ Socket error:', error);
    });

    // Get user session info
    const currentSessionId = localStorage.getItem('currentActivitySession');
    const activeSessions = JSON.parse(localStorage.getItem('activeActivitySessions') || '[]');
    
    if (currentSessionId && activeSessions.includes(currentSessionId)) {
      const sessionKey = `activity_${currentSessionId}`;
      const department = localStorage.getItem(sessionKey + '_department');
      const email = localStorage.getItem(sessionKey + '_email');
      const userName = localStorage.getItem(sessionKey + '_userName');
      const savedTheme = localStorage.getItem('activityReportsChatTheme');
      
      if (department) {
        setLoggedInDept(department);
        setFilterDept(department);
        // Join department room
        newSocket.emit('joinChatRoom', department);
      }
      if (email) {
        setLoggedInEmail(email);
      }
      if (userName) {
        setFormData(prev => ({ ...prev, submitterName: userName }));
      }
      if (savedTheme) {
        setChatTheme(savedTheme);
      }
    }

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const cycleChatTheme = () => {
    const themes = ['light', 'soft', 'mint', 'dark'];
    const currentIndex = themes.indexOf(chatTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setChatTheme(nextTheme);
    localStorage.setItem('activityReportsChatTheme', nextTheme);
  };

  const themeClasses = {
    light: {
      chatBg: 'bg-gray-50',
      mineBubble: 'bg-green-100 text-gray-900',
      otherBubble: 'bg-white border border-gray-200 text-gray-900',
      headerBg: 'bg-gray-50',
      composerBg: 'bg-white'
    },
    soft: {
      chatBg: 'bg-slate-100',
      mineBubble: 'bg-indigo-100 text-gray-900',
      otherBubble: 'bg-white border border-gray-200 text-gray-900',
      headerBg: 'bg-slate-50',
      composerBg: 'bg-white'
    },
    mint: {
      chatBg: 'bg-emerald-50',
      mineBubble: 'bg-emerald-100 text-gray-900',
      otherBubble: 'bg-white border border-emerald-100 text-gray-900',
      headerBg: 'bg-emerald-50',
      composerBg: 'bg-white'
    },
    dark: {
      chatBg: 'bg-gray-900',
      mineBubble: 'bg-green-700 text-white',
      otherBubble: 'bg-gray-800 border border-gray-700 text-white',
      headerBg: 'bg-gray-900',
      composerBg: 'bg-gray-900'
    }
  };

  const currentTheme = themeClasses[chatTheme] || themeClasses.light;

  const setDeptFilter = (dept) => {
    if (loggedInDept) {
      setFilterDept(loggedInDept);
      return;
    }
    setFilterDept(dept);
  };

  useEffect(() => {
    if (socket && socketConnected) {
      fetchChatHistory();
    }
  }, [filterDept, socket, socketConnected]);

  const fetchChatHistory = () => {
    if (!socket) {
      console.log('❌ Socket not available for fetchChatHistory');
      return;
    }
    
    console.log('📡 Requesting chat history for department:', filterDept);
    setLoading(true);
    socket.emit('requestChatHistory', { department: filterDept });
    
    // Listen for chat history response
    socket.once('chatHistory', (messages) => {
      console.log('📨 Received chat history:', messages);
      const messageData = messages || [];
      
      // If no messages, show demo message for testing
      if (messageData.length === 0) {
        const demoMessage = {
          _id: 'demo-' + Date.now(),
          content: 'Welcome to real-time chat! This is a demo message. Start typing to send real messages!',
          sender: {
            name: 'System',
            email: 'system@chat.com',
            department: 'All'
          },
          type: 'Custom',
          timestamp: new Date(),
          attachments: [],
          images: []
        };
        setReports([demoMessage]);
      } else {
        setReports(messageData);
      }
      
      setLoading(false);
    });
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
    if (!socket || !socketConnected) {
      console.error('Socket not connected');
      return;
    }

    try {
      const currentSessionId = localStorage.getItem('currentActivitySession');
      const activeSessions = JSON.parse(localStorage.getItem('activeActivitySessions') || '[]');
      
      let userName = '';
      let department = '';
      let email = '';
      
      if (currentSessionId && activeSessions.includes(currentSessionId)) {
        const sessionKey = `activity_${currentSessionId}`;
        userName = localStorage.getItem(sessionKey + '_userName') || '';
        department = localStorage.getItem(sessionKey + '_department') || '';
        email = localStorage.getItem(sessionKey + '_email') || '';
      }

      const trimmedContent = (formData.content || '').trim();
      if (!trimmedContent) return;

      const finalTitle = (formData.title || '').trim() || trimmedContent.split('\n')[0].slice(0, 60) || 'Report';
      const finalDescription = (formData.description || '').trim();

      // Send message via Socket.IO
      const messageData = {
        content: trimmedContent,
        sender: {
          name: userName,
          email: email,
          department: department
        },
        type: formData.reportType,
        attachments: formData.files.map(f => ({ name: f.name, url: URL.createObjectURL(f), type: 'file' })),
        images: formData.images.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
      };

      socket.emit('sendMessage', messageData);

      // Clear form
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
    <div className="space-y-2">
      {/* <div className="flex items-center justify-between"> */}
        {/* <h2 className="text-2xl font-bold text-gray-900">Reports</h2> */}
        {/* <button
          onClick={() => setShowComposerAdvanced((v) => !v)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {showComposerAdvanced ? 'Hide Options' : 'Report Options'}
        </button> */}
      {/* </div> */}

      {/* <div className="flex items-center gap-4">
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
      </div> */}

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
              <div className={`${currentTheme.headerBg} px-4 py-3 border-b border-gray-200 flex items-center justify-between`}>
                <p className={`text-sm ${chatTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  {loggedInDept ? `Chat feed (logged in as ${loggedInDept})` : 'Chat feed'}
                  <span className={`ml-2 inline-flex items-center gap-1 text-xs ${socketConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {socketConnected ? '● Connected' : '● Disconnected'}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={cycleChatTheme}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    chatTheme === 'dark'
                      ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                      : 'border-gray-200 text-gray-700 hover:bg-white'
                  }`}
                  title="Change chat background"
                >
                  <Palette size={16} />
                  <span className="capitalize">{chatTheme}</span>
                </button>
              </div>

              <div className={`p-4 space-y-3 ${currentTheme.chatBg} overflow-y-auto flex-1 flex flex-col`}>
                {[...reports]
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((report) => {
                    const isFromMe = Boolean(loggedInEmail) && Boolean(report.submittedByEmail) && report.submittedByEmail === loggedInEmail;
                    const senderName = report.submittedBy || report.department;

                    return (
                      <div key={report._id} className={`flex w-full ${isFromMe ? 'justify-start' : 'justify-end'}`}>
                        <div
                          className={
                            `max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ` +
                            (isFromMe ? currentTheme.mineBubble : currentTheme.otherBubble)
                          }
                        >
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div className="min-w-0">
                              <p className={`text-xs font-semibold truncate ${chatTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                {senderName} • {report.department}
                                {isFromMe ? (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-green-200 text-green-900 text-[10px] font-semibold">
                                    You
                                  </span>
                                ) : null}
                              </p>
                            </div>
                            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full ${chatTheme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'}`}>
                              {report.reportType}
                            </span>
                          </div>

                          <p className={`text-sm font-semibold break-words ${chatTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{report.title}</p>

                          {report.description ? (
                            <p className={`text-sm mt-1 break-words ${chatTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{report.description}</p>
                          ) : null}

                          {report.content ? (
                            <p className={`text-sm mt-2 whitespace-pre-wrap break-words ${chatTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{report.content}</p>
                          ) : null}

                          {Array.isArray(report.attachments) && report.attachments.length > 0 ? (
                            <div className="mt-3 space-y-1">
                              <p className={`text-xs font-semibold ${chatTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Attachments</p>
                              <div className="space-y-1">
                                {report.attachments.map((name, idx) => (
                                  <div key={`${report._id}-att-${idx}`} className={`flex items-center gap-2 text-xs ${chatTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                    <Download size={14} className={chatTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
                                    <span className="break-all">{name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className={`mt-2 flex items-center justify-end gap-2 text-[11px] ${chatTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            <span>
                              {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded ${chatTheme === 'dark' ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`}>
                              {report.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className={`border-t border-gray-200 ${currentTheme.composerBg}`}>
                {showComposerAdvanced && (
                  <div className={`p-3 border-b border-gray-200 ${chatTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${chatTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Your Name</label>
                        <input
                          type="text"
                          value={formData.submitterName}
                          onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                          placeholder="Enter your name"
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${chatTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${chatTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Report Type</label>
                        <select
                          value={formData.reportType}
                          onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${chatTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
                        >
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                          <option>Quarterly</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-medium mb-1 ${chatTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Title (optional)</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Auto-generated if empty"
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${chatTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-medium mb-1 ${chatTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Description (optional)</label>
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Short summary"
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${chatTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
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

                <div className="p-2 sm:p-3 flex items-end gap-1.5 sm:gap-2">
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
                    className={`shrink-0 p-1.5 sm:p-2 rounded-full transition-colors ${chatTheme === 'dark' ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="Attach files"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className={`shrink-0 p-1.5 sm:p-2 rounded-full transition-colors ${chatTheme === 'dark' ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="Attach images"
                  >
                    <ImageIcon size={20} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      onKeyDown={handleComposerKeyDown}
                      rows={1}
                      placeholder={isMobile ? 'Message…' : 'Type a message'}
                      className={`w-full min-w-0 resize-none px-3 sm:px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${chatTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'border-gray-300'}`}
                    />
                    {/* <p className={`text-[11px] mt-1 ${chatTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Press Enter to send • Shift+Enter for new line</p> */}
                  </div>

                  <button
                    type="button"
                    onClick={submitReport}
                    disabled={!String(formData.content || '').trim()}
                    className="shrink-0 p-1.5 sm:p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-600"
                    title="Send"
                  >
                    <Send size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowComposerAdvanced((v) => !v)}
                    className={`shrink-0 p-1.5 sm:p-2 rounded-full transition-colors ${chatTheme === 'dark' ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
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
