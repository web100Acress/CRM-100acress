
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter, 
  Users, 
  DollarSign, 
  Clock, 
  Award
} from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('dashboard');
  const [dateRange, setDateRange] = useState('this-month');

  // Sample data for charts
  const employeeGrowthData = [
    { month: 'Jan', employees: 100 },
    { month: 'Feb', employees: 108 },
    { month: 'Mar', employees: 115 },
    { month: 'Apr', employees: 120 },
    { month: 'May', employees: 125 },
    { month: 'Jun', employees: 128 }
  ];

  const departmentData = [
    { name: 'Sales', employees: 35, color: '#ef4444' },
    { name: 'Marketing', employees: 25, color: '#3b82f6' },
    { name: 'IT', employees: 30, color: '#10b981' },
    { name: 'HR', employees: 15, color: '#f59e0b' },
    { name: 'Finance', employees: 20, color: '#8b5cf6' }
  ];

  const salaryData = [
    { department: 'Sales', amount: 1500000 },
    { department: 'Marketing', amount: 1200000 },
    { department: 'IT', amount: 1800000 },
    { department: 'HR', amount: 800000 },
    { department: 'Finance', amount: 1000000 }
  ];

  const attendanceData = [
    { month: 'Jan', present: 95, absent: 5 },
    { month: 'Feb', present: 92, absent: 8 },
    { month: 'Mar', present: 96, absent: 4 },
    { month: 'Apr', present: 94, absent: 6 },
    { month: 'May', present: 97, absent: 3 },
    { month: 'Jun', present: 93, absent: 7 }
  ];

  const performanceData = [
    { rating: '5 Stars', count: 25 },
    { rating: '4 Stars', count: 40 },
    { rating: '3 Stars', count: 35 },
    { rating: '2 Stars', count: 15 },
    { rating: '1 Star', count: 10 }
  ];

  const reportTypes = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: TrendingUp },
    { id: 'employee', name: 'Employee Reports', icon: Users },
    { id: 'payroll', name: 'Payroll Reports', icon: DollarSign },
    { id: 'attendance', name: 'Attendance Reports', icon: Clock },
    { id: 'performance', name: 'Performance Reports', icon: Award }
  ];

  const renderDashboard = () => (
    <div className="dashboard-reports">
      <div className="charts-grid">
        {/* Employee Growth Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Employee Growth Trend</h3>
            <button className="export-btn">
              <Download size={16} />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={employeeGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="employees" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Department Distribution</h3>
            <button className="export-btn">
              <Download size={16} />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="employees"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Salary by Department */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Salary Distribution by Department</h3>
            <button className="export-btn">
              <Download size={16} />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trends */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Attendance Trends</h3>
            <button className="export-btn">
              <Download size={16} />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#10b981" />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <h3>Key HR Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
              <Users size={24} />
            </div>
            <div className="metric-content">
              <h4>Employee Turnover</h4>
              <p className="metric-value">8.5%</p>
              <span className="metric-change positive">-2.3% from last month</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{backgroundColor: '#10b981' + '20', color: '#10b981'}}>
              <Award size={24} />
            </div>
            <div className="metric-content">
              <h4>Average Performance</h4>
              <p className="metric-value">4.2/5</p>
              <span className="metric-change positive">+0.3 from last quarter</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{backgroundColor: '#3b82f6' + '20', color: '#3b82f6'}}>
              <Clock size={24} />
            </div>
            <div className="metric-content">
              <h4>Average Attendance</h4>
              <p className="metric-value">94.5%</p>
              <span className="metric-change neutral">Same as last month</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{backgroundColor: '#f59e0b' + '20', color: '#f59e0b'}}>
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <h4>Cost per Employee</h4>
              <p className="metric-value">₹36,543</p>
              <span className="metric-change positive">-5% from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeReports = () => (
    <div className="employee-reports">
      <div className="report-filters">
        <select>
          <option value="all">All Departments</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
          <option value="it">IT</option>
          <option value="hr">HR</option>
          <option value="finance">Finance</option>
        </select>
        <select>
          <option value="all">All Positions</option>
          <option value="executive">Executive</option>
          <option value="manager">Manager</option>
          <option value="senior">Senior</option>
          <option value="junior">Junior</option>
        </select>
      </div>

      <div className="report-tables">
        <div className="table-container">
          <h4>Employee Summary Report</h4>
          <table className="report-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Employees</th>
                <th>New Hires</th>
                <th>Resignations</th>
                <th>Avg Tenure</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sales</td>
                <td>35</td>
                <td>3</td>
                <td>2</td>
                <td>2.5 years</td>
              </tr>
              <tr>
                <td>Marketing</td>
                <td>25</td>
                <td>2</td>
                <td>1</td>
                <td>3.2 years</td>
              </tr>
              <tr>
                <td>IT</td>
                <td>30</td>
                <td>5</td>
                <td>3</td>
                <td>2.8 years</td>
              </tr>
              <tr>
                <td>HR</td>
                <td>15</td>
                <td>1</td>
                <td>0</td>
                <td>4.1 years</td>
              </tr>
              <tr>
                <td>Finance</td>
                <td>20</td>
                <td>2</td>
                <td>1</td>
                <td>3.5 years</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>Reports & Analytics</h2>
          <p>Comprehensive HR reports and data insights</p>
        </div>
        <div className="header-actions">
          <div className="date-range-selector">
            <Calendar size={20} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="last-year">Last Year</option>
            </select>
          </div>
          <button className="export-all-btn">
            <Download size={16} />
            Export All Reports
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="report-nav">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <button
              key={report.id}
              className={`nav-btn ${selectedReport === report.id ? 'active' : ''}`}
              onClick={() => setSelectedReport(report.id)}
            >
              <IconComponent size={20} />
              {report.name}
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="report-content">
        {selectedReport === 'dashboard' && renderDashboard()}
        {selectedReport === 'employee' && renderEmployeeReports()}
        {selectedReport === 'payroll' && (
          <div className="payroll-reports">
            <h3>Payroll Reports</h3>
            <p>Detailed payroll analysis and reports will be displayed here.</p>
          </div>
        )}
        {selectedReport === 'attendance' && (
          <div className="attendance-reports">
            <h3>Attendance Reports</h3>
            <p>Comprehensive attendance tracking and analysis will be displayed here.</p>
          </div>
        )}
        {selectedReport === 'performance' && (
          <div className="performance-reports">
            <h3>Performance Reports</h3>
            <p>Employee performance metrics and evaluations will be displayed here.</p>
          </div>
        )}
      </div>

      <style>{`
        .reports-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-left h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .header-left p {
          color: #6b7280;
          font-size: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .date-range-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
        }

        .date-range-selector select {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.9rem;
        }

        .export-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .export-all-btn:hover {
          background: #dc2626;
        }

        .report-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nav-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .nav-btn.active {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .report-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .chart-container {
          background: #f9fafb;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .chart-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .export-btn:hover {
          background: #4b5563;
        }

        .metrics-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .metric-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .metric-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-content h4 {
          font-size: 0.9rem;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .metric-change {
          font-size: 0.8rem;
        }

        .metric-change.positive {
          color: #10b981;
        }

        .metric-change.neutral {
          color: #6b7280;
        }

        .report-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .report-filters select {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          outline: none;
        }

        .table-container {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .table-container h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .report-table th {
          background: #f3f4f6;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .report-table td {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #1f2937;
        }

        .report-table tr:hover {
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .reports-container {
            padding: 1rem;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .report-nav {
            flex-direction: column;
          }

          .nav-btn {
            justify-content: center;
          }

          .report-filters {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;