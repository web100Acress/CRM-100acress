import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, ChevronDown, User, Settings, FileText, Share2, Lightbulb, BarChart3 } from 'lucide-react';
import ActivitySidebar from '../components/ActivitySidebar';
import ActivityOverview from '../components/ActivityOverview';
import ReportsSection from '../components/ReportsSection';
import FilesSection from '../components/FilesSection';
import ContentSection from '../components/ContentSection';
import ThoughtsSection from '../components/ThoughtsSection';

const ActivityDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentActivitySession');
    const activeSessions = JSON.parse(localStorage.getItem('activeActivitySessions') || '[]');
    
    if (currentSessionId && activeSessions.includes(currentSessionId)) {
      const sessionKey = `activity_${currentSessionId}`;
      const departmentName = localStorage.getItem(sessionKey + '_department');
      const departmentEmail = localStorage.getItem(sessionKey + '_email');
      const userName = localStorage.getItem(sessionKey + '_userName');
      const userAvatarUrl = localStorage.getItem(sessionKey + '_avatarUrl');
      
      if (departmentName && departmentEmail) {
        setUserInfo({ 
          name: departmentName, 
          email: departmentEmail,
          userName: userName,
          sessionId: currentSessionId,
          avatarUrl: userAvatarUrl
        });
        
        // Set avatar URL for display
        if (userAvatarUrl) {
          setAvatarUrl(userAvatarUrl);
        } else {
          // Demo avatar for testing - remove this in production
          setAvatarUrl('https://static.vecteezy.com/system/resources/thumbnails/024/183/502/small/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg');
        }
      }
    }
  }, []);

  const handleLogout = () => {
    const currentSessionId = localStorage.getItem('currentActivitySession');
    const activeSessions = JSON.parse(localStorage.getItem('activeActivitySessions') || '[]');
    
    if (currentSessionId) {
      const sessionKey = `activity_${currentSessionId}`;
      
      // Remove current session data
      localStorage.removeItem(sessionKey + '_department');
      localStorage.removeItem(sessionKey + '_email');
      localStorage.removeItem(sessionKey + '_departmentId');
      localStorage.removeItem(sessionKey + '_userName');
      localStorage.removeItem(sessionKey + '_sessionId');
      
      // Remove from active sessions
      const updatedSessions = activeSessions.filter(id => id !== currentSessionId);
      localStorage.setItem('activeActivitySessions', JSON.stringify(updatedSessions));
      
      // Set current session to next available if any
      if (updatedSessions.length > 0) {
        localStorage.setItem('currentActivitySession', updatedSessions[0]);
      } else {
        localStorage.removeItem('currentActivitySession');
        localStorage.removeItem('isActivityLoggedIn');
      }
    }
    
    window.location.href = '/login';
  };

  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ActivityOverview />;
      case 'reports':
        return <ReportsSection />;
      case 'files':
        return <FilesSection />;
      case 'content':
        return <ContentSection />;
      case 'thoughts':
        return <ThoughtsSection />;
      default:
        return <ActivityOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ActivitySidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h1 className="font-bold text-gray-900 text-lg sm:text-2xl leading-tight">
                  <span className="sm:hidden">Activity</span>
                  <span className="hidden sm:inline">Activity Dashboard</span>
                </h1>
                <p className="hidden sm:block text-sm text-gray-600 truncate max-w-[52vw]">
                  Collaborate and share across departments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span className="text-white font-semibold text-sm" style={{display: avatarUrl ? 'none' : 'flex'}}>
                      {getUserInitials(userInfo?.userName || userInfo?.name)}
                    </span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{userInfo?.userName || userInfo?.name}</p>
                    {/* <p className="text-xs text-gray-600">{userInfo?.email}</p> */}
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <User size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                      <Settings size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut size={16} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityDashboard;
