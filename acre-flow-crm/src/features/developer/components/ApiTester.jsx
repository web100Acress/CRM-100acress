import React, { useState } from 'react';
import { Globe, Play, Save, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const ApiTester = () => {
  const [request, setRequest] = useState({
    method: 'GET',
    url: '',
    headers: '',
    body: ''
  });
  const [response, setResponse] = useState('');

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  return (
    <div className="api-tester">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Method</label>
              <select 
                value={request.method}
                onChange={(e) => setRequest({...request, method: e.target.value})}
                className="w-full p-2 border rounded"
              >
                {methods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="text"
                value={request.url}
                onChange={(e) => setRequest({...request, url: e.target.value})}
                placeholder="https://api.example.com/endpoint"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Headers (JSON)</label>
              <textarea
                value={request.headers}
                onChange={(e) => setRequest({...request, headers: e.target.value})}
                placeholder='{"Content-Type": "application/json"}'
                className="w-full p-2 border rounded h-20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Body (JSON)</label>
              <textarea
                value={request.body}
                onChange={(e) => setRequest({...request, body: e.target.value})}
                placeholder='{"key": "value"}'
                className="w-full p-2 border rounded h-20"
              />
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <Play className="w-4 h-4 inline mr-2" />
                Send Request
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                <Save className="w-4 h-4 inline mr-2" />
                Save
              </button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">Response will appear here</span>
              <button className="text-blue-500 hover:text-blue-700">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={response}
              readOnly
              placeholder="Response data..."
              className="w-full p-2 border rounded h-64 bg-gray-50"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiTester;
