import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import DeveloperSidebarMobile from './DeveloperSidebar.mobile';
import DeveloperSidebarDesktop from './DeveloperSidebar.desktop';

const DeveloperSidebar = ({ 
  isDark, 
  sidebarOpen, 
  setSidebarOpen,
  activeTab, 
  setActiveTab, 
  toggleTheme, 
  handleLogout, 
  developerName, 
  tabs 
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <DeveloperSidebarMobile
        isDark={isDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        developerName={developerName}
        tabs={tabs}
      />
    );
  }

  return (
    <DeveloperSidebarDesktop
      isDark={isDark}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      toggleTheme={toggleTheme}
      handleLogout={handleLogout}
      developerName={developerName}
      tabs={tabs}
    />
  );
};

export default DeveloperSidebar;
