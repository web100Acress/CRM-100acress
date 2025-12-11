import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api100acress from "../config/api100acressClient";
import AdminSidebar from "../components/AdminSidebar";
import { MdArticle, MdImage, MdTitle, MdDescription, MdCategory, MdPerson } from "react-icons/md";

const BlogViewAdmin = () => {
  const [viewDetails, setViewDetails] = useState({
    blog_Category: "",
    blog_Description: "",
    blog_Title: "",
    blog_Image: "",
    author: "",
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api100acress.get(`blog/admin/view?page=1&limit=1000`);
        console.log('BlogViewAdmin API Response:', res.data);
        const payload = res.data;
        const allBlogs = payload.data || [];
        console.log('All blogs:', allBlogs);
        const blogData = allBlogs.find(blog => blog._id === id);
        console.log('Found blog data:', blogData);
        
        if (blogData) {
          setViewDetails({
            blog_Category: blogData.blog_Category || "",
            blog_Description: blogData.blog_Description || "",
            blog_Title: blogData.blog_Title || "",
            blog_Image: blogData.blog_Image || "",
            author: blogData.author || "",
          });
        } else {
          console.error(`Blog with ID ${id} not found`);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    console.log('Current viewDetails state:', viewDetails);
    return (
      <>
        <AdminSidebar />
        <div className="flex bg-gray-50 min-h-screen">
          <div className="flex-1 p-8 ml-0 overflow-auto font-sans">
            <div className="w-full space-y-10">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  console.log('Current viewDetails state:', viewDetails);
  return (
    <>
      <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar />
        <div className="flex-1 p-8 ml-0 overflow-auto font-sans">
          <div className="w-full space-y-10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
              <MdArticle className="text-3xl text-blue-500 animate-pulse" />
              <h1 className="text-3xl font-bold text-gray-800">Blog Details</h1>
            </div>
            {/* Card View */}
            <section className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 p-8">
              {/* Blog Image */}
              <div className="mb-8 flex flex-col items-center">
                <label className="text-red-700 font-semibold mb-2 flex items-center gap-2"><MdImage />Blog Image</label>
                <div className="flex items-center justify-center h-40 w-40 overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
                  {viewDetails.blog_Image && viewDetails.blog_Image.url ? (
                    <img src={viewDetails.blog_Image.url} alt="blog_Image" className="max-h-full max-w-full object-contain" id="previewImage" />
                  ) : (
                    <span className="text-gray-500 text-sm italic">No Blog Image</span>
                  )}
                </div>
              </div>
              {/* Blog Title */}
              <div className="mb-6">
                <label className="text-red-700 font-semibold mb-2 flex items-center gap-2"><MdTitle />Blog Title</label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.blog_Title || <span className="text-gray-400 italic">N/A</span>}</div>
              </div>
              {/* Blog Description */}
              <div className="mb-6">
                <label className="text-red-700 font-semibold mb-2 flex items-center gap-2"><MdDescription />Blog Description</label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800 whitespace-pre-wrap">{viewDetails.blog_Description || <span className="text-gray-400 italic">N/A</span>}</div>
              </div>
              {/* Blog Category */}
              <div className="mb-6">
                <label className="text-red-700 font-semibold mb-2 flex items-center gap-2"><MdCategory />Blog Category</label>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full shadow-sm">{viewDetails.blog_Category || <span className="text-gray-400 italic">N/A</span>}</span>
              </div>
              {/* Author */}
              <div className="mb-6">
                <label className="text-red-700 font-semibold mb-2 flex items-center gap-2"><MdPerson />Author</label>
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800">{viewDetails.author || <span className="text-gray-400 italic">N/A</span>}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogViewAdmin;
