import { Toaster } from "@/layout/toaster";
import { Toaster as Sonner } from "@/layout/sonner";
import { TooltipProvider } from "@/layout/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { useState, useEffect } from "react";
import store from "@/store";
import '@/styles/dark-mode.css';
import { ThemeProvider } from "@/context/ThemeContext";
import { jwtDecode } from "jwt-decode";
import Dashboard from "@/pages/Dashboard/Dashboard.container";
import Leads from "@/features/lead-management/Leads/Leads.container";
import Tickets from "@/pages/Tickets/Tickets.container";
import Login from "@/pages/Login/Login.container";
import AdminDashboard from "@/pages/AdminDashboard/AdminDashboard.container";
import HRDashboard from "@/pages/HRDashboard/HRDashboard.container";
import SalesHeadDashboard from "@/pages/SalesHeadDashboard/SalesHeadDashboard.container";
import CreateUser from "@/pages/CreateUser/CreateUser.container";
import NotFound from "@/pages/NotFound/NotFound.container";
import Settings from "@/pages/Settings/Settings.container";
import UserManagement from "@/pages/UserManagement/UserManagement.container";
import Developer from "@/pages/Developer/Developer.container";
import DeveloperDashboard from "@/pages/DeveloperDashboard/DeveloperDashboard.container";
import ResetPassword from "@/pages/ResetPassword/ResetPassword.container";
import ItInfrastructure from "@/pages/ItInfrastructure/ItInfrastructure.container";
import HRAllUsers from "@/pages/HRAllUsers/HRAllUsers.container";
import HRAllJobs from "@/pages/HRAllJobs/HRAllJobs.container";
import JobApplications from "@/pages/JobApplications/JobApplications.container";
import LeaveManagement from "@/pages/LeaveManagement/LeaveManagement.container";
import Onboarding from "@/pages/Onboarding/Onboarding.container";
import Offboarding from "@/pages/Offboarding/Offboarding.container";
import CandidateDocumentUpload from "@/pages/CandidateDocumentUpload/CandidateDocumentUpload.container";
import BlogDashboard from "@/pages/BlogDashboard/BlogDashboard.container";
import AdminUserManagement from "@/features/admin/components/UserManagement";
import ViewPropertyAdmin from "@/features/admin/components/ViewPropertyAdmin";

import CallLogs from "@/features/lead-management/CallLogs/CallLogs.container";
import CallingSettings from '@/features/lead-management/CallingSettings/CallingSettings.container';
import BDStatusSummary from '@/features/calling/pages/BDStatusSummary';
import EmailCenter from '@/features/lead-management/EmailCenter/EmailCenter.container';
import WhatsAppLogs from "@/features/lead-management/WhatsAppLogs/WhatsAppLogs.container";

import ProjectEnquiries from '@/pages/ProjectEnquiries/ProjectEnquiries.container';
import ListedProjects from '@/pages/ListedProjects/ListedProjects.container';
import InsertProject from '@/pages/InsertProject/InsertProject.container';
import ProjectView from '@/pages/ProjectView/ProjectView.container';
import ProjectEdit from '@/pages/ProjectEdit/ProjectEdit.container';
import ProjectsAddBhk from '@/pages/ProjectsAddBhk/ProjectsAddBhk.container';
import ProjectAddHighlights from '@/pages/ProjectAddHighlights/ProjectAddHighlights.container';
import ProjectOrderManager from '@/pages/ProjectOrderManager/ProjectOrderManager.container';
import ProjectOrderManagement from '@/pages/ProjectOrderManagement/ProjectOrderManagement.container';
import ResaleEnquiries from '@/pages/ResaleEnquiries/ResaleEnquiries.container';
import ListedProperties from '@/pages/ListedProperties/ListedProperties.container';
import ViewPropertyDetails from '@/pages/ViewPropertyDetails/ViewPropertyDetails.container';
import EditPropertyDetails from '@/pages/EditPropertyDetails/EditPropertyDetails.container';
import S3Manager from '@/pages/S3Manager/S3Manager.container';
import ContactCards from '@/pages/ContactCards/ContactCards.container';
import SitemapManager from '@/pages/SitemapManager/SitemapManager.container';
import BlogPost from '@/pages/BlogPost/BlogPost.container';
import BlogViewAdmin from '@/pages/BlogViewAdmin/BlogViewAdmin.container';
import BlogEdit from '@/pages/BlogEdit/BlogEdit.container';
import BannerManagement from '@/pages/BannerManagement/BannerManagement.container';
import ShortSetting from '@/pages/ShortSetting/ShortSetting.container';
import BackToTopButton from '@/pages/BackToTopButton/BackToTopButton.container';
import ActivityDashboard from '@/pages/ActivityDashboard/ActivityDashboard.container';
import EmployeeDashboard from '@/features/employee/dashboard/EmployeeDashboard';
import EmployeeDashboardMobile from '@/features/employee/dashboard/EmployeeDashboard.mobile';
import { useIsMobile } from '@/hooks/use-mobile';
import EditProfileMobile from '@/pages/EditProfile/EditProfile.mobile';
import WhatsAppChatPage from '@/features/chat/pages/WhatsAppChatPage';

