import DeveloperContent from '@/features/developer/DeveloperContent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const DeveloperDashboardMobile = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

 
  const developerName = localStorage.getItem('developerName') || 'Developer';

  return (
    <div>

        {/* <div className="flex-1 overflow-auto"> */}
            <DeveloperContent />
        {/* </div> */}
      </div>

  );
};

export default DeveloperDashboardMobile;
