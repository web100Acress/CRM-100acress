import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { Save, Loader2, User, Mail, Phone, MapPin, Building2, DollarSign, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateLeadFormMobile = ({ isOpen, onClose, onSuccess, onCancel }) => {
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
  const { toast } = useToast();
  const [currentUserRole, setCurrentUserRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setCurrentUserRole(userRole);
  }, []);

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
  }, [isOpen]);

  const fetchAssignableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bcrm.100acress.com/api/leads/assignable-users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      let users = json.data || [];
      
      // Filter users based on current user role
      if (currentUserRole === 'super-admin') {
        // Super admin can only assign to head-admin users
        users = users.filter((user) => user.role === 'head-admin');
      } else {
        // Other roles can assign to all users (or implement your logic)
        // For now, keep all users for other roles
      }
      
      setAssignableUsers(users);
    } catch (error) {
      console.error('Error fetching assignable users:', error);
      toast({
        title: "Error",
        description: "Could not load assignable users.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.email) {
        toast({
          title: "Validation Error",
          description: "Name, phone, and email are required",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Phone validation
      const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid phone number",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`https://bcrm.100acress.com/api/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: "Lead created successfully!",
        });
        
        // Reset form
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
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess(result);
        }
        
        onClose();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to create lead",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const budgetOptions = [
    "Under ₹1 Cr",
    "₹1 Cr - ₹5 Cr",
    "₹5 Cr - ₹10 Cr",
    "₹10 Cr - ₹20 Cr",
    "₹20 Cr - ₹50 Cr",
    "Above ₹50 Cr"
  ];

  const propertyOptions = [
    "SCO Plots",
    "Luxury Villas",
    "Plots In Gurugram",
    "Residential Projects",
    "Independent Floors",
    "Commercial Projects",
    "Farm Houses",
    "Industrial Projects",
    "Senior Living",
  ];

  const locationOptions = [
    "Projects on Sohna Road",
    "Projects on Golf Course",
    "Projects on Dwarka Expressway",
    "Projects on New Gurgaon",
    "Projects on Southern Peripheral Road",
    "Projects on Golf Course Extn Road",
    "Delhi",
    "Noida",
    "Gurugram",
    "Other"
  ];

  const statusOptions = ["Cold", "Warm", "Hot", "Converted", "Lost"];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[83%] max-w-[280px] max-h-[60vh] overflow-y-auto p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3">
          <DialogTitle className="text-base font-semibold flex items-center justify-between">
            <span>Create New Lead</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-3 space-y-3">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User size={16} />
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter lead name"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {/* Phone Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone size={16} />
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {/* Location Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin size={16} />
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select location</option>
              {locationOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign size={16} />
              Budget
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Budget Range</option>
              {budgetOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Property Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building2 size={16} />
              Property Type
            </label>
            <select
              name="property"
              value={formData.property}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Property Type</option>
              {propertyOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Target size={16} />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned To Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User size={16} />
              Assign To
              {currentUserRole === "super-admin" && (
                <span className="text-xs text-gray-500 ml-2">(Only HODs)</span>
              )}
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Agent</option>
              {assignableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role === "head-admin" ? "HOD" : user.role})
                </option>
              ))}
            </select>
            {currentUserRole === "super-admin" && assignableUsers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No HODs available to assign leads to
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel || onClose}
              className="flex-1 text-sm py-1.5"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm py-1.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Create Lead
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadFormMobile;
