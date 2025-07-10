import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  DollarSign
} from 'lucide-react';

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const employees = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      employeeId: 'EMP001',
      email: 'rajesh@company.com',
      phone: '+91 9876543210',
      department: 'Sales',
      position: 'Senior Sales Executive',
      joiningDate: '2023-01-15',
      salary: 45000,
      status: 'Active',
      address: '123 Main St, Mumbai',
      avatar: 'R'
    }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="employee-management">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>Employee Management</h2>
          <p>Manage employee information and track employee lifecycle</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={20} />
            Export Data
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#3b82f6' + '20', color: '#3b82f6'}}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{employees.length}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#10b981' + '20', color: '#10b981'}}>
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>{employees.filter(emp => emp.status === 'Active').length}</h3>
            <p>Active Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#f59e0b' + '20', color: '#f59e0b'}}>
            <Building size={24} />
          </div>
          <div className="stat-content">
            <h3>{employees.length}</h3>
            <p>Departments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>₹45,67,890</h3>
            <p>Total Salary</p>
          </div>
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

      {/* Employee Table */}
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {employee.avatar}
                    </div>
                    <div>
                      <div className="employee-name">{employee.name}</div>
                      <div className="employee-id">{employee.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>₹{employee.salary.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="action-btn edit">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="modal-backdrop" onClick={() => setSelectedEmployee(null)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Details - {selectedEmployee.name}</h3>
              <button className="close-btn" onClick={() => setSelectedEmployee(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="employee-details">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Name:</span>
                      <span className="value">{selectedEmployee.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Employee ID:</span>
                      <span className="value">{selectedEmployee.employeeId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Email:</span>
                      <span className="value">{selectedEmployee.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedEmployee.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Address:</span>
                      <span className="value">{selectedEmployee.address}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Company Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Department:</span>
                      <span className="value">{selectedEmployee.department}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Position:</span>
                      <span className="value">{selectedEmployee.position}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Joining Date:</span>
                      <span className="value">{selectedEmployee.joiningDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Salary:</span>
                      <span className="value">₹{selectedEmployee.salary.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status:</span>
                      <span className="value">{selectedEmployee.status}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-actions">
                  <button className="btn-secondary">
                    <Mail size={16} />
                    Send Email
                  </button>
                  <button className="btn-secondary">
                    <Phone size={16} />
                    Call Employee
                  </button>
                  <button className="btn-primary">
                    <Edit size={16} />
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="employee-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Enter name" />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input type="text" placeholder="Enter employee ID" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter email" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="Enter phone number" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="it">IT</option>
                    <option value="hr">HR</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input type="text" placeholder="Enter position" />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input type="number" placeholder="Enter salary" />
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary">
                    Add Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .employee-management {
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

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .employee-table-container {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .employee-table {
          width: 100%;
          border-collapse: collapse;
        }

        .employee-table th {
          background: #f8fafc;
          color: #374151;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .employee-table td {
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

        .status-badge.active {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .status-badge.inactive {
          background-color: #fecaca;
          color: #dc2626;
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

        .action-btn.delete {
          background: #fecaca;
          color: #dc2626;
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .detail-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .employee-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
        }

        .form-group input, .form-group select {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-actions {
            justify-content: stretch;
          }
          
          .stats-cards {
            grid-template-columns: 1fr;
          }
          
          .filters-section {
            flex-direction: column;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .employee-table-container {
            overflow-x: auto;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeManagement;