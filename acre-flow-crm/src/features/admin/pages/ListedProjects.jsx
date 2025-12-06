import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { Link } from "react-router-dom";
import { message } from "antd";
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const Projects = () => {
  const [viewAll, setViewAll] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");

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
  const [messageApi, contextHolder] = message.useMessage();

  const getApiBase = () => {
    return process.env.REACT_APP_API_BASE || "http://localhost:3001";
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'PROJECT_UPDATED') {
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
        const base = getApiBase();
        const tokenRaw = localStorage.getItem("myToken") || "";
        const token = tokenRaw.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");
        const res = await axios.get(
          `${base}/project/viewAll/data?sort=-createdAt`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
          }
        );
        const payload = res.data;
        const rows = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
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
  }, [refreshTrigger, messageApi]);

  const handleDeleteUser = async (id) => {
    try {
      const base = getApiBase();
      const raw = localStorage.getItem("myToken") || "";
      const myToken = raw.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "");
      const response = await axios.delete(
        `${base}/project/Delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(myToken ? { Authorization: `Bearer ${myToken}` } : {}),
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        messageApi.open({
          type: "success",
          content: "Property deleted successfully.",
          duration: 2,
        });
        setViewAll(prevViewAll => (Array.isArray(prevViewAll) ? prevViewAll.filter(item => item._id !== id) : []));
        setRefreshTrigger(prev => prev + 1);
      } else {
        messageApi.open({
          type: "error",
          content: "Failed to delete project. Server returned an error.",
          duration: 2,
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        messageApi.open({
          type: "error",
          content: "You are not authorized to delete this project.",
          duration: 2,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Error deleting project. Please try again.",
          duration: 2,
        });
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const typeOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) {
      return ['Industrial Plots', 'Farm Houses'];
    }
    const uniqueTypes = Array.from(new Set((viewAll || []).map(v => v?.type).filter(Boolean)));
    if (!uniqueTypes.includes('Industrial Plots')) uniqueTypes.push('Industrial Plots');
    if (!uniqueTypes.includes('Farm Houses')) uniqueTypes.push('Farm Houses');
    if (!uniqueTypes.includes('Residential Plots')) uniqueTypes.push('Residential Plots');
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

  const projectOverviewOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) return [];
    const overviewCounts = { trending: 0, featured: 0, none: 0 };
    viewAll.forEach(project => {
      if (project.projectOverview === "trending") overviewCounts.trending++;
      else if (project.projectOverview === "featured") overviewCounts.featured++;
      else overviewCounts.none++;
    });
    return [
      { value: 'trending', label: `Trending (${overviewCounts.trending})` },
      { value: 'featured', label: `Featured (${overviewCounts.featured})` },
      { value: 'none', label: `None (${overviewCounts.none})` }
    ];
  }, [viewAll]);

  const youtubeVideoOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) return [];
    let withYoutube = 0, withoutYoutube = 0;
    viewAll.forEach(project => {
      const hasYoutubeVideo = Boolean((project?.youtubeVideoUrl ?? "").toString().trim());
      if (hasYoutubeVideo) withYoutube++;
      else withoutYoutube++;
    });
    return [
      { value: 'with', label: `With (${withYoutube})` },
      { value: 'without', label: `Without (${withoutYoutube})` }
    ];
  }, [viewAll]);

  const brochureOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) return [];
    let withBrochure = 0, withoutBrochure = 0, pdfBrochure = 0, imageBrochure = 0;
    viewAll.forEach(project => {
      const hasBrochure = Boolean((project?.project_Brochure?.url ?? "").toString().trim());
      if (hasBrochure) {
        withBrochure++;
        const url = (project?.project_Brochure?.url ?? "").toString().toLowerCase();
        if (url.includes('.pdf')) pdfBrochure++;
        else imageBrochure++;
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

  const specificPhoneNumbers = ['9811750130', '9355990063', '9811750740', '8500900100', '9315375335'];
  const specificNumberOptions = useMemo(() => {
    if (!viewAll || viewAll.length === 0) return [];
    const counts = {};
    specificPhoneNumbers.forEach(num => counts[num] = 0);
    viewAll.forEach(project => {
      const mobileNumber = (project?.mobileNumber ?? "").toString().trim();
      if (specificPhoneNumbers.includes(mobileNumber)) counts[mobileNumber]++;
    });
    return specificPhoneNumbers.map(num => ({
      value: num,
      label: `${num} (${counts[num]})`
    }));
  }, [viewAll]);

  const filteredProjects = viewAll.filter((item) => {
    const searchTermLower = (searchTerm || "").toLowerCase();
    const name = (item?.projectName || "").toLowerCase();
    const type = (item?.type || "").toLowerCase();
    const city = (item?.city || "").toLowerCase();
    const builder = (item?.builderName || "").toLowerCase();
    const address = (item?.projectAddress || "").toLowerCase();
    const status = (item?.project_Status || "").toLowerCase();

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
    const matchesStatus = !filterStatus ? true : (filterStatus === '__missing__' ? statusVal.length === 0 : item?.project_Status === filterStatus);
    const matchesState = !filterState || item?.state === filterState;
    const hasMobile = Boolean((item?.mobileNumber ?? "").toString().trim());
    const matchesMobile = !filterHasMobile || (filterHasMobile === "with" ? hasMobile : !hasMobile);
    const hasPayment = Boolean((item?.paymentPlan ?? "").toString().trim());
    const matchesPayment = !filterHasPayment || (filterHasPayment === "with" ? hasPayment : !hasPayment);

    let matchesOverview = true;
    if (filterProjectOverview) {
      const isTrendingInDB = item.projectOverview === "trending";
      const isFeaturedInDB = item.projectOverview === "featured";
      if (filterProjectOverview === 'trending') matchesOverview = isTrendingInDB;
      else if (filterProjectOverview === 'featured') matchesOverview = isFeaturedInDB;
      else if (filterProjectOverview === 'none') matchesOverview = !isTrendingInDB && !isFeaturedInDB;
    }

    const hasYoutubeVideo = Boolean((item?.youtubeVideoUrl ?? "").toString().trim());
    const matchesYoutubeVideo = !filterYoutubeVideo || (filterYoutubeVideo === "with" ? hasYoutubeVideo : !hasYoutubeVideo);

    let matchesBrochure = true;
    if (filterBrochure) {
      const hasBrochure = Boolean((item?.project_Brochure?.url ?? "").toString().trim());
      if (filterBrochure === 'with') matchesBrochure = hasBrochure;
      else if (filterBrochure === 'without') matchesBrochure = !hasBrochure;
      else if (filterBrochure === 'pdf') matchesBrochure = hasBrochure && (item?.project_Brochure?.url ?? "").toString().toLowerCase().includes('.pdf');
      else if (filterBrochure === 'image') matchesBrochure = hasBrochure && !(item?.project_Brochure?.url ?? "").toString().toLowerCase().includes('.pdf');
    }

    const itemMobileNumber = (item?.mobileNumber ?? "").toString().trim();
    const matchesSpecificNumber = !filterSpecificNumber || itemMobileNumber === filterSpecificNumber;

    return matchesSearch && matchesType && matchesCity && matchesAddress && matchesBuilder && matchesStatus && matchesState && matchesMobile && matchesPayment && matchesOverview && matchesYoutubeVideo && matchesBrochure && matchesSpecificNumber;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProjects.slice(indexOfFirstRow, indexOfLastRow);

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
        return '"' + s.replace(/"/g, '""') + '"';
      };

      const header = columns.map(c => csvEscape(c.label)).join(',');
      const lines = filteredProjects.map(item =>
        columns.map(c => csvEscape(item?.[c.key])).join(',')
      );
      const csvContent = ['\ufeff' + header, ...lines].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
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

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-0 lg:ml-[250px] transition-all duration-300">
        {contextHolder}

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all real estate projects</p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between flex-wrap">
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full lg:w-96">
            <Search className="ml-4 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, types, cities, builders..."
              className="px-4 py-3 bg-transparent text-gray-700 dark:text-gray-200 outline-none flex-grow text-base placeholder-gray-400 dark:placeholder-gray-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Add New Project Button */}
          <Link to="/admin/project-insert" className="w-full lg:w-auto">
            <button className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
              Add New Project
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3 mb-3">
            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Types</option>
              {typeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterCity}
              onChange={(e) => { setFilterCity(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Cities</option>
              {cityOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterBuilder}
              onChange={(e) => { setFilterBuilder(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Builders</option>
              {builderOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="__missing__">No status</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterState}
              onChange={(e) => { setFilterState(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All States</option>
              {stateOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterHasPayment}
              onChange={(e) => { setFilterHasPayment(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Payment: All</option>
              <option value="with">Payment: With</option>
              <option value="without">Payment: Without</option>
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterProjectOverview}
              onChange={(e) => { setFilterProjectOverview(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Project Overview</option>
              {projectOverviewOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterYoutubeVideo}
              onChange={(e) => { setFilterYoutubeVideo(e.target.value); setCurrentPage(1); }}
            >
              <option value="">YouTube Video: All</option>
              {youtubeVideoOptions.map(opt => (
                <option key={opt.value} value={opt.value}>YouTube Video: {opt.label}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterBrochure}
              onChange={(e) => { setFilterBrochure(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Brochure: All</option>
              {brochureOptions.map(opt => (
                <option key={opt.value} value={opt.value}>Brochure: {opt.label}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={filterSpecificNumber}
              onChange={(e) => { setFilterSpecificNumber(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Specific Number: All</option>
              {specificNumberOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
            >
              Reset Filters
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200 text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto mb-8">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">S.No</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">City</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Address</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Actions</th>
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
                      className={`border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'
                      } hover:bg-blue-50 dark:hover:bg-blue-900/20`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{serialNumber}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-xs truncate">{item.projectName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.city}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-sm truncate">{item.projectAddress}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2 flex-wrap">
                          <Link to={`/Admin/ProjectsView/${pUrl}`}>
                            <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 hover:shadow-md" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>

                          <Link to={`/Admin/ProjectsEdit/${id}`}>
                            <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:shadow-md" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>

                          <Link to={`/Admin/ProjectsAddBhk/${id}`}>
                            <button className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-semibold transition-all duration