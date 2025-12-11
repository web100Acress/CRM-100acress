import React, { useState, useEffect } from 'react';
import AdminSidebar from "../components/AdminSidebar";
import api100acress from "../config/api100acressClient";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ChevronLeft, ChevronRight, Search, Menu, X, ChevronDown, User, Settings as SettingsIcon, LogOut } from 'lucide-react';

const ProjectEnquiries = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const adminName = localStorage.getItem('adminName') || 'Admin';
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@example.com';
    setUserInfo({ name: adminName, email: adminEmail });
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    window.location.href = '/login';
  };

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api100acress.get(
        `/userViewAll?limit=${pageSize}&page=${page}&search=${encodeURIComponent(search)}`
      );
      const payload = response.data;
      let rows = payload?.data || payload?.users || (Array.isArray(payload) ? payload : []);
      const filteredRows = rows.filter((r) => !(/footer\s*instant\s*call/i.test((r?.projectName || '').trim())));
      setData(filteredRows);
      setTotal(payload?.total || payload?.data?.[0]?.totalCount || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
      messageApi.error("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1);
    }, 300); // Debounce search input
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);


  const totalPages = Math.ceil(total / pageSize);
  const paginatedData = data;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map(item => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete enquiry for ${item.name}?`)) {
        try {
            await api100acress.delete(`/userdataDelete/delete/${item._id}`);
            messageApi.success(`Deleted enquiry for ${item.name}`);
            fetchData(currentPage);
        } catch(error) {
            console.error("Failed to delete enquiry", error);
            messageApi.error("Failed to delete enquiry.");
        }
    }
  };

  const formatDateTime = (dt) => {
    try {
      return new Date(dt).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (_) {
      return dt || '';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
      {contextHolder}
        {/* <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
              >
                {sidebarOpen ? <X size={24} className="text-gray-700 dark:text-gray-300"/> : <Menu size={24} className="text-gray-700 dark:text-gray-300"/>}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getUserInitials(userInfo?.name)}</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{userInfo?.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{userInfo?.email}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-600 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <User size={16} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <SettingsIcon size={16} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                    >
                      <LogOut size={16} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header> */}

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Project Enquiries</h1>
            </div>
            {/* Search and Controls */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md flex-grow">
                <Search className="ml-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Name, Mobile, or Project..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="px-4 py-3 bg-transparent text-gray-700 dark:text-gray-200 outline-none flex-grow text-base placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Selection Info and Clear */}
              <div className="flex items-center gap-3">
                {selectedIds.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-700 rounded-lg text-sm font-semibold">
                      {selectedIds.length} selected
                    </div>
                    <button
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                      onClick={() => setSelectedIds([])}
                    >
                      Clear
                    </button>
                  </>
                )}
                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg">
                  Export 📥
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 cursor-pointer rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">SR.NO</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">NAME</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">MOBILE</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">PROJECT NAME</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">EMAIL RECEIVED</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">DATE</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <ClipLoader color={"#E53E3E"} loading={loading} size={50} />
                        <p className="text-gray-500 dark:text-gray-400 mt-4">Loading enquiries...</p>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ${
                          selectedIds.includes(item._id)
                            ? 'bg-yellow-50 dark:bg-yellow-900/20'
                            : index % 2 === 0
                              ? 'bg-white dark:bg-gray-800'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                        } hover:bg-blue-50 dark:hover:bg-blue-900/20`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                            className="w-4 h-4 cursor-pointer rounded"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.mobile}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.projectName}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.emailReceived ? 'bg-cyan-100 dark:bg-cyan-900/30 text-teal-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'}`}>
                            {item.emailReceived ? 'True' : 'False'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDateTime(item.createdAt)}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(item)}
                            className="px-3 py-1 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          <p className="text-lg font-medium">No enquiries found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, idx, arr) => {
                  if (idx > 0 && page - arr[idx - 1] > 1) {
                    return [
                      <span key={`ellipsis-${page}`} className="px-2 text-gray-500 dark:text-gray-400">...</span>,
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-red-500 text-white border border-red-500 shadow-md'
                            : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ];
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-red-500 text-white border border-red-500 shadow-md'
                          : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectEnquiries;