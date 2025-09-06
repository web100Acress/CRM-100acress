import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/layout/dialog'; // Import DialogFooter
import { Button } from '@/layout/button';
import { X, Save, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import { useToast } from '@/hooks/use-toast'; // Assuming you have useToast setup
import '@/styles/CreateLeadForm.css'

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
      const response = await fetch("https://crm.100acress.com/api/leads/assignable-users", {
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
      const response = await fetch('https://crm.100acress.com/api/leads', {
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
     
    </Dialog>
  );
};

export default CreateLeadForm;