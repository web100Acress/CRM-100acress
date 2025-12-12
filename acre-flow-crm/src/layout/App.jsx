import { Toaster } from "@/layout/toaster";
import { Toaster as Sonner } from "@/layout/sonner";
import { TooltipProvider } from "@/layout/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { useState, useEffect } from "react";
import store from "@/store";
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
import BlogDashboard from "@/features/blog/pages/BlogDashboard";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminUserManagement from "@/features/admin/components/UserManagement";
import ViewPropertyAdmin from "@/features/admin/components/ViewPropertyAdmin";

import ProjectEnquiries from '@/features/admin/pages/ProjectEnquiries';
import ListedProjects from '@/features/admin/pages/ListedProjects';
import ProjectView from '@/features/admin/pages/ProjectView';
import ProjectEdit from '@/features/admin/pages/ProjectEdit';
import ProjectsAddBhk from '@/features/admin/pages/ProjectsAddBhk';
import ProjectAddHighlights from '@/features/admin/pages/ProjectAddHighlights';
import ProjectOrderManager from '@/features/admin/pages/ProjectOrderManager';
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

// Import Blog Components (temporarily disabled)
// import BlogDashboard from "@/features/blog/pages/BlogDashboard";
import BlogOverview from "@/features/blog/components/BlogOverview";
import BlogUser from "@/features/blog/pages/BlogUser";
import AllBlogs from "@/features/blog/pages/AllBlogs";
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
    localStorage.removeItem("isSalesHeadLoggedIn");
    localStorage.removeItem("isHRLoggedIn");
    localStorage.removeItem("isBlogLoggedIn");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("isItLoggedIn");
    localStorage.removeItem("isHrFinanceLoggedIn");
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
      const salesHeadLoggedIn =
        localStorage.getItem("isSalesHeadLoggedIn") === "true";
      const hrLoggedIn =
        localStorage.getItem("isHRLoggedIn") === "true";
      const blogLoggedIn =
        localStorage.getItem("isBlogLoggedIn") === "true";
      const adminLoggedIn =
        localStorage.getItem("isAdminLoggedIn") === "true";
      const itLoggedIn =
        localStorage.getItem("isItLoggedIn") === "true";
      const hrFinanceLoggedIn =
        localStorage.getItem("isHrFinanceLoggedIn") === "true";

      // Check if any user is logged in
      const anyUserLoggedIn = loggedIn || developerLoggedIn || salesHeadLoggedIn || 
                             hrLoggedIn || blogLoggedIn || adminLoggedIn || itLoggedIn || hrFinanceLoggedIn;

      setIsLoggedIn(loggedIn);
      setUserRole(role);
      setIsDeveloperLoggedIn(developerLoggedIn);

      // If no user is logged in but localStorage has some old data, clear it and redirect
      if (!anyUserLoggedIn) {
        // Clear all possible login states
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        localStorage.removeItem("isDeveloperLoggedIn");
        localStorage.removeItem("isSalesHeadLoggedIn");
        localStorage.removeItem("isHRLoggedIn");
        localStorage.removeItem("isBlogLoggedIn");
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("isItLoggedIn");
        localStorage.removeItem("isHrFinanceLoggedIn");
        
        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    const checkAnyUserLoggedIn = () => {
      const developerLoggedIn = localStorage.getItem("isDeveloperLoggedIn") === "true";
      const salesHeadLoggedIn = localStorage.getItem("isSalesHeadLoggedIn") === "true";
      const hrLoggedIn = localStorage.getItem("isHRLoggedIn") === "true";
      const blogLoggedIn = localStorage.getItem("isBlogLoggedIn") === "true";
      const adminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
      const itLoggedIn = localStorage.getItem("isItLoggedIn") === "true";
      const hrFinanceLoggedIn = localStorage.getItem("isHrFinanceLoggedIn") === "true";
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";

      return loggedIn || developerLoggedIn || salesHeadLoggedIn || hrLoggedIn || 
             blogLoggedIn || adminLoggedIn || itLoggedIn || hrFinanceLoggedIn;
    };

    if (!checkAnyUserLoggedIn()) return;

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
  }, []);



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
                  <Dashboard userRole={userRole} />
                ) : (
                  <Navigate to="/login" replace />
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
            <Route
              path="/hr-finance"
              element={
                localStorage.getItem("isHrFinanceLoggedIn") === "true" ? (
                  <ItInfrastructure />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/it-infrastructure"
              element={
                localStorage.getItem("isItLoggedIn") === "true" ? (
                  <ItInfrastructure />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/sales-head-dashboard"
              element={
                localStorage.getItem("isSalesHeadLoggedIn") === "true" ? (
                  <SalesHeadDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/hr-dashboard"
              element={
                localStorage.getItem("isHRLoggedIn") === "true" ? (
                  <HRDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/hr-all-users"
              element={
                localStorage.getItem("isHRLoggedIn") === "true" ? (
                  <HRAllUsers />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/hr-all-jobs"
              element={
                localStorage.getItem("isHRLoggedIn") === "true" ? (
                  <HRAllJobs />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/hr/job-applications/:id"
              element={
                localStorage.getItem("isHRLoggedIn") === "true" ? (
                  <JobApplications />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/hr/leave-management"
              element={
                localStorage.getItem("isHRLoggedIn") === "true" ? (
                  <LeaveManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/blog-dashboard"
              element={
                localStorage.getItem("isBlogLoggedIn") === "true" ? (
                  <BlogDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/blog-users"
              element={
                localStorage.getItem("isBlogLoggedIn") === "true" ? (
                  <BlogUser />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/all-blogs"
              element={
                localStorage.getItem("isBlogLoggedIn") === "true" ? (
                  <AllBlogs />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/register-user"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <AdminUserManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/viewproperty/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ViewPropertyAdmin />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/view-property/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ViewPropertyAdmin />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/ProjectsView/:pUrl"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ProjectView />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/ProjectsEdit/:pUrl"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ProjectEdit />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/ProjectsAddBhk/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ProjectsAddBhk />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/ProjectAddHighlights/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ProjectAddHighlights />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* New Admin Routes */}
            <Route
              path="/admin/project-enquiries"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ProjectEnquiries />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/listed-projects"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ListedProjects />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/project-order-manager"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ProjectOrderManager />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/resale-enquiries"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ResaleEnquiries />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/listed-properties"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ListedProperties />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/viewproperty/viewdetails/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ViewPropertyDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/viewproperty/editdetails/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <EditPropertyDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/s3-manager"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <S3Manager />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/contact-cards"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ContactCards />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/sitemap-manager"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <SitemapManager />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/blog-post"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <BlogPost />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/blog/view/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <BlogViewAdmin />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/Admin/blog/edit/:id"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <BlogEdit />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/banner-management"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <BannerManagement />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/short-setting"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <ShortSetting />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/back-to-top"
              element={
                localStorage.getItem("isAdminLoggedIn") === "true" ? (
                  <BackToTopButton />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

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
                  <BlogManagement />
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
    </Provider>
  );
};

export default App;
