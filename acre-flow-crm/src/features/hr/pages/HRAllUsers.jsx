import React, { useState, useEffect } from "react";
import { FaSearch, FaUsers, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import api100acress from "../../admin/config/api100acressClient";

const HRAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      filterUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [users, searchText, statusFilter, roleFilter]);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("myToken") || localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        return;
      }

      const response = await api100acress.get("/postPerson/view/allusers");

      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data || []);
      } else {
        alert(response.data?.message || "Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(error.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    setFilteredUsers(filtered);
  };

  const handleAuthorize = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      const token =
        localStorage.getItem("myToken") || localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        return;
      }

      const newStatus =
        currentStatus === "authorized" ? "unauthorized" : "authorized";

      const response = await api100acress.patch(`/api/users/${userId}`, { status: newStatus });

      if (response.data && response.data.success) {
        fetchAllUsers();
      } else {
        alert(response.data?.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const getStats = () => {
    const total = users.length;
    const authorized = users.filter((u) => u.status === "authorized").length;
    const unauthorized = users.filter((u) => u.status !== "authorized").length;
    return { total, authorized, unauthorized };
  };

  const stats = getStats();
  const uniqueRoles = [...new Set(users.map((u) => u.role).filter(Boolean))];

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      hr: "bg-green-100 text-green-800",
      it: "bg-blue-100 text-blue-800",
      seller: "bg-orange-100 text-orange-800",
      builder: "bg-purple-100 text-purple-800",
      agent: "bg-cyan-100 text-cyan-800",
      sales_head: "bg-indigo-100 text-indigo-800",
      sales_executive: "bg-sky-100 text-sky-800",
      hr_manager: "bg-emerald-100 text-emerald-800",
      hr_executive: "bg-teal-100 text-teal-800",
      blog_manager: "bg-amber-100 text-amber-800",
      blog_writer: "bg-yellow-100 text-yellow-800",
      super_admin: "bg-rose-100 text-rose-800",
    };
    return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
        <div className="bg-gray-100 min-h-screen overflow-x-hidden">
            <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto">
        <div className="w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 sm:p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{stats.total}</p>
                </div>
                <FaUsers className="text-blue-400 text-2xl sm:text-3xl opacity-70" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 sm:p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Authorized</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{stats.authorized}</p>
                </div>
                <FaCheckCircle className="text-green-400 text-2xl sm:text-3xl opacity-70" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 sm:p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Unauthorized</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">{stats.unauthorized}</p>
                </div>
                <FaTimesCircle className="text-red-400 text-2xl sm:text-3xl opacity-70" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Filters */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
                <div className="relative lg:col-span-2">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="all">All Status</option>
                  <option value="authorized">Authorized</option>
                  <option value="unauthorized">Unauthorized</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="all">All Roles</option>
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>
                      {role?.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
                <span>Showing {filteredUsers.length} of {users.length} users</span>
                <button
                  onClick={fetchAllUsers}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>

            {/* Table - Desktop (lg and above) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {user.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-blue-600 text-xs">
                          {user.email || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role?.toUpperCase() || "USER"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "authorized"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {user.status === "authorized" ? "Authorized" : "Unauthorized"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleAuthorize(user._id, user.status)}
                            disabled={actionLoading === user._id}
                            className={`px-3 py-1 text-xs font-medium rounded transition ${
                              user.status === "authorized"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            } disabled:opacity-50`}
                          >
                            {actionLoading === user._id ? "..." : user.status === "authorized" ? "Revoke" : "Authorize"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table - Tablet (md to lg) */}
            <div className="hidden md:block lg:hidden overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Role</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-6 text-center text-gray-500 text-xs">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-6 text-center text-gray-500 text-xs">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-3 py-2 font-medium text-gray-900 truncate">
                          {user.name || "—"}
                        </td>
                        <td className="px-3 py-2 text-blue-600 text-xs truncate">
                          {user.email || "—"}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role?.slice(0, 8)?.toUpperCase() || "USER"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block text-xs font-medium ${
                            user.status === "authorized"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}>
                            {user.status === "authorized" ? "✓" : "✕"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleAuthorize(user._id, user.status)}
                            disabled={actionLoading === user._id}
                            className={`px-2 py-1 text-xs font-medium rounded transition ${
                              user.status === "authorized"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            } disabled:opacity-50`}
                          >
                            {actionLoading === user._id ? "..." : user.status === "authorized" ? "Revoke" : "Auth"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards - Extra Small Mobile */}
            <div className="md:hidden divide-y divide-gray-200">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-xs">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs">No users found</div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user._id} className="p-3 sm:p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{user.name || "—"}</h3>
                        <p className="text-xs text-blue-600 truncate">{user.email || "—"}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                        user.status === "authorized"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.status === "authorized" ? "✓" : "✕"}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role?.toUpperCase() || "USER"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewingUser(user)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded transition bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        <FaEye size={12} />
                        <span className="hidden xs:inline">Details</span>
                      </button>
                      <button
                        onClick={() => handleAuthorize(user._id, user.status)}
                        disabled={actionLoading === user._id}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded transition ${
                          user.status === "authorized"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } disabled:opacity-50`}
                      >
                        {actionLoading === user._id ? "..." : user.status === "authorized" ? "Revoke" : "Auth"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Mobile Details */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="text-xl text-gray-600">✕</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600">Name</p>
                <p className="text-gray-900 font-medium text-sm">{viewingUser.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">Email</p>
                <p className="text-gray-900 text-sm break-all">{viewingUser.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">Role</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getRoleBadgeColor(viewingUser.role)}`}>
                  {viewingUser.role?.toUpperCase() || "USER"}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                  viewingUser.status === "authorized"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {viewingUser.status === "authorized" ? "Authorized" : "Unauthorized"}
                </span>
              </div>
            </div>

            <div className="pt-4 flex gap-2 border-t border-gray-200">
              <button
                onClick={() => {
                  handleAuthorize(viewingUser._id, viewingUser.status);
                  setViewingUser(null);
                }}
                className={`flex-1 px-4 py-2 text-xs font-medium rounded transition ${
                  viewingUser.status === "authorized"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {viewingUser.status === "authorized" ? "Revoke Access" : "Authorize"}
              </button>
              <button
                onClick={() => setViewingUser(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 text-xs font-medium rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRAllUsers; 