import React from 'react';
import { GitBranch, Play, RotateCcw, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const DeploymentPanel = () => {
  const deployments = [
    { id: 1, app: 'Frontend', version: 'v2.1.0', status: 'deployed', time: '2 hours ago' },
    { id: 2, app: 'Backend API', version: 'v1.8.3', status: 'deployed', time: '5 hours ago' },
    { id: 3, app: 'Database', version: 'v3.2.1', status: 'pending', time: '10 minutes ago' },
  ];

  return (
    <div className="deployment-panel">
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Play className="w-4 h-4 inline mr-2" />
          Deploy
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          <RotateCcw className="w-4 h-4 inline mr-2" />
          Rollback
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Recent Deployments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{deployment.app}</div>
                  <div className="text-sm text-gray-600">Version {deployment.version}</div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs ${
                    deployment.status === 'deployed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {deployment.status === 'deployed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {deployment.status}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{deployment.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentPanel;
