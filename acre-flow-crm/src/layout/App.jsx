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
import HrFinance from "@/features/hr/pages/HrFinance";
import ItInfrastructure from "@/features/it/pages/ItInfrastructure";
import SalesHeadDashboard from "@/features/sales/pages/SalesHeadDashboard";
import HRDashboard from "@/features/hr/pages/HRDashboard";
import BlogDashboard from "@/features/blog/pages/BlogDashboard";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";

// Import Blog Components (temporarily disabled)
// import BlogDashboard from "@/features/Blog_Components/BlogDashboard";
// import BlogManagement from "@/features/Blog_Components/BlogManagement";
// import DraftManagement from "@/features/Blog_Components/DraftManagement";
// import BlogSection from "@/features/Blog_Components/BlogSection";
// import SingleBlog from "@/features/Blog_Components/SingleBlog";
  


const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(true);

  const [isDeveloperLoggedIn, setIsDeveloperLoggedIn] = useState(false);

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

      
       
          <Route path="/hr-finance" element={<HrFinance />} />
          <Route path="/it-infrastructure" element={<ItInfrastructure />} />
          <Route path="/sales-head-dashboard" element={<SalesHeadDashboard />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/blog-dashboard" element={<BlogDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

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
