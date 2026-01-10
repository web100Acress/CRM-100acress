import React, { useState, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import '@/styles/DashboardLayout.css'
import { useTheme } from "@/context/ThemeContext";

const DashboardLayout = ({ children, userRole = "employee" }) => {
  const { isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const userName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : "";

  const getRoleTitle = (role) => {
    switch (role) {
      case "boss":
      case "super-admin":
        return "BOSS";
      case "hod":
      case "head-admin":
      case "head": return "Head";
      case "team-leader": return "Team Leader";
      case "bd":
      case "employee":
        return "BD";
      default: return "User";
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
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
    <div className={`dashboard-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
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
            {isInstallable && (
              <button onClick={handleInstallClick} className="install-button">
                Install
              </button>
            )}
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
