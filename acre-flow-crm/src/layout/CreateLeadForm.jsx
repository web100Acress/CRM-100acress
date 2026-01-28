import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/layout/dialog";
import { Button } from "@/layout/button";
import {
  X,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Building,
  Target,
  AlertCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "@/styles/CreateLeadForm.css";
import { Badge } from "@/layout/badge";
import { apiUrl, API_ENDPOINTS } from "@/config/apiConfig";

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
  const [duplicateLeads, setDuplicateLeads] = useState([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

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
      setDuplicateLeads([]);
      setShowDuplicateWarning(false);
      fetchAssignableUsers();
    }
  }, [isOpen]); // Depend on isOpen to refetch/reset when opened

  const fetchAssignableUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/leads/assignable-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      let users = json.data || [];

      // Filter users based on current user role
      if (currentUserRole === "super-admin" || currentUserRole === "boss") {
        // Boss can ONLY assign to HOD users
        users = users.filter((user) => user.role === "hod");
        console.log("🔍 Boss assigning leads - Available HODs ONLY:", users);
      } else if (currentUserRole === "hod") {
        // HOD can assign to team-leader and bd users
        users = users.filter(
          (user) => user.role === "team-leader" || user.role === "bd",
        );
        console.log(
          "🔍 HOD assigning leads - Available Team Leaders & BD:",
          users,
        );
      } else if (currentUserRole === "team-leader") {
        // Team Leader can assign to bd users
        users = users.filter((user) => user.role === "bd");
        console.log("🔍 Team Leader assigning leads - Available BD:", users);
      } else if (currentUserRole === "bd" || currentUserRole === "employee") {
        // BD can assign to themselves and potentially other BDs if backend allows
        // For now, let's allow them to see themselves in the list
        users = users.filter(
          (user) =>
            user.role === "bd" || user._id === localStorage.getItem("userId"),
        );
        console.log("🔍 BD assigning leads - Available Users:", users);
      } else {
        // Other roles cannot assign leads - empty list
        users = [];
        console.log("🔍 Other roles cannot assign leads - No users available");
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

    // Check for duplicates when phone or email changes
    if (name === 'phone' || name === 'email') {
      if (value.trim()) {
        checkForDuplicates(name, value.trim());
      } else {
        setDuplicateLeads([]);
        setShowDuplicateWarning(false);
      }
    }
  };

  const checkForDuplicates = async (fieldName, value) => {
    if (!value) return;

    setCheckingDuplicates(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.LEADS_CHECK_DUPLICATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          [fieldName]: value
        }),
      });

      const data = await response.json();
      if (response.ok && data.data && data.data.length > 0) {
        setDuplicateLeads(data.data);
        setShowDuplicateWarning(true);
      } else {
        setDuplicateLeads([]);
        setShowDuplicateWarning(false);
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handlePasteDataChange = (e) => {
    const value = e.target.value;
    setPasteData(value);

    // Auto-detect if pasted data looks like structured data
    const hasStructure =
      value.includes(":") ||
      value.includes(",") ||
      value.includes("\t") ||
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
        assignedTo: formData.assignedTo, // Keep assigned user if already selected
      };

      // Enhanced parsing for different formats

      // 1. Multi-line structured data (like from your screenshot)
      if (data.includes("\n")) {
        const lines = data
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        console.log("🔍 Processing lines:", lines);

        // Process each line to extract labeled data
        lines.forEach((line, index) => {
          console.log(`🔍 Processing line ${index + 1}: "${line}"`);

          // Check for labeled format: "Customer Name: Anand Pal"
          if (
            line.toLowerCase().includes("customer name") ||
            line.toLowerCase().includes("full name")
          ) {
            const nameMatch = line.match(
              /(?:customer name|full name)\s*[:\-]?\s*(.+)/i,
            );
            if (nameMatch) {
              updatedFormData.name = nameMatch[1].trim();
              console.log(`✅ Name found (labeled): ${nameMatch[1]}`);
            }
          }
          // Check for email labels
          else if (
            line.toLowerCase().includes("customer email") ||
            line.toLowerCase().includes("email") ||
            line.toLowerCase().includes("email id")
          ) {
            const emailMatch = line.match(
              /(?:customer email|customer email id|email|email id)\s*[:\-]?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
            );
            if (emailMatch) {
              updatedFormData.email = emailMatch[1].trim();
              console.log(`✅ Email found (labeled): ${emailMatch[1]}`);
            }
          }
          // Check for phone labels
          else if (
            line.toLowerCase().includes("customer mobile") ||
            line.toLowerCase().includes("mobile") ||
            line.toLowerCase().includes("phone") ||
            line.toLowerCase().includes("phon")
          ) {
            const phoneMatch = line.match(
              /(?:customer mobile|customer mobile number|mobile|phone|phon)\s*[:\-]?\s*(\+91\s?)?(\d{10})/i,
            );
            if (phoneMatch) {
              const cleanPhone = phoneMatch[2]; // Get the 10-digit number
              updatedFormData.phone = cleanPhone;
              console.log(`✅ Phone found (labeled): ${cleanPhone}`);
            }
          }
          // Check for project labels
          else if (
            line.toLowerCase().includes("project name") ||
            line.toLowerCase().includes("project")
          ) {
            const projectMatch = line.match(
              /(?:project name|project)\s*[:\-]?\s*(.+)/i,
            );
            if (projectMatch) {
              updatedFormData.projectName = projectMatch[1].trim();
              console.log(`✅ Project found (labeled): ${projectMatch[1]}`);
            }
          }
          // Fallback: Simple extraction for unlabeled data
          else {
            // Simple email detection
            const emailMatch = line.match(
              /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
            );
            if (emailMatch && !updatedFormData.email) {
              updatedFormData.email = emailMatch[1].trim();
              console.log(`✅ Email found (simple): ${emailMatch[1]}`);
              return;
            }

            // Simple phone detection
            const phoneMatch = line.match(/(\+91\s?)?\d{10}/);
            if (phoneMatch && !updatedFormData.phone) {
              const cleanPhone = phoneMatch[0].replace(/[^\d]/g, "");
              if (cleanPhone.length === 10) {
                updatedFormData.phone = cleanPhone;
                console.log(`✅ Phone found (simple): ${cleanPhone}`);
                return;
              }
            }

            // Name/Project extraction (text only)
            const cleanLine = line.replace(/[^\w\s]/g, "").trim();
            if (
              cleanLine &&
              /^[A-Za-z\s]+$/.test(cleanLine) &&
              cleanLine.length > 1
            ) {
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

        console.log("🔍 Final parsed data:", updatedFormData);
      }
      // 2. Key-value pairs format: "name: John, email: john@example.com, mobile: 1234567890"
      else if (data.includes(":")) {
        // Split by comma or new line, then process each key-value pair
        const pairs = data
          .split(/[,\n]/)
          .map((pair) => pair.trim())
          .filter((pair) => pair);

        pairs.forEach((pair) => {
          const colonIndex = pair.indexOf(":");
          if (colonIndex > -1) {
            const key = pair.substring(0, colonIndex).trim().toLowerCase();
            const value = pair
              .substring(colonIndex + 1)
              .trim()
              .replace(/["']/g, "");

            switch (key) {
              case "name":
              case "full name":
              case "customer name":
                updatedFormData.name = value;
                break;
              case "email":
              case "email address":
                updatedFormData.email = value;
                break;
              case "phone":
              case "mobile":
              case "phone number":
              case "contact":
                updatedFormData.phone = value;
                break;
              case "location":
              case "address":
              case "city":
                updatedFormData.location = value;
                break;
              case "project":
              case "project name":
              case "property name":
                updatedFormData.projectName = value;
                break;
              case "budget":
              case "price":
              case "amount":
                updatedFormData.budget = value;
                break;
              case "property":
              case "property type":
              case "property category":
                updatedFormData.property = value;
                break;
              case "status":
              case "lead status":
                updatedFormData.status = value;
                break;
            }
          }
        });
      }
      // 2. Comma-separated values: "John, john@example.com, 1234567890, Delhi, Project A, 50L, 2BHK, Hot"
      else if (data.includes(",")) {
        const fields = data
          .split(",")
          .map((field) => field.trim().replace(/["']/g, ""));

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
      else if (data.includes("\t")) {
        const fields = data
          .split("\t")
          .map((field) => field.trim().replace(/["']/g, ""));

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
      console.log(
        "🔍 Name:",
        updatedFormData.name,
        "Phone:",
        updatedFormData.phone,
      );

      // Use setTimeout to ensure state is updated before switching modes
      setTimeout(() => {
        setEntryMode("manual"); // Switch back to manual to show filled form
        setPasteData(""); // Clear paste data after successful parsing
      }, 100);

      toast({
        title: "✅ Data Parsed Successfully!",
        description: `Form fields have been auto-filled. Found: ${updatedFormData.name ? "Name" : ""}${updatedFormData.email ? ", Email" : ""}${updatedFormData.phone ? ", Phone" : ""}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error parsing paste data:", error);
      toast({
        title: "❌ Parse Error",
        description:
          "Could not parse pasted data. Please check the format and try again.",
        variant: "destructive",
      });
    }
  };

  const fetchPhoneNumbersByRole = async (creatorRole, assignedUserId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const users = data.data || [];

        // Find creator (current user) by ID and assigned user by ID
        const currentUserId = localStorage.getItem("userId");
        const creator = users.find(
          (user) => String(user._id) === String(currentUserId),
        );
        const assignedUser = users.find(
          (user) => String(user._id) === String(assignedUserId),
        );

        console.log(
          "🔍 Creator and Assigned User phone numbers from database:",
          {
            creator: creator
              ? { name: creator.name, role: creator.role, phone: creator.phone }
              : null,
            assignedUser: assignedUser
              ? {
                  name: assignedUser.name,
                  role: assignedUser.role,
                  phone: assignedUser.phone,
                }
              : null,
          },
        );

        // Return only database values - no hardcoded fallbacks
        if (!creator || !assignedUser) {
          throw new Error(
            `Required users not found: ${!creator ? "Creator (" + creatorRole + ") " : ""}${!assignedUser ? "Assigned User" : ""}`,
          );
        }

        if (!creator.phone || !assignedUser.phone) {
          throw new Error(
            `Phone numbers missing: ${!creator.phone ? creator.name : ""}${!assignedUser.phone ? " and " + assignedUser.name : ""}`,
          );
        }

        return {
          creatorPhone: creator.phone,
          assignedUserPhone: assignedUser.phone,
          creatorName:
            creator.name ||
            creator.role.charAt(0).toUpperCase() + creator.role.slice(1),
          assignedUserName:
            assignedUser.name ||
            assignedUser.role.charAt(0).toUpperCase() +
              assignedUser.role.slice(1),
          creatorRole: creator.role,
          assignedUserRole: assignedUser.role,
        };
      } else {
        throw new Error("Failed to fetch users from database");
      }
    } catch (error) {
      console.error("Error fetching phone numbers from database:", error);
      // Return null values to indicate database fetch failed
      return {
        creatorPhone: null,
        assignedUserPhone: null,
        creatorName: null,
        assignedUserName: null,
        creatorRole: null,
        assignedUserRole: null,
        error: error.message,
      };
    }
  };

  const sendRoleBasedWhatsApp = async (leadData, assignedUser) => {
    try {
      const {
        creatorPhone,
        assignedUserPhone,
        creatorName,
        assignedUserName,
        creatorRole,
        assignedUserRole,
        error,
      } = await fetchPhoneNumbersByRole(currentUserRole, assignedUser._id);

      // Check if phone numbers were found in database
      if (!creatorPhone || !assignedUserPhone || error) {
        console.error("❌ Phone numbers not found in database:", error);
        toast({
          title: "⚠️ Phone Numbers Missing",
          description: `Creator or assigned user phone numbers not found in database. Please update user profiles with phone numbers.`,
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      // Clean phone numbers (remove spaces, add +91 if needed)
      const cleanCreatorPhone = creatorPhone.replace(/\s/g, "");
      const cleanAssignedUserPhone = assignedUserPhone.replace(/\s/g, "");

      // Validate phone numbers
      if (!cleanCreatorPhone || !cleanAssignedUserPhone) {
        throw new Error("Invalid phone numbers found in database");
      }

      // Create WhatsApp message from Creator to Assigned User
      const message = `
*New Lead Assigned by ${creatorName}*


*Lead Details:*
• Name: ${leadData.name}
• Phone: ${leadData.phone}
• Email: ${leadData.email || "N/A"}
• Location: ${leadData.location || "N/A"}
• Budget: ${leadData.budget || "N/A"}
• Project: ${leadData.projectName || "N/A"}
• Property: ${leadData.property || "N/A"}
• Status: ${leadData.status || "Cold"}

*Assignment:*
• Assigned To: ${assignedUserName} (${assignedUserRole.toUpperCase()})
• Assigned By: ${creatorName} (${creatorRole.toUpperCase()})

*Action Required:*
Please contact the lead immediately and update the status in CRM.


*CRM Access:*
https://crm.100acress.com/login

---
*This is an automated message from 100acress CRM System*
      `.trim();

      // Send WhatsApp from Creator to Assigned User
      const whatsappUrl = `https://wa.me/91${cleanAssignedUserPhone}?text=${encodeURIComponent(message)}`;

      console.log("🔍 Sending WhatsApp from Creator to Assigned User:", {
        from: `${creatorName} (${creatorRole.toUpperCase()}) - ${cleanCreatorPhone}`,
        to: `${assignedUserName} (${assignedUserRole.toUpperCase()}) - ${cleanAssignedUserPhone}`,
        message: message.substring(0, 100) + "...",
      });

      // Open WhatsApp automatically
      window.open(whatsappUrl, "_blank");

      toast({
        title: "📱 WhatsApp Sent",
        description: `Lead details sent from ${creatorName} to ${assignedUserName}`,
        duration: 4000,
      });
    } catch (error) {
      console.error("Error sending role-based WhatsApp:", error);
      toast({
        title: "❌ WhatsApp Error",
        description: `Failed to send WhatsApp: ${error.message}. Please check phone numbers in database.`,
        variant: "destructive",
        duration: 5000,
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
        description: `Please fill in all required fields (Name, Phone). Current: Name=${formData.name ? "✅" : "❌"}, Phone=${formData.phone ? "✅" : "❌"}`,
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates before submission
    if (showDuplicateWarning && duplicateLeads.length > 0) {
      toast({
        title: "Duplicate Lead Detected",
        description: "Please review the duplicate leads before creating a new one.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Use dynamic apiUrl
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Lead creation response:", data);

      if (response.ok) {
        toast({
          title: "Lead Created Successfully",
          description: "The lead has been added to the CRM.",
          variant: "default",
        });

        onSave && onSave(formData);

        const shouldOpenWhatsAppAfterCreate = !!window.openWhatsAppAfterCreate;

        // AUTOMATIC ROLE-BASED WHATSAPP FORWARDING (skip if Create+WhatsApp button is used)
        if (formData.assignedTo && !shouldOpenWhatsAppAfterCreate) {
          console.log(
            "🔍 Lead assigned - checking for automatic WhatsApp forwarding",
          );

          const assignedUser = assignableUsers.find(
            (user) => String(user._id) === String(formData.assignedTo),
          );

          if (assignedUser) {
            console.log(
              "🔍 Lead assigned to user - sending automatic WhatsApp:",
              assignedUser,
            );

            setTimeout(() => {
              sendRoleBasedWhatsApp(formData, assignedUser);
            }, 1500);
          } else {
            console.log(
              "🔍 Assigned user not found in assignableUsers - no automatic WhatsApp sent",
            );
          }
        } else if (!formData.assignedTo) {
          console.log(
            "🔍 Lead not assigned to anyone - no automatic WhatsApp sent",
          );
        }

        // Create Lead + WhatsApp flow (send to assigned user's DB phone)
        if (shouldOpenWhatsAppAfterCreate) {
          window.openWhatsAppAfterCreate = false;

          const createdLead = data.data || data.payload || data;
          const leadId = createdLead._id || createdLead.id;

          const assignedUserId = createdLead.assignedTo || formData.assignedTo;
          if (!assignedUserId) {
            toast({
              title: "Lead Not Assigned",
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

        onClose();
      } else {
        toast({
          title: "Lead Creation Failed",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lead creation error:", error);
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
    "Sohna Road",
    "Golf Course",
    "Dwarka Expressway",
    "New Gurgaon",
    "Southern Peripheral Road",
    "Golf Course Extn Road",
    "Delhi",
    "Noida",
    "Gurugram",
    "Other",
  ];

  const statusOptions = ["Cold", "Warm", "Hot", "Converted", "Lost"];

  // Helper functions
  const getStatusVariant = (status) => {
    switch (status) {
      case "Hot":
        return "destructive";
      case "Warm":
        return "default";
      case "Cold":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "hod":
        return "HOD";
      case "team-leader":
        return "Team Leader";
      case "bd":
        return "BD";
      case "boss":
        return "Boss";
      default:
        return role;
    }
  };

  const hasAssignmentPermission = () => {
    return [
      "super-admin",
      "boss",
      "hod",
      "team-leader",
      "bd",
      "employee",
    ].includes(currentUserRole);
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
      const message =
        {
          "super-admin": "No HODs available to assign leads to",
          boss: "No HODs available to assign leads to",
          hod: "No Team Leaders or BD available to assign leads to",
          "team-leader": "No BD available to assign leads to",
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
              <DialogTitle className="lead-form-title">
                Create New Lead
              </DialogTitle>
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
              {/* <div className="section-header">
                Copy data from Excel/Sheet and paste below. Formats supported:
                  <br />• Comma-separated: Name, Email, Phone, Location, Project Name, Budget, Property, Status
                  <br />• Key-value pairs: name: John, email: john@example.com, mobile: 1234567890
                  <br />• Multi-line data: Each line with name, email, phone (auto-detected)
                </div> */}
              <div className="form-group full-width">
                <label htmlFor="pasteData" className="form-label">
                  Paste Data
                </label>
                <textarea
                  id="pasteData"
                  value={pasteData}
                  onChange={handlePasteDataChange}
                  placeholder="Paste your data here... Example formats:&#10;• John, john@example.com, 9876543210, Delhi, Project A, 50L, 2BHK, Hot&#10;• name: John, email: john@example.com, mobile: 9876543210&#10;• John Doe&#10;john@example.com&#10;9876543210"
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
                    Paste & Fill Form
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
                      {checkingDuplicates && (
                        <Loader2 size={14} className="animate-spin ml-2 text-blue-600" />
                      )}
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
                        className={`form-input enhanced ${
                          showDuplicateWarning ? 'border-red-300 bg-red-50' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="email" className="form-label">
                      <Mail className="input-icon" />
                      Email Address
                      {checkingDuplicates && (
                        <Loader2 size={14} className="animate-spin ml-2 text-blue-600" />
                      )}
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
                        className={`form-input enhanced ${
                          showDuplicateWarning ? 'border-red-300 bg-red-50' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="form-section">
                <div className="section-header"></div>

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
                          <Badge
                            variant={getStatusVariant(option)}
                            className="status-badge"
                          >
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
                <div className="section-header"></div>
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

          {/* Duplicate Warning Section */}
          {showDuplicateWarning && duplicateLeads.length > 0 && (
            <div className="form-section">
              <div className="duplicate-warning">
                <div className="duplicate-warning-header">
                  <AlertTriangle className="warning-icon" />
                  <div className="warning-content">
                    <h4 className="warning-title">
                      Duplicate Lead{duplicateLeads.length > 1 ? 's' : ''} Found
                    </h4>
                    <p className="warning-description">
                      Existing lead{duplicateLeads.length > 1 ? 's' : ''} with similar contact information found
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDuplicateWarning(false)}
                    className="warning-close"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div className="duplicate-list">
                  {duplicateLeads.map((lead) => (
                    <div key={lead._id} className="duplicate-item">
                      <div className="duplicate-item-content">
                        <div className="duplicate-item-info">
                          <p className="duplicate-name">{lead.name}</p>
                          <p className="duplicate-contact">{lead.phone}</p>
                          {lead.email && (
                            <p className="duplicate-email">{lead.email}</p>
                          )}
                          <div className="duplicate-meta">
                            <Badge className={`status-badge ${
                              lead.status === 'Cold' ? 'status-cold' :
                              lead.status === 'Warm' ? 'status-warm' :
                              lead.status === 'Hot' ? 'status-hot' :
                              'status-default'
                            }`}>
                              {lead.status}
                            </Badge>
                            {lead.assignedTo && (
                              <span className="assigned-info">
                                Assigned: {typeof lead.assignedTo === 'object' ? lead.assignedTo.name : lead.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // View lead details logic here
                            toast({
                              title: "Lead Details",
                              description: `Viewing details for ${lead.name}`,
                            });
                          }}
                          className="view-lead-btn"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="duplicate-footer">
                  <p className="duplicate-footer-text">
                    Please review the existing lead{duplicateLeads.length > 1 ? 's' : ''} before creating a new one.
                  </p>
                </div>
              </div>
            </div>
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
