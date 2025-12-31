import React from 'react';
import { Wrench, Settings, Terminal, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const DeveloperTools = () => {
  const tools = [
    { name: 'Code Formatter', icon: Settings, description: 'Format and beautify your code' },
    { name: 'Terminal', icon: Terminal, description: 'Integrated terminal for commands' },
    { name: 'Package Manager', icon: Package, description: 'Manage npm packages' },
    { name: 'Build Tools', icon: Wrench, description: 'Build and compilation tools' },
  ];

  return (
    <div className="developer-tools">
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <Card key={index} className="tool-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <tool.icon className="w-5 h-5" />
                {tool.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{tool.description}</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Open Tool
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeveloperTools;
