import React from 'react';
import AdminSidebar from "../components/AdminSidebar";
const BlogPost = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-4 ml-0 lg:ml-[250px] transition-all duration-300">
      <h1 className="text-2xl font-bold">Blog Post</h1>
      <p>This is the page for Blog Post.</p>
      </div>
      </div>
  );
};

export default BlogPost;
