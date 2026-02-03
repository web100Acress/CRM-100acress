import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HrSidebar from './Sidebar';
import HrHeader from './Header';
import HrFooter from './Footer';

const HrLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#e9f2ff]">
      {/* Sidebar */}
      <HrSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HrHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#e9f2ff]">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <HrFooter />
      </div>
    </div>
  );
};

export default HrLayout;
