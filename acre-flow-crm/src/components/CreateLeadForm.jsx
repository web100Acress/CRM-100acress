import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Import DialogFooter
import { Button } from '@/components/ui/button';
import { X, Save, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import { useToast } from '@/hooks/use-toast'; // Assuming you have useToast setup

const CreateLeadForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    budget: '',
    property: '',
    status: 'Cold',
    assignedTo: ''
  });
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    if (isOpen) {
      // Reset form data when the modal opens
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        budget: '',
        property: '',
        status: 'Cold',
        assignedTo: ''
      });
      fetchAssignableUsers();
    }
  }, [isOpen]); // Depend on isOpen to refetch/reset when opened

  const fetchAssignableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5001/api/leads/assignable-users", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setAssignableUsers(json.data || []);
      // Pre-select the first assignable user if any, otherwise keep unassigned
      if (json.data && json.data.length > 0) {
        setFormData(prev => ({ ...prev, assignedTo: json.data[0]._id }));
      } else {
        setFormData(prev => ({ ...prev, assignedTo: '' }));
      }
    } catch (error) {
      console.error("Error fetching assignable users:", error);
      toast({
        title: "Error",
        description: "Could not load assignable users.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, Phone).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
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

      if (response.ok && data.success) {
        toast({
          title: "Lead Created!",
          description: `${formData.name} has been successfully added as a lead.`,
          className: "bg-green-500 text-white", // Example of custom toast styling
        });
        onSave && onSave(formData); // Call onSave callback if provided
        onClose(); // Close the modal
      } else {
        toast({
          title: "Lead Creation Failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const statusOptions = [
    'Cold',
    'Warm',
    'Hot',
    'Converted',
    'Lost'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lead-form-dialog">
        <DialogHeader>
          <DialogTitle className="lead-form-title">Create New Lead</DialogTitle>
          {/* <Button
            variant="ghost"
            size="sm"
            className="dialog-close-button"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="lead-form-grid">
          <div className="form-group">
            <label htmlFor="name">Full Name <span className="required">*</span></label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., John Doe"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g., john.doe@example.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number <span className="required">*</span></label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Delhi, Noida"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget Range</label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select budget</option>
              {budgetOptions.map(option => (
                <option value={option} key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="property">Property Type</label>
            <select
              id="property"
              name="property"
              value={formData.property}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select property</option>
              {propertyOptions.map(option => (
                <option value={option} key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Lead Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-select"
            >
              {statusOptions.map(option => (
                <option value={option} key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Unassigned</option>
              {assignableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </form>

        <DialogFooter className="form-actions">
        <Button
  variant="outline"
  onClick={onClose}
  disabled={loading}
  className="btn-cancel"
>
  <X />
  Cancel
</Button>

<Button
  type="submit"
  onClick={handleSubmit}
  disabled={loading}
  className="btn-primary"
>
  {loading ? (
    <>
      <Loader2 className="icon-spin" />
      Creating...
    </>
  ) : (
    <>
      <Save />
      Create Lead
    </>
  )}
</Button>

        </DialogFooter>
      </DialogContent>
      <style>{`
        /* Base styles from your previous CSS, refined */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .lead-form-dialog {
          font-family: 'Inter', sans-serif;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); /* More pronounced shadow */
          padding: 2.5rem; /* Increased padding */
          max-width: 650px; /* Wider form for better layout */
          width: 95%; /* Responsive width */
          position: relative; /* Needed for absolute positioning of close button */
        }

        .lead-form-title {
          font-size: 1.8rem; /* Larger, more impactful title */
          font-weight: 700;
          color: #1a202c; /* Darker text for prominence */
          text-align: center; /* Center align title */
          margin-bottom: 1.5rem; /* More space below title */
        }

        .dialog-close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #718096; /* Muted color */
          transition: color 0.2s ease, background-color 0.2s ease;
          border-radius: 50%; /* Make it circular */
          padding: 0.5rem; /* Sufficient hit area */
        }

        .dialog-close-button:hover {
          color: #e53e3e; /* Red on hover */
          background-color: #f7fafc; /* Light background on hover */
        }

        /* Form Grid Layout */
        .lead-form-grid {
          display: grid;
          grid-template-columns: 1fr; /* Default to single column */
          gap: 1.5rem; /* Consistent spacing */
        }

        @media (min-width: 640px) { /* md breakpoint */
          .lead-form-grid {
            grid-template-columns: repeat(2, 1fr); /* Two columns on larger screens */
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 0.9rem; /* Slightly smaller, clean label */
          font-weight: 600;
          color: #4a5568; /* Subtler label color */
          margin-bottom: 0.5rem; /* Space between label and input */
        }

        .form-group .required {
          color: #e53e3e; /* Red asterisk for required fields */
          margin-left: 0.25rem;
        }

        .form-input,
        .form-select {
          padding: 0.75rem 1rem; /* Generous padding */
          border: 1px solid #e2e8f0; /* Light border */
          border-radius: 0.5rem; /* More rounded corners */
          font-size: 1rem;
          color: #2d3748; /* Darker text */
          background-color: #f7fafc; /* Light background for input fields */
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
          width: 100%; /* Full width */
        }

        .form-input::placeholder {
            color: #a0aec0; /* Muted placeholder text */
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #4299e1; /* Blue focus border */
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3); /* Soft blue glow */
          background-color: #ffffff; /* White background on focus */
        }

        .form-select {
            appearance: none; /* Remove default select arrow */
            background-image: url('data:image/svg+xml;utf8,<svg fill="%23A0AEC0" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill-rule="evenodd"></path></svg>');
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1.2em;
            cursor: pointer;
        }

        /* Actions Footer */
        .form-actions {
          display: flex;
          justify-content: center;
          gap: 0.75rem; /* Space between buttons */
          padding-top: 1.5rem;
          border-top: 1px solid #edf2f7; /* Subtle top border */
          margin-top: 1rem;
        }

        .btn-cancel {
          background-color: #e2e8f0; /* Light gray */
          color: #2d3748;
          border: 1px solid #cbd5e1;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background-color: #cbd5e1;
          color: #1a202c;
          transform: translateY(-1px); /* Slight lift on hover */
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .btn-primary {
          background-color: #28a745; /* Vibrant green */
          color: white;
          box-shadow: 0 4px 10px rgba(40, 167, 69, 0.2); /* Soft shadow for primary */
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background-color: #218838; /* Darker green on hover */
          transform: translateY(-1px);
          box-shadow: 0 6px 12px rgba(40, 167, 69, 0.3);
        }

        .btn-primary:disabled {
          background-color: #a7d9b5; /* Lighter green when disabled */
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* Icon styling within buttons */
        .btn-cancel svg,
        .btn-primary svg {
          margin-right: 0.5rem;
        }
      `}</style>
    </Dialog>
  );
};

export default CreateLeadForm;