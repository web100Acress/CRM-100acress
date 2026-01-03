// Placeholder for app-level route definitions
// This file will contain all the route configurations for the application

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '@/features/admin/components/Login';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import UserManagement from '@/features/admin/components/UserManagement';
import ProjectEnquiries from '@/features/admin/pages/ProjectEnquiries';
import ListedProjects from '@/features/admin/pages/ListedProjects';
import ProjectView from '@/features/admin/pages/ProjectView';
import ProjectOrderManager from '@/features/admin/pages/ProjectOrderManager';
import ResaleEnquiries from '@/features/admin/pages/ResaleEnquiries';
import ListedProperties from '@/features/admin/pages/ListedProperties';
import S3Manager from '@/features/admin/pages/S3Manager';
import ContactCards from '@/features/admin/pages/ContactCards';
import SitemapManager from '@/features/admin/pages/SitemapManager';
import BlogPost from '@/features/admin/pages/BlogPost';
import BannerManagement from '@/features/admin/pages/BannerManagement';
import ShortSetting from '@/features/admin/pages/ShortSetting';
import BDStatusSummary from '@/features/calling/pages/BDStatusSummary';
// Import pages from features
// import Dashboard from '@/features/users/pages/Dashboard';
// import Login from '@/features/auth/pages/Login';
// import Leads from '@/features/leads/pages/Leads';
// import Tickets from '@/features/tickets/pages/Tickets';
// import UserManagement from '@/features/users/pages/UserManagement';

// Role-based redirect component
const RoleBasedRedirect = ({ userRole }) => {
  const navigate = useNavigate();
  useEffect(() => {
    switch (userRole) {
      case 'developer':
        navigate('/developer-dashboard', { replace: true });
        break;
      case 'hr_finance':
        navigate('/hr-finance', { replace: true });
        break;
      case 'it_infrastructure':
        navigate('/it-infrastructure', { replace: true });
        break;
      case 'super-admin':
        navigate('/super-admin-dashboard', { replace: true });
        break;
      case 'head-admin':
        navigate('/head-admin-dashboard', { replace: true });
        break;
      case 'team-leader':
        navigate('/team-leader-dashboard', { replace: true });
        break;
      default:
        navigate('/dashboard', { replace: true });
    }
  }, [userRole, navigate]);
  return null;
};

const AppRoutes = ({ isLoggedIn, userRole, isDeveloperLoggedIn }) => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={isLoggedIn && (userRole === "admin" || userRole === "sales_head" || userRole === "blog_manager") ? <AdminDashboard /> : <Navigate to="/login" replace />}>
        <Route path="project-enquiries" element={<ProjectEnquiries />} />
        <Route path="listed-projects" element={<ListedProjects />} />
        <Route path="project-order-manager" element={<ProjectOrderManager />} />
        <Route path="resale-enquiries" element={<ResaleEnquiries />} />
        <Route path="listed-properties" element={<ListedProperties />} />
        <Route path="s3-manager" element={<S3Manager />} />
        <Route path="contact-cards" element={<ContactCards />} />
        <Route path="sitemap-manager" element={<SitemapManager />} />
        <Route path="blog-post" element={<BlogPost />} />
        <Route path="banner-management" element={<BannerManagement />} />
        <Route path="short-setting" element={<ShortSetting />} />
        <Route path="user-management" element={<UserManagement />} />
      </Route>

      {/* BD Analytics Route for super-admin and head-admin */}
      <Route path="/admin/bd-analytics" element={isLoggedIn && (userRole === "super-admin" || userRole === "head-admin") ? <BDStatusSummary /> : <Navigate to="/login" replace />} />

      {/* Project View Route */}
      <Route path="/Admin/ProjectsView/:pUrl" element={isLoggedIn && (userRole === "admin" || userRole === "sales_head") ? <ProjectView /> : <Navigate to="/login" replace />} />

      {/* Protected Routes */}
      {/* <Route path="/Admin/UserManagement" element={isLoggedIn && (userRole === "admin" || userRole === "crm_admin" || userRole === "hr" || userRole === "it") ? <UserManagement /> : <Navigate to="/login" replace />} />
      <Route path="/admin/project-enquiries" element={isLoggedIn && (userRole === "admin") ? <ProjectEnquiries /> : <Navigate to="/login" replace />} />
      <Route path="/admin/listed-projects" element={isLoggedIn && (userRole === "admin" || userRole === "sales_head") ? <ListedProjects /> : <Navigate to="/login" replace />} />
      <Route path="/admin/project-order-manager" element={isLoggedIn && (userRole === "admin" || userRole === "sales_head") ? <ProjectOrderManager /> : <Navigate to="/login" replace />} />
      <Route path="/admin/resale-enquiries" element={isLoggedIn && (userRole === "admin" || userRole === "sales_head") ? <ResaleEnquiries /> : <Navigate to="/login" replace />} />
      <Route path="/admin/listed-properties" element={isLoggedIn && (userRole === "admin" || userRole === "sales_head") ? <ListedProperties /> : <Navigate to="/login" replace />} />
      <Route path="/admin/s3-manager" element={isLoggedIn && (userRole === "admin") ? <S3Manager /> : <Navigate to="/login" replace />} />
      <Route path="/admin/contact-cards" element={isLoggedIn && (userRole === "admin") ? <ContactCards /> : <Navigate to="/login" replace />} />
      <Route path="/admin/sitemap-manager" element={isLoggedIn && (userRole === "admin") ? <SitemapManager /> : <Navigate to="/login" replace />} />
      <Route path="/admin/blog-post" element={isLoggedIn && (userRole === "admin" || userRole === "blog_manager") ? <BlogPost /> : <Navigate to="/login" replace />} />
      <Route path="/admin/banner-management" element={isLoggedIn && (userRole === "admin" || userRole === "blog_manager") ? <BannerManagement /> : <Navigate to="/login" replace />} />
      <Route path="/admin/short-setting" element={isLoggedIn && (userRole === "admin") ? <ShortSetting /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/" element={isLoggedIn ? <Dashboard userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/leads" element={isLoggedIn ? <Leads userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/tickets" element={isLoggedIn ? <Tickets userRole={userRole} /> : <Navigate to="/login" replace />} /> */}
      {/* <Route path="/users" element={isLoggedIn && userRole === "super-admin" ? <UserManagement userRole={userRole} /> : <Navigate to="/" replace />} /> */}
      
      {/* Developer Routes */}
      {/* <Route path="/developer" element={(isLoggedIn && userRole === "super-admin") || isDeveloperLoggedIn ? <Developer userRole={userRole} /> : <Navigate to="/" replace />} /> */}
      {/* Main route: role-aware redirect */}
      <Route
        path="/"
        element={
          isLoggedIn
            ? <RoleBasedRedirect userRole={userRole} />
            : <Navigate to="/login" replace />
        }
      />
      {/* Developer Dashboard route */}
      <Route path="/developer-dashboard" element={
        (isLoggedIn && userRole === "developer") || isDeveloperLoggedIn
          ? <DeveloperDashboard />
          : <Navigate to="/login" replace />
      } />
      {/* Catch-all route: ensure developers always see their dashboard */}
      <Route
        path="*"
        element={
          isLoggedIn
            ? userRole === "developer"
              ? <Navigate to="/developer-dashboard" replace />
              : <RoleBasedRedirect userRole={userRole} />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes; 