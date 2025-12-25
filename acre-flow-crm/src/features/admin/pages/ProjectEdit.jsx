import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useParams, useNavigate } from "react-router-dom";
import api100acress from "../config/api100acressClient";
import { MdOutlineDeleteOutline, MdInfo, MdAttachMoney, MdDateRange, MdBarChart, MdDescription, MdStar, MdCheckCircle, MdUpdate, MdMovie, MdTitle, MdArrowBack } from "react-icons/md";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { LogOut, Menu, X, ChevronDown, User, Settings as SettingsIcon } from 'lucide-react';

const ProjectEdit = () => {
  const { pUrl } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [projectTypes, setProjectTypes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [builderOptions, setBuilderOptions] = useState([]);

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
  const [values, setValues] = useState({
    thumbnailImage: "",
    otherImage: [],
    project_floorplan_Image: [],
    projectGallery: [],
    highlightImage: "",
    project_locationImage: "",
    logo: "",
    projectName: "",
    builderName: "",
    projectAddress: "",
    city: "",
    paymentPlan: "",
    state: "",
    country: "",
    luxury: false,
    spotlight: false,
    projectOverview: "",
    projectRedefine_Business: "",
    projectRedefine_Connectivity: "",
    projectRedefine_Education: "",
    projectRedefine_Entertainment: "",
    projectReraNo: "",
    AboutDeveloper: "",
    type: "",
    project_url: "",
    meta_title: "",
    meta_description: "",
    project_Status: "",
    launchingDate: "",
    totalLandArea: "",
    totalUnit: "",
    towerNumber: "",
    mobileNumber: "",
    possessionDate: "",
    minPrice: "",
    maxPrice: "",
    Amenities: "",
    project_Brochure: "",
    youtubeVideoUrl: "",
    youtubeVideoTitle: "",
    youtubeVideoDescription: ""
  });

  // City and State dropdown states
  const [citiesList, setCitiesList] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");

  const [statesList, setStatesList] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");

  // Safely derive arrays from values to avoid destructuring errors
  const project_floorplan_Image = Array.isArray(values?.project_floorplan_Image)
    ? values.project_floorplan_Image
    : [];
  const projectGallery = Array.isArray(values?.projectGallery)
    ? values.projectGallery
    : [];
  const floorPlanLength = project_floorplan_Image.length;
  const projectGalleryLength = projectGallery.length;

  // Fetch project data when pUrl changes
  useEffect(() => {
    fetchData();
  }, [pUrl]);

  // Load cities and states on component mount
  useEffect(() => {
    fetchCitiesFromBackend();
    fetchStatesFromBackend();
    fetchProjectTypes();
    fetchProjectStatuses();
    fetchProjectBuilders();
  }, []);

  // Initialize city search term when values.city changes
  useEffect(() => {
    if (values.city) {
      setCitySearchTerm(values.city);
    }
  }, [values.city]);

  // Initialize state search term when values.state changes
  useEffect(() => {
    if (values.state) {
      setStateSearchTerm(values.state);
    }
  }, [values.state]);

  // Fetch all project types for dropdown
  const fetchProjectTypes = async () => {
    try {
      const res = await api100acress.get('/project/viewAll/data?sort=-createdAt');
      if (res.data?.data) {
        const uniqueTypes = [...new Set(
          res.data.data
            .map(project => project.type)
            .filter(Boolean)
        )].sort();
        if (!uniqueTypes.includes('Industrial Plots')) {
          uniqueTypes.push('Industrial Plots');
        }
        uniqueTypes.sort();
        setProjectTypes(uniqueTypes);
      }
    } catch (error) {
      console.error("Error fetching project types:", error);
      setProjectTypes(['Industrial Plots']);
    }
  };

  // Fetch all project statuses for dropdown
  const fetchProjectStatuses = async () => {
    try {
      const res = await api100acress.get('/project/viewAll/data?sort=-createdAt');
      if (res.data?.data) {
        const uniqueStatuses = [...new Set(
          res.data.data
            .map(project => project.project_Status)
            .filter(Boolean)
        )].sort();
        setStatusOptions(uniqueStatuses);
      }
    } catch (error) {
      console.error("Error fetching project statuses:", error);
      setStatusOptions(['newlaunch', 'readytomove', 'underconstruction']);
    }
  };

  // Fetch all project builders for dropdown
  const fetchProjectBuilders = async () => {
    try {
      const res = await api100acress.get('/project/viewAll/data?sort=-createdAt');
      if (res.data?.data) {
        const uniqueBuilders = [...new Set(
          res.data.data
            .map(project => project.builderName)
            .filter(Boolean)
        )].sort();
        setBuilderOptions(uniqueBuilders);
      }
    } catch (error) {
      console.error("Error fetching project builders:", error);
      setBuilderOptions([]);
    }
  };

  // Function to fetch project data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api100acress.get(`/project/View/${pUrl}`);
      if (res.status === 200 && res.data?.dataview) {
        const projectData = res.data.dataview[0] || {};
        setValues(prev => ({
          ...prev,
          ...projectData,
          frontImage: projectData.frontImage || "",
          thumbnailImage: projectData.thumbnailImage || "",
          project_floorplan_Image: Array.isArray(projectData.project_floorplan_Image) ? projectData.project_floorplan_Image : [],
          projectGallery: Array.isArray(projectData.projectGallery) ? projectData.projectGallery : [],
        }));
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      alert("Failed to load project data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch cities from backend
  const fetchCitiesFromBackend = async () => {
    try {
      setLoadingCities(true);
      const res = await api100acress.get("project/viewAll/data?sort=-createdAt&limit=1000");
      if (res.data?.data) {
        const uniqueCities = [...new Set(
          res.data.data.map(project => project.city).filter(Boolean)
        )].sort();
        setCitiesList(uniqueCities);
        setFilteredCities(uniqueCities);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Function to fetch states from backend
  const fetchStatesFromBackend = async () => {
    try {
      setLoadingStates(true);
      const res = await api100acress.get("project/viewAll/data?sort=-createdAt&limit=1000");
      if (res.data?.data) {
        const uniqueStates = [...new Set(
          res.data.data.map(project => project.state).filter(Boolean)
        )].sort();
        setStatesList(uniqueStates);
        setFilteredStates(uniqueStates);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  // Filter cities based on search term
  useEffect(() => {
    const filtered = citiesList.filter((city) =>
      city.toLowerCase().includes(citySearchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [citySearchTerm, citiesList]);

  // Filter states based on search term
  useEffect(() => {
    const filtered = statesList.filter((state) =>
      state.toLowerCase().includes(stateSearchTerm.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [stateSearchTerm, statesList]);

  // Handle city selection
  const handleCitySelect = (cityName) => {
    setValues((prev) => ({
      ...prev,
      city: cityName,
    }));
    setCitySearchTerm(cityName);
    setIsCityDropdownOpen(false);
  };

  // Handle state selection
  const handleStateSelect = (stateName) => {
    setValues((prev) => ({
      ...prev,
      state: stateName,
    }));
    setStateSearchTerm(stateName);
    setIsStateDropdownOpen(false);
  };

  // Handle city input change
  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCitySearchTerm(value);
    if (value && !filteredCities.includes(value)) {
      setValues((prev) => ({
        ...prev,
        city: value,
      }));
    }
    setIsCityDropdownOpen(true);
  };

  // Handle state input change
  const handleStateInputChange = (e) => {
    const value = e.target.value;
    setStateSearchTerm(value);
    if (value && !filteredStates.includes(value)) {
      setValues((prev) => ({
        ...prev,
        state: value,
      }));
    }
    setIsStateDropdownOpen(true);
  };

  // Handle city input focus
  const handleCityInputFocus = () => {
    setIsCityDropdownOpen(true);
  };

  // Handle state input focus
  const handleStateInputFocus = () => {
    setIsStateDropdownOpen(true);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCityDropdownOpen && !event.target.closest(".city-dropdown")) {
        setIsCityDropdownOpen(false);
      }
      if (isStateDropdownOpen && !event.target.closest(".state-dropdown")) {
        setIsStateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCityDropdownOpen, isStateDropdownOpen]);

  const handleFileChange = (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setValues((prevValues) => ({
          ...prevValues,
          frontImage: {
            file: input.files[0],
            url: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  const handleThumbnailImageChange = (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setValues((prevValues) => ({
          ...prevValues,
          thumbnailImage: {
            file: input.files[0],
            url: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  const handleBrochureChange = (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
      setValues((prevValues) => ({
        ...prevValues,
        project_Brochure: {
          file: input.files[0],
          url: URL.createObjectURL(input.files[0]),
        },
      }));
    }
  };

  const handleUpdateProject = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append scalar/text fields
      const scalarKeys = [
        'projectName', 'builderName', 'projectAddress', 'city', 'state', 'country', 'paymentPlan',
        'luxury', 'spotlight', 'projectOverview', 'projectRedefine_Business', 'projectRedefine_Connectivity',
        'projectRedefine_Education', 'projectRedefine_Entertainment', 'projectReraNo', 'AboutDeveloper', 'type',
        'project_url', 'meta_title', 'meta_description', 'project_Status', 'launchingDate', 'totalLandArea',
        'totalUnit', 'towerNumber', 'mobileNumber', 'possessionDate', 'minPrice', 'maxPrice', 'Amenities',
        'project_discripation', 'youtubeVideoUrl', 'youtubeVideoTitle', 'youtubeVideoDescription'
      ];

      scalarKeys.forEach((key) => {
        const val = values[key];
        if (val !== undefined && val !== null && typeof val !== 'object') {
          formData.append(key, val);
        }
      });

      // Helper: append single file if it's a File object or an object with .file
      const appendMaybeFile = (field, value) => {
        if (!value) return;
        if (value instanceof File) {
          formData.append(field, value);
        } else if (value && value.file instanceof File) {
          formData.append(field, value.file);
        }
      };

      // Single-file fields
      appendMaybeFile('frontImage', values.frontImage);
      appendMaybeFile('thumbnailImage', values.thumbnailImage);
      appendMaybeFile('project_locationImage', values.project_locationImage);
      appendMaybeFile('highlightImage', values.highlightImage);
      appendMaybeFile('projectMaster_plan', values.projectMaster_plan);
      appendMaybeFile('logo', values.logo);
      appendMaybeFile('project_Brochure', values.project_Brochure);

      // Multi-file fields
      if (Array.isArray(values.project_floorplan_Image)) {
        values.project_floorplan_Image.forEach((item) => {
          if (item instanceof File) {
            formData.append('project_floorplan_Image', item);
          } else if (item && item.file instanceof File) {
            formData.append('project_floorplan_Image', item.file);
          }
        });
      }

      if (Array.isArray(values.projectGallery)) {
        values.projectGallery.forEach((item) => {
          if (item instanceof File) {
            formData.append('projectGallery', item);
          } else if (item && item.file instanceof File) {
            formData.append('projectGallery', item.file);
          }
        });
      }

      const response = await api100acress.post(`/project/Update/${pUrl}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("Project updated successfully");
        navigate('/admin/listed-projects');
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert(error.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const groupedSections = [
    {
      icon: <MdInfo className="text-2xl text-blue-500 mr-2" />,
      title: "Basic Info",
      fields: [
        { label: "Project Name", name: "projectName", icon: <MdInfo className="inline mr-1" /> },
        { label: "Project Type", name: "type", icon: <MdInfo className="inline mr-1" />, select: true, options: projectTypes || [] },
        { label: "Project Status", name: "project_Status", icon: <MdInfo className="inline mr-1" />, select: true, options: statusOptions },
        { label: "Project URL", name: "project_url", icon: <MdInfo className="inline mr-1" />, placeholder: "project-name" },
        { label: "Builder Name", name: "builderName", icon: <MdInfo className="inline mr-1" />, select: true, options: builderOptions },
        { label: "Address", name: "projectAddress", icon: <MdInfo className="inline mr-1" /> },
        { label: "City", name: "city", icon: <MdInfo className="inline mr-1" /> },
        { label: "State", name: "state", icon: <MdInfo className="inline mr-1" /> },
        { label: "Country", name: "country", icon: <MdInfo className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdAttachMoney className="text-2xl text-green-500 mr-2" />,
      title: "Pricing & Dates",
      fields: [
        { label: "Minimum Price", name: "minPrice", icon: <MdAttachMoney className="inline mr-1" /> },
        { label: "Maximum Price", name: "maxPrice", icon: <MdAttachMoney className="inline mr-1" /> },
        { label: "Payment Plan", name: "paymentPlan", icon: <MdAttachMoney className="inline mr-1" /> },
        { label: "Launching Date", name: "launchingDate", icon: <MdDateRange className="inline mr-1" /> },
        { label: "Possession Date", name: "possessionDate", icon: <MdDateRange className="inline mr-1" /> },
        { label: "Project Rera No", name: "projectReraNo", icon: <MdCheckCircle className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdBarChart className="text-2xl text-purple-500 mr-2" />,
      title: "Project Stats",
      fields: [
        { label: "Total Land Area", name: "totalLandArea", icon: <MdBarChart className="inline mr-1" /> },
        { label: "Total Unit", name: "totalUnit", icon: <MdBarChart className="inline mr-1" /> },
        { label: "Tower Number", name: "towerNumber", icon: <MdBarChart className="inline mr-1" /> },
        { label: "Mobile Number", name: "mobileNumber", icon: <MdBarChart className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdDescription className="text-2xl text-orange-500 mr-2" />,
      title: "Descriptions",
      fields: [
        { label: "Project Overview", name: "projectOverview", icon: <MdDescription className="inline mr-1" /> },
        { label: "Project Description", name: "project_discripation", icon: <MdDescription className="inline mr-1" />, textarea: true },
        { label: "About Developer", name: "AboutDeveloper", icon: <MdDescription className="inline mr-1" /> },
        { label: "Meta Title", name: "meta_title", icon: <MdDescription className="inline mr-1" /> },
        { label: "Meta Description", name: "meta_description", icon: <MdDescription className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdStar className="text-2xl text-yellow-500 mr-2" />,
      title: "Features",
      fields: [
        { label: "Luxury", name: "luxury", icon: <MdStar className="inline mr-1" />, select: true, options: ["true", "false"] },
        { label: "Spotlight", name: "spotlight", icon: <MdStar className="inline mr-1" />, select: true, options: ["true", "false"] },
        { label: "Amenities", name: "Amenities", icon: <MdStar className="inline mr-1" />, textarea: true },
        { label: "Project Redefine Business", name: "projectRedefine_Business", icon: <MdStar className="inline mr-1" /> },
        { label: "Project Redefine Connectivity", name: "projectRedefine_Connectivity", icon: <MdStar className="inline mr-1" /> },
        { label: "Project Redefine Education", name: "projectRedefine_Education", icon: <MdStar className="inline mr-1" /> },
        { label: "Project Redefine Entertainment", name: "projectRedefine_Entertainment", icon: <MdStar className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdMovie className="text-2xl text-red-500 mr-2" />,
      title: "YouTube Video",
      fields: [
        { label: "YouTube Video URL", name: "youtubeVideoUrl", icon: <MdMovie className="inline mr-1" /> },
        { label: "YouTube Video Title", name: "youtubeVideoTitle", icon: <MdTitle className="inline mr-1" /> },
        { label: "YouTube Video Description", name: "youtubeVideoDescription", icon: <MdDescription className="inline mr-1" />, textarea: true },
      ]
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    <span className="lg:hidden">Edit Project</span>
                    <span className="hidden lg:inline">Edit Project</span>
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
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading project data...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  <span className="lg:hidden">Edit Project</span>
                  <span className="hidden lg:inline">Edit Project</span>
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
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <div className="w-full space-y-10">
              
              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 mb-4"
              >
                <MdArrowBack className="text-xl" />
                Back
              </button>

          {/* Image Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Front Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-2">Front Image</h3>
              <div className="flex items-center justify-center h-48 w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-200 mb-2">
                {values.frontImage && values.frontImage.url ? (
                  <img src={values.frontImage.url} alt="frontImage" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm italic">No Front Image</span>
                )}
              </div>
              <input type="file" onChange={handleFileChange} className="mt-2 dark:bg-gray-900 dark:text-white" />
            </div>

            {/* Thumbnail Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-2">Thumbnail Image</h3>
              <div className="flex items-center justify-center h-48 w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-200 mb-2">
                {values.thumbnailImage && values.thumbnailImage.url ? (
                  <img src={values.thumbnailImage.url} alt="thumbnailImage" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-gray-500 text-sm italic">No Thumbnail Image</span>
                )}
              </div>
              <input type="file" onChange={handleThumbnailImageChange} className="mt-2 dark:bg-gray-900 dark:text-white" />
            </div>
          </div>

          {/* Project Details Form */}
          <section className="space-y-8">
            {groupedSections.map((section, idx) => (
              <div key={section.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-l-4 border-blue-400 p-8 hover:shadow-3xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  {section.icon}
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{section.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.fields.map(field => (
                    <div key={field.name}>
                      <label className="flex items-center text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        {field.icon}
                        {field.label}
                      </label>
                      {field.select ? (
                        <select
                          name={field.name}
                          value={values[field.name] || ''}
                          onChange={e => setValues({ ...values, [field.name]: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-900 dark:text-white"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.name === 'city' ? (
                        <div className="relative city-dropdown">
                          <input
                            type="text"
                            value={citySearchTerm}
                            onChange={handleCityInputChange}
                            onFocus={handleCityInputFocus}
                            placeholder="Type or select city"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 dark:bg-gray-900 dark:text-white pr-10"
                            autoComplete="off"
                          />
                          {isCityDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {loadingCities ? (
                                <div className="px-4 py-2 text-gray-500">Loading cities...</div>
                              ) : filteredCities.length > 0 ? (
                                filteredCities.map((city, index) => (
                                  <div
                                    key={index}
                                    onClick={() => handleCitySelect(city)}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                                  >
                                    {city}
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500">No cities found</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : field.name === 'state' ? (
                        <div className="relative state-dropdown">
                          <input
                            type="text"
                            value={stateSearchTerm}
                            onChange={handleStateInputChange}
                            onFocus={handleStateInputFocus}
                            placeholder="Type or select state"
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 dark:bg-gray-900 dark:text-white pr-10"
                            autoComplete="off"
                          />
                          {isStateDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {loadingStates ? (
                                <div className="px-4 py-2 text-gray-500">Loading states...</div>
                              ) : filteredStates.length > 0 ? (
                                filteredStates.map((state, index) => (
                                  <div
                                    key={index}
                                    onClick={() => handleStateSelect(state)}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                                  >
                                    {state}
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500">No states found</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : field.textarea ? (
                        <textarea
                          name={field.name}
                          value={values[field.name] || ''}
                          onChange={e => setValues({ ...values, [field.name]: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-900 dark:text-white"
                          rows="3"
                        />
                      ) : (
                        <input
                          type="text"
                          name={field.name}
                          value={values[field.name] || ''}
                          onChange={e => setValues({ ...values, [field.name]: e.target.value })}
                          placeholder={field.placeholder || ''}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-900 dark:text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/admin/listed-projects')}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProject}
                disabled={loading}
                className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-8 py-3 shadow-lg transition-all disabled:opacity-60"
              >
                <MdUpdate className="text-2xl" />
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : "Update"}
              </button>
            </div>
          </section>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectEdit;
