import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  Save,
  History,
  Settings,
  Globe,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';
import '../styles/ApiTester.css';

const ApiTester = () => {
  const [request, setRequest] = useState({
    method: 'GET',
    url: '',
    description: '', // Added description field
    headers: [{ key: '', value: '' }],
    params: [{ key: '', value: '' }],
    body: '',
    contentType: 'application/json'
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('params');

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  const contentTypes = [
    { value: 'application/json', label: 'JSON' },
    { value: 'application/x-www-form-urlencoded', label: 'Form Data' },
    { value: 'text/plain', label: 'Text' },
    { value: 'application/xml', label: 'XML' },
    { value: 'multipart/form-data', label: 'Form Data (Multipart)' }
  ];

  const addHeader = () => {
    setRequest({
      ...request,
      headers: [...request.headers, { key: '', value: '' }]
    });
  };

  const removeHeader = (index) => {
    setRequest({
      ...request,
      headers: request.headers.filter((_, i) => i !== index)
    });
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...request.headers];
    newHeaders[index][field] = value;
    setRequest({
      ...request,
      headers: newHeaders
    });
  };

  const addParam = () => {
    setRequest({
      ...request,
      params: [...request.params, { key: '', value: '' }]
    });
  };

  const removeParam = (index) => {
    setRequest({
      ...request,
      params: request.params.filter((_, i) => i !== index)
    });
  };

  const updateParam = (index, field, value) => {
    const newParams = [...request.params];
    newParams[index][field] = value;
    setRequest({
      ...request,
      params: newParams
    });
  };

  const sendRequest = async () => {
    if (!request.url) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const headersObj = request.headers
        .filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      const paramsObj = request.params
        .filter(p => p.key && p.value)
        .reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {});

      let requestOptions = {
        method: request.method,
        headers: {
          'Content-Type': request.contentType,
          ...headersObj
        }
      };

      if (request.method !== 'GET' && request.body) {
        requestOptions.body = request.contentType === 'application/json' ? JSON.stringify(JSON.parse(request.body)) : request.body;
      }

      // Add query parameters for GET requests
      let finalUrl = request.url;
      if (request.method === 'GET' && Object.keys(paramsObj).length > 0) {
        const queryString = new URLSearchParams(paramsObj).toString();
        finalUrl = `${request.url}?${queryString}`;
      }

      const response = await fetch(finalUrl, requestOptions);
      const responseText = await response.text();
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = responseText;
      }

      const responseInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: parsedResponse,
        time: new Date().toLocaleTimeString(),
        url: finalUrl,
        method: request.method
      };

      setResponse(responseInfo);
      
      // Add to history
      setHistory([responseInfo, ...history.slice(0, 9)]);

    } catch (error) {
      setResponse({
        error: error.message,
        status: 'Error',
        time: new Date().toLocaleTimeString(),
        url: request.url,
        method: request.method
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const [dbConnected, setDbConnected] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [autoSave, setAutoSave] = useState(true);

  // Load saved requests from database on component mount
  useEffect(() => {
    const loadSavedRequests = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/api-tester/requests', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Convert database requests to history format
            const dbHistory = data.data.map(req => ({
              status: req.response?.status || 200,
              statusText: req.response?.statusText || 'OK',
              headers: req.response?.headers || {},
              data: req.response?.data || 'No response data',
              time: new Date(req.timestamp).toLocaleTimeString(),
              url: req.url,
              method: req.method,
              description: req.description || 'No description provided' // Include description
            }));
            
            setHistory(dbHistory);
          }
        }
      } catch (error) {
        console.error('Error loading saved requests:', error);
        // Fallback to localStorage if database fails
        const savedRequests = JSON.parse(localStorage.getItem('apiTestRequests') || '[]');
        setHistory(savedRequests);
      }
    };

    loadSavedRequests();
  }, []);

  // Check database connection status
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/api-tester/status');
        const data = await response.json();
        setDbConnected(data.connected);
      } catch (error) {
        console.error('Database connection check failed:', error);
        setDbConnected(false);
      }
    };

    checkDbConnection();
    const interval = setInterval(checkDbConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-save to database when request is sent
  useEffect(() => {
    if (response && autoSave) {
      saveRequest();
      setLastSavedTime(new Date().toLocaleTimeString());
    }
  }, [response]);

  const saveRequest = async () => {
    try {
      // Save to localStorage
      const requestData = {
        method: request.method,
        url: request.url,
        description: request.description, // Include description
        headers: request.headers.filter(h => h.key && h.value),
        params: request.params.filter(p => p.key && p.value),
        body: request.body,
        contentType: request.contentType,
        timestamp: new Date().toISOString(),
        response: response
      };
      
      const savedRequests = JSON.parse(localStorage.getItem('apiTestRequests') || '[]');
      savedRequests.push(requestData);
      localStorage.setItem('apiTestRequests', JSON.stringify(savedRequests));
      
      // Save to database in real-time
      await fetch('http://localhost:5001/api/api-tester/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });
      
      alert('Request saved successfully!');
    } catch (error) {
      console.error('Error saving request:', error);
      alert('Failed to save request');
    }
  };

  const formatBody = () => {
    try {
      if (request.contentType === 'application/json') {
        return JSON.stringify(JSON.parse(request.body), null, 2);
      }
      return request.body;
    } catch {
      return request.body;
    }
  };

  return (
    <div className="api-tester">
      <div className="api-header">
        <h2>API Tester - Real-Time Database Integration</h2>
        <div className="api-actions">
          <div className="db-status">
            <span className={`status-indicator ${dbConnected ? 'connected' : 'disconnected'}`}></span>
            <span className="status-text">
              {dbConnected ? '🟢 Database Connected' : '🔴 Database Disconnected'}
            </span>
          </div>
          <div className="auto-save-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="toggle-input"
              />
              Auto-save to Database
            </label>
          </div>
          <button onClick={saveRequest} className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
            <Save className="w-4 h-4 inline mr-2" /> Save Now
          </button>
          <button onClick={() => setResponse(null)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
            <Trash2 className="w-4 h-4 inline mr-2" /> Clear
          </button>
        </div>
        {lastSavedTime && (
          <div className="last-saved">
            <span className="saved-text">Last saved: {lastSavedTime}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL and Method */}
            <div className="flex gap-2">
              <select 
                value={request.method} 
                onChange={(e) => setRequest({...request, method: e.target.value})}
                className="px-3 py-2 border rounded bg-white"
              >
                {methods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="text"
                value={request.url}
                onChange={(e) => setRequest({...request, url: e.target.value})}
                placeholder="Enter API endpoint URL (e.g., https://api.example.com/users)"
                className="flex-1 px-3 py-2 border rounded"
              />
              <button 
                onClick={sendRequest} 
                disabled={loading} 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Description Input */}
            <div className="description-section">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">API Description</label>
                <span className="text-xs text-gray-500">Add a description for team members</span>
              </div>
              <input
                type="text"
                value={request.description}
                onChange={(e) => setRequest({...request, description: e.target.value})}
                placeholder="e.g., Get all users from the database - Returns user list with pagination"
                className="w-full px-3 py-2 border rounded text-sm"
              />
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button 
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'params' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('params')}
              >
                Params
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'headers' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('headers')}
              >
                Headers
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'body' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('body')}
              >
                Body
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'params' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Query Parameters</h3>
                    <button onClick={addParam} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      <Plus className="w-4 h-4 inline mr-1" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {request.params.map((param, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => updateParam(index, 'key', e.target.value)}
                          placeholder="Key"
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => updateParam(index, 'value', e.target.value)}
                          placeholder="Value"
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                        <button onClick={() => removeParam(index)} className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'headers' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Headers</h3>
                    <button onClick={addHeader} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      <Plus className="w-4 h-4 inline mr-1" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {request.headers.map((header, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          placeholder="Header Name"
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          placeholder="Header Value"
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                        <button onClick={() => removeHeader(index)} className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'body' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Request Body</h3>
                    <select 
                      value={request.contentType} 
                      onChange={(e) => setRequest({...request, contentType: e.target.value})}
                      className="px-3 py-2 border rounded text-sm"
                    >
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={request.body}
                    onChange={(e) => setRequest({...request, body: e.target.value})}
                    placeholder={request.contentType === 'application/json' 
                      ? '{\n  "key": "value"\n}' 
                      : 'Enter request body here...'
                    }
                    className="w-full px-3 py-2 border rounded h-32 font-mono text-sm"
                  />
                  {request.contentType === 'application/json' && (
                    <div className="mt-2">
                      <button 
                        onClick={() => setRequest({...request, body: formatBody()})}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 inline mr-1" /> Format JSON
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Response Section */}
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      response.status >= 200 && response.status < 300 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-sm text-gray-500">{response.time}</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(
                      typeof response.data === 'object' 
                        ? JSON.stringify(response.data, null, 2) 
                        : response.data
                    )}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    <Copy className="w-4 h-4 inline mr-1" /> Copy
                  </button>
                </div>
                
                {response.error ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center text-red-800">
                      <X className="w-4 h-4 mr-2" />
                      <span className="font-medium">Error: {response.error}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <pre className="bg-gray-50 p-3 border rounded text-xs overflow-auto max-h-96">
                      {typeof response.data === 'object' 
                        ? JSON.stringify(response.data, null, 2) 
                        : response.data
                      }
                    </pre>
                  </div>
                )}
                
                {response.headers && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Response Headers</h4>
                    <div className="bg-gray-50 p-2 border rounded text-xs max-h-32 overflow-auto">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="font-medium text-blue-600">{key}:</span>
                          <span className="text-gray-700 ml-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Globe className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Send a request to see the response</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request History */}
      {history.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Request History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-auto">
              {history.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded hover:bg-gray-100 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status >= 200 && item.status < 300 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.method}
                      </span>
                      <span className="text-sm text-gray-600 truncate max-w-xs">{item.url}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-700 bg-white p-2 rounded border-l-2 border-blue-400">
                      <strong>Description:</strong> {item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiTester;
