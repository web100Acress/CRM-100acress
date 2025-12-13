import React, { useState, useEffect } from 'react';
import AdminSidebar from "../components/AdminSidebar";
import api100acress from "../config/api100acressClient";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ChevronLeft, ChevronRight, Search, Menu, X, ChevronDown, User, Settings as SettingsIcon, LogOut, Calendar } from 'lucide-react';

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
  const [dateFilter, setDateFilter] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterType, setFilterType] = useState('day'); // 'day' or 'month'
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
      let url = `/userViewAll?limit=${pageSize}&page=${page}&search=${encodeURIComponent(search)}`;
      
      // Add date filter to API call
      if (dateFilter) {
        if (filterType === 'day') {
          url += `&date=${dateFilter}`;
        } else if (filterType === 'month') {
          url += `&month=${dateFilter}`;
        }
      }
      
      console.log('Fetching URL:', url);
      console.log('Date filter:', dateFilter, 'Filter type:', filterType);
      
      const response = await api100acress.get(url);
      const payload = response.data;
      console.log('API Response:', payload);
      
      let rows = payload?.data || payload?.users || (Array.isArray(payload) ? payload : []);
      
      // If date filter is applied and API doesn't support it, filter on frontend
      if (dateFilter && filterType === 'month') {
        const filterYear = new Date(dateFilter).getFullYear();
        const filterMonth = new Date(dateFilter).getMonth();
        
        console.log('Frontend month filtering - Year:', filterYear, 'Month:', filterMonth);
        
        rows = rows.filter((row) => {
          try {
            const rowDate = new Date(row.createdAt || row.date || row.submittedAt);
            return rowDate.getFullYear() === filterYear && rowDate.getMonth() === filterMonth;
          } catch (e) {
            console.warn('Error parsing date for row:', row);
            return false;
          }
        });
        
        console.log('Rows after frontend month filter:', rows.length);
      }
      
      if (dateFilter && filterType === 'day') {
        const filterDate = new Date(dateFilter).toDateString();
        
        console.log('Frontend day filtering - Date:', filterDate);
        
        rows = rows.filter((row) => {
          try {
            const rowDate = new Date(row.createdAt || row.date || row.submittedAt);
            return rowDate.toDateString() === filterDate;
          } catch (e) {
            console.warn('Error parsing date for row:', row);
            return false;
          }
        });
        
        console.log('Rows after frontend day filter:', rows.length);
      }
      
      const filteredRows = rows.filter((r) => !(/footer\s*instant\s*call/i.test((r?.projectName || '').trim())));
      
      console.log('Total rows before footer filter:', rows.length);
      console.log('Total rows after footer filter:', filteredRows.length);
      console.log('Payload total:', payload?.total, 'Data total:', payload?.data?.[0]?.totalCount);
      
      setData(filteredRows);
      
      // For filtered data, use filteredRows length
      const apiTotal = payload?.total || payload?.data?.[0]?.totalCount || 0;
      const finalTotal = dateFilter ? filteredRows.length : (apiTotal > 0 ? apiTotal : filteredRows.length);
      
      console.log('Final total being set:', finalTotal);
      setTotal(finalTotal);
      setCurrentPage(page);
      
      // Log available months for debugging
      if (dateFilter && filterType === 'month') {
        const availableMonths = {};
        (payload?.data || payload?.users || (Array.isArray(payload) ? payload : [])).forEach(row => {
          try {
            const rowDate = new Date(row.createdAt || row.date || row.submittedAt);
            const monthYear = rowDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            availableMonths[monthYear] = (availableMonths[monthYear] || 0) + 1;
          } catch (e) {
            // Skip invalid dates
          }
        });
        console.log('Available months with data:', availableMonths);
      }
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
  }, [search, dateFilter, filterType]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarOpen && !event.target.closest('.calendar-container')) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [calendarOpen]);


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

  const handleDateFilterChange = (date) => {
    if (filterType === 'day') {
      // Format as YYYY-MM-DD for API
      const formattedDate = new Date(date).toISOString().split('T')[0];
      setDateFilter(formattedDate);
    } else if (filterType === 'month') {
      // Format as YYYY-MM for API
      const formattedMonth = new Date(date).toISOString().slice(0, 7);
      setDateFilter(formattedMonth);
    }
    setCalendarOpen(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearDateFilter = () => {
    setDateFilter('');
    setCalendarOpen(false);
    setCurrentPage(1);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (filterType === 'month') {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const generateCalendarDays = (selectedDate = null) => {
    const dateToUse = selectedDate ? new Date(selectedDate) : new Date();
    const currentMonth = dateToUse.getMonth();
    const currentYear = dateToUse.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    return days;
  };

  const generateMonthOptions = () => {
    const months = [];
    const today = new Date();
    
    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date);
    }
    
    return months;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
      {contextHolder}
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

              {/* Calendar Filter */}
              <div className="relative calendar-container">
                <div className="flex items-center gap-2">
                  {/* Filter Type Toggle */}
                  <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                    <button
                      onClick={() => setFilterType('day')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filterType === 'day'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      Day
                    </button>
                    <button
                      onClick={() => setFilterType('month')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filterType === 'month'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      Month
                    </button>
                  </div>

                  {/* Calendar Button */}
                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-200 text-sm">
                      {dateFilter ? formatDateForDisplay(dateFilter) : 'Select Date'}
                    </span>
                    {dateFilter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearDateFilter();
                        }}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </button>
                </div>

                {/* Calendar Dropdown */}
                {calendarOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 min-w-[300px]">
                    {filterType === 'day' ? (
                      /* Day View Calendar */
                      <div>
                        <div className="text-center mb-3 font-semibold text-gray-700 dark:text-gray-200">
                          {(dateFilter ? new Date(dateFilter) : new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-xs mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-center font-medium text-gray-500 dark:text-gray-400 p-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays(dateFilter).map((day, i) => (
                            <div key={i} className="aspect-square min-h-[32px]">
                              {day ? (
                                <button
                                  onClick={() => handleDateFilterChange(day)}
                                  className="w-full h-full flex items-center justify-center rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-sm text-gray-700 dark:text-gray-200 transition-colors border border-gray-100 dark:border-gray-600"
                                >
                                  {day.getDate()}
                                </button>
                              ) : (
                                <div className="border border-transparent" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Month View */
                      <div>
                        <div className="text-center mb-3 font-semibold text-gray-700 dark:text-gray-200">
                          Select Month
                        </div>
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                          {generateMonthOptions().map((month, i) => (
                            <button
                              key={i}
                              onClick={() => handleDateFilterChange(month)}
                              className="w-full text-left px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-sm text-gray-700 dark:text-gray-200 transition-colors"
                            >
                              {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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