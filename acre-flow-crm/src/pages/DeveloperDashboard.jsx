  import React from 'react';
  import DeveloperContent from '../components/dev/DeveloperContent';
  import { LogOut, Code } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';

  const DeveloperDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('isDeveloperLoggedIn');
      localStorage.removeItem('developerEmail');
      localStorage.removeItem('developerName');
      localStorage.removeItem('developerRole');
      navigate('/developer-login');
      window.location.reload(); // Reload to clear any remaining state
    };

    const developerName = localStorage.getItem('developerName') || 'Developer';

    return (
      <div className="developer-dashboard">
          <div className="header-left">
            <div className="header-title-group">
            </div>
          </div>
        <main className="developer-main">
          <DeveloperContent userRole="developer" />
        </main>
        <style>{`   
        .developer-dashboard * {
            box-sizing: border-box;
          }
          .developer-main {
            padding: 1rem;
            max-width:2000px;
            margin: 0 auto;
            box-sizing: border-box; 
          }
          }
        `}</style>
      </div>
    );
  };

  export default DeveloperDashboard;