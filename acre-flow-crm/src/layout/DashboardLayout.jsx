import React, { useState, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import '@/styles/DashboardLayout.css'

const DashboardLayout = ({ children, userRole = "employee" }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : "";

  const getRoleTitle = (role) => {
    switch (role) {
      case "super-admin": return "BOSS";
      case "head-admin": return "Head";
      case "team-leader": return "Team Leader";
      case "employee": return "Employee";
      default: return "User";
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileBreakpoint = 768;
      const currentIsMobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(currentIsMobile);

      if (!currentIsMobile && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }

      if (currentIsMobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarCollapsed, mobileSidebarOpen]);

  const handleMenuButtonClick = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onToggle={handleMenuButtonClick}
        onClose={handleMobileSidebarClose}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <header className="dashboard-header">
          <div className="header-left">
            <button onClick={handleMenuButtonClick} className="menu-button">
              <Menu className="menu-icon" />
            </button>
            <h1 className="user-greeting">
              Hello{" "}
              {userName
                ? `${userName} (${getRoleTitle(userRole)})`
                : getRoleTitle(userRole)}
            </h1>
          </div>

          <div className="header-right">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                className="search-input"
              />
            </div>
            <button className="notification-button">
              <Bell className="bell-icon" />
              <span className="notification-dot"></span>
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
