import React from 'react';
import DeveloperContent from '@/features/developer/DeveloperContent';
import { LogOut, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeveloperDashboardDesktop = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
       
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
            <DeveloperContent />
      
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboardDesktop;
