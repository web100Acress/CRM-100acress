import React from 'react';
import AdminSidebar from "../components/AdminSidebar";
const ResaleEnquiries = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-4 ml-0 lg:ml-[250px] transition-all duration-300">
      <h1 className="text-2xl font-bold">Resale Enquiries</h1>
      <p>This is the page for Resale Enquiries.</p>
      </div>
      </div>
  );
};

export default ResaleEnquiries;
