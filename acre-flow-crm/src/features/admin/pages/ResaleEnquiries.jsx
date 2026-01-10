import React, { useEffect, useState } from "react";
import api100acress from "../config/api100acressClient"; // For 100acress backend
import AdminSidebar from "../components/AdminSidebar";
import { message } from "antd"; // Assuming Ant Design message is available
import { ClipLoader } from "react-spinners"; // Assuming react-spinners is installed for loading indicator
import { LogOut, ChevronDown, User, Settings as SettingsIcon, X } from 'lucide-react';

const ResaleEnquiries = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [agentNames, setAgentNames] = useState({});
  const [agentEmails, setAgentEmails] = useState({});

  const itemsPerPage = 10;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const userName = localStorage.getItem('userName') || localStorage.getItem('adminName') || 'Admin';
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || 'admin@example.com';
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('adminRole') || 'admin';
    setUserInfo({ name: userName, email: userEmail, role: userRole });
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('sourceSystem');
    localStorage.removeItem('originalRole');
    localStorage.removeItem('myToken');
    localStorage.removeItem('isDeveloperLoggedIn');
    localStorage.removeItem('isHrFinanceLoggedIn');
    localStorage.removeItem('isSalesHeadLoggedIn');
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('isItLoggedIn');
    window.location.href = '/login';
  };

  const openDetails = (item) => {
    setSelectedEnquiry(item);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedEnquiry(null);
  };

  // Function to fetch agent details by agent ID or number
  const fetchAgentDetails = async (agentId, agentNumber) => {
    if (!agentId && !agentNumber) {
      console.log('No agent ID or number provided');
      return null;
    }
    
    const cacheKey = agentId || agentNumber;
    if (agentNames[cacheKey]) {
      console.log(`Agent ${cacheKey} already in cache`);
      return agentNames[cacheKey];
    }
    
    console.log(`Fetching agent details for:`, { agentId, agentNumber });
    
    try {
      let response;
      if (agentId) {
        // Try to get agent by ID first (for property poster)
        console.log("Making API call to: /agent/getAgentById/" + agentId);
        response = await api100acress.get(`/agent/getAgentById/${agentId}`);
      } else if (agentNumber) {
        // Fallback to getting agent by number
        console.log("Making API call to: /agent/getByNumber/" + agentNumber);
        response = await api100acress.get(`/agent/getByNumber/${agentNumber}`);
      }
      
      console.log('API Response:', response?.data);
      
      if (response?.data?.name) {
        const agentName = response.data.name;
        console.log(`Found agent:`, agentName);
        setAgentNames(prev => ({
          ...prev,
          [cacheKey]: agentName
        }));
        return agentName;
      } else {
        console.log('No agent details found in response');
        return null;
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: error.request ? 'Request was made but no response received' : 'No request was made',
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      // Set a default value to prevent repeated failed requests
      setAgentNames(prev => ({
        ...prev,
        [cacheKey]: 'Agent not found'
      }));
      
      return null;
    }
  };
  
  // For backward compatibility
  const fetchAgentName = (agentNumber) => fetchAgentDetails(null, agentNumber);

  // Function to extract name from email
  const getNameFromEmail = (email) => {
    if (!email) return null;
    const username = email.split('@')[0];
    const nameParts = username.split(/[.\-_]/);
    return nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };

  // Function to get agent name with network error resilience
  const getAgentDisplayName = (item) => {
    // First priority: Use agentName from item if available
    if (item.agentName) {
      return item.agentName;
    }
    
    // Second priority: Use cached name from agentNames
    const cacheKey = item.agentNumber || item.agentEmail;
    if (cacheKey && agentNames[cacheKey]) {
      return agentNames[cacheKey];
    }
    
    // Third priority: Try to extract name from email
    if (item.agentEmail) {
      return getNameFromEmail(item.agentEmail);
    }
    
    // Final fallback
    return item.agentNumber || 'N/A';
  };
  
  // Function to fetch agent's actual name from the database with rate limiting
  const fetchAgentByEmail = async (email, agentNumber) => {
    if (!email) return;
    
    // Skip API call if we already have a name from the item
    if (agentNumber?.name) {
      setAgentNames(prev => ({
        ...prev,
        [agentNumber || email]: agentNumber.name
      }));
      return agentNumber.name;
    }
    
    // Skip API call if we already have this email in cache
    const cacheKey = agentNumber || email;
    if (agentNames[cacheKey]) {
      return agentNames[cacheKey];
    }
    
    // Skip API call if we can extract a reasonable name from email
    const emailName = email ? getNameFromEmail(email) : null;
    if (emailName) {
      setAgentNames(prev => ({
        ...prev,
        [cacheKey]: emailName
      }));
      return emailName;
    }
    
    // Only make API call as last resort
    try {
      const response = await api100acress.get("/api/agents/by-email", {
        params: { email },
        timeout: 2000, // Shorter timeout
      });
      
      if (response.data?.name) {
        setAgentNames(prev => ({
          ...prev,
          [cacheKey]: response.data.name
        }));
        return response.data.name;
      }
    } catch (error) {
      // Silently fail - we already have fallbacks in place
      console.debug('Agent name fetch failed, using fallback:', error.message);
    }
    
    return null;
  };

  const fetchEnquiriesData = async () => {
    setLoading(true);
    try {
      const res = await api100acress.get("/postEnq_view");
      
      // Normalize array shape and sort by createdAt descending (newest first)
      const payload = res.data;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];
      const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Process agent emails and fetch names
      sorted.forEach(item => {
        if (item.agentEmail) {
          fetchAgentByEmail(item.agentEmail, item.agentNumber);
        }
      });
      
      // Set enquiries after processing
      setEnquiries(sorted);
    } catch (error) {
      console.error("Error fetching resale enquiries:", error);
      messageApi.open({
        type: "error",
        content: "Failed to fetch resale enquiries. Please try again.",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiriesData();
  }, []);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filter = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // 🐛 FIX: Changed the filtering logic
  const filteredEnquiries = enquiries.filter((item) => {
    // Check if item and relevant properties exist before calling toLowerCase()
    const customerName = item.custName ? item.custName.toLowerCase() : '';
    const propertyAddress = item.propertyAddress ? item.propertyAddress.toLowerCase() : '';

    // You can add more fields here if needed for search
    return customerName.includes(search) || propertyAddress.includes(search);
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  const loadMore = () => {
    if (currentPage * itemsPerPage < filteredEnquiries.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const loadBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const downloadExcelFile = async () => {
    setDownloadProgress(1);
    try {
      const response = await api100acress.get("/postEnq_download", {
        responseType: "blob",
        onDownloadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setDownloadProgress(progress);
          }
        },
      });

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : "resale_enquiries.xlsx";
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      messageApi.open({
        type: "success",
        content: "File downloaded successfully!",
        duration: 2,
      });
    } catch (error) {
      console.error('Error downloading the file:', error);
      messageApi.open({
        type: "error",
        content: "Error downloading file. Please try again.",
        duration: 3,
      });
    } finally {
      setDownloadProgress(0);
    }
  };

  // Delete a resale enquiry by id (ensure backend route matches)
  const handleDelete = async (item) => {
    try {
      const confirmDelete = window.confirm(`Delete resale enquiry for ${item?.custName || item?.custEmail || item?._id}?`);
      if (!confirmDelete) return;
      const res = await api100acress.delete(`/postEnq_delete/${item._id}`);
      
      if (res.status === 200) {
        messageApi.success('Deleted successfully');
        fetchEnquiriesData();
      } else {
        throw new Error('Non-200 response');
      }
    } catch (e) {
      console.error(e);
      messageApi.error('Failed to delete');
    }
  };

  // Format date + time like: 02 September 2025, 11:22:05 AM
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
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        {contextHolder}

        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                <span className="lg:hidden">Resale</span>
                <span className="hidden lg:inline">Resale Enquiries</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  type="button"
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
                    <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors" type="button">
                      <User size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors" type="button">
                      <SettingsIcon size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                      type="button"
                    >
                      <LogOut size={16} />
                      <span className="text-xs sm:text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
          <div className="w-full space-y-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 mb-4">
          <div className="flex items-center bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.08)] overflow-hidden w-full lg:max-w-[450px] border border-[#d4dbe8]">
            <input
              type="text"
              placeholder="Search by Customer Name or Address..."
              className="flex-1 px-[15px] py-2 border-0 outline-none text-[14px] text-[#2c3e50] placeholder:text-[#9ab0c4] focus:outline-none focus:ring-4 focus:ring-[#6c5ce7]/25"
              onChange={filter}
              value={search}
            />
            <button
              className="px-[15px] py-2 bg-gradient-to-r from-[#6c5ce7] to-[#5b4ddf] text-white cursor-pointer font-semibold text-[14px] transition-all duration-200 hover:from-[#5b4ddf] hover:to-[#4a3ec4] hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(108,92,231,0.5)]"
              type="button"
            >
              Search
            </button>
          </div>
          {downloadProgress > 0 ?
            <button
              className="inline-flex items-center justify-center gap-2 px-[15px] py-2 rounded-[10px] cursor-not-allowed font-semibold text-[14px] bg-[#f0f4f7] text-[#7f8c8d] shadow-none animate-pulse w-full lg:w-auto"
              type="button"
            >
              <ClipLoader color="#C13B44" size={20} />
              <span className="font-bold text-[#2c3e50]">{downloadProgress}%</span>
            </button>
            :
            <button
              className="px-[15px] py-2 rounded-[10px] cursor-pointer font-semibold text-[14px] bg-gradient-to-r from-[#1abc9c] to-[#16a085] shadow-[0_5px_20px_rgba(26,188,156,0.3)] transition-all duration-200 hover:from-[#16a085] hover:to-[#117d6b] hover:shadow-[0_8px_25px_rgba(26,188,156,0.4)] hover:-translate-y-[3px] w-full lg:w-auto"
              onClick={downloadExcelFile}
              type="button"
            >
              Export to csv 📥
            </button>
          }
        </div>

        <div className="sm:hidden space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="flex items-center justify-center">
                <ClipLoader color="#6750A4" size={30} />
              </div>
              <p className="mt-3 text-sm text-gray-600">Loading enquiries...</p>
            </div>
          ) : selectedEnquiries.length > 0 ? (
            selectedEnquiries.map((item, index) => (
              <div key={item?._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">#{startIndex + index + 1}</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.custName || 'N/A'}</p>
                    <p className="text-xs text-gray-600 truncate">🏠 {item.propertyAddress || 'No address'}</p>
                    <p className="text-xs text-gray-600">📅 {formatDateTime(item.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                      onClick={() => openDetails(item)}
                      type="button"
                    >
                      View
                    </button>
                    <button
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#ef4444] text-white text-xs font-semibold hover:bg-[#dc2626]"
                      onClick={() => handleDelete(item)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="px-3 py-2 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                    👤 {getAgentDisplayName(item)}
                  </div>
                  <div className="px-3 py-2 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                    📱 {item.agentNumber || 'N/A'}
                  </div>
                  {item.agentEmail && (
                    <div className="px-3 py-2 rounded-md bg-purple-100 text-purple-800 text-xs truncate">
                      ✉️ {item.agentEmail}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <p className="text-sm text-gray-600">No resale enquiries found matching your criteria.</p>
            </div>
          )}
        </div>

        <div className="hidden sm:block overflow-x-auto bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.08)] mb-12 border border-[#e0e6ed]">
          <table className="w-full border-separate border-spacing-0 bg-white rounded-[10px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
            <thead>
              <tr>
                <th scope="col" className="px-[15px] py-[10px] text-left font-bold text-[13px] text-[#34495e] bg-[#f8f9fa] border-b border-[#e9ecef] rounded-tl-[10px]">Sr.No</th>
               <th scope="col" className="px-[15px] py-[10px] text-left font-bold text-[13px] text-[#34495e] bg-[#f8f9fa] border-b border-[#e9ecef]">
                  <div>Agent Details</div>
                  <div className="text-sm font-normal">Number, Name & Email</div>
                </th>
             
               <th scope="col" className="px-[15px] py-[10px] text-left font-bold text-[13px] text-[#34495e] bg-[#f8f9fa] border-b border-[#e9ecef]">
                  <div>Costomer Details</div>
                  <div className="text-sm font-normal">Number, Name & Email</div>
                </th>
                <th scope="col" className="px-[15px] py-[10px] text-left font-bold text-[13px] text-[#34495e] bg-[#f8f9fa] border-b border-[#e9ecef]">Property Address</th>
                <th scope="col" className="px-[15px] py-[10px] text-left font-bold text-[13px] text-[#34495e] bg-[#f8f9fa] border-b border-[#e9ecef]">Date</th>
                <th scope="col" className="px-[15px] py-[10px] text-left font-bold text-[13px] text-[#34495e] bg-[#f8f9fa] border-b border-[#e9ecef] rounded-tr-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-10 text-[#8898aa] text-[1.2rem] italic font-medium bg-white rounded-b-[10px]">
                    <ClipLoader color="#6750A4" size={30} />
                    <p>Loading enquiries...</p>
                  </td>
                </tr>
              ) : selectedEnquiries.length > 0 ? (
                selectedEnquiries.map((item, index) => (
                  <tr key={item?._id} className="even:bg-[#fbfcfe] hover:bg-[#e6f7ff] transition-[background-color,transform] duration-300 hover:scale-[1.005] hover:shadow-[inset_0_0_0_1px_rgba(108,92,231,0.1)]">
                    <td className="px-[15px] py-[10px] border-b border-[#e9ecef] align-top leading-[1.4]">{startIndex + index + 1}</td>
                    <td className="px-[15px] py-[10px] border-b border-[#e9ecef] align-top leading-[1.4]">
                      <div className="flex flex-col space-y-1">

                                                
                        {/* Agent Name */}
                        <div className="px-3 py-1.5 rounded-md bg-green-100 text-green-800 text-sm font-medium">
                          👤 {getAgentDisplayName(item)}
                        </div>
                        
                        {/* Agent Number */}
                        <div className="px-3 py-1.5 rounded-md bg-blue-100 text-blue-800 text-sm font-medium">
                          📱 {item.agentNumber || 'N/A'}
                        </div>

                        {/* Agent Email */}
                        {item.agentEmail && (
                          <div className="px-3 py-1.5 rounded-md bg-purple-100 text-purple-800 text-sm truncate">
                            ✉️ {item.agentEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-[15px] py-[10px] border-b border-[#e9ecef] align-top leading-[1.4]">
                      <div className="flex flex-col space-y-1">
                        {/* Customer Name */}
                        <div className="px-3 py-1.5 rounded-md bg-pink-100 text-pink-800 text-sm font-medium">
                          👤 {item.custName || 'N/A'}
                        </div>
                        
                        {/* Customer Number */}
                        <div className="px-3 py-1.5 rounded-md bg-cyan-100 text-cyan-800 text-sm font-medium">
                          📱 {item.custNumber || 'N/A'}
                        </div>
                        
                        {/* Customer Email */}
                        {item.custEmail && (
                          <div className="px-3 py-1.5 rounded-md bg-amber-100 text-amber-800 text-sm truncate">
                            ✉️ {item.custEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-[15px] py-[10px] border-b border-[#e9ecef] align-top leading-[1.4]">
                      <div className="flex flex-col space-y-1">
                        {/* Property Address */}
                        <div className="px-3 py-1.5 rounded-md bg-indigo-100 text-indigo-800 text-sm">
                          🏠 {item.propertyAddress || 'No address'}
                        </div>
                      </div>
                    </td>
                    <td className="px-[15px] py-[10px] border-b border-[#e9ecef] align-top leading-[1.4]">
                      <div className="flex flex-col space-y-1">
                        {/* Date */}
                        <div className="px-3 py-1.5 rounded-md bg-teal-100 text-teal-800 text-sm font-medium">
                          📅 {formatDateTime(item.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-[15px] py-[10px] border-b border-[#e9ecef] align-top leading-[1.4]">
                      <div className="flex flex-col gap-2">
                        <button
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700"
                          onClick={() => openDetails(item)}
                          type="button"
                        >
                          View Details
                        </button>
                        <button
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-[#ef4444] text-white text-[13px] font-semibold hover:bg-[#dc2626]"
                          onClick={() => handleDelete(item)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-10 text-[#8898aa] text-[1.2rem] italic font-medium bg-white rounded-b-[10px]">
                  No resale enquiries found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-[5px] mt-4 pb-4">
            <button
              className={`px-3 py-1.5 border border-[#ddd] bg-white text-[#333] rounded-[6px] cursor-pointer font-semibold text-[13px] transition-all duration-200 hover:bg-[#f0f4f7] hover:border-[#b0c2d3] hover:text-[#2c3e50] hover:-translate-y-[2px] hover:shadow-[0_5px_12px_rgba(0,0,0,0.1)] ${currentPage === 1 ? "bg-[#fcfdfe] text-[#c0c8d3] cursor-not-allowed opacity-80 border-[#e0e5ed] shadow-none hover:bg-[#fcfdfe] hover:border-[#e0e5ed] hover:text-[#c0c8d3] hover:translate-y-0 hover:shadow-none" : ""}`}
              onClick={loadBack}
              disabled={currentPage === 1 || loading}
              type="button"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handleClick(index + 1)}
                className={`px-3 py-1.5 border border-[#ddd] bg-white text-[#333] rounded-[6px] cursor-pointer font-semibold text-[13px] transition-all duration-200 hover:bg-[#f0f4f7] hover:border-[#b0c2d3] hover:text-[#2c3e50] hover:-translate-y-[2px] hover:shadow-[0_5px_12px_rgba(0,0,0,0.1)] ${currentPage === index + 1 ? "bg-gradient-to-r from-[#6c5ce7] to-[#5b4ddf] text-white border-[#6c5ce7] font-bold shadow-[0_5px_18px_rgba(108,92,231,0.45)] hover:from-[#5b4ddf] hover:to-[#4a3ec4] hover:border-[#5b4ddf]" : ""}`}
                disabled={loading}
                type="button"
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`px-3 py-1.5 border border-[#ddd] bg-white text-[#333] rounded-[6px] cursor-pointer font-semibold text-[13px] transition-all duration-200 hover:bg-[#f0f4f7] hover:border-[#b0c2d3] hover:text-[#2c3e50] hover:-translate-y-[2px] hover:shadow-[0_5px_12px_rgba(0,0,0,0.1)] ${currentPage === totalPages ? "bg-[#fcfdfe] text-[#c0c8d3] cursor-not-allowed opacity-80 border-[#e0e5ed] shadow-none hover:bg-[#fcfdfe] hover:border-[#e0e5ed] hover:text-[#c0c8d3] hover:translate-y-0 hover:shadow-none" : ""}`}
              onClick={loadMore}
              disabled={currentPage === totalPages || loading}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
        </div>
          </div>
        </main>

        {detailsOpen && selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeDetails}>
            <div
              className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Enquiry Details</h3>
                <button className="p-2 rounded-lg hover:bg-gray-100" onClick={closeDetails} type="button">
                  <X size={18} className="text-gray-700" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  <div className="px-3 py-2 rounded-md bg-green-100 text-green-800 text-sm font-medium">
                    👤 Agent: {getAgentDisplayName(selectedEnquiry)}
                  </div>
                  <div className="px-3 py-2 rounded-md bg-blue-100 text-blue-800 text-sm font-medium">
                    📱 Agent Number: {selectedEnquiry.agentNumber || 'N/A'}
                  </div>
                  {selectedEnquiry.agentEmail && (
                    <div className="px-3 py-2 rounded-md bg-purple-100 text-purple-800 text-sm break-words">
                      ✉️ Agent Email: {selectedEnquiry.agentEmail}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="px-3 py-2 rounded-md bg-pink-100 text-pink-800 text-sm font-medium">
                    👤 Customer: {selectedEnquiry.custName || 'N/A'}
                  </div>
                  <div className="px-3 py-2 rounded-md bg-cyan-100 text-cyan-800 text-sm font-medium">
                    📱 Customer Number: {selectedEnquiry.custNumber || 'N/A'}
                  </div>
                  {selectedEnquiry.custEmail && (
                    <div className="px-3 py-2 rounded-md bg-amber-100 text-amber-800 text-sm break-words">
                      ✉️ Customer Email: {selectedEnquiry.custEmail}
                    </div>
                  )}
                </div>

                <div className="px-3 py-2 rounded-md bg-indigo-100 text-indigo-800 text-sm break-words">
                  🏠 Address: {selectedEnquiry.propertyAddress || 'No address'}
                </div>
                <div className="px-3 py-2 rounded-md bg-teal-100 text-teal-800 text-sm font-medium">
                  📅 Date: {formatDateTime(selectedEnquiry.createdAt)}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#ef4444] text-white text-sm font-semibold hover:bg-[#dc2626]"
                    onClick={() => handleDelete(selectedEnquiry)}
                    type="button"
                  >
                    Delete
                  </button>
                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200"
                    onClick={closeDetails}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResaleEnquiries;
