import React from 'react';
import { Zap, Trash2, RefreshCw, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const CacheManager = () => {
  const cacheItems = [
    { key: 'user_sessions', size: '12.5 MB', ttl: '2 hours', hits: 1542 },
    { key: 'api_responses', size: '8.3 MB', ttl: '1 hour', hits: 892 },
    { key: 'database_queries', size: '5.7 MB', ttl: '30 minutes', hits: 2341 },
    { key: 'static_assets', size: '45.2 MB', ttl: '24 hours', hits: 5678 },
  ];

  return (
    <div className="cache-manager">
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Refresh Cache
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          <Trash2 className="w-4 h-4 inline mr-2" />
          Clear All Cache
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">71.7 MB</div>
            <div className="text-sm text-gray-600">Total Cache Size</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">10,453</div>
            <div className="text-sm text-gray-600">Total Hits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <RefreshCw className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">94%</div>
            <div className="text-sm text-gray-600">Hit Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trash2 className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-gray-600">Cache Items</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Cache Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cacheItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{item.key}</div>
                  <div className="text-sm text-gray-600">TTL: {item.ttl}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.size}</div>
                  <div className="text-sm text-blue-600">{item.hits.toLocaleString()} hits</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManager;
