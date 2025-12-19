import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useParams, useNavigate } from "react-router-dom";
import api100acress from "../config/api100acressClient";
import { MdInfo, MdAttachMoney, MdDateRange, MdBarChart, MdDescription, MdStar, MdCheckCircle, MdArrowBack } from "react-icons/md";
import { Modal } from 'antd';
import { LogOut, Menu, X, ChevronDown, User, Settings as SettingsIcon } from 'lucide-react';

const ProjectView = () => {
  const [viewDetails, setViewDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { pUrl } = useParams();
  const navigate = useNavigate();

  // Get project_url from viewDetails to navigate back
  const projectUrl = viewDetails?.project_url;

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


  const {
    project_floorplan_Image = [],
    projectRedefine_Connectivity = [],
    projectRedefine_Business = [],
    projectRedefine_Education = [],
    projectRedefine_Entertainment = [],
    Amenities = [],
    projectGallery = [],
    frontImage,
    thumbnailImage,
    project_locationImage,
    logo,
    highlightImage,
    projectMaster_plan,
    project_Brochure,
    projectName,
    paymentPlan,
    country,
    luxury,
    spotlight,
    totalLandArea,
    totalUnit,
    towerNumber,
    mobileNumber,
    possessionDate,
    maxPrice,
    minPrice,
    launchingDate,
    project_discripation,
    project_Status,
    builderName,
    projectAddress,
    city,
    state,
    projectOverview,
    projectReraNo,
    AboutDeveloper,
    type,
    project_url,
    meta_title,
    meta_description,
  } = viewDetails;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api100acress.get(`/project/View/${pUrl}`);
        const dv = res?.data?.dataview;
        setViewDetails(Array.isArray(dv) && dv.length > 0 ? dv[0] : {});
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchData();
  }, [pUrl]);


  // Helper for rendering a single image with a title
  const renderSingleImageCard = (imageObject, title) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center justify-center space-y-4 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center">{title}</h3>
      <div className="flex items-center justify-center h-48 w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
        {imageObject && imageObject.url ? (
          <img
            src={imageObject.url}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-gray-500 text-sm italic">No {title} available</span>
        )}
      </div>
    </div>
  );


  // Helper for rendering image galleries
  const renderGalleryCard = (images, title) => (
    <section className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-3 border-gray-200">{title}</h3>
      {images && Array.isArray(images) && images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <article
              key={index}
              className="relative w-full aspect-video overflow-hidden rounded-lg shadow-md group cursor-pointer"
              onClick={() => {
                setModalImage(image.url);
                setModalOpen(true);
              }}
            >
              <img
                src={image.url}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">View Image</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center">No {title} images available.</p>
      )}
    </section>
  );


  // Helper for rendering lists with a modern badge/chip style
  const renderFeatureList = (items, title) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 border-b pb-3 border-gray-200">{title}</h3>
      {items && Array.isArray(items) && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No {title.toLowerCase()} available.</p>
      )}
    </div>
  );


  const groupedSections = [
    {
      icon: <MdInfo className="text-2xl text-blue-500 mr-2" />, title: "Basic Info", fields: [
        { label: "Property Name", value: projectName, icon: <MdInfo className="inline mr-1" /> },
        { label: "Type", value: type, icon: <MdInfo className="inline mr-1" /> },
        { label: "Project Status", value: project_Status, icon: <MdInfo className="inline mr-1" /> },
        { label: "Builder Name", value: builderName, icon: <MdInfo className="inline mr-1" /> },
        { label: "Address", value: projectAddress, icon: <MdInfo className="inline mr-1" /> },
        { label: "City", value: city, icon: <MdInfo className="inline mr-1" /> },
        { label: "State", value: state, icon: <MdInfo className="inline mr-1" /> },
        { label: "Country", value: country, icon: <MdInfo className="inline mr-1" /> },
        { label: "Project URL", value: project_url, icon: <MdInfo className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdAttachMoney className="text-2xl text-green-500 mr-2" />, title: "Pricing & Dates", fields: [
        { label: "Minimum Price", value: minPrice, icon: <MdAttachMoney className="inline mr-1" /> },
        { label: "Maximum Price", value: maxPrice, icon: <MdAttachMoney className="inline mr-1" /> },
        { label: "Payment Plan", value: paymentPlan, icon: <MdAttachMoney className="inline mr-1" /> },
        { label: "Launching Date", value: launchingDate, icon: <MdDateRange className="inline mr-1" /> },
        { label: "Possession Date", value: possessionDate, icon: <MdDateRange className="inline mr-1" /> },
        { label: "Project Rera No", value: projectReraNo, icon: <MdCheckCircle className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdBarChart className="text-2xl text-purple-500 mr-2" />, title: "Project Stats", fields: [
        { label: "Total Land Area", value: totalLandArea, icon: <MdBarChart className="inline mr-1" /> },
        { label: "Total Unit", value: totalUnit, icon: <MdBarChart className="inline mr-1" /> },
        { label: "Tower Number", value: towerNumber, icon: <MdBarChart className="inline mr-1" /> },
        { label: "Mobile Number", value: mobileNumber, icon: <MdBarChart className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdDescription className="text-2xl text-orange-500 mr-2" />, title: "Descriptions", fields: [
        { label: "Project Overview", value: projectOverview, icon: <MdDescription className="inline mr-1" /> },
        { label: "Project Description", value: project_discripation, icon: <MdDescription className="inline mr-1" /> },
        { label: "About Developer", value: AboutDeveloper, icon: <MdDescription className="inline mr-1" /> },
        { label: "Meta Title", value: meta_title, icon: <MdDescription className="inline mr-1" /> },
        { label: "Meta Description", value: meta_description, icon: <MdDescription className="inline mr-1" /> },
      ]
    },
    {
      icon: <MdStar className="text-2xl text-yellow-500 mr-2" />, title: "Features", fields: [
        { label: "Luxury", value: luxury, icon: <MdStar className="inline mr-1" /> },
        { label: "Spotlight", value: spotlight, icon: <MdStar className="inline mr-1" /> },
      ]
    },
  ];



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  <span className="lg:hidden">Project View</span>
                  <span className="hidden lg:inline">Project View</span>
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
          
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center tracking-tight">
                Project Overview
              </h1>


              {/* Image Gallery Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {renderSingleImageCard(frontImage, "Front Images")}
                {renderSingleImageCard(thumbnailImage, "Thumbnail Image")}
                {renderSingleImageCard(project_locationImage, "Project Location Image")}
                {renderSingleImageCard(logo, "Project Logo Image")}
                {renderSingleImageCard(highlightImage, "Project highlight Image")}
                {renderSingleImageCard(projectMaster_plan, "Project Master Plan")}
                {renderSingleImageCard(project_Brochure, "Project Brochure")}
              </div>


              <div className="space-y-8">
                {renderGalleryCard(project_floorplan_Image, "Project FloorPlan Image")}
                {renderGalleryCard(projectGallery, "Project Gallery Image")}
              </div>
              
              {/* Project Information Table */}
              <section className="space-y-8">
                {groupedSections.map((section, idx) => (
                  <div key={section.title} className="bg-white rounded-xl shadow-2xl border-l-4 border-blue-400 p-8 hover:shadow-3xl transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                      {section.icon}
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{section.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {section.fields.map(field => (
                        <div key={field.label}>
                          <label className="flex items-center text-red-700 font-semibold mb-2">{field.icon}{field.label}</label>
                          <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800 dark:text-white whitespace-pre-wrap">{field.value || <span className="text-gray-400 italic">N/A</span>}</div>
                        </div>
                      ))}
                    </div>
                    {idx < groupedSections.length - 1 && <hr className="my-8 border-t-2 border-dashed border-gray-200" />}
                  </div>
                ))}
              </section>


              {/* Features and Amenities Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {renderFeatureList(projectRedefine_Connectivity, "Project Redefine Connectivity")}
                {renderFeatureList(projectRedefine_Business, "Project Redefine Business")}
                {renderFeatureList(projectRedefine_Education, "Project Redefine Education")}
                {renderFeatureList(projectRedefine_Entertainment, "Project Redefine Entertainment")}
                {renderFeatureList(Amenities, "Amenities")}
              </div>


            </div>
          </div>
        </main>
      </div>

      {/* Image Modal */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <button
            key="close"
            onClick={() => setModalOpen(false)}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Close
          </button>
        ]}
        width="90%"
        style={{ maxWidth: '900px' }}
        centered
      >
        <img
          src={modalImage}
          alt="Full size view"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </Modal>
    </div>
  );
};


export default ProjectView;
