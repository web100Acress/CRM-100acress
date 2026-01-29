import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Network, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const SystemMonitor = () => {
  const [stats, setStats] = useState({
    cpu: '0%',
    memory: '0%',
    disk: '0%',
    network: '0 MB/s'
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats({
        cpu: `${Math.floor(Math.random() * 100)}%`,
        memory: `${Math.floor(Math.random() * 100)}%`,
        disk: `${Math.floor(Math.random() * 100)}%`,
        network: `${Math.floor(Math.random() * 100)} MB/s`
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'CPU Usage', value: stats.cpu, icon: Cpu, color: 'text-blue-500' },
    { label: 'Memory', value: stats.memory, icon: HardDrive, color: 'text-green-500' },
    { label: 'Disk Space', value: stats.disk, icon: Server, color: 'text-purple-500' },
    { label: 'Network', value: stats.network, icon: Network, color: 'text-orange-500' },
  ];

  return (
    <div className="system-monitor">
      <div className="monitor-grid">
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Server Status</span>
              <span className="text-green-500">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime</span>
              <span>2d 14h 32m</span>
            </div>
            <div className="flex justify-between">
              <span>Processes</span>
              <span>142</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;
