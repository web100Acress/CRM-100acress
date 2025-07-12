
import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calculator,
  TrendingUp,
  User,
  Calendar
} from 'lucide-react';

const SalaryManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const salaryOverview = {
    totalPayroll: '₹45,67,890',
    totalEmployees: 125,
    avgSalary: '₹36,543',
    pendingApprovals: 8
  };

  const employees = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      employeeId: 'EMP001',
      department: 'Sales',
      position: 'Senior Sales Executive',
      basicSalary: 35000,
      hra: 14000,
      medicalAllowance: 1500,
      transportAllowance: 2000,
      bonus: 3000,
      overtime: 1500,
      pf: 4200,
      tax: 3500,
      grossSalary: 57000,
      netSalary: 49300,
      status: 'Paid',
      payDate: '2024-01-31'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      employeeId: 'EMP002',
      department: 'Marketing',
      position: 'Marketing Manager',
      basicSalary: 45000,
      hra: 18000,
      medicalAllowance: 1500,
      transportAllowance: 2500,
      bonus: 4000,
      overtime: 0,
      pf: 5400,
      tax: 5200,
      grossSalary: 71000,
      netSalary: 60400,
      status: 'Pending',
      payDate: ''
    },
    {
      id: 3,
      name: 'Vikash Singh',
      employeeId: 'EMP003',
      department: 'IT',
      position: 'Full Stack Developer',
      basicSalary: 50000,
      hra: 20000,
      medicalAllowance: 2000,
      transportAllowance: 3000,
      bonus: 5000,
      overtime: 2000,
      pf: 6000,
      tax: 6500,
      grossSalary: 82000,
      netSalary: 69500,
      status: 'Paid',
      payDate: '2024-01-31'
    }
  ];

  const payrollHistory = [
    {
      month: 'January 2024',
      totalAmount: '₹45,67,890',
      employeeCount: 125,
      processedDate: '2024-01-31',
      status: 'Completed'
    },
    {
      month: 'December 2023',
      totalAmount: '₹44,23,560',
      employeeCount: 123,
      processedDate: '2023-12-31',
      status: 'Completed'
    },
    {
      month: 'November 2023',
      totalAmount: '₹43,89,340',
      employeeCount: 122,
      processedDate: '2023-11-30',
      status: 'Completed'
    }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'processing': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const handleViewSalaryDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="salary-management">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>Salary Management</h2>
          <p>Manage employee salaries and payroll processing</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={20} />
            Export Payroll
          </button>
          <button className="btn-primary" onClick={() => setShowPayrollModal(true)}>
            <Plus size={20} />
            Process Payroll
          </button>
        </div>
      </div>

      {/* Salary Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
            <DollarSign size={24} />
          </div>
          <div className="card-content">
            <h3>{salaryOverview.totalPayroll}</h3>
            <p>Monthly Payroll</p>
            <span className="trend positive">+8.5%</span>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#3b82f6' + '20', color: '#3b82f6'}}>
            <User size={24} />
          </div>
          <div className="card-content">
            <h3>{salaryOverview.totalEmployees}</h3>
            <p>Total Employees</p>
            <span className="trend positive">+3</span>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#10b981' + '20', color: '#10b981'}}>
            <Calculator size={24} />
          </div>
          <div className="card-content">
            <h3>{salaryOverview.avgSalary}</h3>
            <p>Average Salary</p>
            <span className="trend positive">+5.2%</span>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#f59e0b' + '20', color: '#f59e0b'}}>
            <Clock size={24} />
          </div>
          <div className="card-content">
            <h3>{salaryOverview.pendingApprovals}</h3>
            <p>Pending Approvals</p>
            <span className="trend negative">-2</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={20} />
          Salary Overview
        </button>
        <button 
          className={`tab ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          <Calendar size={20} />
          Payroll History
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' ? (
        <div className="salary-overview-section">
          {/* Search and Filter */}
          <div className="filters-section">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input type="text" placeholder="Search employees..." />
            </div>
            <div className="filter-group">
              <Filter size={20} />
              <select>
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Employee Salary Table */}
          <div className="salary-table-container">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Basic Salary</th>
                  <th>Gross Salary</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
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
                    <td>₹{employee.basicSalary.toLocaleString()}</td>
                    <td>₹{employee.grossSalary.toLocaleString()}</td>
                    <td>₹{employee.netSalary.toLocaleString()}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{backgroundColor: getStatusColor(employee.status) + '20', color: getStatusColor(employee.status)}}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view"
                          onClick={() => handleViewSalaryDetails(employee)}
                        >
                          <Eye size={16} />
                        </button>
                        <button className="action-btn edit">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="payroll-history-section">
          <div className="payroll-cards">
            {payrollHistory.map((payroll, index) => (
              <div key={index} className="payroll-card">
                <div className="payroll-header">
                  <h3>{payroll.month}</h3>
                  <span 
                    className="status-badge"
                    style={{backgroundColor: getStatusColor(payroll.status) + '20', color: getStatusColor(payroll.status)}}
                  >
                    {payroll.status}
                  </span>
                </div>
                
                <div className="payroll-details">
                  <div className="detail-item">
                    <span className="label">Total Amount:</span>
                    <span className="value">{payroll.totalAmount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Employees:</span>
                    <span className="value">{payroll.employeeCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Processed Date:</span>
                    <span className="value">{payroll.processedDate}</span>
                  </div>
                </div>
                
                <div className="payroll-actions">
                  <button className="action-btn view">
                    <Eye size={16} />
                    View Details
                  </button>
                  <button className="action-btn download">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Details Modal */}
      {selectedEmployee && (
        <div className="modal-backdrop" onClick={() => setSelectedEmployee(null)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Salary Details - {selectedEmployee.name}</h3>
              <button className="close-btn" onClick={() => setSelectedEmployee(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="salary-breakdown">
                <div className="breakdown-section">
                  <h4>Earnings</h4>
                  <div className="breakdown-items">
                    <div className="breakdown-item">
                      <span>Basic Salary</span>
                      <span>₹{selectedEmployee.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>HRA (40%)</span>
                      <span>₹{selectedEmployee.hra.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Medical Allowance</span>
                      <span>₹{selectedEmployee.medicalAllowance.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Transport Allowance</span>
                      <span>₹{selectedEmployee.transportAllowance.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Bonus</span>
                      <span>₹{selectedEmployee.bonus.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Overtime</span>
                      <span>₹{selectedEmployee.overtime.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item total">
                      <span>Gross Salary</span>
                      <span>₹{selectedEmployee.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="breakdown-section">
                  <h4>Deductions</h4>
                  <div className="breakdown-items">
                    <div className="breakdown-item">
                      <span>Provident Fund (12%)</span>
                      <span>₹{selectedEmployee.pf.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item">
                      <span>Income Tax</span>
                      <span>₹{selectedEmployee.tax.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-item total">
                      <span>Total Deductions</span>
                      <span>₹{(selectedEmployee.pf + selectedEmployee.tax).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="net-salary">
                  <h3>Net Salary: ₹{selectedEmployee.netSalary.toLocaleString()}</h3>
                </div>

                <div className="salary-actions">
                  <button className="btn-primary">
                    <Download size={16} />
                    Download Payslip
                  </button>
                  <button className="btn-secondary">
                    <Edit size={16} />
                    Edit Salary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Payroll Modal */}
      {showPayrollModal && (
        <div className="modal-backdrop" onClick={() => setShowPayrollModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Process Monthly Payroll</h3>
              <button className="close-btn" onClick={() => setShowPayrollModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="payroll-process">
                <div className="form-group">
                  <label>Select Month</label>
                  <input type="month" defaultValue="2024-02" />
                </div>
                
                <div className="form-group">
                  <label>Include Bonus</label>
                  <input type="checkbox" /> Performance Bonus
                </div>
                
                <div className="form-group">
                  <label>Include Overtime</label>
                  <input type="checkbox" /> Overtime Hours
                </div>
                
                <div className="payroll-summary">
                  <h4>Payroll Summary</h4>
                  <div className="summary-item">
                    <span>Total Employees:</span>
                    <span>125</span>
                  </div>
                  <div className="summary-item">
                    <span>Estimated Amount:</span>
                    <span>₹46,50,000</span>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setShowPayrollModal(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary">
                    Process Payroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .salary-management {
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
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #ef4444;
          color: white;
        }

        .btn-primary:hover {
          background: #dc2626;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .overview-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .overview-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: #1e293b;
        }

        .card-content p {
          margin: 0 0 0.25rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .trend {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .trend.positive {
          color: #10b981;
        }

        .trend.negative {
          color: #ef4444;
        }

        .tabs-container {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab.active {
          color: #ef4444;
          border-bottom-color: #ef4444;
        }

        .filters-section {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
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

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .filter-group select {
          border: none;
          outline: none;
          background: none;
          cursor: pointer;
        }

        .salary-table-container {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .salary-table {
          width: 100%;
          border-collapse: collapse;
        }

        .salary-table th {
          background: #f8fafc;
          color: #374151;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .salary-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
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

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
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

        .action-btn.view {
          background: #dbeafe;
          color: #3b82f6;
        }

        .action-btn.edit {
          background: #fef3c7;
          color: #d97706;
        }

        .action-btn.download {
          background: #dcfce7;
          color: #16a34a;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .payroll-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .payroll-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .payroll-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .payroll-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .payroll-details {
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-item .label {
          color: #64748b;
        }

        .detail-item .value {
          font-weight: 500;
          color: #1e293b;
        }

        .payroll-actions {
          display: flex;
          gap: 0.5rem;
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
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal.large {
          max-width: 800px;
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

        .salary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .breakdown-section h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
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
          border-bottom: 1px solid #f1f5f9;
        }

        .breakdown-item.total {
          font-weight: 600;
          border-top: 2px solid #e5e7eb;
          border-bottom: 2px solid #e5e7eb;
          background: #f8fafc;
          padding: 1rem;
          margin-top: 0.5rem;
        }

        .net-salary {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-radius: 1rem;
        }

        .net-salary h3 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .salary-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input[type="month"] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .payroll-summary {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin: 1rem 0;
        }

        .payroll-summary h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-actions {
            justify-content: stretch;
          }
          
          .overview-cards {
            grid-template-columns: 1fr;
          }
          
          .filters-section {
            flex-direction: column;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .salary-table-container {
            overflow-x: auto;
          }
          
          .payroll-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SalaryManagement;