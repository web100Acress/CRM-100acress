import React from 'react';
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';

const SalesMetrics = () => {
  const metrics = [
    {
      title: 'Average Deal Size',
      value: '$8,500',
      change: '+5.2%',
      trend: 'up',
      icon: Target,
    },
    {
      title: 'Sales Cycle Length',
      value: '18 days',
      change: '-2 days',
      trend: 'down',
      icon: Clock,
    },
    {
      title: 'Win Rate',
      value: '42%',
      change: '+3.1%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Customer Retention',
      value: '87%',
      change: '+1.2%',
      trend: 'up',
      icon: TrendingUp,
    },
  ];

  const performanceByMonth = [
    { month: 'Jan', target: 100, actual: 95 },
    { month: 'Feb', target: 100, actual: 108 },
    { month: 'Mar', target: 100, actual: 112 },
    { month: 'Apr', target: 100, actual: 98 },
    { month: 'May', target: 100, actual: 115 },
    { month: 'Jun', target: 100, actual: 125 },
  ];

  const maxValue = Math.max(...performanceByMonth.map(d => Math.max(d.target, d.actual)));

  return (
    <div className="space-y-6">
     
  

    </div>
  );
};

export default SalesMetrics;
