import React, { useState, useEffect } from "react";
import api100acress from "../config/api100acressClient"; // For 100acress backend
import AdminSidebar from "./AdminSidebar";
import Tippy from "@tippyjs/react";
import { Link } from "react-router-dom";
import { MdPeople, MdSearch, MdVisibility } from "react-icons/md";
import { Modal, message } from "antd";
import { LogOut, ChevronDown, User, Settings as SettingsIcon } from "lucide-react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";


const UserAdmin = () => {
  const [viewAll, setViewAll] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | role values
  const [verifyFilter, setVerifyFilter] = useState('all'); // 'all' | 'verified' | 'unverified'
  const [updatingRole, setUpdatingRole] = useState({}); // { [userId]: boolean }
  const [verifyingEmail, setVerifyingEmail] = useState({}); // { [userId]: boolean }
  const [dateFrom, setDateFrom] = useState(""); // ISO yyyy-mm-dd
  const [dateTo, setDateTo] = useState("");   // ISO yyyy-mm-dd
  const [sourceFilter, setSourceFilter] = useState('all'); // 'all' | source values
  const [viewPropertyModalVisible, setViewPropertyModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Get real-time logged-in user data
    const userName = localStorage.getItem('userName') || localStorage.getItem('adminName') || 'Admin';
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || 'admin@example.com';
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('adminRole') || 'admin';
    
    setUserInfo({ 
      name: userName, 
      email: userEmail,
      role: userRole
    });
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    // Clear all user-related localStorage items
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('sourceSystem');
    
    window.location.href = '/login';
  };

  // Utility function to truncate text
  const truncateText = (text, wordLimit) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Available roles
  const ROLE_OPTIONS = [
    { label: "User", value: "user" },
    { label: "BlogManagement", value: "blog" },
    { label: "Admin", value: "admin" },
    { label: "Agent", value: "agent" },
    { label: "Owner", value: "owner" },
    { label: "Builder", value: "builder" },
    { label: "HR", value: "hr" },
    { label: "Sales Head", value: "sales_head" },
  ];

  // Normalize any incoming role value to one of ROLE_OPTIONS values
  const canonicalizeRole = (role) => {
    try {
      const s = (role || 'user').toString().trim().toLowerCase();
      const allowed = new Set(ROLE_OPTIONS.map(o => o.value));
      return allowed.has(s) ? s : 'user';
    } catch {
      return 'user';
    }
  };

  // Role-based color classes for the select control
  const getRoleClasses = (role) => {
    switch (canonicalizeRole(role)) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'hr':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'agent':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'builder':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'owner':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'blog':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sales_head':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myToken = localStorage.getItem("myToken");
        console.log("UserManagement - myToken from localStorage:", myToken);
        const response = await api100acress.get("/postPerson/view/allusers");
        
        const res = response.data;
        
        // Canonicalize role values so UI select matches the actual role
        const normalized = (res.data || []).map(u => ({
          ...u,
          role: canonicalizeRole(u.role),
        }));
        setViewAll(normalized);
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        messageApi.error('Failed to load users');
      }
    };
    fetchData();
  }, [messageApi]);

  const handleViewProperty = async (userId) => {
    try {
      setLoadingProperties(true);
      setSelectedUserId(userId);
      
      // Fetch user properties
      const res = await api100acress.get(`/postPerson/propertyView/${userId}`);
      
      console.log('✅ User properties response:', res.data);
      
      const responseData = res.data?.data || res.data || res;
      
      // Extract user details
      if (responseData.name || responseData.email || responseData.mobile) {
        setUserDetails({
          name: responseData.name || "N/A",
          email: responseData.email || "N/A",
          mobile: responseData.mobile || "N/A",
        });
      }
      
      // Extract properties array
      const properties = responseData.postProperty || 
                       responseData.properties || 
                       responseData.postProperties ||
                       (Array.isArray(responseData) ? responseData : []);
      
      setUserProperties(properties);
      setViewPropertyModalVisible(true);
      
      if (properties.length === 0) {
        messageApi.info('No properties found for this user');
      }
    } catch (error) {
      console.error('❌ Error fetching user properties:', error);
      messageApi.error(error.response?.data?.message || 'Failed to load user properties');
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleClosePropertyModal = () => {
    setViewPropertyModalVisible(false);
    setSelectedUserId(null);
    setUserProperties([]);
    setUserDetails({ name: "", email: "", mobile: "" });
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsModalVisible(true);
  };

  const handleCloseUserDetailsModal = () => {
    setUserDetailsModalVisible(false);
    setSelectedUser(null);
  };

  // Extract a reasonable "source" value from a user object
  const SOURCE_KEYS = ['source', 'signupSource', 'provider', 'origin'];
  const getSourceValue = (u) => {
    try {
      for (const k of SOURCE_KEYS) {
        const v = u && u[k];
        if (v !== undefined && v !== null && String(v).trim() !== '') {
          return String(v).trim();
        }
      }
      return 'unknown';
    } catch {
      return 'unknown';
    }
  };

  // Helpers for date sorting
  const getTimestampFromId = (id) => {
    if (!id) return 0;
    const hex = id.toString().substring(0, 8);
    return parseInt(hex, 16) * 1000; // Convert to milliseconds
  };

  const getCreatedAtMs = (item) => {
    if (item?.createdAt) {
      const d = new Date(item.createdAt);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    return getTimestampFromId(item?._id);
  };

  // Verify email (optimistic UI)
  const handleVerifyEmail = async (userId) => {
    // optimistic: set emailVerified true locally
    const prev = viewAll;
    setViewAll((list) =>
      list.map((u) => (u._id === userId ? { ...u, emailVerified: true } : u))
    );
    setVerifyingEmail((m) => ({ ...m, [userId]: true }));

    try {
      const myToken = localStorage.getItem("myToken");
      await api100acress.patch(
        `/postPerson/users/${userId}/email-verified`,
        { emailVerified: true },
      );
    } catch (err) {
      console.error("❌ Failed to verify email", err);
      // revert on error
      setViewAll(prev);
      alert("Failed to verify email. Please try again.");
    } finally {
      setVerifyingEmail((m) => ({ ...m, [userId]: false }));
    }
  };

  // Sort by newest first
  const sortedUsers = [...viewAll].sort(
    (a, b) => getCreatedAtMs(b) - getCreatedAtMs(a)
  );

  // Filter out deleted users (frontend simulation)
  const deletedUsers = JSON.parse(localStorage.getItem("deletedUsers") || "[]");

  const filteredProjects = sortedUsers
    .filter((item) => !deletedUsers.includes(item._id)) // Hide deleted users
    .filter((item) => {
      const q = (searchTerm || "").toLowerCase();
      if (!q) return true;
      const name = (item.name || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      const mobile = (item.mobile || "").toString().toLowerCase();
      return (
        name.includes(q) || email.includes(q) || mobile.includes(q)
      );
    })
    // Source filter
    .filter((item) => {
      if (sourceFilter === 'all') return true;
      return getSourceValue(item) === sourceFilter;
    })
    // Date range filter (inclusive)
    .filter((item) => {
      if (!dateFrom && !dateTo) return true;
      const created = getCreatedAtMs(item);
      if (dateFrom) {
        const fromMs = new Date(dateFrom + 'T00:00:00').getTime();
        if (created < fromMs) return false;
      }
      if (dateTo) {
        const toMs = new Date(dateTo + 'T23:59:59').getTime();
        if (created > toMs) return false;
      }
      return true;
    })
    .filter((item) => {
      if (roleFilter === 'all') return true;
      return canonicalizeRole(item.role) === roleFilter;
    })
    .filter((item) => {
      if (verifyFilter === 'all') return true;
      return verifyFilter === 'verified' ? !!item.emailVerified : !item.emailVerified;
    });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProjects.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // CSV Export of filtered users (all pages)
  const exportToCSV = () => {
    const rows = filteredProjects;
    const headers = [
      'S No',
      'Name',
      'Email',
      'Mobile',
      'Role',
      'Email Verified',
      'Created At',
      'User ID',
    ];
    const csv = [headers.join(',')]
      .concat(
        rows.map((u, idx) => {
          const vals = [
            (idx + 1).toString(),
            (u.name || '').replaceAll('"', '""'),
            (u.email || '').replaceAll('"', '""'),
            (u.mobile || '').toString().replaceAll('"', '""'),
            canonicalizeRole(u.role),
            u.emailVerified ? 'Yes' : 'No',
            formatLastModified(u.createdAt || getCreatedAtMs(u)),
            u._id || '',
          ];
          return vals
            .map((v) => `"${v}"`)
            .join(',');
        })
      )
      .join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // UI meta for role badges
  const getRoleMeta = (role) => {
    const r = (role || "user").toLowerCase();
    switch (r) {
      case "admin":
        return { label: "Admin", classes: "bg-red-100 text-red-700" };
      case "hr":
        return { label: "HR", classes: "bg-green-100 text-green-700" };
      case "blog":
        return {
          label: "Content Writer",
          classes: "bg-indigo-100 text-indigo-700",
        };
      case "builder":
        return { label: "Builder", classes: "bg-yellow-100 text-yellow-700" };
      case "owner":
        return { label: "Owner", classes: "bg-orange-100 text-orange-700" };
      case "agent":
        return { label: "Agent", classes: "bg-emerald-100 text-emerald-700" };
      case "client":
        return { label: "Client", classes: "bg-blue-100 text-blue-700" };
      default:
        return { label: "User", classes: "bg-gray-100 text-gray-700" };
    }
  };

  const formatLastModified = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Update role (optimistic UI)
  const handleRoleChange = async (userId, nextRole) => {
    const prev = viewAll;
    // optimistic update
    setViewAll((list) =>
      list.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
    );
    setUpdatingRole((m) => ({ ...m, [userId]: true }));

    try {
      const myToken = localStorage.getItem("myToken");
      await api100acress.patch(
        `/postPerson/users/${userId}/role`,
        { role: nextRole },
      );
    } catch (err) {
      console.error("❌ Failed to update role", err);
      // revert on error
      setViewAll(prev);
      alert("Failed to update role. Please try again.");
    } finally {
      setUpdatingRole((m) => ({ ...m, [userId]: false }));
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    <span className="lg:hidden">User Management</span>
                    <span className="hidden lg:inline">User Management</span>
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs sm:text-sm">{getUserInitials(userInfo?.name)}</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{userInfo?.name}</p>
                      <p className="text-xs text-gray-600 truncate max-w-[120px]">{userInfo?.email}</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors">
                        <User size={14} sm:size={16} className="text-gray-600" />
                        <span className="text-xs sm:text-sm text-gray-700">Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors">
                        <SettingsIcon size={14} sm:size={16} className="text-gray-600" />
                        <span className="text-xs sm:text-sm text-gray-700">Settings</span>
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut size={14} sm:size={16} />
                        <span className="text-xs sm:text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="w-full space-y-4">
          {/* Header Controls: Enhanced Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Left: Enhanced Search */}
              <div className="relative w-full lg:max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdSearch className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name, email, or mobile..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base bg-gray-50 hover:bg-white shadow-sm"
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 016 0zm-1-9a1 1 0 00-2 1 1 0 002 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Right: Enhanced Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start w-full">
                {/* Role Filter */}
                <div className="relative w-full">
                  <select
                    className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer"
                    value={roleFilter}
                    onChange={(e)=>{ setRoleFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="all">👥 All Roles</option>
                    {ROLE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293 3.293a1 1 0 001.414 1.414l-4-4a1 1 0 00-1.414 0L5.586 8.707a1 1 0 00-1.414-1.414l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Email Verification Filter */}
                <div className="relative w-full">
                  <select
                    className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer w-full"
                    value={verifyFilter}
                    onChange={(e)=>{ setVerifyFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="all">✉️ All Status</option>
                    <option value="verified">✅ Verified</option>
                    <option value="unverified">❌ Unverified</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293 3.293a1 1 0 001.414 1.414l-4-4a1 1 0 00-1.414 0L5.586 8.707a1 1 0 00-1.414-1.414l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Source Filter */}
                <div className="relative w-full">
                  {(() => {
                    const options = Array.from(new Set(viewAll.map(getSourceValue))).filter(Boolean).sort();
                    return (
                      <select
                        className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer w-full"
                        value={sourceFilter}
                        onChange={(e)=>{ setSourceFilter(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="all">🌐 All Sources</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    );
                  })()}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293 3.293a1 1 0 001.414 1.414l-4-4a1 1 0 00-1.414 0L5.586 8.707a1 1 0 00-1.414-1.414l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Date Range */}
                <div className="col-span-full sm:col-span-2 lg:col-span-4 flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer w-full"
                      value={dateFrom}
                      onChange={(e)=>{ setDateFrom(e.target.value); setCurrentPage(1); }}
                      title="From date"
                    />
                  </div>
                  <span className="text-gray-500 px-2 hidden sm:inline">to</span>
                  <div className="relative flex-1">
                    <input
                      type="date"
                      className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer w-full"
                      value={dateTo}
                      onChange={(e)=>{ setDateTo(e.target.value); setCurrentPage(1); }}
                      title="To date"
                    />
                  </div>
                </div>

                {/* Export Button */}
                <div className="col-span-full sm:col-span-2 lg:col-span-4 flex justify-center">
                  <button
                    onClick={exportToCSV}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
                    title="Export filtered users to CSV"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H3a1 1 0 01-1-2zm3.293-7.707a1 1 0 011.414 0L10 10.586l3.293 3.293a1 1 0 001.414 1.414l-4-4a1 1 0 00-1.414 0L5.586 8.707a1 1 0 00-1.414-1.414l4-4z" clipRule="evenodd" />
                    </svg>
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-xl shadow-2xl border-l-4 border-gradient-to-r from-red-400 to-red-600 p-6 w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      S No.
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="hidden md:table-cell px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mobile Number
                    </th>
                    <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email Verified
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRows.map((item, index) => {
                    const serialNumber = indexOfFirstRow + index + 1;
                    const userId = item._id;
                    const meta = getRoleMeta(item.role);
                    return (
                      <tr
                        key={userId}
                        className="group even:bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {serialNumber}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800 max-w-[150px] truncate">
                          <Tippy
                            content={item.name || 'No name'}
                            animation="scale"
                            theme="light"
                            placement="top"
                          >
                            <span className="cursor-help">
                              {truncateText(item.name || 'No name', 13)}
                            </span>
                          </Tippy>
                        </td>
                        <td className="hidden md:table-cell px-3 py-3 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full shadow-sm">
                            {item.email}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-3 py-3 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full shadow-sm">
                            {item.mobile}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-3 py-3 whitespace-nowrap text-sm text-gray-800">
                          {formatLastModified(item.createdAt)}
                        </td>
                        <td className="hidden lg:table-cell px-3 py-3 whitespace-nowrap text-sm text-gray-800">
                          <div className="flex items-center">
                            <select
                              className={`px-2 py-1 border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-red-500 ${getRoleClasses(item.role)} ${
                                updatingRole[userId]
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={!!updatingRole[userId]}
                              value={canonicalizeRole(item.role)}
                              onChange={(e) =>
                                handleRoleChange(userId, e.target.value)
                              }
                            >
                              {ROLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {updatingRole[userId] && (
                              <span className="ml-1 text-xs text-gray-500">Saving...</span>
                            )}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-3 py-3 whitespace-nowrap text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                item.emailVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.emailVerified ? "Verified" : "Not Verified"}
                            </span>
                            <button
                              onClick={() => handleVerifyEmail(userId)}
                              disabled={!!verifyingEmail[userId] || item.emailVerified}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {verifyingEmail[userId] ? "..." : "Verify"}
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleViewUserDetails(item)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm w-full"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {(() => {
                const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
                const windowSize = 5; // how many pages to show around current
                const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
                const end = Math.min(totalPages, start + windowSize - 1);
                const pages = [];
                for (let p = Math.max(1, end - windowSize + 1); p <= end; p++) pages.push(p);
                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                    >
                      Previous
                    </button>
                    {pages.map((p) => (
                      <button
                        key={p}
                        onClick={() => paginate(p)}
                        className={`w-10 h-10 rounded-lg font-semibold border ${currentPage === p ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                    >
                      Next
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      </main>

      {/* View Property Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 -m-6 p-4 rounded-t-lg">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
              <MdVisibility className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">User Properties</span>
          </div>
        }
        open={viewPropertyModalVisible}
        onCancel={handleClosePropertyModal}
        footer={[
          <button
            key="close"
            onClick={handleClosePropertyModal}
            className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Close
          </button>
        ]}
        width={1000}
        centered
        className="elegant-modal"
        styles={{
          body: { padding: '24px', borderRadius: '12px' },
          maskBg: 'rgba(0, 0, 0, 0.5)',
          content: { borderRadius: '16px', overflow: 'hidden' }
        }}
      >
        {loadingProperties ? (
          <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-200 to-purple-200 border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-gray-700 font-medium text-lg">Loading properties...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the information</p>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {/* User Details */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl mb-6 shadow-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-md">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">User Information</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label>
                  <p className="text-base font-medium text-gray-800 mt-1">{userDetails.name || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-50">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                  <p className="text-base font-medium text-gray-800 mt-1 break-all">{userDetails.email || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-50">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</label>
                  <p className="text-base font-medium text-gray-800 mt-1">{userDetails.mobile || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Properties List */}
            {userProperties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No properties found for this user.</p>
                <Link 
                  to={`/Admin/viewproperty/${selectedUserId}`}
                  className="mt-4 inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Go to Property Management
                </Link>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Properties ({userProperties.length})
                </h3>
                <div className="space-y-4">
                  {userProperties.map((property, index) => (
                    <div 
                      key={property._id || index} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Property Name</label>
                          <p className="text-base font-medium">{property.propertyName || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Type</label>
                          <p className="text-base">{property.propertyType || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">City</label>
                          <p className="text-base">{property.city || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Price</label>
                          <p className="text-base font-semibold text-red-600">
                            {property.price ? `₹${property.price.toLocaleString()}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {(property.address || property.landMark) && (
                        <div className="mt-2">
                          <label className="text-sm font-semibold text-gray-600">Address</label>
                          <p className="text-base">{property.address || property.landMark}</p>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Link 
                          to={`/Admin/viewproperty/${selectedUserId}`}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-green-50 -m-6 p-4 rounded-t-lg">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg">
              <MdPeople className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">User Details</span>
          </div>
        }
        open={userDetailsModalVisible}
        onCancel={handleCloseUserDetailsModal}
        footer={null}
        width={600}
        className="user-details-modal"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label>
                  <p className="text-base font-medium text-gray-900">{selectedUser.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                  <p className="text-base text-gray-800">{selectedUser.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile Number</label>
                  <p className="text-base text-gray-800">{selectedUser.mobile || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration Date</label>
                  <p className="text-base text-gray-800">{formatLastModified(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">Account Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${getRoleClasses(selectedUser.role)} ${
                        updatingRole[selectedUser._id]
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={!!updatingRole[selectedUser._id]}
                      value={canonicalizeRole(selectedUser.role)}
                      onChange={(e) =>
                        handleRoleChange(selectedUser._id, e.target.value)
                      }
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {updatingRole[selectedUser._id] && (
                      <span className="text-sm text-gray-500">Updating...</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Verification</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                        selectedUser.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                    {!selectedUser.emailVerified && (
                      <button
                        onClick={() => handleVerifyEmail(selectedUser._id)}
                        disabled={!!verifyingEmail[selectedUser._id]}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {verifyingEmail[selectedUser._id] ? "..." : "Verify Email"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseUserDetailsModal}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCloseUserDetailsModal();
                  handleViewProperty(selectedUser._id);
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Properties
              </button>
            </div>
          </div>
        )}
      </Modal>

      {contextHolder}
      </div>
    </div>
    </>
  );
};

export default UserAdmin;
