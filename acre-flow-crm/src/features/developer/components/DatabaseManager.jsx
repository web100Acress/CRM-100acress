import React, { useState } from 'react';
import { Database, Search, Download, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const DatabaseManager = () => {
  const [tables] = useState([
    { name: 'users', rows: 1250, size: '2.4 MB' },
    { name: 'projects', rows: 450, size: '1.8 MB' },
    { name: 'activities', rows: 3200, size: '5.2 MB' },
    { name: 'logs', rows: 8900, size: '12.1 MB' },
  ]);

  return (
    <div className="database-manager">
      <div className="db-actions mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
          <Upload className="w-4 h-4 inline mr-2" />
          Backup Database
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2">
          <Download className="w-4 h-4 inline mr-2" />
          Restore Database
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          <Database className="w-4 h-4 inline mr-2" />
          Run Query
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Tables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Table Name</th>
                  <th className="text-left p-2">Rows</th>
                  <th className="text-left p-2">Size</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{table.name}</td>
                    <td className="p-2">{table.rows.toLocaleString()}</td>
                    <td className="p-2">{table.size}</td>
                    <td className="p-2">
                      <button className="text-blue-500 hover:text-blue-700 mr-2">
                        <Search className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseManager;
