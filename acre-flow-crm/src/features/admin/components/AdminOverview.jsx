import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminOverview = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">Admin overview placeholder.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
