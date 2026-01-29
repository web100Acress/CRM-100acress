import React, { useState, useEffect } from "react";
import api100acress from "../../admin/config/api100acressClient"; // For 100acress backend
import Tippy from "@tippyjs/react";
import { Link } from "react-router-dom";
import { MdPeople, MdSearch, MdVisibility } from "react-icons/md";
import { Modal, message } from "antd";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";


const BlogUser = () => {
  const [viewAll, setViewAll] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState('blog'); // Fixed to 'blog' since we only want blog users
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
        
        // Canonicalize role values and filter only blog users
        const normalized = (res.data || [])
          .map(u => ({
            ...u,
            role: canonicalizeRole(u.role),
          }))
          .filter(u => u.role === 'blog'); // Only show blog users
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
    .filter((item) => item.role === 'blog', 'ContentWriter') // Only show blog users
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
      <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="w-full space-y-4">
          {/* Header Controls: Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative w-full">
                <Tippy content={<span>Search by name, email or mobile</span>} animation="scale" theme="light-border">
                  <input
                    type="text"
                    placeholder="Search by name, email or mobile..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 shadow-sm text-base"
                  />
                </Tippy>
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Filters - Mobile First */}
            <div className="space-y-3">
              {/* Filter Title */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
                <button
                  onClick={() => {
                    setRoleFilter('all');
                    setVerifyFilter('all');
                    setSourceFilter('all');
                    setDateFrom('');
                    setDateTo('');
                    setCurrentPage(1);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
                {/* Role filter */}
                <select
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                  value={roleFilter}
                  onChange={(e)=>{ setRoleFilter(e.target.value); setCurrentPage(1); }}
                  title="Filter by role"
                >
                  <option value="all">All Roles</option>
                  {ROLE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* Verified filter */}
                <select
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                  value={verifyFilter}
                  onChange={(e)=>{ setVerifyFilter(e.target.value); setCurrentPage(1); }}
                  title="Filter by email verification"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>

                {/* Source filter */}
                {(() => {
                  const options = Array.from(new Set(viewAll.map(getSourceValue))).filter(Boolean).sort();
                  return (
                    <select
                      className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                      value={sourceFilter}
                      onChange={(e)=>{ setSourceFilter(e.target.value); setCurrentPage(1); }}
                      title="Filter by source"
                    >
                      <option value="all">All Sources</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  );
                })()}

                {/* Date From */}
                <input
                  type="date"
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                  value={dateFrom}
                  onChange={(e)=>{ setDateFrom(e.target.value); setCurrentPage(1); }}
                  title="Registered from date"
                />

                {/* Date To */}
                <input
                  type="date"
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                  value={dateTo}
                  onChange={(e)=>{ setDateTo(e.target.value); setCurrentPage(1); }}
                  title="Registered to date"
                />

                {/* Export CSV */}
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow text-sm font-medium w-full"
                  title="Export filtered users to CSV"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* User Table - Desktop View */}
          <div className="bg-white rounded-xl shadow-2xl border-l-4 border-gradient-to-r from-red-400 to-red-600 p-4 sm:p-6 w-full">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      S No.
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email Verified
                    </th>
                    {/* <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th> */}
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
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-800">
                          <Tippy
                            content={item.name || 'No name'}
                            animation="scale"
                            theme="light"
                            placement="top"
                          >
                            <span className="cursor-help">
                              {truncateText(item.name || 'No name', 10)}
                            </span>
                          </Tippy>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full shadow-sm">
                            {item.email}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full shadow-sm">
                            {item.mobile}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800">
                          {formatLastModified(item.createdAt)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800">
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
                              title="Change user role"
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
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800">
                          <div className="flex items-center gap-1">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                                item.emailVerified
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {item.emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                            {!item.emailVerified && (
                              <button
                                className={`px-2 py-1 text-xs rounded-full ${verifyingEmail[userId] ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
                                onClick={() => handleVerifyEmail(userId)}
                                disabled={!!verifyingEmail[userId]}
                                title="Mark email as verified"
                              >
                                {verifyingEmail[userId] ? 'Verifying...' : 'Verify'}
                              </button>
                            )}
                          </div>
                        </td>
                        {/* <td className="px-3 py-3 whitespace-nowrap text-center text-sm font-medium">
                          <Tippy
                            content={<span>View Property</span>}
                            animation="scale"
                            theme="light-border"
                          >
                            <button 
                              onClick={() => handleViewProperty(userId)}
                              disabled={loadingProperties}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full shadow-md hover:from-red-500 hover:to-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <MdVisibility className="text-lg" /> View
                              Property
                            </button>
                          </Tippy>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {currentRows.map((item, index) => {
                const serialNumber = indexOfFirstRow + index + 1;
                const userId = item._id;
                const meta = getRoleMeta(item.role);
                return (
                  <div key={userId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-500">#{serialNumber}</span>
                        <h3 className="font-medium text-gray-900">{item.name || 'No name'}</h3>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                        item.emailVerified
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">Email:</span>
                        <span className="text-sm text-gray-800 truncate">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">Mobile:</span>
                        <span className="text-sm text-gray-800">{item.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">Date:</span>
                        <span className="text-sm text-gray-800">{formatLastModified(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Role and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Role:</span>
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
                          title="Change user role"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {updatingRole[userId] && (
                          <span className="text-xs text-gray-500">Saving...</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!item.emailVerified && (
                          <button
                            className={`px-3 py-1 text-xs rounded-full ${verifyingEmail[userId] ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
                            onClick={() => handleVerifyEmail(userId)}
                            disabled={!!verifyingEmail[userId]}
                            title="Mark email as verified"
                          >
                            {verifyingEmail[userId] ? 'Verifying...' : 'Verify'}
                          </button>
                        )}
                        {/* <button 
                          onClick={() => handleViewProperty(userId)}
                          disabled={loadingProperties}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full shadow-md hover:from-red-500 hover:to-red-700 transition duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MdVisibility className="text-sm" /> View
                        </button> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination - Mobile Friendly */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              {/* Results count */}
              <div className="text-sm text-gray-600 text-center sm:text-left">
                Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredProjects.length)} of {filteredProjects.length} results
              </div>
              
              {/* Pagination controls */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {(() => {
                  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
                  const windowSize = 3; // Smaller window for mobile
                  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
                  const end = Math.min(totalPages, start + windowSize - 1);
                  const pages = [];
                  for (let p = Math.max(1, end - windowSize + 1); p <= end; p++) pages.push(p);
                  return (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium border text-xs sm:text-sm ${
                          currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 border-gray-200' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      {pages.map((p) => (
                        <button
                          key={p}
                          onClick={() => paginate(p)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold border text-xs sm:text-sm ${
                            currentPage === p 
                              ? 'bg-red-500 text-white border-red-500' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium border text-xs sm:text-sm ${
                          currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 border-gray-200' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
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
      </div>

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
      {contextHolder}
    </>
  );
};

export default BlogUser;
