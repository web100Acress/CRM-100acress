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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
                <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <Icon size={20} className={isPositive ? 'text-green-600' : 'text-blue-600'} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <p className={`text-sm mt-2 ${isPositive ? 'text-green-600' : 'text-blue-600'}`}>
                {metric.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Performance vs Target */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Performance vs Target (% of Goal)</h3>
        <div className="space-y-6">
          {performanceByMonth.map((data, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{data.month}</span>
                <span className="text-sm text-gray-600">{data.actual}% of {data.target}%</span>
              </div>
              <div className="flex gap-2">
                {/* Target Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gray-400 h-full rounded-full"
                    style={{ width: `${(data.target / maxValue) * 100}%` }}
                  ></div>
                </div>
                {/* Actual Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      data.actual >= data.target ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${(data.actual / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Actual (Met)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Actual (Below)</span>
          </div>
        </div>
      </div>

      {/* Sales by Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales by Product</h3>
          <div className="space-y-4">
            {[
              { name: 'Product A', value: 35, color: 'bg-blue-500' },
              { name: 'Product B', value: 28, color: 'bg-green-500' },
              { name: 'Product C', value: 22, color: 'bg-purple-500' },
              { name: 'Product D', value: 15, color: 'bg-orange-500' },
            ].map((product, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="text-sm text-gray-600">{product.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${product.color} h-2 rounded-full`}
                    style={{ width: `${product.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Region */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales by Region</h3>
          <div className="space-y-4">
            {[
              { name: 'North America', value: 45, color: 'bg-red-500' },
              { name: 'Europe', value: 30, color: 'bg-yellow-500' },
              { name: 'Asia Pacific', value: 18, color: 'bg-cyan-500' },
              { name: 'Others', value: 7, color: 'bg-gray-500' },
            ].map((region, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{region.name}</span>
                  <span className="text-sm text-gray-600">{region.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${region.color} h-2 rounded-full`}
                    style={{ width: `${region.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesMetrics;
