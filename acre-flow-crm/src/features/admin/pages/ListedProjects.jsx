import React, { useState, useEffect, useMemo } from "react";
import api100acress from "../config/api100acressClient";
// import { getApiBase } from '../config/apiBase';

import AdminSidebar from "../components/AdminSidebar";
import { Link } from "react-router-dom";
import { message, Modal } from "antd"; 
import { LogOut, ChevronDown, User, Settings as SettingsIcon, ArrowLeft, Eye, Edit, Trash2, Home, Plus, Calendar, Phone, MapPin, Building } from 'lucide-react';

const Projects = () => {
  const [viewAll, setViewAll] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Additional filters
  const [filterType, setFilterType] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterBuilder, setFilterBuilder] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterHasMobile, setFilterHasMobile] = useState("");
  const [filterHasPayment, setFilterHasPayment] = useState("");
  const [filterProjectOverview, setFilterProjectOverview] = useState("");
  const [filterYoutubeVideo, setFilterYoutubeVideo] = useState("");
  const [filterBrochure, setFilterBrochure] = useState("");
  const [filterSpecificNumber, setFilterSpecificNumber] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [messageApi, contextHolder] = message.useMessage(); // For Ant Design messages
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const userName = localStorage.getItem('userName') || localStorage.getItem('adminName') || 'Admin';
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || 'admin@example.com';
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('adminRole') || 'admin';
    setUserInfo({ name: userName, email: userEmail, role: userRole });
    
    // Handle window resize
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('sourceSystem');
    window.location.href = '/login';
  };

  const handleViewDetails = (item) => {
    setSelectedProject(item);
    setDetailsOpen(true);
  };

  const truncateMobileName = (name) => {
    const s = (name ?? '').toString();
    return s.length > 13 ? `${s.slice(0, 13)}...` : s;
  };

  // Listen for project update messages from other components
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'PROJECT_UPDATED') {
        // Refresh the data when a project is updated
        setRefreshTrigger(prev => prev + 1);
        messageApi.open({
          type: "success",
          content: "Project updated successfully. Data refreshed.",
          duration: 2,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [messageApi]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api100acress.get(
          "/project/viewAll/data?sort=-createdAt"
        );
        const payload = res.data;
        const rows = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        // Sort by creation date in descending order (newest first)

        const sortedRows = [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setViewAll(sortedRows);
      } catch (error) {
        console.error("Error fetching projects:", error);
        messageApi.open({
          type: "error",
          content: "Failed to fetch projects. Please try again.",
          duration: 2,
        });
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const handleDeleteUser = async (id) => {
    try {
      const response = await api100acress.delete(`/project/Delete/${id}`);

      console.log(response, "response");
      if (response.status >= 200 && response.status < 300) {

        messageApi.open({
          type: "success",
          content: "Property deleted successfully.",
          duration: 2,
        });
        // Filter out the deleted item from the state to update UI
        setViewAll(prevViewAll => (Array.isArray(prevViewAll) ? prevViewAll.filter(item => item._id !== id) : []));
        // Refresh data to ensure consistency
        setRefreshTrigger(prev => prev + 1);
      } else {

        messageApi.open({
          type: "error",
          content: "Failed to delete project. Server returned an error.",
          duration: 2,
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.log("Unauthorized: You don't have permission to delete this project.");
          messageApi.open({
            type: "error",
            content: "You are not authorized to delete this project.",
            duration: 2,
          });
        } else {
          console.error("An error occurred while deleting project:", error.response.status);
          messageApi.open({
            type: "error",
            content: `Error deleting project: ${error.response.status}.`,
            duration: 2,
          });
        }
      } else if (error.request) {
        console.error("No response received from the server.");
        messageApi.open({
          type: "error",
          content: "No response from server. Please check your network.",
          duration: 2,
        });
      } else {
        console.error("Error in request setup:", error.message);
        messageApi.open({
          type: "error",
          content: "An unexpected error occurred. Please try again.",
          duration: 2,
        });
      }
    }
  };

  const handleRefreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Unique options for filters
  const typeOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) {
      return ['Industrial Plots', 'Farm Houses'];
    }

    const uniqueTypes = Array.from(new Set((viewAll || []).map(v => v?.type).filter(Boolean)));

    // Add common project types if not already present (removed Industrial Projects)
    if (!uniqueTypes.includes('Industrial Plots')) {
      uniqueTypes.push('Industrial Plots');
    }
    if (!uniqueTypes.includes('Farm Houses')) {
      uniqueTypes.push('Farm Houses');
    }
    if (!uniqueTypes.includes('Residential Plots')) {
      uniqueTypes.push('Residential Plots');
    }

    // Sort the final list alphabetically
    return uniqueTypes.sort();
  }, [viewAll]);
  const cityOptions = useMemo(
    () => Array.from(new Set((viewAll || []).map(v => v?.city).filter(Boolean))).sort(),
    [viewAll]
  );
  const builderOptions = useMemo(
    () => Array.from(new Set((viewAll || []).map(v => v?.builderName).filter(Boolean))).sort(),
    [viewAll]
  );
  const statusOptions = useMemo(
    () => Array.from(new Set((viewAll || []).map(v => v?.project_Status).filter(Boolean))).sort(),
    [viewAll]
  );
  const stateOptions = useMemo(
    () => Array.from(new Set((viewAll || []).map(v => v?.state).filter(Boolean))).sort(),
    [viewAll]
  );

  // Helper function to check if project is high value
  const isHighValueProject = (minPrice) => {
    if (!minPrice) return false;

    let priceValue;
    if (typeof minPrice === 'string') {
      // Remove commas and convert to number
      priceValue = parseInt(minPrice.replace(/,/g, ''));
    } else if (typeof minPrice === 'number') {
      priceValue = minPrice;
    } else {
      return false;
    }

    return !isNaN(priceValue) && priceValue > 5000000;
  };

  // Project overview options based on project status and other criteria
  const projectOverviewOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) {
      return [];
    }

    const overviewCounts = { trending: 0, featured: 0, none: 0 };

    viewAll.forEach(project => {
      try {
        // Check if project has trending or featured field in the database
        const isTrendingInDB = project.projectOverview === "trending";
        const isFeaturedInDB = project.projectOverview === "featured";

        if (isTrendingInDB) {
          overviewCounts.trending++;
          console.log(`✅ Project ${project.projectName} is marked as trending in DB`);
        }
        // Define featured projects (ONLY database field - no fallback criteria)
        else if (isFeaturedInDB) {
          overviewCounts.featured++;
          console.log(`✅ Project ${project.projectName} is marked as featured in DB`);
        } else {
          overviewCounts.none++;
        }
      } catch (error) {
        console.error(`Error processing project ${project.projectName}:`, error);
        overviewCounts.none++;
      }
    });

    return [
      { value: 'trending', label: `Trending (${overviewCounts.trending})` },
      { value: 'featured', label: `Featured (${overviewCounts.featured})` },
      { value: 'none', label: `none (${overviewCounts.none})` }
    ];
  }, [viewAll, isHighValueProject]);

  // YouTube video options with counts
  const youtubeVideoOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) {
      return [];
    }

    let withYoutube = 0;
    let withoutYoutube = 0;

    viewAll.forEach(project => {
      const hasYoutubeVideo = Boolean((project?.youtubeVideoUrl ?? "").toString().trim());
      if (hasYoutubeVideo) {
        withYoutube++;
      } else {
        withoutYoutube++;
      }
    });

    return [
      { value: 'with', label: `With (${withYoutube})` },
      { value: 'without', label: `Without (${withoutYoutube})` }
    ];
  }, [viewAll]);

  // Brochure options with counts
  const brochureOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) {
      return [];
    }

    let withBrochure = 0;
    let withoutBrochure = 0;
    let pdfBrochure = 0;
    let imageBrochure = 0;

    viewAll.forEach(project => {
      const hasBrochure = Boolean((project?.project_Brochure?.url ?? "").toString().trim());
      if (hasBrochure) {
        withBrochure++;
        const url = (project?.project_Brochure?.url ?? "").toString().toLowerCase();
        if (url.includes('.pdf')) {
          pdfBrochure++;
        } else {
          imageBrochure++;
        }
      } else {
        withoutBrochure++;
      }
    });

    return [
      { value: 'with', label: `Has Brochure (${withBrochure})` },
      { value: 'without', label: `No Brochure (${withoutBrochure})` },
      { value: 'pdf', label: `PDF Brochure (${pdfBrochure})` },
      { value: 'image', label: `Image Brochure (${imageBrochure})` }
    ];
  }, [viewAll]);

  // Specific phone numbers filter options with counts
  const specificPhoneNumbers = ['9811750130', '9355990063', '9811750740', '8500900100', '9315375335'];
  const specificNumberOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) {
      return [];
    }

    const counts = {};
    specificPhoneNumbers.forEach(num => {
      counts[num] = 0;
    });

    viewAll.forEach(project => {
      const mobileNumber = (project?.mobileNumber ?? "").toString().trim();
      if (specificPhoneNumbers.includes(mobileNumber)) {
        counts[mobileNumber]++;
      }
    });

    return specificPhoneNumbers.map(num => ({
      value: num,
      label: `${num} (${counts[num]})`
    }));
  }, [viewAll]);

  // Apply combined filters
  const filteredProjects = viewAll.filter((item) => {
    const searchTermLower = (searchTerm || "").toLowerCase();

    // Enhanced search: search in multiple fields
    const name = (item?.projectName || "").toLowerCase();
    const type = (item?.type || "").toLowerCase();
    const city = (item?.city || "").toLowerCase();
    const builder = (item?.builderName || "").toLowerCase();
    const address = (item?.projectAddress || "").toLowerCase();
    const status = (item?.project_Status || "").toLowerCase();

    // Check if search term matches any of these fields
    const matchesSearch = !searchTerm ||
      name.includes(searchTermLower) ||
      type.includes(searchTermLower) ||
      city.includes(searchTermLower) ||
      builder.includes(searchTermLower) ||
      address.includes(searchTermLower) ||
      status.includes(searchTermLower);

    const matchesType = !filterType || item?.type === filterType;
    const matchesCity = !filterCity || item?.city === filterCity;
    const matchesAddress = !filterAddress || address.includes(filterAddress.toLowerCase());
    const matchesBuilder = !filterBuilder || item?.builderName === filterBuilder;
    const statusVal = (item?.project_Status ?? '').toString().trim();
    const matchesStatus = !filterStatus
      ? true
      : (filterStatus === '__missing__'
          ? statusVal.length === 0
          : item?.project_Status === filterStatus);
    const matchesState = !filterState || item?.state === filterState;
    const hasMobile = Boolean((item?.mobileNumber ?? "").toString().trim());
    const matchesMobile = !filterHasMobile || (filterHasMobile === "with" ? hasMobile : !hasMobile);
    const hasPayment = Boolean((item?.paymentPlan ?? "").toString().trim());
    const matchesPayment = !filterHasPayment || (filterHasPayment === "with" ? hasPayment : !hasPayment);

    // Project overview filtering logic
    let matchesOverview = true;
    if (filterProjectOverview) {
      try {
        // Check if project has trending or featured field in the database
        const isTrendingInDB = item.projectOverview === "trending";
        const isFeaturedInDB = item.projectOverview === "featured";

        if (filterProjectOverview === 'trending') {
          matchesOverview = isTrendingInDB;
        } else if (filterProjectOverview === 'featured') {
          matchesOverview = isFeaturedInDB;
        } else if (filterProjectOverview === 'none') {
          matchesOverview = !isTrendingInDB && !isFeaturedInDB;
        }
      } catch (error) {
        console.error(`Error filtering project ${item.projectName}:`, error);
        matchesOverview = filterProjectOverview === 'none';
      }
    }

    // YouTube video filtering logic
    const hasYoutubeVideo = Boolean((item?.youtubeVideoUrl ?? "").toString().trim());
    const matchesYoutubeVideo = !filterYoutubeVideo || (filterYoutubeVideo === "with" ? hasYoutubeVideo : !hasYoutubeVideo);

    // Brochure filtering logic
    let matchesBrochure = true;
    if (filterBrochure) {
      const hasBrochure = Boolean((item?.project_Brochure?.url ?? "").toString().trim());
      if (filterBrochure === 'with') {
        matchesBrochure = hasBrochure;
      } else if (filterBrochure === 'without') {
        matchesBrochure = !hasBrochure;
      } else if (filterBrochure === 'pdf') {
        matchesBrochure = hasBrochure && (item?.project_Brochure?.url ?? "").toString().toLowerCase().includes('.pdf');
      } else if (filterBrochure === 'image') {
        matchesBrochure = hasBrochure && !(item?.project_Brochure?.url ?? "").toString().toLowerCase().includes('.pdf');
      }
    }

    // Specific phone number filtering logic
    const itemMobileNumber = (item?.mobileNumber ?? "").toString().trim();
    const matchesSpecificNumber = !filterSpecificNumber || itemMobileNumber === filterSpecificNumber;

    return matchesSearch && matchesType && matchesCity && matchesAddress && matchesBuilder && matchesStatus && matchesState && matchesMobile && matchesPayment && matchesOverview && matchesYoutubeVideo && matchesBrochure && matchesSpecificNumber;
  });
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProjects.slice(indexOfFirstRow, indexOfLastRow);

  // Export filtered data to CSV
  const handleExportCSV = () => {
    try {
      const columns = [
        { key: 'projectName', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'project_Status', label: 'Status' },
        { key: 'builderName', label: 'Builder' },
        { key: 'projectAddress', label: 'Address' },
        { key: 'mobileNumber', label: 'Mobile' },
        { key: 'project_url', label: 'Slug' },
      ];

      const csvEscape = (val) => {
        const s = (val ?? '').toString();
        // Replace quotes with doubled quotes and wrap the value in quotes
        const escaped = '"' + s.replace(/"/g, '""') + '"';
        return escaped;
      };

      const header = columns.map(c => csvEscape(c.label)).join(',');
      const lines = filteredProjects.map(item =>
        columns.map(c => csvEscape(item?.[c.key])).join(',')
      );
      const csvContent = ['\ufeff' + header, ...lines].join('\n'); // BOM for Excel

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0,10);
      a.download = `projects_${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      messageApi.open({ type: 'success', content: `Exported ${filteredProjects.length} rows.`, duration: 2 });
    } catch (err) {
      console.error('CSV export failed', err);
      messageApi.open({ type: 'error', content: 'Failed to export CSV', duration: 2 });
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setFilterCity("");
    setFilterAddress("");
    setFilterBuilder("");
    setFilterStatus("");
    setFilterState("");
    setFilterHasMobile("");
    setFilterHasPayment("");
    setFilterProjectOverview("");
    setFilterYoutubeVideo("");
    setFilterBrochure("");
    setFilterSpecificNumber("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        {contextHolder} {/* Ant Design message context holder */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  <span className="lg:hidden">Projects</span>
                  <span className="hidden lg:inline">Listed Projects</span>
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
                      <User size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors">
                      <SettingsIcon size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
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
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full lg:max-w-md">
                <input
                  type="text"
                  placeholder="Search projects, types, cities, builders..."
                  className="flex-1 px-4 py-2 outline-none border-b-2 border-red-500 text-gray-800"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="px-4 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                  Search
                </button>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full">
                <select
                  className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterType}
                  onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Types</option>
                  {typeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <select
                  className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterCity}
                  onChange={(e) => { setFilterCity(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Cities</option>
                  {cityOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <select
                  className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterBuilder}
                  onChange={(e) => { setFilterBuilder(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Builders</option>
                  {builderOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <select
                  className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Status</option>
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <select
                  className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterState}
                  onChange={(e) => { setFilterState(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All States</option>
                  {stateOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <select
                  className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterHasPayment}
                  onChange={(e) => { setFilterHasPayment(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Payment: All</option>
                  <option value="with">Payment: With</option>
                  <option value="without">Payment: Without</option>
                </select>

                <select
                  className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterProjectOverview}
                  onChange={(e) => { setFilterProjectOverview(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Project Overview</option>
                  {projectOverviewOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <select
                  className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterYoutubeVideo}
                  onChange={(e) => { setFilterYoutubeVideo(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">YouTube Video: All</option>
                  {youtubeVideoOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>YouTube Video: {opt.label}</option>
                  ))}
                </select>

                <select
                  className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterBrochure}
                  onChange={(e) => { setFilterBrochure(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Brochure: All</option>
                  {brochureOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>Brochure: {opt.label}</option>
                  ))}
                </select>

                <select
                  className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  value={filterSpecificNumber}
                  onChange={(e) => { setFilterSpecificNumber(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Specific Number: All</option>
                  {specificNumberOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={"/admin/project-insert"}>
                <button
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition-colors"
                >
                  Add New Project 
                </button>
              </Link>
            </div>
            <div className="mt-5 w-full max-w-full bg-white rounded-2xl shadow-md border border-gray-200">
              {/* Mobile Card View */}
              {mobileView && (
                <div className="p-4 space-y-4">
                  {currentRows.length > 0 ? (
                    currentRows.map((item, index) => {
                      const serialNumber = indexOfFirstRow + index + 1;
                      const id = item._id;
                      const pUrl = item.project_url;
                      return (
                        <div key={id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.projectName}</h3>
                              <span className="text-xs text-gray-500">#{serialNumber}</span>
                            </div>
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building size={14} />
                              <span className="text-xs">{item.type || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={14} />
                              <span className="text-xs">{item.city || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone size={14} />
                              <span className="text-xs">{item.mobileNumber || '-'}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Link to={`/Admin/ProjectsView/${pUrl}`} className="flex-1">
                              <button className="w-full px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                                <Eye size={14} /> View
                              </button>
                            </Link>
                            <Link to={`/Admin/ProjectsEdit/${pUrl}`} className="flex-1">
                              <button className="w-full px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                                <Edit size={14} /> Edit
                              </button>
                            </Link>
                            <Link to={`/Admin/ProjectsAddBhk/${id}`} className="flex-1">
                              <button className="w-full px-3 py-2 bg-amber-400 text-gray-900 text-xs font-semibold rounded-lg hover:bg-amber-500 transition-colors flex items-center justify-center gap-1">
                                <Plus size={14} /> BHK
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No projects found.
                    </div>
                  )}
                </div>
              )}

              {/* Desktop Table View */}
              {!mobileView && (
                <table className="w-full min-w-0 sm:min-w-[1000px] table-fixed sm:table-auto border-separate border-spacing-0 text-sm">
                  <thead>
                    <tr>
                      <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-gray-600 hidden sm:table-cell">
                        S No.
                      </th>
                      <th scope="col" className="px-1 sm:px-4 py-2 text-left font-bold text-gray-600 whitespace-nowrap">
                        Name
                      </th>
                      <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-gray-600 hidden sm:table-cell">
                        Type
                      </th>
                      <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-gray-600 hidden sm:table-cell">
                        City
                      </th>
                      <th scope="col" className="sticky top-0 z-10 bg-gray-50 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-gray-600 hidden sm:table-cell">
                        Address
                      </th>
                      <th scope="col" className="px-1 sm:px-4 py-2 text-center font-bold text-gray-600 w-24 sm:w-auto">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.length > 0 ? (
                      currentRows.map((item, index) => {
                        const serialNumber = indexOfFirstRow + index + 1;
                        const id = item._id;
                        const pUrl = item.project_url;
                        return (
                          <tr
                            key={id}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-3 py-2 text-center text-gray-700 border-b border-gray-100 whitespace-nowrap overflow-hidden text-ellipsis hidden sm:table-cell">
                              {serialNumber}
                            </td>
                            <td className="px-1 sm:px-3 py-2 text-left font-semibold text-gray-900 border-b border-gray-100 whitespace-nowrap overflow-hidden text-ellipsis">
                              <span className="sm:hidden">{truncateMobileName(item.projectName)}</span>
                              <span className="hidden sm:inline">{item.projectName}</span>
                            </td>
                            <td className="px-3 py-2 text-center text-gray-700 border-b border-gray-100 whitespace-nowrap overflow-hidden text-ellipsis hidden sm:table-cell">
                              {item.type}
                            </td>
                            <td className="px-3 py-2 text-center text-gray-700 border-b border-gray-100 whitespace-nowrap overflow-hidden text-ellipsis hidden sm:table-cell">
                              {item.city}
                            </td>
                            <td className="px-3 py-2 text-center text-gray-700 border-b border-gray-100 max-w-[260px] whitespace-normal hidden sm:table-cell">
                              {item.projectAddress}
                            </td>

                            <td className="px-1 sm:px-3 py-2 text-left sm:text-center border-b border-gray-100 w-24 sm:w-auto">
                              <div className="flex flex-wrap justify-start sm:justify-center items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewDetails(item)}
                                  className="mr-4 sm:hidden px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all duration-200"
                                >
                                  View Details
                                </button>

                                <Link to={`/Admin/ProjectsView/${pUrl}`}>
                                  <button
                                    type="button"
                                    className="hidden sm:inline-flex px-3 py-1.5 rounded-md text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                                  >
                                    View
                                  </button>
                                </Link>

                                <Link to={`/Admin/ProjectsEdit/${pUrl}`}>
                                  <button
                                    type="button"
                                    className="hidden sm:inline-flex px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                  >
                                    Edit
                                  </button>
                                </Link>

                                <Link to={`/Admin/ProjectsAddBhk/${id}`}>
                                  <button
                                    type="button"
                                    className="hidden sm:inline-flex px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-400 text-gray-900 hover:bg-amber-500 transition-colors"
                                  >
                                    ADD BHK
                                  </button>
                                </Link>

                                <Link to={`/Admin/ProjectAddHighlights/${id}`}>
                                  <button
                                    type="button"
                                    className="hidden sm:inline-flex px-3 py-1.5 rounded-md text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                                  >
                                    ADD Highlights
                                  </button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-500 italic">
                          No projects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              <Modal
                open={detailsOpen}
                onCancel={() => setDetailsOpen(false)}
                footer={null}
                title="Project Details"
                centered
                width={520}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Project Name</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 break-words">{selectedProject?.projectName || '-'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Type</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{selectedProject?.type || '-'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">City</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{selectedProject?.city || '-'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">State</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{selectedProject?.state || '-'}</div>
                  </div>
                  <div className="sm:col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Address</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{selectedProject?.projectAddress || '-'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Builder</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{selectedProject?.builderName || '-'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Status</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{selectedProject?.project_Status || '-'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Mobile</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{(selectedProject?.mobileNumber ?? '').toString().trim() || '-'}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Payment Plan</div>
                    <div className="mt-1 text-sm text-gray-900 break-words">{(selectedProject?.paymentPlan ?? '').toString().trim() || '-'}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                  {selectedProject?.project_url && (
                    <Link to={`/Admin/ProjectsView/${selectedProject.project_url}`}>
                      <button
                        type="button"
                        onClick={() => setDetailsOpen(false)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
                      >
                        View
                      </button>
                    </Link>
                  )}
                  {selectedProject?.project_url && (
                    <Link to={`/Admin/ProjectsEdit/${selectedProject.project_url}`}>
                      <button
                        type="button"
                        onClick={() => setDetailsOpen(false)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                      >
                        Edit
                      </button>
                    </Link>
                  )}
                  {selectedProject?._id && (
                    <Link to={`/Admin/ProjectsAddBhk/${selectedProject._id}`}>
                      <button
                        type="button"
                        onClick={() => setDetailsOpen(false)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200"
                      >
                        Add BHK
                      </button>
                    </Link>
                  )}
                  {selectedProject?._id && (
                    <Link to={`/Admin/ProjectAddHighlights/${selectedProject._id}`}>
                      <button
                        type="button"
                        onClick={() => setDetailsOpen(false)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
                      >
                        Add Highlights
                      </button>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setDetailsOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </Modal>

              <div className="flex justify-center items-center gap-3 py-6">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(3, Math.ceil(filteredProjects.length / rowsPerPage)) },
                  (_, index) => {
                    // Show current page and 1 page before/after
                    const pageNumber = Math.min(
                      Math.max(1, currentPage - 1) + index,
                      Math.ceil(filteredProjects.length / rowsPerPage)
                    );
                    if (pageNumber > Math.ceil(filteredProjects.length / rowsPerPage)) return null;
                    return (
                      <button
                        key={index}
                        onClick={() => paginate(pageNumber)}
                        className={`px-4 py-2 rounded-lg border font-semibold transition-colors ${
                          currentPage === pageNumber
                            ? "bg-red-600 border-red-600 text-white"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => paginate(currentPage < Math.ceil(filteredProjects.length / rowsPerPage) ? currentPage + 1 : currentPage)}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === Math.ceil(filteredProjects.length / rowsPerPage)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;