
import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Receipt,
  User,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react';

const ExpenseManagement = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const expenseData = [
    {
      id: 1,
      employeeName: 'Rajesh Kumar',
      employeeId: 'EMP001',
      category: 'Travel',
      description: 'Client meeting in Mumbai',
      amount: 8500,
      date: '2024-01-20',
      status: 'Pending',
      receipts: ['receipt1.pdf'],
      approver: 'Amit Sharma',
      submittedDate: '2024-01-21'
    },
    {
      id: 2,
      employeeName: 'Priya Sharma',
      employeeId: 'EMP002',
      category: 'Marketing',
      description: 'Digital advertising campaign',
      amount: 15000,
      date: '2024-01-18',
      status: 'Approved',
      receipts: ['receipt2.pdf', 'invoice.pdf'],
      approver: 'Ravi Gupta',
      submittedDate: '2024-01-19',
      approvedDate: '2024-01-22'
    },
    {
      id: 3,
      employeeName: 'Vikash Singh',
      employeeId: 'EMP003',
      category: 'Equipment',
      description: 'New laptop for development',
      amount: 75000,
      date: '2024-01-15',
      status: 'Approved',
      receipts: ['laptop_invoice.pdf'],
      approver: 'Tech Lead',
      submittedDate: '2024-01-16',
      approvedDate: '2024-01-17'
    },
    {
      id: 4,
      employeeName: 'Sneha Patel',
      employeeId: 'EMP004',
      category: 'Training',
      description: 'HR certification course',
      amount: 12000,
      date: '2024-01-10',
      status: 'Rejected',
      receipts: ['course_fee.pdf'],
      approver: 'HR Manager',
      submittedDate: '2024-01-11',
      rejectedDate: '2024-01-12',
      rejectionReason: 'Budget exceeded for training this quarter'
    },
    {
      id: 5,
      employeeName: 'Mohammad Ali',
      employeeId: 'EMP005',
      category: 'Office Supplies',
      description: 'Stationery and office materials',
      amount: 2500,
      date: '2024-01-25',
      status: 'Pending',
      receipts: ['supplies_receipt.pdf'],
      approver: 'Finance Head',
      submittedDate: '2024-01-25'
    }
  ];

  const expenseCategories = [
    'Travel',
    'Marketing',
    'Equipment',
    'Training',
    'Office Supplies',
    'Entertainment',
    'Communication',
    'Software',
    'Maintenance',
    'Other'
  ];

  const expenseStats = {
    totalExpenses: expenseData.reduce((sum, exp) => sum + exp.amount, 0),
    pendingExpenses: expenseData.filter(exp => exp.status === 'Pending').length,
    approvedExpenses: expenseData.filter(exp => exp.status === 'Approved').length,
    rejectedExpenses: expenseData.filter(exp => exp.status === 'Rejected').length
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="expense-management">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>Expense Management</h2>
          <p>Track and manage employee expense claims</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={20} />
            Export Report
          </button>
          <button className="btn-primary" onClick={() => setShowAddExpenseModal(true)}>
            <Plus size={20} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Expense Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{expenseStats.totalExpenses.toLocaleString()}</h3>
            <p>Total Expenses</p>
            <span className="period">This Month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#f59e0b' + '20', color: '#f59e0b'}}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{expenseStats.pendingExpenses}</h3>
            <p>Pending Approval</p>
            <span className="period">Awaiting Review</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#10b981' + '20', color: '#10b981'}}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{expenseStats.approvedExpenses}</h3>
            <p>Approved</p>
            <span className="period">Ready for Payment</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{expenseStats.rejectedExpenses}</h3>
            <p>Rejected</p>
            <span className="period">Need Review</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search expenses..." />
        </div>
        
        <div className="filter-group">
          <Filter size={20} />
          <select>
            <option value="all">All Categories</option>
            {expenseCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <select>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="expenses-table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenseData.map(expense => {
              const StatusIcon = getStatusIcon(expense.status);
              return (
                <tr key={expense.id}>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {expense.employeeName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="employee-name">{expense.employeeName}</div>
                        <div className="employee-id">{expense.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">{expense.category}</span>
                  </td>
                  <td className="description">{expense.description}</td>
                  <td className="amount">₹{expense.amount.toLocaleString()}</td>
                  <td>{expense.date}</td>
                  <td>
                    <div className="status-container">
                      <StatusIcon size={16} />
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(expense.status) + '20', 
                          color: getStatusColor(expense.status)
                        }}
                      >
                        {expense.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => setSelectedExpense(expense)}
                      >
                        <Eye size={16} />
                      </button>
                      {expense.status === 'Pending' && (
                        <>
                          <button className="action-btn approve">
                            <CheckCircle size={16} />
                          </button>
                          <button className="action-btn reject">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="modal-backdrop" onClick={() => setSelectedExpense(null)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Expense Details</h3>
              <button className="close-btn" onClick={() => setSelectedExpense(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="expense-detail">
                <div className="detail-header">
                  <div className="employee-info">
                    <div className="employee-avatar large">
                      {selectedExpense.employeeName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{selectedExpense.employeeName}</h3>
                      <p>{selectedExpense.employeeId}</p>
                    </div>
                  </div>
                  <div className="status-section">
                    <span 
                      className="status-badge large"
                      style={{
                        backgroundColor: getStatusColor(selectedExpense.status) + '20', 
                        color: getStatusColor(selectedExpense.status)
                      }}
                    >
                      {selectedExpense.status}
                    </span>
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-group">
                    <label>Category</label>
                    <p>{selectedExpense.category}</p>
                  </div>
                  <div className="detail-group">
                    <label>Amount</label>
                    <p className="amount">₹{selectedExpense.amount.toLocaleString()}</p>
                  </div>
                  <div className="detail-group">
                    <label>Expense Date</label>
                    <p>{selectedExpense.date}</p>
                  </div>
                  <div className="detail-group">
                    <label>Submitted Date</label>
                    <p>{selectedExpense.submittedDate}</p>
                  </div>
                  <div className="detail-group">
                    <label>Approver</label>
                    <p>{selectedExpense.approver}</p>
                  </div>
                  {selectedExpense.approvedDate && (
                    <div className="detail-group">
                      <label>Approved Date</label>
                      <p>{selectedExpense.approvedDate}</p>
                    </div>
                  )}
                  {selectedExpense.rejectedDate && (
                    <div className="detail-group">
                      <label>Rejected Date</label>
                      <p>{selectedExpense.rejectedDate}</p>
                    </div>
                  )}
                </div>

                <div className="detail-group full-width">
                  <label>Description</label>
                  <p>{selectedExpense.description}</p>
                </div>

                {selectedExpense.rejectionReason && (
                  <div className="detail-group full-width">
                    <label>Rejection Reason</label>
                    <p className="rejection-reason">{selectedExpense.rejectionReason}</p>
                  </div>
                )}

                <div className="receipts-section">
                  <label>Receipts & Documents</label>
                  <div className="receipts-list">
                    {selectedExpense.receipts.map((receipt, index) => (
                      <div key={index} className="receipt-item">
                        <Receipt size={16} />
                        <span>{receipt}</span>
                        <button className="download-btn">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedExpense.status === 'Pending' && (
                  <div className="approval-actions">
                    <button className="btn-approve">
                      <CheckCircle size={16} />
                      Approve Expense
                    </button>
                    <button className="btn-reject">
                      <XCircle size={16} />
                      Reject Expense
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="modal-backdrop" onClick={() => setShowAddExpenseModal(false)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Expense</h3>
              <button className="close-btn" onClick={() => setShowAddExpenseModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <form className="expense-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employee</label>
                    <select>
                      <option value="">Select Employee</option>
                      <option value="emp1">Rajesh Kumar</option>
                      <option value="emp2">Priya Sharma</option>
                      <option value="emp3">Vikash Singh</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select>
                      <option value="">Select Category</option>
                      {expenseCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="form-group">
                    <label>Expense Date</label>
                    <input type="date" />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea placeholder="Enter expense description" rows={3}></textarea>
                  </div>
                  <div className="form-group full-width">
                    <label>Upload Receipts</label>
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" />
                    <p className="form-hint">Upload receipts and supporting documents</p>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddExpenseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .expense-management {
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

        .period {
          font-size: 0.8rem;
          color: #9ca3af;
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

        .expenses-table-container {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .expenses-table {
          width: 100%;
          border-collapse: collapse;
        }

        .expenses-table th {
          background: #f8fafc;
          color: #374151;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .expenses-table td {
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

        .employee-avatar.large {
          width: 60px;
          height: 60px;
          font-size: 1.5rem;
        }

        .employee-name {
          font-weight: 500;
          color: #1e293b;
        }

        .employee-id {
          font-size: 0.8rem;
          color: #64748b;
        }

        .category-tag {
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .description {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .amount {
          font-weight: 600;
          color: #1e293b;
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

        .status-badge.large {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
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

        .action-btn.approve {
          background: #dcfce7;
          color: #16a34a;
        }

        .action-btn.reject {
          background: #fee2e2;
          color: #ef4444;
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

        .expense-detail {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-header .employee-info h3 {
          margin: 0 0 0.25rem 0;
          color: #1e293b;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .detail-header .employee-info p {
          margin: 0;
          color: #64748b;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .detail-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-group.full-width {
          grid-column: 1 / -1;
        }

        .detail-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .detail-group p {
          margin: 0;
          color: #6b7280;
        }

        .rejection-reason {
          color: #ef4444;
          font-style: italic;
        }

        .receipts-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .receipts-section label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .receipts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .receipt-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .download-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #3b82f6;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
        }

        .download-btn:hover {
          background: #dbeafe;
        }

        .approval-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-approve, .btn-reject {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-approve {
          background: #16a34a;
          color: white;
        }

        .btn-approve:hover {
          background: #15803d;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-reject:hover {
          background: #dc2626;
        }

        .expense-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
        }

        .form-hint {
          font-size: 0.8rem;
          color: #6b7280;
          margin: 0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          
          .filters-section {
            flex-direction: column;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .expenses-table-container {
            overflow-x: auto;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .approval-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpenseManagement;