import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBanners } from '../Redux/slice/BannerSlice';
import { fetchAllSmallBanners } from '../Redux/slice/SmallBannerSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '../components/AdminSidebar.jsx';
import api100acress from "../config/api100acressClient";
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdVisibility, 
  MdVisibilityOff,
  MdImage,
  MdComputer,
  MdPhoneAndroid,
  MdSave,
  MdClose,
  MdRefresh
} from 'react-icons/md';
import { ChevronDown, User, Settings as SettingsIcon, LogOut } from 'lucide-react';

const UnifiedBannerManagement = () => {
  const dispatch = useDispatch();
  const { allBanners = [], loading: bannerLoading } = useSelector(state => state?.banner || {});
  const { allSmallBanners = [], loading: smallBannerLoading } = useSelector(state => state?.smallBanner || {});
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' or 'small'
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
  const [bannerData, setBannerData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    link: '',
    isActive: false, // Default to inactive so banners don't show immediately after upload
    order: 0,
    position: 'bottom',
    size: 'small',
    desktopImage: '',
    mobileImage: ''
  });
  
  const [selectedDesktopFile, setSelectedDesktopFile] = useState(null);
  const [selectedMobileFile, setSelectedMobileFile] = useState(null);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState(null);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState(null);

  useEffect(() => {
    if (activeTab === 'hero') {
      dispatch(fetchAllBanners());
    } else {
      dispatch(fetchAllSmallBanners());
    }
  }, [dispatch, activeTab]);

  const currentBanners = (() => {
    const banners = activeTab === 'hero' ? allBanners : allSmallBanners;
    return Array.isArray(banners) ? banners : [];
  })();
  const loading = activeTab === 'hero' ? bannerLoading : smallBannerLoading;

  const handleFileSelect = (file, type) => {
    if (type === 'desktop') {
      setSelectedDesktopFile(file);
      const url = URL.createObjectURL(file);
      setDesktopPreviewUrl(url);
    } else {
      setSelectedMobileFile(file);
      const url = URL.createObjectURL(file);
      setMobilePreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (activeTab === 'hero') {
      await uploadHeroBanner();
    } else {
      await uploadSmallBanner();
    }
  };

  const uploadHeroBanner = async () => {
    try {
      const formData = new FormData();
      formData.append('title', bannerData.title);
      formData.append('subtitle', bannerData.subtitle);
      formData.append('slug', bannerData.slug);
      formData.append('link', bannerData.link);
      formData.append('isActive', bannerData.isActive);
      formData.append('order', bannerData.order);
      
      if (selectedDesktopFile) {
        formData.append('bannerImage', selectedDesktopFile);
      }
      if (selectedMobileFile) {
        formData.append('mobileBannerImage', selectedMobileFile);
      }

      // Use PATCH for updates, POST for new banners
      const method = editingBanner ? 'patch' : 'post';
      const endpoint = editingBanner 
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners/upload';

      console.log('Hero banner update - FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Banner update request details:', {
        method,
        endpoint,
        editingBannerId: editingBanner?._id,
        editingBannerTitle: editingBanner?.title
      });

      const response = await api100acress[method](endpoint, formData);

      console.log('Hero banner update response status:', response.status);

      if (response.data) {
        toast.success(editingBanner ? 'Hero banner updated successfully!' : 'Hero banner uploaded successfully!');
        dispatch(fetchAllBanners());
        resetForm();
      } else {
        const errorData = response.response?.data || { message: 'Failed to upload banner' };
        console.error('Hero banner update error response:', errorData);
        toast.error(errorData.message || `Failed to ${editingBanner ? 'update' : 'upload'} hero banner`);
      }
    } catch (error) {
      console.error(`Error ${editingBanner ? 'updating' : 'uploading'} hero banner:`, error);
      toast.error(`Error ${editingBanner ? 'updating' : 'uploading'} hero banner`);
    }
  };

  const uploadSmallBanner = async () => {
    try {
      // Validate required fields
      if (!bannerData.title) {
        toast.error('Title is required');
        return;
      }
      if (!bannerData.slug) {
        toast.error('Slug is required');
        return;
      }
      if (!selectedDesktopFile && !bannerData.desktopImage) {
        toast.error('Desktop image is required');
        return;
      }

      const formData = new FormData();
      formData.append('title', bannerData.title);
      formData.append('subtitle', bannerData.subtitle);
      formData.append('slug', bannerData.slug);
      formData.append('link', bannerData.link);
      formData.append('isActive', bannerData.isActive);
      formData.append('order', bannerData.order);
      formData.append('position', bannerData.position);
      formData.append('size', bannerData.size);
      
      // Only append image URLs if no files are selected
      if (!selectedDesktopFile && bannerData.desktopImage) {
        formData.append('desktopImage', bannerData.desktopImage);
      }
      if (!selectedMobileFile && bannerData.mobileImage) {
        formData.append('mobileImage', bannerData.mobileImage);
      }
      
      // Append files if selected
      if (selectedDesktopFile) {
        formData.append('desktopBannerImage', selectedDesktopFile);
      }
      if (selectedMobileFile) {
        formData.append('mobileBannerImage', selectedMobileFile);
      }

      // Use PUT for updates, POST for new banners
      const method = editingBanner ? 'put' : 'post';
      const endpoint = editingBanner 
        ? `/api/admin/small-banners/${editingBanner._id}`
        : '/api/admin/small-banners/upload';

      console.log('Small banner upload - FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api100acress[method](endpoint, formData);

      console.log('Small banner upload response status:', response.status);

      if (response.data) {
        toast.success(editingBanner ? 'Small banner updated successfully!' : 'Small banner uploaded successfully!');
        dispatch(fetchAllSmallBanners());
        resetForm();
      } else {
        const errorData = response.response?.data || { message: 'Failed to upload banner' };
        console.error('Small banner upload error response:', errorData);
        toast.error(errorData.message || `Failed to ${editingBanner ? 'update' : 'upload'} small banner`);
      }
    } catch (error) {
      console.error(`Error ${editingBanner ? 'updating' : 'uploading'} small banner:`, error);
      toast.error(`Error ${editingBanner ? 'updating' : 'uploading'} small banner`);
    }
  };

  const handleEdit = (banner) => {
    console.log('Editing banner:', banner);
    console.log('Banner ID:', banner._id);
    console.log('Banner title:', banner.title);

    setEditingBanner(banner);
    setBannerData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      slug: banner.slug || '',
      link: banner.link || '',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      order: banner.order || 0,
      position: banner.position || 'bottom',
      size: banner.size || 'small',
      desktopImage: banner.desktopImage?.url || banner.desktopImage || '',
      mobileImage: banner.mobileImage?.url || banner.mobileImage || ''
    });
    setShowUploadForm(true);
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const endpoint = activeTab === 'hero' 
          ? `/api/admin/banners/${bannerId}`
          : `/api/admin/small-banners/${bannerId}`;
          
        const response = await api100acress.delete(endpoint);

        if (response.data) {
          toast.success('Banner deleted successfully!');
          if (activeTab === 'hero') {
            dispatch(fetchAllBanners());
          } else {
            dispatch(fetchAllSmallBanners());
          }
        } else {
          toast.error('Failed to delete banner');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast.error('Error deleting banner');
      }
    }
  };

  const handleToggleStatus = async (bannerId, currentStatus) => {
    try {
      const endpoint = activeTab === 'hero' 
        ? `/api/admin/banners/${bannerId}/toggle`
        : `/api/admin/small-banners/${bannerId}/toggle`;
        
      const response = await api100acress.patch(endpoint, { isActive: !currentStatus });

      if (response.data) {
        toast.success(`Banner ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        if (activeTab === 'hero') {
          dispatch(fetchAllBanners());
        } else {
          dispatch(fetchAllSmallBanners());
        }
      } else {
        toast.error('Failed to update banner status');
      }
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast.error('Error updating banner status');
    }
  };

  const resetForm = () => {
    setBannerData({
      title: '',
      subtitle: '',
      slug: '',
      link: '',
      isActive: false, // Default to inactive for new uploads
      order: 0,
      position: 'bottom',
      size: 'small',
      desktopImage: '',
      mobileImage: ''
    });
    setSelectedDesktopFile(null);
    setSelectedMobileFile(null);
    setDesktopPreviewUrl(null);
    setMobilePreviewUrl(null);
    setEditingBanner(null);
    setShowUploadForm(false);
  };

  const generateSlug = (title) => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Add timestamp to make slug unique
    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setBannerData(prev => ({
      ...prev,
      title,
      // Generate slug for both new and editing banners
      slug: generateSlug(title)
    }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen flex overflow-x-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        {/* Admin Dashboard Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Header */}
              <div className="flex items-center gap-2 sm:hidden w-full">
                <div className="bg-blue-100 p-2 rounded-lg shadow">
                  <MdImage className="text-lg text-blue-600" />
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-bold text-gray-900">Banner</h1>
                  <p className="text-xs text-gray-600">Manage banners</p>
                </div>
              </div>
              
              {/* Desktop Header */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl shadow-lg">
                  <MdImage className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    Banner Management
                  </h1>
                  <p className="text-sm text-gray-600">
                    Manage both hero section and small banners
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Action Button */}
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
              >
                <MdAdd className="text-sm sm:text-base" />
                <span className="hidden sm:inline">Add Banner</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* User Profile Dropdown */}
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

        {/* Action Bar Below Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {currentBanners.length} {activeTab === 'hero' ? 'hero' : 'small'} banner{currentBanners.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={() => {
                if (activeTab === 'hero') {
                  dispatch(fetchAllBanners());
                } else {
                  dispatch(fetchAllSmallBanners());
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <MdRefresh className="text-base" />
              Refresh
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('hero')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'hero'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">Hero Section Banners</span>
                <span className="sm:hidden">Hero Banners</span>
              </button>
              <button
                onClick={() => setActiveTab('small')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'small'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">Small Banners</span>
                <span className="sm:hidden">Small Banners</span>
              </button>
            </div>
          </div>

        {/* Banner List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading banners...</p>
            </div>
          ) : currentBanners.length === 0 ? (
            <div className="p-8 text-center">
              <MdImage className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No {activeTab === 'hero' ? 'hero' : 'small'} banners found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by adding your first banner
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MdAdd className="text-lg" />
                Add Banner
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Banner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      {activeTab === 'small' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Size
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {(currentBanners || []).map((banner) => (
                      <tr key={banner._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-20 flex-shrink-0">
                              <img
                                className="h-12 w-20 rounded-lg object-cover"
                                src={
                                  activeTab === 'hero' 
                                    ? banner.image?.cdn_url || banner.image?.url || '/Images/placeholder-banner.jpg'
                                    : banner.desktopImage?.cdn_url || banner.desktopImage?.url || '/Images/placeholder-banner.jpg'
                                }
                                alt={banner.title}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {banner.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {banner.subtitle}
                          </div>
                        </td>
                        {activeTab === 'small' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {banner.size}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            banner.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {banner.order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStatus(banner._id, banner.isActive)}
                              className={`p-2 rounded-lg transition-colors ${
                                banner.isActive 
                                  ? 'text-red-600 hover:bg-red-100' 
                                  : 'text-green-600 hover:bg-green-100'
                              }`}
                              title={banner.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {banner.isActive ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                            <button
                              onClick={() => handleEdit(banner)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <MdEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(banner._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {(currentBanners || []).map((banner) => (
                  <div key={banner._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Banner Image */}
                        <div className="flex-shrink-0">
                          <img
                            className="h-16 w-24 rounded-lg object-cover"
                            src={
                              activeTab === 'hero' 
                                ? banner.image?.cdn_url || banner.image?.url || '/Images/placeholder-banner.jpg'
                                : banner.desktopImage?.cdn_url || banner.desktopImage?.url || '/Images/placeholder-banner.jpg'
                            }
                            alt={banner.title}
                          />
                        </div>
                        
                        {/* Banner Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {banner.title}
                          </h3>
                          {banner.subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                              {banner.subtitle}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              banner.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </span>
                            
                            {activeTab === 'small' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {banner.size}
                              </span>
                            )}
                            
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Order: {banner.order}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleToggleStatus(banner._id, banner.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            banner.isActive 
                              ? 'text-red-600 hover:bg-red-100' 
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={banner.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {banner.isActive ? <MdVisibilityOff /> : <MdVisibility />}
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                    {editingBanner ? 'Edit' : 'Add'} {activeTab === 'hero' ? 'Hero' : 'Small'} Banner
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={bannerData.title}
                        onChange={handleTitleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={bannerData.subtitle}
                        onChange={(e) => setBannerData(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={bannerData.slug}
                        onChange={(e) => setBannerData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Link
                      </label>
                      <input
                        type="url"
                        value={bannerData.link}
                        onChange={(e) => setBannerData(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        placeholder="https://www.100acress.com/slug"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Leave empty to use slug-based link: https://www.100acress.com/{bannerData.slug || 'your-slug'}
                      </p>
                    </div>
                  </div>

                  {activeTab === 'small' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Position
                        </label>
                        <select
                          value={bannerData.position}
                          onChange={(e) => setBannerData(prev => ({ ...prev, position: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        >
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                          <option value="center">Center</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Size
                        </label>
                        <select
                          value={bannerData.size}
                          onChange={(e) => setBannerData(prev => ({ ...prev, size: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Order
                        </label>
                        <input
                          type="number"
                          value={bannerData.order}
                          onChange={(e) => setBannerData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  )}

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {activeTab === 'hero' ? 'Banner Image' : 'Banner Images'}
                    </h3>
                    
                    {activeTab === 'hero' ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Desktop Image *
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files[0], 'desktop')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {desktopPreviewUrl && (
                            <div className="mt-2">
                              <img src={desktopPreviewUrl} alt="Preview" className="h-32 w-auto rounded-lg" />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mobile Image (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files[0], 'mobile')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {mobilePreviewUrl && (
                            <div className="mt-2">
                              <img src={mobilePreviewUrl} alt="Mobile Preview" className="h-32 w-auto rounded-lg" />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Desktop Image Section */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <MdComputer className="text-blue-600" />
                            Desktop Image
                          </h4>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Desktop Image Link
                            </label>
                            <input
                              type="url"
                              name="desktopImage"
                              value={bannerData.desktopImage}
                              onChange={(e) => setBannerData(prev => ({ ...prev, desktopImage: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                              placeholder="https://example.com/desktop-image.jpg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Or Upload Desktop Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileSelect(e.target.files[0], 'desktop')}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                            />
                            {desktopPreviewUrl && (
                              <div className="mt-4">
                                <img
                                  src={desktopPreviewUrl}
                                  alt="Desktop Preview"
                                  className="w-full max-w-xs h-32 object-cover rounded-lg border"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mobile Image Section */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <MdPhoneAndroid className="text-green-600" />
                            Mobile Image
                          </h4>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Mobile Image Link
                            </label>
                            <input
                              type="url"
                              name="mobileImage"
                              value={bannerData.mobileImage}
                              onChange={(e) => setBannerData(prev => ({ ...prev, mobileImage: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                              placeholder="https://example.com/mobile-image.jpg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Or Upload Mobile Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileSelect(e.target.files[0], 'mobile')}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                            />
                            {mobilePreviewUrl && (
                              <div className="mt-4">
                                <img
                                  src={mobilePreviewUrl}
                                  alt="Mobile Preview"
                                  className="w-full max-w-xs h-32 object-cover rounded-lg border"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bannerData.isActive}
                        onChange={(e) => setBannerData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <MdSave className="text-base" />
                      {editingBanner ? 'Update' : 'Upload'} Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default UnifiedBannerManagement;
