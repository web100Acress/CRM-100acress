import React from 'react';
import AdminSidebar from "../components/AdminSidebar";
const ShortSetting = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-4 ml-0 lg:ml-[250px] transition-all duration-300">
      <h1 className="text-2xl font-bold">Short Setting</h1>
      <p>This is the page for Short Setting.</p>
      </div>
      </div>
  );
};

export default ShortSetting;
