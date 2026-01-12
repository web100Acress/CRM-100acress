import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/layout/dialog"; // Import DialogFooter
import { Button } from "@/layout/button";
import { X, Save, Loader2 } from "lucide-react"; // Added Loader2 for loading state
import { useToast } from "@/hooks/use-toast"; // Assuming you have useToast setup
import "@/styles/CreateLeadForm.css";

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
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bcrm.100acress.com/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
          description:
            data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description:
          "Could not connect to the server. Please check your connection.",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lead-form-dialog">
        <DialogHeader>
          <DialogTitle className="lead-form-title">Create New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="lead-form-grid">
          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
              required
              className="form-input"
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              required
              className="form-input"
            />
          </div> */}

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter Your Phon Number"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-select"
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
            <label htmlFor="budget">Budget Range</label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select budget</option>
              {budgetOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
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
              {propertyOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
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
              {statusOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">
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
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Unassigned</option>
              {assignableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role === "hod" ? "HOD" : user.role})
                </option>
              ))}
            </select>
            {(currentUserRole === "super-admin" || currentUserRole === "boss") &&
              assignableUsers.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No HODs available to assign leads to
                </p>
              )}
            {currentUserRole === "hod" &&
              assignableUsers.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No Team Leaders or BD available to assign leads to
                </p>
              )}
            {currentUserRole === "team-leader" &&
              assignableUsers.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No BD available to assign leads to
                </p>
              )}
            {!(currentUserRole === "super-admin" || currentUserRole === "boss" || currentUserRole === "hod" || currentUserRole === "team-leader") && (
              <p className="text-xs text-red-500 mt-1">
                You don't have permission to assign leads
              </p>
            )}
          </div>

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
        </form>

      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadForm;
