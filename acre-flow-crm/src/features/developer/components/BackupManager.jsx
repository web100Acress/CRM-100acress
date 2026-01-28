import React from 'react';
import { HardDrive, Download, Upload, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const BackupManager = () => {
  const backups = [
    { id: 1, name: 'daily_backup_2024-01-15', size: '245 MB', date: '2024-01-15 02:00:00', type: 'automatic' },
    { id: 2, name: 'weekly_backup_2024-01-14', size: '1.2 GB', date: '2024-01-14 03:00:00', type: 'automatic' },
    { id: 3, name: 'manual_backup_before_update', size: '890 MB', date: '2024-01-13 14:30:00', type: 'manual' },
  ];

  return (
    <div className="backup-manager">
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Download className="w-4 h-4 inline mr-2" />
          Create Backup
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <Upload className="w-4 h-4 inline mr-2" />
          Restore Backup
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="font-medium">{backup.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {backup.date}
                      <span className={`px-2 py-1 rounded text-xs ${
                        backup.type === 'automatic' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {backup.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{backup.size}</div>
                  <div className="flex gap-2 mt-1">
                    <button className="text-blue-500 hover:text-blue-700 text-sm">Download</button>
                    <button className="text-green-500 hover:text-green-700 text-sm">Restore</button>
                    <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
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

export default BackupManager;
