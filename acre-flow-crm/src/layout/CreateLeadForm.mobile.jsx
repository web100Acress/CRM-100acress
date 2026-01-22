import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { Save, Loader2, User, Mail, Phone, MapPin, Building2, DollarSign, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from "@/config/apiConfig";

const CreateLeadFormMobile = ({ isOpen, onClose, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    projectName: '',
    budget: '',
    property: '',
    status: 'Cold',
    assignedTo: ''
  });
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [entryMode, setEntryMode] = useState('manual'); // "manual" or "paste"
  const [pasteData, setPasteData] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setCurrentUserRole(userRole);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset form data when the modal opens
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        projectName: '',
        budget: '',
        property: '',
        status: 'Cold',
        assignedTo: ''
      });
      setEntryMode('manual');
      setPasteData('');
      fetchAssignableUsers();
    }
  }, [isOpen]);

  const fetchAssignableUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/leads/assignable-users`, {
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

      console.log('🔍 Backend returned users:', users);
      console.log('🔍 Current user role:', currentUserRole);

      // The backend now includes the current user, so no need for additional filtering
      // Just use the users as returned by backend
      console.log('🔍 Final assignable users:', users.map(u => ({ id: u._id, name: u.name, role: u.role })));

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

  const handlePasteData = () => {
    try {
      // Parse pasted data - expecting tab-separated or comma-separated values
      const lines = pasteData.trim().split('\n');
      if (lines.length === 0) {
        toast({
          title: "No Data",
          description: "Please paste some data first.",
          variant: "destructive",
        });
        return;
      }

      // Take first line for parsing
      const firstLine = lines[0];
      let fields = [];
      
      // Try to split by tab first, then by comma
      if (firstLine.includes('\t')) {
        fields = firstLine.split('\t');
      } else if (firstLine.includes(',')) {
        fields = firstLine.split(',');
      } else {
        fields = [firstLine]; // Single field
      }

      // Clean up fields (remove quotes and extra spaces)
      fields = fields.map(field => field.replace(/["']/g, '').trim());

      // Check if data is in key-value format (like the user's pasted data)
      if (firstLine.includes(':') && firstLine.includes(',')) {
        // Parse key-value pairs format: "name: value, mobile: value, email: value"
        const updatedFormData = { ...formData };
        
        fields.forEach(field => {
          const [key, ...valueParts] = field.split(':').map(s => s.trim());
          const value = valueParts.join(':').trim();
          
          switch(key.toLowerCase()) {
            case 'name':
              updatedFormData.name = value;
              break;
            case 'email':
              updatedFormData.email = value;
              break;
            case 'phone':
            case 'mobile':
              updatedFormData.phone = value;
              break;
            case 'location':
              updatedFormData.location = value;
              break;
            case 'project':
            case 'project name':
              updatedFormData.projectName = value;
              break;
            case 'budget':
              updatedFormData.budget = value;
              break;
            case 'property':
              updatedFormData.property = value;
              break;
            case 'status':
              updatedFormData.status = value;
              break;
          }
        });
        
        setFormData(updatedFormData);
        setEntryMode("manual"); // Switch back to manual to show filled form
        
        toast({
          title: "Data Parsed!",
          description: "Form fields have been auto-filled from pasted data.",
          variant: "default",
        });
        return;
      }

      // Auto-fill form based on field order: Name, Email, Phone, Location, Project Name, Budget, Property, Status
      const updatedFormData = { ...formData };
      
      if (fields[0]) updatedFormData.name = fields[0];
      if (fields[1]) updatedFormData.email = fields[1];
      if (fields[2]) updatedFormData.phone = fields[2];
      if (fields[3]) updatedFormData.location = fields[3];
      if (fields[4]) updatedFormData.projectName = fields[4];
      if (fields[5]) updatedFormData.budget = fields[5];
      if (fields[6]) updatedFormData.property = fields[6];
      if (fields[7]) updatedFormData.status = fields[7];

      setFormData(updatedFormData);
      setEntryMode("manual"); // Switch back to manual to show filled form
      
      toast({
        title: "Data Parsed!",
        description: "Form fields have been auto-filled from pasted data.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error parsing paste data:", error);
      toast({
        title: "Parse Error",
        description: "Could not parse pasted data. Please check format.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Validate required fields
      if (!formData.name || !formData.phone) {
        toast({
          title: "Validation Error",
          description: "Name and phone are required",
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

      const response = await fetch(`${apiUrl}/api/leads`, {
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
          phone: '',
          email: '',
          location: '',
          projectName: '',
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
    "Sohna Road",
    "Golf Course",
    "Dwarka Expressway",
    "New Gurgaon",
    "Southern Peripheral Road",
    "Golf Course Extn Road",
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
          {/* Entry Mode Selection */}
          <div className="flex gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={() => setEntryMode("manual")}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                entryMode === "manual" 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <User size={14} />
              Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setEntryMode("paste")}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                entryMode === "paste" 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Save size={14} />
              Paste Data
            </button>
          </div>

          {/* Paste Data Mode */}
          {entryMode === "paste" && (
            <div className="space-y-2 p-2 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-2">
                Copy data from Excel/Sheet and paste below. Formats supported:
                <br />• Comma-separated: Name, Email, Phone, Location, Project Name, Budget, Property, Status
                <br />• Key-value pairs: name: John, email: john@example.com, mobile: 1234567890
              </div>
              <textarea
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                placeholder="John Doe, john@example.com, 9876543210, Gurgaon, Project Name, ₹1 Cr - ₹5 Cr, Residential Projects, Cold"
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                rows={4}
              />
              <button
                type="button"
                onClick={handlePasteData}
                disabled={!pasteData.trim()}
                className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={14} />
                Parse & Fill Form
              </button>
            </div>
          )}

          {/* Manual Entry Mode */}
          {entryMode === "manual" && (
            <>
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
          {/* Email Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Project Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building2 size={16} />
              Project Name
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              {(currentUserRole === "super-admin" || currentUserRole === "boss") && (
                <span className="text-xs text-gray-500 ml-2">(Only HODs)</span>
              )}
              {currentUserRole === "hod" && (
                <span className="text-xs text-gray-500 ml-2">(Team Leaders & BD)</span>
              )}
              {currentUserRole === "team-leader" && (
                <span className="text-xs text-gray-500 ml-2">(Only BD)</span>
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
                  {user.name} ({user.role === "hod" ? "HOD" : user.role})
                </option>
              ))}
            </select>
            {(currentUserRole === "super-admin" || currentUserRole === "boss") && assignableUsers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No HODs available to assign leads to
              </p>
            )}
            {currentUserRole === "hod" && assignableUsers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No Team Leaders or BD available to assign leads to
              </p>
            )}
            {currentUserRole === "team-leader" && assignableUsers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No BD available to assign leads to
              </p>
            )}
            {!(currentUserRole === "super-admin" || currentUserRole === "boss" || currentUserRole === "hod" || currentUserRole === "team-leader" || currentUserRole === "bd" || currentUserRole === "employee") && (
              <p className="text-xs text-red-500 mt-1">
                You don't have permission to assign leads
              </p>
            )}
          </div>
          </> // Added closing JSX fragment tag
          )}

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
                <div>
                  <Save size={16} className="mr-2" />
                  Create Lead
                </div>
              )}
            </Button>
          </div>
        </form>

        </DialogContent>
    </Dialog>
  );
};

export default CreateLeadFormMobile;
