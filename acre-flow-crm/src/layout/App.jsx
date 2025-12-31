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
import Dashboard from "@/features/users/pages/Dashboard";
import Leads from "@/features/leads/pages/Leads";
import Tickets from "@/features/tickets/pages/Tickets";
import CreateUser from "@/features/users/pages/CreateUser";
import Login from "@/features/auth/pages/Login";
import NotFound from "@/features/users/pages/NotFound";
import Settings from "@/features/users/pages/Settings";
import UserManagement from "@/features/users/pages/UserManagement";
import Developer from "@/features/developer/pages/Developer";
import DeveloperDashboard from "@/features/developer/pages/DeveloperDashboard";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import ItInfrastructure from "@/features/it/pages/ItInfrastructure";
import SalesHeadDashboard from "@/features/sales/pages/SalesHeadDashboard";
import HRDashboard from "@/features/hr/pages/HRDashboard";
import HRAllUsers from "@/features/hr/pages/HRAllUsers";
import HRAllJobs from "@/features/hr/pages/HRAllJobs";
import JobApplications from "@/features/hr/pages/JobApplications";
import LeaveManagement from "@/features/hr/pages/LeaveManagement";
import Onboarding from "@/features/hr/pages/Onboarding";
import Offboarding from "@/features/hr/pages/Offboarding";
import CandidateDocumentUpload from "@/features/hr/pages/CandidateDocumentUpload";
import BlogDashboard from "@/features/blog/pages/BlogDashboard";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminUserManagement from "@/features/admin/components/UserManagement";
import ViewPropertyAdmin from "@/features/admin/components/ViewPropertyAdmin";

import CallLogs from "@/features/calling/pages/CallLogs";
import CallingSettings from "@/features/calling/pages/CallingSettings";
import EmailCenter from "@/features/communication/pages/EmailCenter";
import WhatsAppLogs from "@/features/communication/pages/WhatsAppLogs";

import ProjectEnquiries from '@/features/admin/pages/ProjectEnquiries';
import ListedProjects from '@/features/admin/pages/ListedProjects';
import InsertProject from '@/features/admin/pages/AddProjects';
import ProjectView from '@/features/admin/pages/ProjectView';
import ProjectEdit from '@/features/admin/pages/ProjectEdit';
import ProjectsAddBhk from '@/features/admin/pages/ProjectsAddBhk';
import ProjectAddHighlights from '@/features/admin/pages/ProjectAddHighlights';
import ProjectOrderManager from '@/features/admin/pages/ProjectOrderManager';
import ProjectOrderManagement from '@/features/admin/pages/ProjectOrderManagement';
import ResaleEnquiries from '@/features/admin/pages/ResaleEnquiries';
import ListedProperties from '@/features/admin/pages/ListedProperties';
import ViewPropertyDetails from '@/features/admin/pages/ViewPropertyDetails';
import EditPropertyDetails from '@/features/admin/pages/EditPropertyDetails';
import S3Manager from '@/features/admin/pages/S3Manager';
import ContactCards from '@/features/admin/pages/ContactCards';
import SitemapManager from '@/features/admin/pages/SitemapManager';
import BlogPost from '@/features/admin/pages/BlogPost';
import BlogViewAdmin from '@/features/admin/pages/BlogViewAdmin';
import BlogEdit from '@/features/admin/pages/BlogEdit';
import BannerManagement from '@/features/admin/pages/BannerManagement';
import ShortSetting from '@/features/admin/pages/ShortSetting';
import BackToTopButton from '@/features/admin/pages/BackToTopButton';
import ActivityDashboard from '@/features/activity/pages/ActivityDashboard';
import EmployeeDashboard from '@/layout/EmployeeDashboard';

// Import Blog Components (temporarily disabled)
// import BlogDashboard from "@/features/blog/pages/BlogDashboard";
import BlogOverview from "@/features/blog/components/BlogOverview";
import BlogUser from "@/features/blog/pages/BlogUser";
import AllBlogs from "@/features/blog/pages/AllBlogs";
import ManageBlog from "@/features/blog/pages/ManageBlog";
// import DraftManagement from "@/features/Blog_Components/DraftManagement";
// import BlogSection from "@/features/Blog_Components/BlogSection";
// import SingleBlog from "@/features/Blog_Components/SingleBlog";
  


const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(true);

  const [isDeveloperLoggedIn, setIsDeveloperLoggedIn] = useState(false);

  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("isDeveloperLoggedIn");
    setIsLoggedIn(false);
    setUserRole("employee");
    setIsDeveloperLoggedIn(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("userRole") || "employee";

      const developerLoggedIn =
        localStorage.getItem("isDeveloperLoggedIn") === "true";

      setIsLoggedIn(loggedIn);
      setUserRole(role);
      setIsDeveloperLoggedIn(developerLoggedIn);

      setIsLoading(false);
    };

    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    return () => {
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

    // Add window close event listener for automatic logout
    const handleBeforeUnload = (event) => {
      // Clear authentication when window is closed
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");
      localStorage.removeItem("isDeveloperLoggedIn");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      window.removeEventListener("beforeunload", handleBeforeUnload);
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

  const isFullAccess = userRole === 'super-admin' || userRole === 'developer' || userRole === 'admin';
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
                  userRole === "super-admin" ? (
                    <Navigate to="/super-admin-dashboard" replace />
                  ) : userRole === "head-admin" ? (
                    <Navigate to="/head-admin-dashboard" replace />
                  ) : userRole === "team-leader" ? (
                    <Navigate to="/team-leader-dashboard" replace />
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
                isLoggedIn && userRole === "super-admin" ? (
                  <CallingSettings userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/email"
              element={
                isLoggedIn && userRole === "super-admin" ? (
                  <EmailCenter userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/whatsapp"
              element={
                isLoggedIn && userRole === "super-admin" ? (
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
                isLoggedIn && userRole === "super-admin" ? (
                  <CreateUser userRole={userRole} userType="admin" />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/create-leader"
              element={
                isLoggedIn && userRole === "head-admin" ? (
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
                isLoggedIn && userRole === "super-admin" ? (
                  <UserManagement userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn && userRole === "super-admin" ? (
                  <Settings userRole={userRole} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/developer"
              element={
                (isLoggedIn && userRole === "super-admin") ||
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
                isLoggedIn && userRole === "super-admin" ? (
                  <Dashboard userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/head-admin-dashboard"
              element={
                isLoggedIn && userRole === "head-admin" ? (
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
                isLoggedIn && (userRole === "employee" || userRole === "user") ? (
                  <EmployeeDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/team"
              element={
                isLoggedIn && userRole === "head-admin" ? (
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
