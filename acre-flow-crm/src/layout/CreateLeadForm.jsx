import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/layout/dialog";
import { Button } from "@/layout/button";
import { X, Save, Loader2, User, Phone, MapPin, DollarSign, Building, Target, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/CreateLeadForm.css";
import { Badge } from "@/layout/badge";

const CreateLeadForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    budget: "",
    property: "",
    status: "Cold",
    assignedTo: "",
  });
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Initialize useToast
  const [currentUserRole, setCurrentUserRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setCurrentUserRole(userRole);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset form data when the modal opens
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        budget: "",
        property: "",
        status: "Cold",
        assignedTo: "",
      });
      fetchAssignableUsers();
    }
  }, [isOpen]); // Depend on isOpen to refetch/reset when opened

  const fetchAssignableUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://bcrm.100acress.com/api/leads/assignable-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      let users = json.data || [];

      // Filter users based on current user role
      if (currentUserRole === "super-admin" || currentUserRole === "boss") {
        // Boss can ONLY assign to HOD users
        users = users.filter((user) => user.role === "hod");
        console.log('🔍 Boss assigning leads - Available HODs ONLY:', users);
      } else if (currentUserRole === "hod") {
        // HOD can assign to team-leader and bd users
        users = users.filter((user) => user.role === "team-leader" || user.role === "bd");
        console.log('🔍 HOD assigning leads - Available Team Leaders & BD:', users);
      } else if (currentUserRole === "team-leader") {
        // Team Leader can assign to bd users
        users = users.filter((user) => user.role === "bd");
        console.log('🔍 Team Leader assigning leads - Available BD:', users);
      } else {
        // Other roles cannot assign leads - empty list
        users = [];
        console.log('🔍 Other roles cannot assign leads - No users available');
      }

      setAssignableUsers(users);

      // Pre-select the first assignable user if any, otherwise keep unassigned
      if (users.length > 0) {
        setFormData((prev) => ({ ...prev, assignedTo: users[0]._id }));
      } else {
        setFormData((prev) => ({ ...prev, assignedTo: "" }));
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Updated validation - only name and phone required
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Phone).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Try local API first, then fallback to production
      let apiUrl = 'http://localhost:5001/api/leads';
      let response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      // If local fails, try production
      if (!response.ok) {
        console.log('Local API failed, trying production...');
        apiUrl = 'https://bcrm.100acress.com/api/leads';
        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();
      console.log('Lead creation response:', data);

      if (response.ok) {
        toast({
          title: "Lead Created!",
          description: `${formData.name} has been successfully added as a lead.`,
          variant: "default",
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
      console.error('Lead creation error:', error);
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
    "Under ₹1 Cr",
    "₹1 Cr - ₹5 Cr",
    "₹5 Cr - ₹10 Cr",
    "₹10 Cr - ₹20 Cr",
    "₹20 Cr - ₹50 Cr",
    "Above ₹50 Cr",
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

  // Helper functions
  const getStatusVariant = (status) => {
    switch (status) {
      case "Hot": return "destructive";
      case "Warm": return "default";
      case "Cold": return "secondary";
      case "Converted": return "default";
      case "Lost": return "destructive";
      default: return "secondary";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "hod": return "HOD";
      case "team-leader": return "Team Leader";
      case "bd": return "BD";
      case "boss": return "Boss";
      default: return role;
    }
  };

  const hasAssignmentPermission = () => {
    return ["super-admin", "boss", "hod", "team-leader"].includes(currentUserRole);
  };

  const getAssignmentHint = () => {
    if (currentUserRole === "super-admin" || currentUserRole === "boss") {
      return <span className="assignment-hint">(Only HODs)</span>;
    }
    if (currentUserRole === "hod") {
      return <span className="assignment-hint">(Team Leaders & BD)</span>;
    }
    if (currentUserRole === "team-leader") {
      return <span className="assignment-hint">(Only BD)</span>;
    }
    return null;
  };

  const getAssignmentMessage = () => {
    if (!hasAssignmentPermission()) {
      return (
        <div className="assignment-message error">
          <AlertCircle size={14} />
          You don't have permission to assign leads
        </div>
      );
    }
    
    if (assignableUsers.length === 0) {
      const message = {
        "super-admin": "No HODs available to assign leads to",
        "boss": "No HODs available to assign leads to",
        "hod": "No Team Leaders or BD available to assign leads to",
        "team-leader": "No BD available to assign leads to"
      }[currentUserRole] || "No users available";
      
      return (
        <div className="assignment-message warning">
          <AlertCircle size={14} />
          {message}
        </div>
      );
    }
    
    return null;
  };

  const isFormValid = () => {
    return formData.name && formData.phone;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lead-form-dialog enhanced-desktop">
        <DialogHeader className="form-header">
          <div className="header-content">
            <div className="header-icon">
              <User className="icon" />
            </div>
            <div className="header-text">
              <DialogTitle className="lead-form-title">Create New Lead</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="lead-form-grid">
          {/* Personal Information Section */}
          <div className="form-section">
           
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter customer's full name"
                    required
                    className="form-input enhanced"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                    className="form-input enhanced"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="form-section">
            <div className="section-header">
            
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  <MapPin className="label-icon" />
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-select enhanced"
                >
                  <option value="">Select location</option>
                  {locationOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget" className="form-label">
                  <DollarSign className="label-icon" />
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="form-select enhanced"
                >
                  <option value="">Select budget</option>
                  {budgetOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="property" className="form-label">
                  <Building className="label-icon" />
                  Property Type
                </label>
                <select
                  id="property"
                  name="property"
                  value={formData.property}
                  onChange={handleInputChange}
                  className="form-select enhanced"
                >
                  <option value="">Select property</option>
                  {propertyOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  <Target className="label-icon" />
                  Lead Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select enhanced"
                >
                  {statusOptions.map((option) => (
                    <option value={option} key={option}>
                      <Badge variant={getStatusVariant(option)} className="status-badge">
                        {option}
                      </Badge>
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="form-section">
            <div className="section-header">
            </div> 
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="assignedTo" className="form-label">
                  <User className="label-icon" />
                  Assign To
                  {getAssignmentHint()}
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="form-select enhanced"
                  disabled={!hasAssignmentPermission()}
                >
                  <option value="">Unassigned</option>
                  {assignableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({getRoleDisplayName(user.role)})
                    </option>
                  ))}
                </select>
                {getAssignmentMessage()}
              </div>
            </div>
          </div>

          <DialogFooter className="form-actions enhanced">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="btn-cancel enhanced"
            >
              <X size={16} />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              className="btn-primary enhanced"
            >
              {loading ? (
                <>
                  <Loader2 className="icon-spin" size={16} />
                  Creating Lead...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadForm;
