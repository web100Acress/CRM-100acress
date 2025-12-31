import React from 'react';
import { AlertTriangle, Bug, Wrench, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const ErrorHandler = () => {
  const errors = [
    { 
      id: 1, 
      type: 'critical', 
      message: 'Database connection timeout', 
      count: 15, 
      lastOccurred: '5 minutes ago',
      stack: 'Error: Connection timeout at db.js:45'
    },
    { 
      id: 2, 
      type: 'warning', 
      message: 'High memory usage detected', 
      count: 8, 
      lastOccurred: '12 minutes ago',
      stack: 'Warning: Memory usage > 90% at monitor.js:23'
    },
    { 
      id: 3, 
      type: 'info', 
      message: 'API rate limit approaching', 
      count: 3, 
      lastOccurred: '1 hour ago',
      stack: 'Info: Rate limit 90% reached at api.js:67'
    },
  ];

  const getSeverityColor = (type) => {
    switch(type) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-500 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="error-handler">
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Search className="w-4 h-4 inline mr-2" />
          Search Errors
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <Wrench className="w-4 h-4 inline mr-2" />
          Auto-Fix
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">26</div>
            <div className="text-sm text-gray-600">Total Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Bug className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">3</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Wrench className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">89%</div>
            <div className="text-sm text-gray-600">Resolved Rate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errors.map((error) => (
              <div key={error.id} className={`p-4 border rounded ${getSeverityColor(error.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium capitalize">{error.type}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{error.count}</span> occurrences
                  </div>
                </div>
                <div className="mb-2">
                  <div className="font-medium">{error.message}</div>
                  <div className="text-sm opacity-75">Last: {error.lastOccurred}</div>
                </div>
                <div className="font-mono text-xs bg-black bg-opacity-10 p-2 rounded">
                  {error.stack}
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <FileText className="w-3 h-3 inline mr-1" />
                    View Details
                  </button>
                  <button className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    <Wrench className="w-3 h-3 inline mr-1" />
                    Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorHandler;
