import React from 'react';
import { RefreshCw, Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const QueueMonitor = () => {
  const queues = [
    { name: 'email_queue', pending: 23, processing: 2, failed: 0, status: 'active' },
    { name: 'backup_queue', pending: 5, processing: 1, failed: 1, status: 'active' },
    { name: 'report_queue', pending: 12, processing: 0, failed: 3, status: 'warning' },
    { name: 'notification_queue', pending: 0, processing: 0, failed: 0, status: 'idle' },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'idle': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return <RefreshCw className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="queue-monitor">
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Refresh Queues
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <PlayCircle className="w-4 h-4 inline mr-2" />
          Process All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">40</div>
            <div className="text-sm text-gray-600">Total Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">3</div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">4</div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">2</div>
            <div className="text-sm text-gray-600">Active Queues</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Queue Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queues.map((queue, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {getStatusIcon(queue.status)}
                  <div>
                    <div className="font-medium">{queue.name}</div>
                    <div className="text-sm text-gray-600 capitalize">{queue.status}</div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">{queue.pending}</span>
                    <span className="text-gray-600 ml-1">pending</span>
                  </div>
                  <div>
                    <span className="text-orange-600 font-medium">{queue.processing}</span>
                    <span className="text-gray-600 ml-1">processing</span>
                  </div>
                  <div>
                    <span className="text-red-600 font-medium">{queue.failed}</span>
                    <span className="text-gray-600 ml-1">failed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueMonitor;
