import React, { useState } from 'react';
import { FileText, Search, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const LogViewer = () => {
  const [logs] = useState([
    { time: '2024-01-15 10:23:45', level: 'INFO', message: 'Server started successfully' },
    { time: '2024-01-15 10:24:12', level: 'ERROR', message: 'Database connection failed' },
    { time: '2024-01-15 10:24:30', level: 'WARN', message: 'High memory usage detected' },
    { time: '2024-01-15 10:25:00', level: 'INFO', message: 'User authentication successful' },
  ]);

  return (
    <div className="log-viewer">
      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Search className="w-4 h-4 inline mr-2" />
          Search
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <Filter className="w-4 h-4 inline mr-2" />
          Filter
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <Download className="w-4 h-4 inline mr-2" />
          Download
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Application Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className={`p-2 rounded ${
                log.level === 'ERROR' ? 'bg-red-50 text-red-700' :
                log.level === 'WARN' ? 'bg-yellow-50 text-yellow-700' :
                'bg-gray-50'
              }`}>
                <span className="text-gray-500">{log.time}</span>
                <span className={`ml-2 font-bold ${
                  log.level === 'ERROR' ? 'text-red-600' :
                  log.level === 'WARN' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>[{log.level}]</span>
                <span className="ml-2">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogViewer;
