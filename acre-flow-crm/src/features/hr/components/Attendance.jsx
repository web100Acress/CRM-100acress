import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const attendanceData = [
    { id: 1, name: 'John Doe', status: 'present', time: '09:00 AM', department: 'Sales' },
    { id: 2, name: 'Sarah Johnson', status: 'present', time: '08:45 AM', department: 'Engineering' },
    { id: 3, name: 'Mike Davis', status: 'absent', time: '-', department: 'Marketing' },
    { id: 4, name: 'Emma Wilson', status: 'late', time: '10:30 AM', department: 'HR' },
    { id: 5, name: 'David Brown', status: 'present', time: '09:15 AM', department: 'Finance' },
    { id: 6, name: 'Lisa Anderson', status: 'leave', time: '-', department: 'Operations' },
    { id: 7, name: 'James Miller', status: 'present', time: '09:05 AM', department: 'Sales' },
    { id: 8, name: 'Jennifer Taylor', status: 'present', time: '08:50 AM', department: 'Engineering' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'absent':
        return <XCircle size={20} className="text-red-600" />;
      case 'late':
        return <Clock size={20} className="text-orange-600" />;
      case 'leave':
        return <Calendar size={20} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-orange-100 text-orange-800',
      leave: 'bg-blue-100 text-blue-800',
    };
    return badges[status] || '';
  };

  const stats = [
    { label: 'Present', count: 6, color: 'text-green-600' },
    { label: 'Absent', count: 1, color: 'text-red-600' },
    { label: 'Late', count: 1, color: 'text-orange-600' },
    { label: 'On Leave', count: 1, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-900">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-in Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{record.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {record.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{record.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Attendance Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Attendance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Average Attendance', value: '94.2%', color: 'text-green-600' },
            { label: 'Total Working Days', value: '22', color: 'text-blue-600' },
            { label: 'Total Absences', value: '3', color: 'text-red-600' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">{item.label}</p>
              <p className={`text-3xl font-bold mt-2 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
