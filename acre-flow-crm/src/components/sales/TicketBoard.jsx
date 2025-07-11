import React, { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Upload, Download } from 'lucide-react';
import '../../style/TicketBoard.css';

const TicketBoard = ({ userRole }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const mockTickets = {
    pending: [
      {
        id: 1,
        title: 'Property Documentation Review',
        description: 'Review legal documents for Gurgaon property',
        assignedTo: 'Ravi Kumar',
        assignedBy: 'Team Leader A',
        priority: 'High',
        dueDate: '2024-01-20',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'Client Site Visit Coordination',
        description: 'Coordinate site visit for premium villa project',
        assignedTo: 'Amit Singh',
        assignedBy: 'Team Leader B',
        priority: 'Medium',
        dueDate: '2024-01-18',
        createdAt: '2024-01-14'
      }
    ],
    'in-progress': [
      {
        id: 3,
        title: 'Market Analysis Report',
        description: 'Prepare detailed market analysis for Q1 2024',
        assignedTo: 'Sarah Khan',
        assignedBy: 'Head Admin',
        priority: 'High',
        dueDate: '2024-01-25',
        createdAt: '2024-01-10',
        files: ['market_data.xlsx', 'analysis_draft.pdf']
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Customer Feedback Collection',
        description: 'Collect and compile customer feedback from last quarter',
        assignedTo: 'Priya Sharma',
        assignedBy: 'Team Leader C',
        priority: 'Low',
        dueDate: '2024-01-15',
        createdAt: '2024-01-08',
        completedAt: '2024-01-14',
        files: ['feedback_report.pdf', 'summary.docx']
      }
    ]
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    console.log(`Updating ticket ${ticketId} to ${newStatus}`);
  };

  const TicketCard = ({ ticket, status }) => (
    <div className="ticket-card">
      <div className="ticket-header">
        <h4 className="ticket-title">{ticket.title}</h4>
        <span className={`priority-tag ${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span>
      </div>
      <p className="ticket-description">{ticket.description}</p>
      <div className="ticket-info">
        <div>Assigned to: <span className="font-medium">{ticket.assignedTo}</span></div>
        <div>Due: {ticket.dueDate}</div>
        {ticket.files && (
          <div className="ticket-files">
            <span>Files:</span>
            {ticket.files.map((file, index) => (
              <span key={index} className="file-chip">{file}</span>
            ))}
          </div>
        )}
      </div>
      {userRole === 'employee' && (
        <div className="ticket-actions">
          {status === 'pending' && (
            <button onClick={() => updateTicketStatus(ticket.id, 'in-progress')} className="btn-accept">Accept</button>
          )}
          {status === 'in-progress' && (
            <>
              <button onClick={() => updateTicketStatus(ticket.id, 'completed')} className="btn-complete">Complete</button>
              <button onClick={() => setShowUploadModal(true)} className="btn-upload">
                <Upload className="icon-small" /> Upload
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="ticket-board">
      <div className="ticket-board-header">
        <h2 className="title">Ticket Management</h2>
        {(userRole === 'team-leader' || userRole === 'head-admin' || userRole === 'super-admin') && (
          <button className="btn-create">
            <Plus className="icon-small" /> Create Ticket
          </button>
        )}
      </div>

      <div className="ticket-columns">
        {['pending', 'in-progress', 'completed'].map(status => (
          <div key={status} className="ticket-column">
            <div className="column-header">
              {status === 'pending' ? <Clock /> : status === 'in-progress' ? <AlertCircle /> : <CheckCircle />}
              <h3 className="column-title">{status.replace('-', ' ').toUpperCase()}</h3>
              <span className={`badge ${status}`}>{mockTickets[status].length}</span>
            </div>
            <div>
              {mockTickets[status].map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} status={status} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <h3 className="modal-title">Upload Files</h3>
            <div className="upload-area">
              <Upload className="icon-large" />
              <p>Drag and drop files here or click to select</p>
              <input type="file" multiple className="hidden" />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowUploadModal(false)} className="btn-cancel">Cancel</button>
              <button className="btn-confirm">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketBoard;
