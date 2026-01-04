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
        `http://localhost:5001/api/leads/assignable-users`,
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
      if (currentUserRole === "super-admin") {
        // Super admin can only assign to head-admin users
        users = users.filter((user) => user.role === "head-admin");
      } else {
        // Other roles can assign to all users (or implement your logic)
        // For now, keep all users for other roles
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
      const response = await fetch(`http://localhost:5001/api/leads`, {
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
              {currentUserRole === "super-admin" && (
                <span className="text-xs text-gray-500 ml-2">(Only HODs)</span>
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
                  {user.name} ({user.role === "head-admin" ? "HOD" : user.role})
                </option>
              ))}
            </select>
            {currentUserRole === "super-admin" &&
              assignableUsers.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No HODs available to assign leads to
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
