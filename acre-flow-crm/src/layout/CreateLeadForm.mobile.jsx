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
      const data = pasteData.trim();
      if (!data) {
        toast({
          title: "No Data",
          description: "Please paste some data first.",
          variant: "destructive",
        });
        return;
      }

      // Start with fresh form data
      const updatedFormData = {
        name: "",
        email: "",
        phone: "",
        location: "",
        projectName: "",
        budget: "",
        property: "",
        status: "Cold",
        assignedTo: formData.assignedTo
      };

      // Enhanced parsing for different formats

      // 1. Multi-line structured data (like from your screenshot)
      if (data.includes('\n')) {
        const lines = data.split('\n').map(line => line.trim()).filter(line => line);

        console.log('🔍 Processing lines:', lines);

        // Process each line to extract labeled data
        lines.forEach((line, index) => {
          console.log(`🔍 Processing line ${index + 1}: "${line}"`);

          // Check for labeled format: "Customer Name: Anand Pal"
          if (line.toLowerCase().includes('customer name') || line.toLowerCase().includes('full name')) {
            const nameMatch = line.match(/(?:customer name|full name)\s*[:\-]?\s*(.+)/i);
            if (nameMatch) {
              updatedFormData.name = nameMatch[1].trim();
              console.log(`✅ Name found (labeled): ${nameMatch[1]}`);
            }
          }
          // Check for email labels
          else if (line.toLowerCase().includes('customer email') || line.toLowerCase().includes('email') || line.toLowerCase().includes('email id')) {
            const emailMatch = line.match(/(?:customer email|customer email id|email|email id)\s*[:\-]?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
            if (emailMatch) {
              updatedFormData.email = emailMatch[1].trim();
              console.log(`✅ Email found (labeled): ${emailMatch[1]}`);
            }
          }
          // Check for phone labels
          else if (line.toLowerCase().includes('customer mobile') || line.toLowerCase().includes('mobile') || line.toLowerCase().includes('phone') || line.toLowerCase().includes('phon')) {
            const phoneMatch = line.match(/(?:customer mobile|customer mobile number|mobile|phone|phon)\s*[:\-]?\s*(\+91\s?)?(\d{10})/i);
            if (phoneMatch) {
              const cleanPhone = phoneMatch[2]; // Get the 10-digit number
              updatedFormData.phone = cleanPhone;
              console.log(`✅ Phone found (labeled): ${cleanPhone}`);
            }
          }
          // Check for project labels
          else if (line.toLowerCase().includes('project name') || line.toLowerCase().includes('project')) {
            const projectMatch = line.match(/(?:project name|project)\s*[:\-]?\s*(.+)/i);
            if (projectMatch) {
              updatedFormData.projectName = projectMatch[1].trim();
              console.log(`✅ Project found (labeled): ${projectMatch[1]}`);
            }
          }
          // Fallback: Simple extraction for unlabeled data
          else {
            // Simple email detection
            const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (emailMatch && !updatedFormData.email) {
              updatedFormData.email = emailMatch[1].trim();
              console.log(`✅ Email found (simple): ${emailMatch[1]}`);
              return;
            }

            // Simple phone detection
            const phoneMatch = line.match(/(\+91\s?)?\d{10}/);
            if (phoneMatch && !updatedFormData.phone) {
              const cleanPhone = phoneMatch[0].replace(/[^\d]/g, '');
              if (cleanPhone.length === 10) {
                updatedFormData.phone = cleanPhone;
                console.log(`✅ Phone found (simple): ${cleanPhone}`);
                return;
              }
            }

            // Name/Project extraction (text only)
            const cleanLine = line.replace(/[^\w\s]/g, '').trim();
            if (cleanLine && /^[A-Za-z\s]+$/.test(cleanLine) && cleanLine.length > 1) {
              if (!updatedFormData.name) {
                updatedFormData.name = cleanLine;
                console.log(`✅ Name found (simple): ${cleanLine}`);
              } else if (!updatedFormData.projectName) {
                updatedFormData.projectName = cleanLine;
                console.log(`✅ Project found (simple): ${cleanLine}`);
              }
            }
          }
        });

        console.log('🔍 Final parsed data:', updatedFormData);
      }
      // 2. Key-value pairs format: "name: John, email: john@example.com, mobile: 1234567890"
      else if (data.includes(':')) {
        // Split by comma or new line, then process each key-value pair
        const pairs = data.split(/[,\n]/).map(pair => pair.trim()).filter(pair => pair);

        pairs.forEach(pair => {
          const colonIndex = pair.indexOf(':');
          if (colonIndex > -1) {
            const key = pair.substring(0, colonIndex).trim().toLowerCase();
            const value = pair.substring(colonIndex + 1).trim().replace(/["']/g, '');

            switch (key) {
              case 'name':
              case 'full name':
              case 'customer name':
                updatedFormData.name = value;
                break;
              case 'email':
              case 'email address':
              case 'customer email':
                updatedFormData.email = value;
                break;
              case 'phone':
              case 'mobile':
              case 'phone number':
              case 'customer mobile':
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
      // 3. Comma-separated values: "John, john@example.com, 1234567890, Delhi, Project A, 50L, 2BHK, Hot"
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
      // 4. Tab-separated values
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
      // 5. Single field - treat as name
      else {
        updatedFormData.name = data.replace(/["']/g, '').trim();
      }

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

        // Check if WhatsApp should be opened after lead creation
        const shouldOpenWhatsAppAfterCreate = !!window.openWhatsAppAfterCreate;
        
        if (shouldOpenWhatsAppAfterCreate) {
          window.openWhatsAppAfterCreate = false;

          const createdLead = result.data || result.payload || result;
          const leadId = createdLead._id || createdLead.id;

          const assignedUserId = createdLead.assignedTo || formData.assignedTo;
          if (!assignedUserId) {
            toast({
              title: "⚠️ Lead Not Assigned",
              description:
                "Please assign the lead to a user to send WhatsApp notification.",
              variant: "destructive",
              duration: 5000,
            });
          } else {
            let assignedToInfo = "Unassigned";
            const userFromList = assignableUsers.find(
              (u) => String(u._id) === String(assignedUserId),
            );
            if (createdLead.assignedToName) {
              assignedToInfo = createdLead.assignedToName;
            } else if (createdLead.assignedUserName) {
              assignedToInfo = createdLead.assignedUserName;
            } else if (createdLead.assignedUser?.name) {
              assignedToInfo = createdLead.assignedUser.name;
            } else if (userFromList?.name) {
              assignedToInfo = userFromList.name;
            }

            const productionUrl = "https://crm.100acress.com";
            const crmUrl = `${productionUrl}/leads/${leadId}`;

            let phoneNumber = null;
            try {
              const usersResponse = await fetch(`${apiUrl}/api/users`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              if (usersResponse.ok) {
                const usersJson = await usersResponse.json();
                const users = usersJson.data || [];
                const assignedUser = users.find(
                  (u) => String(u?._id) === String(assignedUserId),
                );
                const digits = String(assignedUser?.phone || "").replace(
                  /[^\d]/g,
                  "",
                );
                if (digits) {
                  phoneNumber = digits.startsWith("91") ? digits : `91${digits}`;
                }
              }
            } catch (e) {
              phoneNumber = null;
            }

            if (!phoneNumber) {
              toast({
                title: "⚠️ Phone Number Missing",
                description:
                  "Assigned user's phone number is missing in the database. Please update the assigned user's profile phone.",
                variant: "destructive",
                duration: 5000,
              });
            } else {
              const message = `
New Lead Created!

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || "N/A"}
Location: ${formData.location || "N/A"}
Budget: ${formData.budget || "N/A"}
Project: ${formData.projectName || "N/A"}
Property: ${formData.property || "N/A"}
Status: ${formData.status || "N/A"}

Assigned To: ${assignedToInfo}

*View Lead in CRM*
${crmUrl}

*CRM Login*
https://crm.100acress.com/login
 Notes: New lead successfully created in CRM system
              `.trim();

              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
              setTimeout(() => {
                window.open(whatsappUrl, "_blank");
                toast({
                  title: "WhatsApp Opened",
                  description:
                    "Lead created and WhatsApp opened with details and CRM link. Click send to notify.",
                  duration: 4000,
                });
              }, 1000);
            }
          }
        }

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
      <DialogContent className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-[320px] sm:max-w-[380px] md:max-w-[450px] max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 sm:p-4">
          <DialogTitle className="text-sm sm:text-base font-semibold flex items-center justify-between">
            <span>Create New Lead</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Entry Mode Selection */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={() => setEntryMode("manual")}
              className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md border transition-colors ${
                entryMode === "manual" 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <User size={14} className="sm:hidden" />
              <User size={16} className="hidden sm:block" />
              <span className="hidden sm:inline">Manual Entry</span>
              <span className="sm:hidden">Manual</span>
            </button>
            <button
              type="button"
              onClick={() => setEntryMode("paste")}
              className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md border transition-colors ${
                entryMode === "paste" 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Save size={14} className="sm:hidden" />
              <Save size={16} className="hidden sm:block" />
              <span className="hidden sm:inline">Paste Data</span>
              <span className="sm:hidden">Paste</span>
            </button>
          </div>

          {/* Paste Data Mode */}
          {entryMode === "paste" && (
            <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
             
              <textarea
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                placeholder="John Doe, john@example.com, 9876543210, Gurgaon, Project Name, ₹1 Cr - ₹5 Cr, Residential Projects, Cold"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                rows={3}
              />
              <button
                type="button"
                onClick={handlePasteData}
                disabled={!pasteData.trim()}
                className="w-full flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={14} className="sm:hidden" />
                <Save size={16} className="hidden sm:block" />
                <span className="hidden sm:inline">Parse & Fill Form</span>
                <span className="sm:hidden">Parse</span>
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
