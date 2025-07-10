
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MessageSquare,
  Download,
  Edit,
  Send
} from 'lucide-react';

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Real Estate Sales Executive',
      department: 'Sales',
      location: 'Noida, UP',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹40,000 - ₹60,000',
      applicants: 25,
      status: 'Active',
      postedDate: '2024-01-10',
      deadline: '2024-02-10',
    }
  ];

  const applications = [
    {
      id: 1,
      name: 'Amit Gupta',
      email: 'amit.gupta@email.com',
      phone: '+91 9876543210',
      position: 'Senior Real Estate Sales Executive',
      department: 'Sales',
      experience: '4 years',
      location: 'Noida, UP',
      appliedDate: '2024-01-12',
      status: 'Application Received',
      source: 'Website',
      resume: 'amit_gupta_resume.pdf',
      skills: ['Sales', 'Real Estate', 'Customer Relations', 'Property Management'],
      recruitmentStage: 'screening',
      followups: [
        { date: '2024-01-13', note: 'Initial screening call scheduled' },
        { date: '2024-01-15', note: 'Screening completed, moved to interview' }
      ],
      communications: [
        { type: 'email', date: '2024-01-12', subject: 'Application Received' },
        { type: 'call', date: '2024-01-13', subject: 'Initial screening call' }
      ]
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 9876543211',
      position: 'Digital Marketing Specialist',
      department: 'Marketing',
      experience: '3 years',
      location: 'Delhi',
      appliedDate: '2024-01-16',
      status: 'Interview Scheduled',
      source: 'Email',
      resume: 'priya_sharma_resume.pdf',
      skills: ['Digital Marketing', 'SEO', 'Social Media', 'Google Ads'],
      recruitmentStage: 'interview',
      followups: [
        { date: '2024-01-18', note: 'Technical interview scheduled for 2024-01-22' }
      ],
      communications: [
        { type: 'email', date: '2024-01-16', subject: 'Interview invitation sent' }
      ]
    },
    {
      id: 3,
      name: 'Rohit Kumar',
      email: 'rohit.kumar@email.com',
      phone: '+91 9876543212',
      position: 'Frontend Developer',
      department: 'IT',
      experience: '2 years',
      location: 'Gurgaon, HR',
      appliedDate: '2024-01-22',
      status: 'Selected',
      source: 'LinkedIn',
      resume: 'rohit_kumar_resume.pdf',
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Node.js'],
      recruitmentStage: 'offer',
      followups: [
        { date: '2024-01-25', note: 'Final interview completed' },
        { date: '2024-01-26', note: 'Offer letter prepared' }
      ],
      communications: [
        { type: 'email', date: '2024-01-26', subject: 'Job Offer Letter' },
        { type: 'whatsapp', date: '2024-01-26', subject: 'Congratulations message' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'application received': return '#6b7280';
      case 'screening': return '#f59e0b';
      case 'interview scheduled': return '#3b82f6';
      case 'selected': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'offer': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getRecruitmentStageColor = (stage) => {
    switch(stage) {
      case 'screening': return '#f59e0b';
      case 'interview': return '#3b82f6';
      case 'offer': return '#8b5cf6';
      case 'hired': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesDepartment = !filterDepartment || app.department === filterDepartment;
    const matchesExperience = !filterExperience || app.experience.includes(filterExperience);
    const matchesKeyword = !filterKeyword || 
      app.skills.some(skill => skill.toLowerCase().includes(filterKeyword.toLowerCase())) ||
      app.position.toLowerCase().includes(filterKeyword.toLowerCase());
    const matchesSearch = !searchTerm || 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesExperience && matchesKeyword && matchesSearch;
  });

  const handleAcceptCandidate = (candidateId) => {
    console.log('Accepting candidate:', candidateId);
    // Here you would update the candidate status and trigger communications
  };

  const handleRejectCandidate = (candidateId) => {
    console.log('Rejecting candidate:', candidateId);
  };

  const handleCommunication = (type, candidateId) => {
    setSelectedCandidate(applications.find(app => app.id === candidateId));
    setShowCommunicationModal(true);
  };

  return (
    <div className="recruitment-container">
      {/* Header */}
      <div className="section-header">
        <div className="header-left">
          <h2>Recruitment Management</h2>
          <p>Manage applications and candidate pipeline</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddJobModal(true)}>
          <Plus size={20} />
          Post New Job
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <Users size={20} />
          Applications ({applications.length})
        </button>
        <button 
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <FileText size={20} />
          Job Openings ({jobOpenings.length})
        </button>
      </div>

      {/* Filters */}
      {activeTab === 'applications' && (
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="filter-select"
              >
                <option value="">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="filter-select"
              >
                <option value="">All Experience</option>
                <option value="1">1-2 years</option>
                <option value="2">2-3 years</option>
                <option value="3">3-5 years</option>
                <option value="5">5+ years</option>
              </select>
            </div>
            <div className="filter-group">
              <input
                type="text"
                placeholder="Keywords (skills, position...)"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'applications' ? (
        <div className="applications-section">
          <div className="applications-table">
            <div className="table-header">
              <div className="table-row header-row">
                <div className="table-cell">Candidate</div>
                <div className="table-cell">Position</div>
                <div className="table-cell">Department</div>
                <div className="table-cell">Source</div>
                <div className="table-cell">Stage</div>
                <div className="table-cell">Applied Date</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            <div className="table-body">
              {filteredApplications.map(application => (
                <div key={application.id} className="table-row">
                  <div className="table-cell">
                    <div className="candidate-info">
                      <div className="candidate-avatar">
                        {application.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="candidate-name">{application.name}</div>
                        <div className="candidate-contact">{application.email}</div>
                        <div className="candidate-contact">{application.phone}</div>
                      </div>
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="position-info">
                      <div>{application.position}</div>
                      <div className="experience-badge">{application.experience} exp</div>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="department-badge">{application.department}</span>
                  </div>
                  <div className="table-cell">
                    <span className="source-badge">{application.source}</span>
                  </div>
                  <div className="table-cell">
                    <span 
                      className="status-badge"
                      style={{
                        backgroundColor: getRecruitmentStageColor(application.recruitmentStage) + '20',
                        color: getRecruitmentStageColor(application.recruitmentStage)
                      }}
                    >
                      {application.recruitmentStage}
                    </span>
                  </div>
                  <div className="table-cell">
                    {application.appliedDate}
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => setSelectedCandidate(application)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn approve"
                        onClick={() => handleAcceptCandidate(application.id)}
                        title="Accept"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        className="action-btn reject"
                        onClick={() => handleRejectCandidate(application.id)}
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                      <button 
                        className="action-btn neutral"
                        onClick={() => handleCommunication('email', application.id)}
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </button>
                      <button 
                        className="action-btn neutral"
                        onClick={() => handleCommunication('whatsapp', application.id)}
                        title="WhatsApp"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        className="action-btn neutral"
                        onClick={() => handleCommunication('call', application.id)}
                        title="Call"
                      >
                        <Phone size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="jobs-section">
          {/* ... keep existing code (job openings display) */}
          <div className="jobs-grid">
            {jobOpenings.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="status-badge active">Active</span>
                </div>
                <div className="job-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{job.type} • {job.experience}</span>
                  </div>
                </div>
                <div className="job-footer">
                  <div className="salary">{job.salary}</div>
                  <button className="action-btn view">View Applications</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="modal-backdrop" onClick={() => setSelectedCandidate(null)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Candidate Details - {selectedCandidate.name}</h3>
              <button className="close-btn" onClick={() => setSelectedCandidate(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="candidate-profile">
                <div className="profile-avatar">
                  {selectedCandidate.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h2>{selectedCandidate.name}</h2>
                  <p>{selectedCandidate.position}</p>
                  <span 
                    className="status-badge"
                    style={{
                      backgroundColor: getRecruitmentStageColor(selectedCandidate.recruitmentStage) + '20',
                      color: getRecruitmentStageColor(selectedCandidate.recruitmentStage)
                    }}
                  >
                    {selectedCandidate.recruitmentStage}
                  </span>
                </div>
              </div>

              <div className="details-tabs">
                <div className="tab-content">
                  <div className="details-grid">
                    <div className="detail-group">
                      <label>Email</label>
                      <p>{selectedCandidate.email}</p>
                    </div>
                    <div className="detail-group">
                      <label>Phone</label>
                      <p>{selectedCandidate.phone}</p>
                    </div>
                    <div className="detail-group">
                      <label>Department</label>
                      <p>{selectedCandidate.department}</p>
                    </div>
                    <div className="detail-group">
                      <label>Experience</label>
                      <p>{selectedCandidate.experience}</p>
                    </div>
                    <div className="detail-group">
                      <label>Source</label>
                      <p>{selectedCandidate.source}</p>
                    </div>
                    <div className="detail-group">
                      <label>Resume</label>
                      <div className="resume-actions">
                        <span>{selectedCandidate.resume}</span>
                        <button className="action-btn neutral">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="skills-section">
                    <h4>Skills & Expertise:</h4>
                    <div className="skills-tags">
                      {selectedCandidate.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="followups-section">
                    <div className="section-header-small">
                      <h4>Follow-ups & Notes</h4>
                      <button 
                        className="btn-small"
                        onClick={() => setShowFollowupModal(true)}
                      >
                        <Plus size={16} />
                        Add Note
                      </button>
                    </div>
                    <div className="followups-list">
                      {selectedCandidate.followups.map((followup, index) => (
                        <div key={index} className="followup-item">
                          <div className="followup-date">{followup.date}</div>
                          <div className="followup-note">{followup.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="communications-section">
                    <h4>Communication History</h4>
                    <div className="communications-list">
                      {selectedCandidate.communications.map((comm, index) => (
                        <div key={index} className="communication-item">
                          <div className="comm-type">{comm.type}</div>
                          <div className="comm-date">{comm.date}</div>
                          <div className="comm-subject">{comm.subject}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {showCommunicationModal && selectedCandidate && (
        <div className="modal-backdrop" onClick={() => setShowCommunicationModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Communication</h3>
              <button className="close-btn" onClick={() => setShowCommunicationModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="communication-form">
                <div className="form-group">
                  <label>To: {selectedCandidate.name}</label>
                  <p>{selectedCandidate.email} | {selectedCandidate.phone}</p>
                </div>
                <div className="form-group">
                  <label>Communication Type</label>
                  <select className="form-select">
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="call">Phone Call</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject/Topic</label>
                  <input type="text" placeholder="Enter subject" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Message/Notes</label>
                  <textarea rows={4} placeholder="Enter your message" className="form-textarea"></textarea>
                </div>
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setShowCommunicationModal(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary">
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="modal-backdrop" onClick={() => setShowAddJobModal(false)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post New Job Opening</h3>
              <button className="close-btn" onClick={() => setShowAddJobModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="job-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input type="text" placeholder="Enter job title" />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select>
                      <option value="">Select Department</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowAddJobModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Post Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .recruitment-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem;
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
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .search-input, .filter-select, .filter-input {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
        }

        .applications-table {
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .table-header {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1fr 2fr;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .header-row {
          font-weight: 600;
          color: #374151;
        }

        .table-cell {
          display: flex;
          align-items: center;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .candidate-avatar {
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

        .candidate-name {
          font-weight: 600;
          color: #1e293b;
        }

        .candidate-contact {
          font-size: 0.8rem;
          color: #64748b;
        }

        .position-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .experience-badge, .department-badge, .source-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .experience-badge {
          background: #f1f5f9;
          color: #475569;
          align-self: flex-start;
        }

        .department-badge {
          background: #fef3c7;
          color: #d97706;
        }

        .source-badge {
          background: #dbeafe;
          color: #3b82f6;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          min-width: 32px;
          height: 32px;
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

        .action-btn.neutral {
          background: #f3f4f6;
          color: #374151;
        }

        .action-btn:hover {
          transform: translateY(-1px);
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

        .candidate-profile {
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

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-group label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .detail-group p {
          margin: 0;
          color: #6b7280;
        }

        .resume-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .skills-section {
          margin: 1.5rem 0;
        }

        .skills-section h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-size: 1rem;
          font-weight: 600;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 1rem;
          font-size: 0.8rem;
        }

        .followups-section, .communications-section {
          margin: 1.5rem 0;
        }

        .section-header-small {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header-small h4 {
          margin: 0;
          color: #374151;
          font-size: 1rem;
          font-weight: 600;
        }

        .btn-small {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .followups-list, .communications-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .followup-item, .communication-item {
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border-left: 3px solid #ef4444;
        }

        .followup-date, .comm-date {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .followup-note, .comm-subject {
          color: #374151;
        }

        .comm-type {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          background: #dbeafe;
          color: #3b82f6;
          border-radius: 0.25rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .communication-form {
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

        .form-input, .form-select, .form-textarea {
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

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .job-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .job-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .job-details {
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

        .job-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .salary {
          font-weight: 600;
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          
          .filters-grid {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Recruitment;
