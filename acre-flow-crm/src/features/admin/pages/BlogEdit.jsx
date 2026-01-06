import React, { useState, useEffect, useMemo } from "react";
import { message, Modal, notification } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import api100acress from "../config/api100acressClient";
import AdminSidebar from "../components/AdminSidebar";
import { MdEdit, MdImage, MdTitle, MdDescription, MdCategory, MdPerson, MdArrowBack, MdSave, MdClose } from "react-icons/md";
import { LogOut, ChevronDown, User, Settings as SettingsIcon } from "lucide-react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const BlogEdit = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [viewDetails, setViewDetails] = useState({
    blog_Category: "",
    blog_Description: "",
    blog_Title: "",
    blog_Image: "",
    author: "",
    isPublished: false,
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // User info effect
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

  const handleUpdateUser = async () => {
    try {
      const toastKey = 'blogUpdate';
      message.loading({ content: 'Updating blog...', key: toastKey, duration: 0 });
      const formData = new FormData();
      
      // Append only scalar fields
      formData.append("blog_Title", viewDetails.blog_Title || "");
      formData.append("blog_Description", viewDetails.blog_Description || "");
      formData.append("author", viewDetails.author || "");
      formData.append("blog_Category", viewDetails.blog_Category || "");
      
      // Preserve current publish status
      if (typeof viewDetails.isPublished !== 'undefined') {
        formData.append("isPublished", String(viewDetails.isPublished));
      }
      
      // If a new image is chosen, send it
      if (viewDetails.frontImage && viewDetails.frontImage.file) {
        formData.append("blog_Image", viewDetails.frontImage.file);
      }
      
      const response = await api100acress.put(`blog/update/${id}`, formData);
      console.debug('[BlogEdit] Update response:', response?.data);
      
      if (response.data) {
        message.destroy(toastKey);
        notification.success({
          message: 'Blog updated',
          description: 'Your changes have been saved successfully.',
          placement: 'topRight',
        });
        
        // Re-fetch latest blog data
        try {
          const refreshed = await api100acress.get(`blog/edit/${id}`);
          console.debug('[BlogEdit] Refetched blog after update:', refreshed.data);
          const payload = refreshed.data;
          const safe = payload && typeof payload.data === 'object' && payload.data !== null ? payload.data : {};
          setViewDetails(prev => ({
            blog_Category: "",
            blog_Description: "",
            blog_Title: "",
            blog_Image: "",
            author: "",
            isPublished: false,
            ...safe,
          }));
        } catch (refetchErr) {
          console.error('Refetch failed:', refetchErr);
        }
        
        // Navigate to Admin blog list
        navigate('/admin/blog-post');
      } else {
        console.error("Failed to update blog");
        message.destroy(toastKey);
        notification.error({
          message: 'Update failed',
          description: 'Could not update the blog. Please try again.',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      message.destroy('blogUpdate');
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred while updating the blog.',
        placement: 'topRight',
      });
    }
  };

  const handleConfirmAndUpdate = () => {
    Modal.confirm({
      title: 'Confirm Update',
      content: 'Are you sure you want to save these changes to the blog?',
      okText: 'Yes, Update',
      cancelText: 'Cancel',
      okButtonProps: { className: 'bg-red-500' },
      onOk: async () => {
        await handleUpdateUser();
      },
    });
  };

  function handleFileChange(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Check image dimensions and aspect ratio (1200x628 = 300:157)
      const img = new Image();
      img.onload = function() {
        const expectedWidth = 1200;
        const expectedHeight = 628;
        const tolerance = 5; // Allow 5px tolerance
        
        if (Math.abs(this.width - expectedWidth) > tolerance || Math.abs(this.height - expectedHeight) > tolerance) {
          message.error(`Image must be exactly ${expectedWidth} × ${expectedHeight} pixels (Current: ${this.width} × ${this.height})`);
          // Reset the file input
          input.value = '';
          return;
        }
        
        // Calculate aspect ratio
        const expectedRatio = expectedWidth / expectedHeight;
        const actualRatio = this.width / this.height;
        const ratioTolerance = 0.01; // 1% tolerance
        
        if (Math.abs(actualRatio - expectedRatio) > ratioTolerance) {
          message.error(`Image aspect ratio must be ${expectedWidth}:${expectedHeight} (300:157). Current ratio is ${this.width}:${this.height}`);
          // Reset the file input
          input.value = '';
          return;
        }
        
        // If all validations pass, proceed with file processing
        const reader = new FileReader();
        reader.onload = function (e) {
          setViewDetails((prevValues) => ({
            ...prevValues,
            frontImage: {
              file: file,
              url: e.target.result,
            },
          }));
        };
        reader.readAsDataURL(file);
      };
      
      img.onerror = function() {
        message.error('Failed to load image. Please try a different file.');
        input.value = '';
      };
      
      // Create object URL for validation
      const objUrl = URL.createObjectURL(file);
      img.src = objUrl;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching blog data for ID:', id);
        const res = await api100acress.get(`blog/edit/${id}`);
        console.log('Blog data received:', res.data);
        const payload = res.data;
        const safe = payload && typeof payload.data === 'object' && payload.data !== null ? payload.data : {};
        setViewDetails(prev => ({
          blog_Category: "",
          blog_Description: "",
          blog_Title: "",
          blog_Image: "",
          author: "",
          isPublished: false,
          ...safe,
        }));
      } catch (error) {
        console.error('Error fetching blog data:', error);
        
        let errorMessage = 'Failed to load blog data';
        if (error.response) {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'Network error. Please check your connection.';
        }
        
        notification.error({
          message: 'Error',
          description: errorMessage,
          placement: 'topRight',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
        <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  <span className="lg:hidden">Edit Blog</span>
                  <span className="hidden lg:inline">Edit Blog Post</span>
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
              <div className="max-w-full mx-auto">
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Desktop Header */}
              <div className="hidden sm:flex items-center gap-3 justify-center w-full">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <MdEdit className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Blog Post</h1>
                  <p className="text-sm text-gray-600">Modify your blog content and settings</p>
                </div>
              </div>
              
              {/* Mobile Header */}
              <div className="sm:hidden flex items-center gap-2 justify-center w-full">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Edit Blog</h1>
                  <p className="text-xs text-gray-600">Modify content</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
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
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Back Button - Below Header */}
              <div className="mb-6">
                <Link
                  to="/admin/blog-post"
                  className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <MdArrowBack className="text-lg" />
                  <span className="ml-2 text-sm font-medium">Back to Blogs</span>
                </Link>
              </div>

              {/* Card Form */}
              <section className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-2xl overflow-hidden border p-4 sm:p-6 lg:p-8 w-full`}> 
                {/* Form Header */}
                <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                      <MdEdit className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Blog Information</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Update your blog post details</p>
                    </div>
                  </div>
                </div>

                {/* Blog Image */}
                <div className="mb-8">
                  <div className="mb-4">
                    <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}>
                      <MdImage className="text-lg" />
                      <span>Blog Image</span>
                    </label>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Upload a high-quality image for your blog post</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className={`flex items-center justify-center h-40 w-40 overflow-hidden rounded-xl ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 border-dashed`}>
                      {viewDetails.frontImage && viewDetails.frontImage.url ? (
                        <img src={viewDetails.frontImage.url} alt="blog_Image_preview" className="max-h-full max-w-full object-contain" id="previewImage" />
                      ) : viewDetails.blog_Image && (viewDetails.blog_Image.cdn_url || viewDetails.blog_Image.url) ? (
                        <img 
                          src={viewDetails.blog_Image.cdn_url || viewDetails.blog_Image.url} 
                          alt="blog_Image_preview" 
                          className="max-h-full max-w-full object-contain" 
                        />
                      ) : (
                        <div className="text-center p-4">
                          <MdImage className={`text-3xl ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-2`} />
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className={`w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        />
                      </div>
                      <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Recommended: 1200x630px, Max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Blog Title */}
                <div className="mb-6">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}>
                    <MdTitle className="text-lg" />
                    <span>Blog Title</span>
                  </label>
                  <input
                    type="text"
                    name="blog_Title"
                    placeholder="Enter an engaging blog title"
                    className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400 focus:border-blue-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'} px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors shadow-sm`}
                    value={viewDetails.blog_Title}
                    onChange={(e) => setViewDetails({ ...viewDetails, blog_Title: e.target.value })}
                  />
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Make it catchy and descriptive (max 100 characters)</p>
                </div>

                {/* Blog Description */}
                <div className="mb-6">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}>
                    <MdDescription className="text-lg" />
                    <span>Blog Description</span>
                  </label>
                  <textarea
                    name="blog_Description"
                    placeholder="Write a compelling description for your blog post..."
                    className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400 focus:border-blue-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'} px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[150px] transition-colors shadow-sm resize-none`}
                    value={viewDetails.blog_Description}
                    onChange={(e) => setViewDetails({ ...viewDetails, blog_Description: e.target.value })}
                  />
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Provide a brief overview of your blog content</p>
                </div>

                {/* Blog Category */}
                <div className="mb-6">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}>
                    <MdCategory className="text-lg" />
                    <span>Blog Category</span>
                  </label>
                  <select
                    className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100 focus:border-blue-500' : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'} px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors shadow-sm cursor-pointer`}
                    value={viewDetails.blog_Category}
                    onChange={(e) => setViewDetails({ ...viewDetails, blog_Category: e.target.value })}
                  >
                    <option value="" className="text-gray-600">Select a category</option>
                    <option value="Commercial Property">Commercial Property</option>
                    <option value="Residential Flats">Residential Flats</option>
                    <option value="SCO Plots">SCO Plots</option>
                    <option value="Deendayal Plots">Deen Dayal Plots</option>
                    <option value="Residential Plots">Residential Plots</option>
                    <option value="Independent Floors">Independent Floors</option>
                    <option value="Builder Floors">Builder Floors</option>
                    <option value="Affordable Homes">Affordable Homes</option>
                  </select>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Choose the most relevant category for your blog</p>
                </div>

                {/* Author */}
                <div className="mb-8">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}>
                    <MdPerson className="text-lg" />
                    <span>Author</span>
                  </label>
                  <input
                    name="author"
                    placeholder="Enter author name"
                    className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400 focus:border-blue-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'} px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors shadow-sm`}
                    value={viewDetails.author}
                    onChange={(e) => setViewDetails({ ...viewDetails, author: e.target.value })}
                  />
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Who wrote this blog post?</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/admin/blog-post"
                    className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    <MdClose className="text-lg" />
                    <span>Cancel</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleConfirmAndUpdate}
                    className="flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <MdSave className="text-xl" />
                    <span>Update Blog</span>
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

export default BlogEdit;
