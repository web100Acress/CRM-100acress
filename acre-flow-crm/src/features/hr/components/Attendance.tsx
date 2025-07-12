
import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  MapPin,
  Phone,
  Calculator,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showSalaryCalculation, setShowSalaryCalculation] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const attendanceData = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      employeeId: 'EMP001',
      department: 'Sales',
      checkIn: '09:15',
      checkOut: '18:30',
      status: 'Present',
      totalHours: '9h 15m',
      overtime: '0h 15m',
      location: 'Office',
      basicSalary: 35000,
      workingDays: 26,
      presentDays: 24,
      absentDays: 2,
      paidLeave: 1,
      unpaidLeave: 1,
      performanceRating: 4.2
    },
    {
      id: 2,
      name: 'Priya Sharma',
      employeeId: 'EMP002',
      department: 'Marketing',
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'Present',
      totalHours: '9h 0m',
      overtime: '0h 0m',
      location: 'Office',
      basicSalary: 42000,
      workingDays: 26,
      presentDays: 25,
      absentDays: 1,
      paidLeave: 0,
      unpaidLeave: 1,
      performanceRating: 4.5
    },
    {
      id: 3,
      name: 'Vikash Singh',
      employeeId: 'EMP003',
      department: 'IT',
      checkIn: '10:30',
      checkOut: '19:45',
      status: 'Late',
      totalHours: '9h 15m',
      overtime: '0h 45m',
      location: 'Remote',
      basicSalary: 48000,
      workingDays: 26,
      presentDays: 23,
      absentDays: 3,
      paidLeave: 2,
      unpaidLeave: 1,
      performanceRating: 4.0
    }
  ];

  const attendanceStats = {
    totalEmployees: 125,
    present: 98,
    absent: 12,
    late: 8,
    onLeave: 7
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'half day': return '#3b82f6';
      case 'on leave': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'present': return CheckCircle;
      case 'absent': return XCircle;
      case 'late': return AlertCircle;
      case 'half day': return Clock;
      default: return AlertCircle;
    }
  };

  const calculateSalary = (employee) => {
    const dailySalary = employee.basicSalary / employee.workingDays;
    const effectiveWorkingDays = employee.presentDays + employee.paidLeave;
    const calculatedSalary = dailySalary * effectiveWorkingDays;
    const performanceBonus = (employee.performanceRating >= 4.0) ? calculatedSalary * 0.1 : 0;
    
    return {
      dailySalary: Math.round(dailySalary),
      effectiveWorkingDays,
      baseSalary: Math.round(calculatedSalary),
      performanceBonus: Math.round(performanceBonus),
      totalSalary: Math.round(calculatedSalary + performanceBonus),
      deductions: Math.round(dailySalary * employee.unpaidLeave)
    };
  };

  const handlePresentMark = (employeeId) => {
    const currentTime = new Date().toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Update attendance data with present status and check-in time
    console.log(`Employee ${employeeId} marked present at ${currentTime}`);
    // This would normally update the backend
  };

  const filteredAttendance = attendanceData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="attendance-container">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>Attendance Management</h2>
          <p>Track and manage employee attendance with salary calculations</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowSalaryCalculation(true)}>
            <Calculator size={20} />
            Calculate Salary
          </button>
          <button className="btn-secondary">
            <Download size={20} />
            Export Report
          </button>
          <div className="date-selector">
            <Calendar size={20} />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#3b82f6' + '20', color: '#3b82f6'}}>
            <User size={24} />
          </div>
          <div className="stat-content">
            <h3>{attendanceStats.totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#10b981' + '20', color: '#10b981'}}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{attendanceStats.present}</h3>
            <p>Present Today</p>
            <span className="percentage">{Math.round((attendanceStats.present / attendanceStats.totalEmployees) * 100)}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{attendanceStats.absent}</h3>
            <p>Absent Today</p>
            <span className="percentage">{Math.round((attendanceStats.absent / attendanceStats.totalEmployees) * 100)}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#f59e0b' + '20', color: '#f59e0b'}}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{attendanceStats.late}</h3>
            <p>Late Arrivals</p>
            <span className="percentage">{Math.round((attendanceStats.late / attendanceStats.totalEmployees) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Date Range Filter for Salary Calculation */}
      <div className="salary-filter-section">
        <h3>Monthly Salary Calculation Filter</h3>
        <div className="date-range-filters">
          <div className="filter-group">
            <label>From Date:</label>
            <input 
              type="date" 
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>To Date:</label>
            <input 
              type="date" 
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
          <button className="btn-primary">
            <Calculator size={20} />
            Calculate Period Salary
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={20} />
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Enhanced Attendance Table */}
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Present Days</th>
              <th>Absent Days</th>
              <th>Paid Leave</th>
              <th>Monthly Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(employee => {
              const StatusIcon = getStatusIcon(employee.status);
              const salaryData = calculateSalary(employee);
              return (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="employee-name">{employee.name}</div>
                        <div className="employee-id">{employee.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{employee.department}</td>
                  <td>
                    <span className={`time ${employee.checkIn === '-' ? 'no-time' : ''}`}>
                      {employee.checkIn}
                    </span>
                  </td>
                  <td>
                    <span className={`time ${employee.checkOut === '-' ? 'no-time' : ''}`}>
                      {employee.checkOut}
                    </span>
                  </td>
                  <td>
                    <div className="status-container">
                      <StatusIcon size={16} />
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(employee.status) + '20', 
                          color: getStatusColor(employee.status)
                        }}
                      >
                        {employee.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="performance-rating">
                      <span className="rating-value">{employee.performanceRating}/5</span>
                      <div className="rating-stars">
                        {'★'.repeat(Math.floor(employee.performanceRating))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="attendance-count present">{employee.presentDays}</span>
                  </td>
                  <td>
                    <span className="attendance-count absent">{employee.absentDays}</span>
                  </td>
                  <td>
                    <span className="attendance-count paid-leave">{employee.paidLeave}</span>
                  </td>
                  <td>
                    <div className="salary-info">
                      <span className="total-salary">₹{salaryData.totalSalary.toLocaleString()}</span>
                      <span className="base-salary">Base: ₹{salaryData.baseSalary.toLocaleString()}</span>
                      {salaryData.performanceBonus > 0 && (
                        <span className="bonus">Bonus: +₹{salaryData.performanceBonus.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn present"
                        onClick={() => handlePresentMark(employee.employeeId)}
                        title="Mark Present"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        className="action-btn view"
                        onClick={() => setSelectedEmployee(employee)}
                        title="View Details"
                      >
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="modal-backdrop" onClick={() => setSelectedEmployee(null)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Attendance & Salary Details - {selectedEmployee.name}</h3>
              <button className="close-btn" onClick={() => setSelectedEmployee(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="employee-details">
                <div className="detail-section">
                  <h4>Attendance Summary</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Total Working Days:</span>
                      <span className="value">{selectedEmployee.workingDays}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Present Days:</span>
                      <span className="value present">{selectedEmployee.presentDays}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Absent Days:</span>
                      <span className="value absent">{selectedEmployee.absentDays}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Paid Leave:</span>
                      <span className="value paid-leave">{selectedEmployee.paidLeave}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Unpaid Leave:</span>
                      <span className="value unpaid-leave">{selectedEmployee.unpaidLeave}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Salary Calculation</h4>
                  <div className="salary-breakdown">
                    {(() => {
                      const salaryData = calculateSalary(selectedEmployee);
                      return (
                        <div className="breakdown-items">
                          <div className="breakdown-item">
                            <span>Basic Salary (Monthly)</span>
                            <span>₹{selectedEmployee.basicSalary.toLocaleString()}</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Daily Salary Rate</span>
                            <span>₹{salaryData.dailySalary.toLocaleString()}</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Effective Working Days</span>
                            <span>{salaryData.effectiveWorkingDays} days</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Base Calculated Salary</span>
                            <span>₹{salaryData.baseSalary.toLocaleString()}</span>
                          </div>
                          {salaryData.performanceBonus > 0 && (
                            <div className="breakdown-item bonus">
                              <span>Performance Bonus (10%)</span>
                              <span>+₹{salaryData.performanceBonus.toLocaleString()}</span>
                            </div>
                          )}
                          {salaryData.deductions > 0 && (
                            <div className="breakdown-item deduction">
                              <span>Unpaid Leave Deduction</span>
                              <span>-₹{salaryData.deductions.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="breakdown-item total">
                            <span>Final Salary</span>
                            <span>₹{salaryData.totalSalary.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Performance Rating</h4>
                  <div className="performance-display">
                    <div className="rating-score">{selectedEmployee.performanceRating}/5.0</div>
                    <div className="rating-visual">
                      {'★'.repeat(Math.floor(selectedEmployee.performanceRating))}
                      {'☆'.repeat(5 - Math.floor(selectedEmployee.performanceRating))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .attendance-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .header-left p {
          margin: 0;
          color: #64748b;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .btn-primary {
          background: #ef4444;
          color: white;
        }

        .btn-primary:hover {
          background: #dc2626;
        }

        .date-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .date-selector input {
          border: none;
          outline: none;
          background: none;
          cursor: pointer;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: #1e293b;
        }

        .stat-content p {
          margin: 0 0 0.25rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .percentage {
          font-size: 0.8rem;
          font-weight: 600;
          color: #10b981;
        }

        .salary-filter-section {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .salary-filter-section h3 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .date-range-filters {
          display: flex;
          gap: 1rem;
          align-items: end;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
        }

        .filter-group input, .filter-group select {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
        }

        .filters-section {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
        }

        .attendance-table-container {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
        }

        .attendance-table th {
          background: #f8fafc;
          color: #374151;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.9rem;
        }

        .attendance-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
        }

        .employee-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .employee-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .employee-name {
          font-weight: 500;
          color: #1e293b;
        }

        .employee-id {
          font-size: 0.8rem;
          color: #64748b;
        }

        .time {
          font-family: 'Courier New', monospace;
          font-weight: 500;
        }

        .time.no-time {
          color: #9ca3af;
        }

        .status-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .performance-rating {
          text-align: center;
        }

        .rating-value {
          display: block;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .rating-stars {
          color: #fbbf24;
          font-size: 0.8rem;
        }

        .attendance-count {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .attendance-count.present {
          background: #dcfce7;
          color: #16a34a;
        }

        .attendance-count.absent {
          background: #fecaca;
          color: #dc2626;
        }

        .attendance-count.paid-leave {
          background: #dbeafe;
          color: #2563eb;
        }

        .salary-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .total-salary {
          font-weight: 700;
          color: #1e293b;
          font-size: 1rem;
        }

        .base-salary {
          font-size: 0.8rem;
          color: #64748b;
        }

        .bonus {
          font-size: 0.8rem;
          color: #10b981;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 35px;
          height: 35px;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-btn.present {
          background: #dcfce7;
          color: #16a34a;
        }

        .action-btn.view {
          background: #dbeafe;
          color: #3b82f6;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 1rem;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal.large {
          max-width: 900px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .employee-details {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .detail-section h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
          border-bottom: 2px solid #ef4444;
          padding-bottom: 0.5rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .detail-item .label {
          color: #64748b;
          font-weight: 500;
        }

        .detail-item .value {
          font-weight: 600;
          color: #1e293b;
        }

        .detail-item .value.present {
          color: #16a34a;
        }

        .detail-item .value.absent {
          color: #dc2626;
        }

        .detail-item .value.paid-leave {
          color: #2563eb;
        }

        .detail-item .value.unpaid-leave {
          color: #f59e0b;
        }

        .salary-breakdown {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.75rem;
        }

        .breakdown-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .breakdown-item.bonus {
          color: #16a34a;
          font-weight: 600;
        }

        .breakdown-item.deduction {
          color: #dc2626;
          font-weight: 600;
        }

        .breakdown-item.total {
          font-weight: 700;
          border-top: 2px solid #ef4444;
          border-bottom: 2px solid #ef4444;
          background: white;
          padding: 1rem;
          margin-top: 0.5rem;
          border-radius: 0.5rem;
          font-size: 1.1rem;
        }

        .performance-display {
          text-align: center;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 0.75rem;
        }

        .rating-score {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .rating-visual {
          font-size: 1.5rem;
          color: #fbbf24;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-actions {
            justify-content: stretch;
            flex-wrap: wrap;
          }
          
          .stats-cards {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .filters-section {
            flex-direction: column;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .attendance-table-container {
            overflow-x: auto;
          }
          
          .date-range-filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Attendance;