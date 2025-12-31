import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/layout/card';

const SecurityAudit = () => {
  const issues = [
    { type: 'critical', title: 'Outdated SSL Certificate', description: 'SSL certificate expires in 7 days' },
    { type: 'warning', title: 'Weak Password Policy', description: 'Password complexity requirements need update' },
    { type: 'info', title: 'Security Headers', description: 'All security headers are properly configured' },
    { type: 'warning', title: 'API Rate Limiting', description: 'Some endpoints lack rate limiting' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="security-audit">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">1</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">2</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">85%</div>
            <div className="text-sm text-gray-600">Security Score</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded">
                {getIcon(issue.type)}
                <div className="flex-1">
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-gray-600">{issue.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAudit;
