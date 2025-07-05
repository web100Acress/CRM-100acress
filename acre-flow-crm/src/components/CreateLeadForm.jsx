import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';

const CreateLeadForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    budget: '',
    property: '',
    status: 'Cold'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name && formData.email && formData.phone) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
          alert('Lead created successfully!');
          onSave && onSave(formData);
          setFormData({
            name: '',
            email: '',
            phone: '',
            location: '',
            budget: '',
            property: '',
            status: 'Cold'
          });
          onClose();
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        alert('Failed to save lead: ' + error.message);
      }
    }
  };

  const budgetOptions = [
    '₹20L - ₹30L',
    '₹30L - ₹45L',
    '₹45L - ₹60L',
    '₹60L - ₹80L',
    '₹80L - ₹1Cr',
    '₹1Cr - ₹1.5Cr',
    '₹1.5Cr+'
  ];

  const propertyOptions = [
    '1BHK Apartment',
    '2BHK Apartment',
    '2BHK Flat',
    '3BHK Apartment',
    '3BHK Flat',
    '4BHK Apartment',
    '4BHK Villa',
    'Villa',
    'Independent House',
    'Plot'
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="plain-dialog">
          <DialogHeader>
            <DialogTitle className="form-title">Create New Lead</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="lead-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City/Area"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Budget Range</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="">Select budget</option>
                  {budgetOptions.map(option => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Property Type</label>
                <select
                  name="property"
                  value={formData.property}
                  onChange={handleInputChange}
                >
                  <option value="">Select property</option>
                  {propertyOptions.map(option => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Lead Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-outline">
                <X style={{ width: 16, height: 16, marginRight: 6 }} />
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save style={{ width: 16, height: 16, marginRight: 6 }} />
                Create Lead
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <style>{`
        .plain-dialog {
          max-width: 500px;
          padding: 24px;
        }

        .form-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .lead-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 16px;
          flex-direction: column;
        }

        @media (min-width: 600px) {
          .form-row {
            flex-direction: row;
          }
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #374151;
        }

        .form-group input,
        .form-group select {
          padding: 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          font-size: 14px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .btn-outline {
          background-color: #f3f4f6;
          color: #111827;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background-color: #e5e7eb;
        }

        .btn-primary {
          background-color: #16a34a;
          color: white;
        }

        .btn-primary:hover {
          background-color: #15803d;
        }
      `}</style>
    </>
  );
};

export default CreateLeadForm;
