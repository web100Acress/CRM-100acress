import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/layout/dialog";
import { Button } from "@/layout/button";
import { X, Save, Loader2, User, Mail, Phone, MapPin, DollarSign, Building, Target, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/CreateLeadForm.css";
import { Badge } from "@/layout/badge";

const CreateLeadForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    projectName: "",
    budget: "",
    property: "",
    status: "Cold",
    assignedTo: "",
  });
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Initialize useToast
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [entryMode, setEntryMode] = useState("manual"); // "manual" or "paste"
  const [pasteData, setPasteData] = useState("");
  const [showParseButton, setShowParseButton] = useState(false);

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
        projectName: "",
        budget: "",
        property: "",
        status: "Cold",
        assignedTo: "",
      });
      setEntryMode("manual");
      setPasteData("");
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

  const handlePasteDataChange = (e) => {
    const value = e.target.value;
    setPasteData(value);
    
    // Auto-detect if pasted data looks like structured data
    const hasStructure = value.includes(':') || value.includes(',') || value.includes('\t') || 
                        value.match(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/) || // Email
                        value.match(/(?:\+91[-\s]?|0)?[6-9]\d{9}/); // Phone
    
    setShowParseButton(hasStructure && value.trim().length > 5);
  };

  const handlePasteData = () => {
    try {
      const data = pasteData.trim();
      if (!data) {
        toast({
          title: "No Data",
          description: "Please paste some data first.",
          variant: "destructive",
        });
        return;
      }

      // Start with fresh form data to ensure clean state
      const updatedFormData = {
        name: "",
        email: "",
        phone: "",
        location: "",
        projectName: "",
        budget: "",
        property: "",
        status: "Cold",
        assignedTo: formData.assignedTo // Keep assigned user if already selected
      };
      
      // Enhanced parsing for different formats
      
      // 1. Key-value pairs format: "name: John, email: john@example.com, mobile: 1234567890"
      if (data.includes(':')) {
        // Split by comma or new line, then process each key-value pair
        const pairs = data.split(/[,\n]/).map(pair => pair.trim()).filter(pair => pair);
        
        pairs.forEach(pair => {
          const colonIndex = pair.indexOf(':');
          if (colonIndex > -1) {
            const key = pair.substring(0, colonIndex).trim().toLowerCase();
            const value = pair.substring(colonIndex + 1).trim().replace(/["']/g, '');
            
            switch(key) {
              case 'name':
              case 'full name':
              case 'customer name':
                updatedFormData.name = value;
                break;
              case 'email':
              case 'email address':
                updatedFormData.email = value;
                break;
              case 'phone':
              case 'mobile':
              case 'phone number':
              case 'contact':
                updatedFormData.phone = value;
                break;
              case 'location':
              case 'address':
              case 'city':
                updatedFormData.location = value;
                break;
              case 'project':
              case 'project name':
              case 'property name':
                updatedFormData.projectName = value;
                break;
              case 'budget':
              case 'price':
              case 'amount':
                updatedFormData.budget = value;
                break;
              case 'property':
              case 'property type':
              case 'property category':
                updatedFormData.property = value;
                break;
              case 'status':
              case 'lead status':
                updatedFormData.status = value;
                break;
            }
          }
        });
      } 
      // 2. Comma-separated values: "John, john@example.com, 1234567890, Delhi, Project A, 50L, 2BHK, Hot"
      else if (data.includes(',')) {
        const fields = data.split(',').map(field => field.trim().replace(/["']/g, ''));
        
        if (fields[0]) updatedFormData.name = fields[0];
        if (fields[1]) updatedFormData.email = fields[1];
        if (fields[2]) updatedFormData.phone = fields[2];
        if (fields[3]) updatedFormData.location = fields[3];
        if (fields[4]) updatedFormData.projectName = fields[4];
        if (fields[5]) updatedFormData.budget = fields[5];
        if (fields[6]) updatedFormData.property = fields[6];
        if (fields[7]) updatedFormData.status = fields[7];
      }
      // 3. Tab-separated values
      else if (data.includes('\t')) {
        const fields = data.split('\t').map(field => field.trim().replace(/["']/g, ''));
        
        if (fields[0]) updatedFormData.name = fields[0];
        if (fields[1]) updatedFormData.email = fields[1];
        if (fields[2]) updatedFormData.phone = fields[2];
        if (fields[3]) updatedFormData.location = fields[3];
        if (fields[4]) updatedFormData.projectName = fields[4];
        if (fields[5]) updatedFormData.budget = fields[5];
        if (fields[6]) updatedFormData.property = fields[6];
        if (fields[7]) updatedFormData.status = fields[7];
      }
      // 4. Single line - try to extract phone number and email
      else {
        // Extract email
        const emailMatch = data.match(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/);
        if (emailMatch) {
          updatedFormData.email = emailMatch[0];
        }
        
        // Extract phone number (10-digit or with country code)
        const phoneMatch = data.match(/(?:\+91[-\s]?|0)?[6-9]\d{9}/);
        if (phoneMatch) {
          updatedFormData.phone = phoneMatch[0];
        }
        
        // If no email/phone found, treat as name
        if (!emailMatch && !phoneMatch) {
          updatedFormData.name = data;
        }
      }

      setFormData(updatedFormData);
      
      // Debug: Log the updated form data
      console.log("🔍 Updated Form Data After Parse:", updatedFormData);
      console.log("🔍 Name:", updatedFormData.name, "Phone:", updatedFormData.phone);
      
      // Use setTimeout to ensure state is updated before switching modes
      setTimeout(() => {
        setEntryMode("manual"); // Switch back to manual to show filled form
        setPasteData(""); // Clear paste data after successful parsing
      }, 100);
      
      toast({
        title: "✅ Data Parsed Successfully!",
        description: `Form fields have been auto-filled. Found: ${updatedFormData.name ? 'Name' : ''}${updatedFormData.email ? ', Email' : ''}${updatedFormData.phone ? ', Phone' : ''}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error parsing paste data:", error);
      toast({
        title: "❌ Parse Error",
        description: "Could not parse pasted data. Please check the format and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug: Log current form data
    console.log("🔍 Form Data on Submit:", formData);
    console.log("🔍 Name:", formData.name, "Phone:", formData.phone);

    // Updated validation - only name and phone required
    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields (Name, Phone). Current: Name=${formData.name ? '✅' : '❌'}, Phone=${formData.phone ? '✅' : '❌'}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Try local API first, then fallback to production
      let apiUrl = 'https://bcrm.100acress.com/api/leads';
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
        
        // Reset form after successful creation
        setFormData({
          name: "",
          email: "",
          phone: "",
          location: "",
          projectName: "",
          budget: "",
          property: "",
          status: "Cold",
          assignedTo: "",
        });
        
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

  // Helper functions
  const getStatusVariant = (status) => {
    switch (status) {
      case "Hot": return "destructive";
      case "Warm": return "default";
      case "Cold": return "secondary";
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
          {/* Entry Mode Selection */}
          <div className="form-section">
            <div className="entry-mode-buttons">
              <button
                type="button"
                onClick={() => setEntryMode("manual")}
                className={`entry-mode-btn ${entryMode === "manual" ? "active" : ""}`}
              >
                <User size={16} />
                Manual Entry
              </button>
              <button
                type="button"
                onClick={() => setEntryMode("paste")}
                className={`entry-mode-btn ${entryMode === "paste" ? "active" : ""}`}
              >
                <Save size={16} />
                Paste Data
              </button>
            </div>
          </div>

          {/* Paste Data Mode */}
          {entryMode === "paste" && (
            <div className="form-section">
              <div className="section-header">
                Copy data from Excel/Sheet and paste below. Formats supported:
                  <br />• Comma-separated: Name, Email, Phone, Location, Project Name, Budget, Property, Status
                  <br />• Key-value pairs: name: John, email: john@example.com, mobile: 1234567890
                </div>
              <div className="form-group full-width">
                <label htmlFor="pasteData" className="form-label">
                  Paste Data
                </label>
                <textarea
                  id="pasteData"
                  value={pasteData}
                  onChange={handlePasteDataChange}
                  placeholder="Paste your data here... Example formats:&#10;• John, john@example.com, 9876543210, Delhi, Project A, 50L, 2BHK, Hot&#10;• name: John, email: john@example.com, mobile: 9876543210"
                  className="form-input enhanced"
                  rows={4}
                />
                {showParseButton && (
                  <button
                    type="button"
                    onClick={handlePasteData}
                    disabled={!pasteData.trim()}
                    className="parse-data-btn"
                  >
                    <Save size={16} />
                    Parse & Fill Form
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Manual Entry Mode */}
          {entryMode === "manual" && (
            <>
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

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="email" className="form-label">
                  <Mail className="input-icon" />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
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
                <label htmlFor="projectName" className="form-label">
                  <Building className="label-icon" />
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  className="form-input enhanced"
                />
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
            </>
          )}

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