// Import Blog Components (temporarily disabled)
// import BlogDashboard from "@/features/blog/pages/BlogDashboard";
import BlogOverview from "@/pages/BlogOverview/BlogOverview.container";
import BlogUser from "@/pages/BlogUser/BlogUser.container";
import AllBlogs from "@/pages/AllBlogs/AllBlogs.container";
import ManageBlog from "@/pages/ManageBlog/ManageBlog.container";
// import DraftManagement from "@/features/Blog_Components/DraftManagement";
// import BlogSection from "@/features/Blog_Components/BlogSection";
// import SingleBlog from "@/features/Blog_Components/SingleBlog";
  


const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("bd");
  const [isLoading, setIsLoading] = useState(true);

  const [isDeveloperLoggedIn, setIsDeveloperLoggedIn] = useState(false);
  const isMobile = useIsMobile();

  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  const handleLogout = () => {
    // Clear all authentication-related localStorage items
    const authKeys = [
      "isLoggedIn", "userRole", "token", "myToken",
      "isDeveloperLoggedIn", "isAdminLoggedIn", "isHRLoggedIn", 
      "isSalesHeadLoggedIn", "isBlogLoggedIn", "isHrFinanceLoggedIn",
      "userEmail", "userName", "userId", "sourceSystem",
      "allowedModules", "permissions", "userDepartment",
      "originalRole", "isActivityLoggedIn", "currentActivitySession",
      "activeActivitySessions"
    ];
    
    authKeys.forEach(key => localStorage.removeItem(key));
    
    setIsLoggedIn(false);
    setUserRole("bd");
    setIsDeveloperLoggedIn(false);
    
    // Redirect to login page
    window.location.href = "/login";
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("userRole") || "bd";
      
      // Check token expiration
      const token = localStorage.getItem("token");
      const myToken = localStorage.getItem("myToken");
      
      if (token || myToken) {
        try {
          // Decode JWT to check expiration
          const decoded = jwtDecode(token || myToken);
          
          if (decoded && decoded.exp) {
            const currentTime = Date.now() / 1000; // Convert to seconds
            const isExpired = decoded.exp < currentTime;
            
            if (isExpired) {
              console.log("Token expired, logging out...");
              handleLogout();
              return;
            }
          }
        } catch (error) {
          console.log("Error checking token expiration:", error);
        }
      }

      const developerLoggedIn =
        localStorage.getItem("isDeveloperLoggedIn") === "true";

      setIsLoggedIn(loggedIn);
      setUserRole(role);
      setIsDeveloperLoggedIn(developerLoggedIn);
      setIsLoading(false);
    };

    checkAuthStatus();
    
    // Check token expiration every minute
    const expirationCheckInterval = setInterval(checkAuthStatus, 60 * 1000);
    
    window.addEventListener("storage", checkAuthStatus);
    return () => {
      clearInterval(expirationCheckInterval);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isLoggedIn]);

  const allowedModules = (() => {
    try {
      const raw = localStorage.getItem('allowedModules');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const permissions = (() => {
    try {
      const raw = localStorage.getItem('permissions');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const isFullAccess = userRole === 'boss' || userRole === 'developer' || userRole === 'admin';
  const hasModule = (m) => isFullAccess || allowedModules.length === 0 || allowedModules.includes(m);
  const hasPermission = (p) => isFullAccess || permissions.length === 0 || permissions.includes(p);
  const pickDefaultModuleRoute = () => {
    if (hasModule('Admin')) return '/admin-dashboard';
    if (hasModule('HR')) return '/hr-dashboard';
    if (hasModule('Sales')) return '/sales-head-dashboard';
    if (hasModule('Blog')) return '/blog-dashboard';
    return '/leads';
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  userRole === "boss" ? (
                    <Navigate to="/super-admin-dashboard" replace />
                  ) : userRole === "hod" ? (
                    <Navigate to="/head-admin-dashboard" replace />
                  ) : userRole === "team-leader" ? (
                    <Navigate to="/team-leader-dashboard" replace />
                  ) : userRole === "bd" ? (
                    <Navigate to="/employee-dashboard" replace />
                  ) : userRole === "developer" ? (
                    <Navigate to="/developer-dashboard" replace />
                  ) : (
                    <Navigate to={pickDefaultModuleRoute()} replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/calls"
              element={
                isLoggedIn ? (
                  <CallLogs userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/calling-settings"
              element={
                isLoggedIn && userRole === "boss" ? (
                  <CallingSettings userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/email"
              element={
                isLoggedIn && userRole === "boss" ? (
                  <EmailCenter userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/whatsapp"
              element={
                isLoggedIn && userRole === "boss" ? (
                  <WhatsAppLogs userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/leads"
              element={
                isLoggedIn ? (
                  <Leads userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/tickets"
              element={
                isLoggedIn ? (
                  <Tickets userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/create-admin"
              element={
                isLoggedIn && userRole === "boss" ? (
                  <CreateUser userRole={userRole} userType="admin" />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/create-leader"
              element={
                isLoggedIn && userRole === "hod" ? (
                  <CreateUser userRole={userRole} userType="leader" />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/create-employee"
              element={
                isLoggedIn && userRole === "team-leader" ? (
                  <CreateUser userRole={userRole} userType="employee" />
                ) : (
                  <Navigate to="/" replace />
                )
              }
              // lsahbs
            />
            <Route
              path="/users"
              element={
                isLoggedIn && userRole === "boss" ? (
                  <UserManagement userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn && userRole === "boss" ? (
                  <Settings userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/developer"
              element={
                (isLoggedIn && userRole === "boss") ||
                isDeveloperLoggedIn ? (
                  <Developer userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/developer-dashboard"
              element={
                (isLoggedIn && userRole === "developer") || isDeveloperLoggedIn ? (
                  <DeveloperDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/it-infrastructure" element={isLoggedIn ? <ItInfrastructure /> : <Navigate to="/login" replace />} />

            <Route path="/sales-head-dashboard" element={isLoggedIn && hasModule('Sales') && hasPermission('sales.dashboard') ? <SalesHeadDashboard /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />

            <Route path="/hr-dashboard" element={isLoggedIn && hasModule('HR') && hasPermission('hr.dashboard') ? <HRDashboard /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/hr-all-users" element={isLoggedIn && hasModule('HR') && hasPermission('hr.all_users') ? <HRAllUsers /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/hr-all-jobs" element={isLoggedIn && hasModule('HR') && hasPermission('hr.all_jobs') ? <HRAllJobs /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/hr/job-applications/:id" element={isLoggedIn && hasModule('HR') && hasPermission('hr.all_jobs') ? <JobApplications /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/hr/leave-management" element={isLoggedIn && hasModule('HR') && hasPermission('hr.leave_management') ? <LeaveManagement /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/hr/onboarding" element={isLoggedIn && hasModule('HR') && hasPermission('hr.onboarding') ? <Onboarding /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />

            {/* BD Analytics Route for boss and hod */}
            <Route path="/admin/bd-analytics" element={isLoggedIn && (userRole === "boss" || userRole === "hod") ? <BDStatusSummary /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/hr/offboarding" element={isLoggedIn && hasModule('HR') && hasPermission('hr.offboarding') ? <Offboarding /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/upload-documents/:token" element={<CandidateDocumentUpload />} />
            <Route path="/blog-dashboard" element={isLoggedIn && hasModule('Blog') && hasPermission('blog.dashboard') ? <BlogDashboard /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/blog-management" element={isLoggedIn && hasModule('Blog') && hasPermission('blog.add_blog') ? <ManageBlog /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/manage-blog" element={isLoggedIn && hasModule('Blog') && hasPermission('blog.manage_blog') ? <ManageBlog /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/blog-users" element={isLoggedIn && hasModule('Blog') && hasPermission('blog.users') ? <BlogUser /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/all-blogs" element={isLoggedIn && hasModule('Blog') && hasPermission('blog.all_blogs') ? <AllBlogs /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />

            <Route path="/admin-dashboard" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.dashboard') ? <AdminDashboard /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/register-user" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.register_user') ? <AdminUserManagement /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/viewproperty/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.dashboard') ? <ViewPropertyAdmin /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/view-property/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.dashboard') ? <ViewPropertyAdmin /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/ProjectsView/:pUrl" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_projects') ? <ProjectView /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/ProjectsEdit/:pUrl" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_projects') ? <ProjectEdit /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/ProjectsAddBhk/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_projects') ? <ProjectsAddBhk /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/ProjectAddHighlights/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_projects') ? <ProjectAddHighlights /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            {/* New Admin Routes */}
            <Route path="/admin/project-enquiries" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.project_enquiries') ? <ProjectEnquiries /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/listed-projects" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_projects') ? <ListedProjects /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/project-insert" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_projects') ? <InsertProject /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/project-order-manager" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.project_order_manager') ? <ProjectOrderManager /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/project-order-management" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.project_order_management') ? <ProjectOrderManagement /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/resale-enquiries" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.resale_enquiries') ? <ResaleEnquiries /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/listed-properties" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_properties') ? <ListedProperties /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/viewproperty/viewdetails/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_properties') ? <ViewPropertyDetails /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/viewproperty/editdetails/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.listed_properties') ? <EditPropertyDetails /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/s3-manager" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.s3_manager') ? <S3Manager /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/contact-cards" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.contact_cards') ? <ContactCards /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/sitemap-manager" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.sitemap_manager') ? <SitemapManager /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/blog-post" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.blog_post') ? <BlogPost /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/blog/view/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.dashboard') ? <BlogViewAdmin /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/Admin/blog/edit/:id" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.dashboard') ? <BlogEdit /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/banner-management" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.banner_management') ? <BannerManagement /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/short-setting" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.short_setting') ? <ShortSetting /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            <Route path="/admin/back-to-top" element={isLoggedIn && hasModule('Admin') && hasPermission('admin.dashboard') ? <BackToTopButton /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            
            {/* Activity Routes */}
            <Route path="/activity-dashboard" element={<ActivityDashboard />} />

            {/* WhatsApp Chat Routes */}
            <Route path="/whatsapp-chat" element={isLoggedIn && (userRole === 'bd' || userRole === 'team-leader' || userRole === 'boss' || userRole === 'hod') ? <WhatsAppChatPage /> : <Navigate to={isLoggedIn ? "/" : "/login"} replace />} />

            {/* Blog Routes - Temporarily Disabled
            <Route
              path="/blog-dashboard"
              element={
                isLoggedIn ? (
                  <BlogDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/blog-management"
              element={
                isLoggedIn ? (
                  <BlogManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/draft-management"
              element={
                isLoggedIn ? (
                  <DraftManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/blog-section"
              element={
                isLoggedIn ? (
                  <BlogSection />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/blog/:title/:id"
              element={
                isLoggedIn ? (
                  <SingleBlog />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            SEO Blog Routes - Temporarily Disabled
            <Route
              path="/seo/blogs/write"
              element={
                isLoggedIn ? (
                  <BlogManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/seo/blogs/manage"
              element={
                isLoggedIn ? (
                  <ManageBlog />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/seo/blogs/edit/:id"
              element={
                isLoggedIn ? (
                  <BlogManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            */}

            <Route
              path="/super-admin-dashboard"
              element={
                isLoggedIn && userRole === "boss" ? (
                  <Dashboard userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/head-admin-dashboard"
              element={
                isLoggedIn && userRole === "hod" ? (
                  <Dashboard userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/team-leader-dashboard"
              element={
                isLoggedIn && userRole === "team-leader" ? (
                  <Dashboard userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/employee-dashboard"
              element={
                isLoggedIn && (userRole === "bd" || userRole === "user") ? (
                  isMobile ? <EmployeeDashboardMobile /> : <EmployeeDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/team"
              element={
                isLoggedIn && userRole === "hod" ? (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Team Management</h1>
                    <p>Team management interface coming soon...</p>
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/employees"
              element={
                isLoggedIn && userRole === "team-leader" ? (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">My Employees</h1>
                    <p>Employee management interface coming soon...</p>
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/edit-profile" element={isLoggedIn ? <EditProfileMobile /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
    </Provider>
  );
};

export default App;
