import React, { useState, useEffect, useMemo } from "react";
import { message, Modal, notification } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import api100acress from "../config/api100acressClient";
import AdminSidebar from "../components/AdminSidebar";
import { MdEdit, MdImage, MdTitle, MdDescription, MdCategory, MdPerson } from "react-icons/md";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const BlogEdit = () => {
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
      const reader = new FileReader();
      reader.onload = function (e) {
        setViewDetails((prevValues) => ({
          ...prevValues,
          frontImage: {
            file: input.files[0],
            url: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(input.files[0]);
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
      <>
        <AdminSidebar />
        <div className="flex bg-gray-50 min-h-screen">
          <div className="flex-1 p-8 ml-64 overflow-auto font-sans">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
     
      <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
         <AdminSidebar />
        <div className="flex-1 p-8 ml-o overflow-auto font-sans">
          <div className="w-full space-y-10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8 justify-between">
              <div className="flex items-center gap-2">
                <MdEdit className="text-3xl text-blue-500 animate-pulse" />
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Edit Blog</h1>
              </div>
            </div>
            {/* Card Form */}
            <section className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-2xl overflow-hidden border p-8 w-full`}> 
              {/* Blog Image */}
              <div className="mb-6">
                <Tippy content={<span>Blog Image</span>} animation="scale" theme="light-border">
                  <label className={`block font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}><MdImage />Blog Image</label>
                </Tippy>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center h-32 w-32 overflow-hidden rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border`}>
                    {viewDetails.frontImage && viewDetails.frontImage.url ? (
                      <img src={viewDetails.frontImage.url} alt="blog_Image_preview" className="max-h-full max-w-full object-contain" id="previewImage" />
                    ) : viewDetails.blog_Image && (viewDetails.blog_Image.cdn_url || viewDetails.blog_Image.url) ? (
                      <img src={(viewDetails.blog_Image.cdn_url || viewDetails.blog_Image.url)} alt="blog_Image" className="max-h-full max-w-full object-contain" id="previewImage" />
                    ) : (
                      <span className="text-gray-500 text-sm italic">No Blog Image</span>
                    )}
                  </div>
                  <input type="file" onChange={handleFileChange} className="mt-2" />
                </div>
              </div>
              {/* Blog Title */}
              <div className="mb-6">
                <Tippy content={<span>Blog Title</span>} animation="scale" theme="light-border">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}><MdTitle />Blog Title</label>
                </Tippy>
                <input
                  name="blog_Title"
                  placeholder="Blog Title"
                  className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                  value={viewDetails.blog_Title}
                  onChange={(e) => setViewDetails({ ...viewDetails, blog_Title: e.target.value })}
                />
              </div>
              {/* Blog Description */}
              <div className="mb-6">
                <Tippy content={<span>Blog Description</span>} animation="scale" theme="light-border">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}><MdDescription />Blog Description</label>
                </Tippy>
                <textarea
                  name="blog_Description"
                  placeholder="Blog Description"
                  className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none min-h-[120px]`}
                  value={viewDetails.blog_Description}
                  onChange={(e) => setViewDetails({ ...viewDetails, blog_Description: e.target.value })}
                />
              </div>
              {/* Blog Category */}
              <div className="mb-6">
                <Tippy content={<span>Blog Category</span>} animation="scale" theme="light-border">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}><MdCategory />Blog Category</label>
                </Tippy>
                <select
                  className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                  value={viewDetails.blog_Category}
                  onChange={(e) => setViewDetails({ ...viewDetails, blog_Category: e.target.value })}
                >
                  <option value="" className="text-gray-600">Blog Category</option>
                  <option value="Commercial Property">Commercial Property</option>
                  <option value="Residential Flats">Residential Flats</option>
                  <option value="SCO Plots">SCO Plots</option>
                  <option value="Deendayal Plots">Deen Dayal Plots</option>
                  <option value="Residential Plots">Residential Plots</option>
                  <option value="Independent Floors">Independent Floors</option>
                  <option value="Builder Floors">Builder Floors</option>
                  <option value="Affordable Homes">Affordable Homes</option>
                </select>
              </div>
              {/* Author */}
              <div className="mb-6">
                <Tippy content={<span>Author</span>} animation="scale" theme="light-border">
                  <label className={`font-semibold mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-300' : 'text-red-700'}`}><MdPerson />Author</label>
                </Tippy>
                <input
                  name="author"
                  placeholder="Author"
                  className={`w-full rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-400' : 'border-gray-300'} px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                  value={viewDetails.author}
                  onChange={(e) => setViewDetails({ ...viewDetails, author: e.target.value })}
                />
              </div>
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={handleConfirmAndUpdate}
                  className="flex items-center gap-2 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-lg px-8 py-3 shadow-lg transition-all"
                >
                  <MdEdit className="text-xl" /> Update
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogEdit;
