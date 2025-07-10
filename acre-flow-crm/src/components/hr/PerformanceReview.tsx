
import React, { useState } from 'react';
import { 
  Award, 
  Star, 
  TrendingUp, 
  User, 
  Calendar, 
  Target, 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

const PerformanceReview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const performanceOverview = {
    totalReviews: 45,
    completed: 32,
    pending: 8,
    overdue: 5,
    avgRating: 4.2
  };

  const employees = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      employeeId: 'EMP001',
      department: 'Sales',
      position: 'Senior Sales Executive',
      manager: 'Amit Sharma',
      lastReview: '2023-12-15',
      nextReview: '2024-06-15',
      currentRating: 4.5,
      status: 'Completed',
      goals: [
        { title: 'Achieve 120% of sales target', progress: 95, status: 'In Progress' },
        { title: 'Complete CRM training', progress: 100, status: 'Completed' },
        { title: 'Mentor 2 junior executives', progress: 60, status: 'In Progress' }
      ],
      strengths: ['Excellent communication', 'Strong sales skills', 'Team leadership'],
      improvements: ['Time management', 'Technical knowledge'],
      overallScore: 4.5
    },
    {
      id: 2,
      name: 'Priya Sharma',
      employeeId: 'EMP002',
      department: 'Marketing',
      position: 'Marketing Manager',
      manager: 'Ravi Gupta',
      lastReview: '2024-01-10',
      nextReview: '2024-07-10',
      currentRating: 4.8,
      status: 'Completed',
      goals: [
        { title: 'Launch 3 digital campaigns', progress: 100, status: 'Completed' },
        { title: 'Increase brand awareness by 25%', progress: 80, status: 'In Progress' },
        { title: 'Lead generation improvement', progress: 90, status: 'In Progress' }
      ],
      strengths: ['Creative thinking', 'Strategic planning', 'Digital marketing'],
      improvements: ['Budget management', 'Team coordination'],
      overallScore: 4.8
    },
    {
      id: 3,
      name: 'Vikash Singh',
      employeeId: 'EMP003',
      department: 'IT',
      position: 'Full Stack Developer',
      manager: 'Tech Lead',
      lastReview: '2023-11-20',
      nextReview: '2024-05-20',
      currentRating: 4.2,
      status: 'Pending',
      goals: [
        { title: 'Complete React certification', progress: 70, status: 'In Progress' },
        { title: 'Optimize application performance', progress: 85, status: 'In Progress' },
        { title: 'Code review participation', progress: 100, status: 'Completed' }
      ],
      strengths: ['Problem solving', 'Technical skills', 'Code quality'],
      improvements: ['Communication', 'Project management'],
      overallScore: 4.2
    }
  ];

  const reviewTemplates = [
    {
      id: 1,
      name: 'Annual Performance Review',
      frequency: 'Yearly',
      sections: ['Goals Achievement', 'Skills Assessment', 'Behavioral Review', 'Career Development']
    },
    {
      id: 2,
      name: 'Quarterly Check-in',
      frequency: 'Quarterly',
      sections: ['Goal Progress', 'Feedback', 'Support Needed']
    },
    {
      id: 3,
      name: 'Probation Review',
      frequency: 'One-time',
      sections: ['Performance Assessment', 'Cultural Fit', 'Recommendation']
    }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      case 'in progress': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const renderStarRating = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={16} 
            className={star <= rating ? 'star-filled' : 'star-empty'}
          />
        ))}
        <span className="rating-number">({rating})</span>
      </div>
    );
  };

  return (
    <div className="performance-review">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>Performance Reviews</h2>
          <p>Manage employee performance evaluations and feedback</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddReviewModal(true)}>
          <Plus size={20} />
          Create Review
        </button>
      </div>

      {/* Performance Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#3b82f6' + '20', color: '#3b82f6'}}>
            <Award size={24} />
          </div>
          <div className="card-content">
            <h3>{performanceOverview.totalReviews}</h3>
            <p>Total Reviews</p>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#10b981' + '20', color: '#10b981'}}>
            <CheckCircle size={24} />
          </div>
          <div className="card-content">
            <h3>{performanceOverview.completed}</h3>
            <p>Completed</p>
            <span className="percentage">{Math.round((performanceOverview.completed / performanceOverview.totalReviews) * 100)}%</span>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#f59e0b' + '20', color: '#f59e0b'}}>
            <Clock size={24} />
          </div>
          <div className="card-content">
            <h3>{performanceOverview.pending}</h3>
            <p>Pending</p>
            <span className="percentage">{Math.round((performanceOverview.pending / performanceOverview.totalReviews) * 100)}%</span>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
            <AlertCircle size={24} />
          </div>
          <div className="card-content">
            <h3>{performanceOverview.overdue}</h3>
            <p>Overdue</p>
            <span className="percentage">{Math.round((performanceOverview.overdue / performanceOverview.totalReviews) * 100)}%</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon" style={{backgroundColor: '#ef4444' + '20', color: '#ef4444'}}>
            <Star size={24} />
          </div>
          <div className="card-content">
            <h3>{performanceOverview.avgRating}</h3>
            <p>Average Rating</p>
            {renderStarRating(performanceOverview.avgRating)}
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
          Employee Reviews
        </button>
        <button 
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Target size={20} />
          Review Templates
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' ? (
        <div className="employee-reviews-section">
          <div className="reviews-grid">
            {employees.map(employee => (
              <div key={employee.id} className="review-card">
                <div className="employee-header">
                  <div className="employee-avatar">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="employee-info">
                    <h3>{employee.name}</h3>
                    <p>{employee.position}</p>
                    <span className="department">{employee.department}</span>
                  </div>
                  <span 
                    className="status-badge"
                    style={{backgroundColor: getStatusColor(employee.status) + '20', color: getStatusColor(employee.status)}}
                  >
                    {employee.status}
                  </span>
                </div>

                <div className="review-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Last Review: {employee.lastReview}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Next Review: {employee.nextReview}</span>
                  </div>
                  <div className="detail-item">
                    <User size={16} />
                    <span>Manager: {employee.manager}</span>
                  </div>
                </div>

                <div className="rating-section">
                  <h4>Current Rating</h4>
                  {renderStarRating(employee.currentRating)}
                </div>

                <div className="goals-preview">
                  <h4>Goals Progress</h4>
                  <div className="goals-list">
                    {employee.goals.slice(0, 2).map((goal, index) => (
                      <div key={index} className="goal-item">
                        <span className="goal-title">{goal.title}</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${goal.progress}%`}}
                          ></div>
                        </div>
                        <span className="progress-text">{goal.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-actions">
                  <button 
                    className="action-btn view"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button className="action-btn edit">
                    <Edit size={16} />
                    Edit Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="templates-section">
          <div className="templates-grid">
            {reviewTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <h3>{template.name}</h3>
                  <span className="frequency-badge">{template.frequency}</span>
                </div>
                
                <div className="template-sections">
                  <h4>Review Sections:</h4>
                  <ul>
                    {template.sections.map((section, index) => (
                      <li key={index}>{section}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="template-actions">
                  <button className="action-btn primary">
                    Use Template
                  </button>
                  <button className="action-btn secondary">
                    Edit Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="modal-backdrop" onClick={() => setSelectedEmployee(null)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Performance Review - {selectedEmployee.name}</h3>
              <button className="close-btn" onClick={() => setSelectedEmployee(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="employee-profile">
                <div className="profile-avatar">
                  {selectedEmployee.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h2>{selectedEmployee.name}</h2>
                  <p>{selectedEmployee.position} - {selectedEmployee.department}</p>
                  <div className="overall-rating">
                    <span>Overall Score: </span>
                    {renderStarRating(selectedEmployee.overallScore)}
                  </div>
                </div>
              </div>

              <div className="review-sections">
                <div className="section">
                  <h4>Goals & Objectives</h4>
                  <div className="goals-detailed">
                    {selectedEmployee.goals.map((goal, index) => (
                      <div key={index} className="goal-detail">
                        <div className="goal-header">
                          <span className="goal-title">{goal.title}</span>
                          <span 
                            className="goal-status"
                            style={{backgroundColor: getStatusColor(goal.status) + '20', color: getStatusColor(goal.status)}}
                          >
                            {goal.status}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${goal.progress}%`}}
                          ></div>
                        </div>
                        <span className="progress-text">{goal.progress}% Complete</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section">
                  <h4>Strengths</h4>
                  <div className="tags-container">
                    {selectedEmployee.strengths.map((strength, index) => (
                      <span key={index} className="tag positive">{strength}</span>
                    ))}
                  </div>
                </div>

                <div className="section">
                  <h4>Areas for Improvement</h4>
                  <div className="tags-container">
                    {selectedEmployee.improvements.map((improvement, index) => (
                      <span key={index} className="tag improvement">{improvement}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-primary">
                  <Edit size={16} />
                  Edit Review
                </button>
                <button className="btn-secondary">
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="modal-backdrop" onClick={() => setShowAddReviewModal(false)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Performance Review</h3>
              <button className="close-btn" onClick={() => setShowAddReviewModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <form className="review-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employee</label>
                    <select>
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Review Template</label>
                    <select>
                      <option value="">Select Template</option>
                      {reviewTemplates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Review Period</label>
                    <select>
                      <option value="q1-2024">Q1 2024</option>
                      <option value="q2-2024">Q2 2024</option>
                      <option value="annual-2024">Annual 2024</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input type="date" />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddReviewModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .performance-review {
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

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #dc2626;
        }

        .overview-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
          transition: transform 0.2s ease;
        }

        .overview-card:hover {
          transform: translateY(-2px);
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

        .percentage {
          font-size: 0.8rem;
          font-weight: 600;
          color: #10b981;
        }

        .star-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .star-filled {
          color: #fbbf24;
          fill: #fbbf24;
        }

        .star-empty {
          color: #d1d5db;
        }

        .rating-number {
          font-size: 0.8rem;
          color: #6b7280;
          margin-left: 0.25rem;
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

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .review-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .review-card:hover {
          transform: translateY(-2px);
        }

        .employee-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          position: relative;
        }

        .employee-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .employee-info h3 {
          margin: 0 0 0.25rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .employee-info p {
          margin: 0 0 0.25rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .department {
          font-size: 0.8rem;
          color: #ef4444;
          font-weight: 500;
        }

        .status-badge {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .review-details {
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .rating-section {
          margin-bottom: 1rem;
        }

        .rating-section h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .goals-preview {
          margin-bottom: 1rem;
        }

        .goals-preview h4 {
          margin: 0 0 0.75rem 0;
          color: #374151;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .goals-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .goal-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
        }

        .goal-title {
          flex: 1;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .progress-bar {
          width: 60px;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #ef4444;
          transition: width 0.3s ease;
        }

        .progress-text {
          color: #6b7280;
          font-weight: 500;
          min-width: 35px;
        }

        .review-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
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

        .action-btn.primary {
          background: #ef4444;
          color: white;
          flex: 1;
        }

        .action-btn.secondary {
          background: #f3f4f6;
          color: #374151;
          flex: 1;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .template-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .template-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .frequency-badge {
          padding: 0.25rem 0.75rem;
          background: #eff6ff;
          color: #3b82f6;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .template-sections h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .template-sections ul {
          margin: 0 0 1.5rem 0;
          padding-left: 1rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .template-sections li {
          margin-bottom: 0.25rem;
        }

        .template-actions {
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

        .employee-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 2rem;
        }

        .profile-info h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .profile-info p {
          margin: 0 0 0.5rem 0;
          color: #64748b;
        }

        .overall-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .review-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .section h4 {
          margin: 0 0 1rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .goals-detailed {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .goal-detail {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .goal-status {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .tag.positive {
          background: #dcfce7;
          color: #16a34a;
        }

        .tag.improvement {
          background: #fef3c7;
          color: #d97706;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-secondary {
          padding: 0.75rem 1.5rem;
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .review-form {
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

        .form-group label {
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
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
          
          .overview-cards {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .reviews-grid, .templates-grid {
            grid-template-columns: 1fr;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .employee-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .status-badge {
            position: static;
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default PerformanceReview;