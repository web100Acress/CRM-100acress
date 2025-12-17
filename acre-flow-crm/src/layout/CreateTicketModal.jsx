import React, { useState, useEffect } from 'react';
import { X, User, Calendar, AlertCircle } from 'lucide-react';
import '@/styles/CreateTicketModal.css';

const mockUsers = ['Alice', 'Bob', 'Charlie', 'David'];

const CreateTicketModal = ({ isOpen, onClose, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    category: 'general'
  });

  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://bcrm.100acress.com/api/leads');
        const data = await response.json();
        setLeadsList(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating ticket:', formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      category: 'general'
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Ticket</h2>
          <button onClick={onClose} className="icon-button">
            <X className="icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Ticket Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="input-field" />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea required rows="4" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} className="textarea-field"></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><User className="icon-small" /> Assign To *</label>
              <select required value={formData.assignedTo} onChange={(e) => handleChange('assignedTo', e.target.value)} className="select-field">
                <option value="">Select user...</option>
                {mockUsers.map((user, index) => (
                  <option key={index} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><AlertCircle className="icon-small" /> Priority *</label>
              <select value={formData.priority} onChange={(e) => handleChange('priority', e.target.value)} className="select-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label><Calendar className="icon-small" /> Due Date *</label>
              <input type="date" required value={formData.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field" />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="select-field">
                <option value="general">General</option>
                <option value="documentation">Documentation</option>
                <option value="client-coordination">Client Coordination</option>
                <option value="analysis">Analysis</option>
                <option value="follow-up">Follow-up</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="priority-info">
            <AlertCircle className={`icon-small ${formData.priority}`} />
            <span>
              This ticket will be created with <strong className={formData.priority}>{formData.priority}</strong> priority
            </span>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Create Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;