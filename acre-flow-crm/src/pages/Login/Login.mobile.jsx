import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Home,
  Building,
  MapPin,
  Key,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import API_CONFIG from "@/config/apiConfig";
import { setAuthData } from "@/features/auth/slices/authSlice";

const LoginMobile = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const parseJson = async (res) => {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  };

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role) => {
    const normalizedRole = (role || '').toLowerCase().trim();

    switch (normalizedRole) {
      // Department-based roles
      case "sales_head":
      case "sales_executive":
        window.location.href = "/sales-head-dashboard";
        break;
      case "hr_manager":
      case "hr_executive":
        window.location.href = "/hr-dashboard";
        break;
      case "blog_manager":
      case "blog_writer":
        window.location.href = "/blog-dashboard";
        break;
      case "admin":
      case "super_admin":
      case "superadmin":
        window.location.href = "/admin-dashboard";
        break;
      // Existing roles
      case "developer":
        window.location.href = "/developer-dashboard";
        break;
      case "hr_finance":
        window.location.href = "/hr-finance";
        break;
      case "it_infrastructure":
        window.location.href = "/it-infrastructure";
        break;
      case "boss":
        window.location.href = "/super-admin-dashboard";
        break;
      case "hod":
        window.location.href = "/head-admin-dashboard";
        break;
      case "head-admin":
      case "head admin":
        window.location.href = "/head-admin-dashboard";
        break;
      case "team-leader":
      case "team leader":
        window.location.href = "/team-leader-dashboard";
        break;
      case "bd":
      case "user":
        window.location.href = "/employee-dashboard";
        break;
      default:
        window.location.href = "/";
    }
  };

  // Static credentials
  const DEVELOPER = { email: "amandev@gmail.com", password: "dev123" };
  const SALES_HEAD = { email: "sales@example.com", password: "sales123" };
  const HR_MANAGER = { email: "hr@example.com", password: "hr123" };
  const BLOG_MANAGER = { email: "blog@example.com", password: "blog123" };
  const ADMIN = { email: "admin@example.com", password: "admin123" };
  const HR_FINANCE = { email: "amanhr@gmail.com", password: "hr123" };
  const IT_INFRA = { email: "amanit@gmail.com", password: "it123" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Check static logins
    if (
      credentials.email === DEVELOPER.email &&
      credentials.password === DEVELOPER.password
    ) {
      localStorage.setItem("isDeveloperLoggedIn", "true");
      localStorage.setItem("developerEmail", credentials.email);
      localStorage.setItem("developerName", "Aman Developer");
      localStorage.setItem("developerRole", "developer");
      localStorage.removeItem("isHrFinanceLoggedIn");
      window.location.href = "/developer-dashboard";
      return;
    }

    if (
      credentials.email === HR_FINANCE.email &&
      credentials.password === HR_FINANCE.password
    ) {
      localStorage.setItem("isHrFinanceLoggedIn", "true");
      localStorage.setItem("hrFinanceEmail", credentials.email);
      localStorage.setItem("hrFinanceName", "HR/Finance User");
      localStorage.setItem("hrFinanceRole", "hr_finance");
      localStorage.removeItem("isDeveloperLoggedIn");
      window.location.href = "/hr-finance";
      return;
    }

    if (
      credentials.email === SALES_HEAD.email &&
      credentials.password === SALES_HEAD.password
    ) {
      localStorage.setItem("isSalesHeadLoggedIn", "true");
      localStorage.setItem("salesHeadEmail", credentials.email);
      localStorage.setItem("salesHeadName", "Sales Head");
      localStorage.setItem("salesHeadRole", "sales_head");
      localStorage.removeItem("isDeveloperLoggedIn");
      localStorage.removeItem("isHrLoggedIn");
      localStorage.removeItem("isBlogLoggedIn");
      window.location.href = "/sales-head-dashboard";
      return;
    }

    if (
      credentials.email === HR_MANAGER.email &&
      credentials.password === HR_MANAGER.password
    ) {
      localStorage.setItem("isHRLoggedIn", "true");
      localStorage.setItem("hrEmail", credentials.email);
      localStorage.setItem("hrName", "HR Manager");
      localStorage.setItem("hrRole", "hr_manager");
      localStorage.removeItem("isDeveloperLoggedIn");
      localStorage.removeItem("isSalesHeadLoggedIn");
      localStorage.removeItem("isBlogLoggedIn");
      window.location.href = "/hr-dashboard";
      return;
    }

    if (
      credentials.email === BLOG_MANAGER.email &&
      credentials.password === BLOG_MANAGER.password
    ) {
      localStorage.setItem("isBlogLoggedIn", "true");
      localStorage.setItem("blogEmail", credentials.email);
      localStorage.setItem("blogName", "Blog Manager");
      localStorage.setItem("blogRole", "blog_manager");
      localStorage.removeItem("isDeveloperLoggedIn");
      localStorage.removeItem("isHRLoggedIn");
      localStorage.removeItem("isSalesHeadLoggedIn");
      window.location.href = "/blog-dashboard";
      return;
    }

    if (
      credentials.email === ADMIN.email &&
      credentials.password === ADMIN.password
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminEmail", credentials.email);
      localStorage.setItem("adminName", "Admin");
      localStorage.setItem("adminRole", "admin");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("sourceSystem", "static");
      localStorage.removeItem("isDeveloperLoggedIn");
      localStorage.removeItem("isHRLoggedIn");
      localStorage.removeItem("isSalesHeadLoggedIn");
      localStorage.removeItem("isBlogLoggedIn");
      
      // Try to get 100acress token for 100acress API access
      try {
        const acressLoginResponse = await fetch("https://api.100acress.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        });

        const acressLoginData = await acressLoginResponse.json();
        if (acressLoginResponse.ok && acressLoginData.token) {
          localStorage.setItem("myToken", acressLoginData.token);
        }
      } catch (acressError) {
        console.warn("Could not get 100acress token for static admin:", acressError);
      }
      
      window.location.href = "/admin-dashboard";
      return;
    }

    if (
      credentials.email === IT_INFRA.email &&
      credentials.password === IT_INFRA.password
    ) {
      localStorage.setItem("isItLoggedIn", "true");
      localStorage.setItem("itEmail", credentials.email);
      localStorage.setItem("itName", "IT Team Lead");
      localStorage.setItem("itRole", "it_infrastructure");
      localStorage.removeItem("isDeveloperLoggedIn");
      localStorage.removeItem("isHrFinanceLoggedIn");
      window.location.href = "/it-infrastructure";
      return;
    }

    // Try Activity Hub Department Login - check if email exists in Activity departments
    try {
      // First check if this email exists in any Activity department
      const checkResponse = await fetch(`${API_CONFIG.BASE_URL}/api/activity/departments/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email }),
      });

      if (checkResponse.ok) {
        const checkData = await parseJson(checkResponse);
        
        // Check if user is admin - skip department login
        if (checkData.success && checkData.isAdmin) {
          console.log("Admin user detected, skipping department login");
          // Continue to normal CRM login flow
        } else if (checkData.success && checkData.exists) {
          // Email exists in Activity departments, try login
          const activityResponse = await fetch(`${API_CONFIG.BASE_URL}/api/activity/departments/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const activityData = await parseJson(activityResponse);
          if (activityResponse.ok && activityData.success && activityData.data) {
            // Activity Hub login successful - use unique session ID for multiple users
            const sessionId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            const sessionKey = `activity_${sessionId}`;
            
            localStorage.setItem(sessionKey + "_department", activityData.data.name);
            localStorage.setItem(sessionKey + "_email", activityData.data.email);
            localStorage.setItem(sessionKey + "_departmentId", activityData.data.id);
            localStorage.setItem(sessionKey + "_userName", activityData.data.userName);
            localStorage.setItem(sessionKey + "_sessionId", sessionId);
            localStorage.setItem("isActivityLoggedIn", "true");
            localStorage.setItem("currentActivitySession", sessionId);
            
            // Store all active sessions
            const activeSessions = JSON.parse(localStorage.getItem("activeActivitySessions") || "[]");
            if (!activeSessions.includes(sessionId)) {
              activeSessions.push(sessionId);
              localStorage.setItem("activeActivitySessions", JSON.stringify(activeSessions));
            }
            
            window.location.href = "/activity-dashboard";
            return;
          } else {
            // Handle specific error responses for Activity login
            if (activityResponse.status === 401) {
              setError("Invalid department credentials. Please check your email and password.");
            } else if (activityResponse.status === 404) {
              setError("Department not found. Please contact your administrator.");
            } else {
              setError(activityData.message || "Activity login failed");
            }
            return; // Stop here - don't try regular login
          }
        }
      }
    } catch (activityError) {
      // If check fails, continue to normal login flow
      console.log("Activity department check failed, continuing to normal login...");
    }

    // Backend login - Try CRM first, then 100acress
    try {
      // Try CRM login first
      const crmResponse = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const crmData = await parseJson(crmResponse);
      if (crmResponse.ok && crmData.token) {
        dispatch(setAuthData({ token: crmData.token, user: crmData.user }));
        // CRM login successful
        localStorage.setItem("token", crmData.token);
        localStorage.setItem("userRole", crmData.user.role);
        localStorage.setItem("userEmail", crmData.user.email);
        localStorage.setItem("userName", crmData.user.name);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", crmData.user._id);
        localStorage.setItem("sourceSystem", "crm");
        localStorage.removeItem("isDeveloperLoggedIn");
        localStorage.removeItem("isHrFinanceLoggedIn");

        // 🎯 CRITICAL FIX: Store profile picture during login
        if (crmData.user.profileImage) {
          localStorage.setItem("userProfileImage", crmData.user.profileImage);
          console.log("✅ Profile picture loaded during login:", crmData.user.profileImage);
        } else {
          // Check if there's a saved profile picture from previous session
          const savedProfileImage = localStorage.getItem("userProfileImage");
          if (savedProfileImage) {
            console.log("✅ Using saved profile picture from previous session");
          } else {
            console.log("ℹ️ No profile picture found for this user");
          }
        }

        // 🎯 GOOGLE PROFILE: Save Google profile icon if available
        if (crmData.user.photoURL) {
          localStorage.setItem("googleProfileImage", crmData.user.photoURL);
          console.log("✅ Google profile icon saved:", crmData.user.photoURL);
        }

        if (Array.isArray(crmData.user.allowedModules)) {
          localStorage.setItem("allowedModules", JSON.stringify(crmData.user.allowedModules));
        } else {
          localStorage.removeItem("allowedModules");
        }

        if (Array.isArray(crmData.user.permissions)) {
          localStorage.setItem("permissions", JSON.stringify(crmData.user.permissions));
        } else {
          localStorage.removeItem("permissions");
        }

        // Store department if available
        if (crmData.user.department) {
          localStorage.setItem("userDepartment", crmData.user.department);
        }

        // If user is admin, try to get 100acress token as well for 100acress API access
        if (crmData.user.role === 'admin' || crmData.user.role === 'Admin') {
          try {
            const acressLoginResponse = await fetch("https://api.100acress.com/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
              credentials: "include",
            });

            const acressLoginData = await acressLoginResponse.json();
            if (acressLoginResponse.ok && acressLoginData.token) {
              localStorage.setItem("myToken", acressLoginData.token);
            }
          } catch (acressError) {
            console.warn("Could not get 100acress token:", acressError);
          }
        }

        // Redirect based on role
        redirectBasedOnRole(crmData.user.role);
        return;
      }

      // If CRM login fails, try 100acress login
      try {
        const acressResponse = await fetch("https://api.100acress.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        });

        const acressData = await acressResponse.json();
        
        if (acressResponse.ok && acressData.token) {
          // 100acress login successful, now verify with CRM backend
          const verifyResponse = await fetch(`${API_CONFIG.BASE_URL}/api/auth/verify-100acress-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: acressData.token }),
            credentials: "include",
          });

          const verifyData = await parseJson(verifyResponse);
          
          if (verifyResponse.ok && verifyData.success && verifyData.token) {
            dispatch(setAuthData({ token: verifyData.token, user: verifyData.user }));
            // Store 100acress token for 100acress API calls
            localStorage.setItem("myToken", acressData.token);
            // Store CRM token for CRM API calls
            localStorage.setItem("token", verifyData.token);
            localStorage.setItem("userRole", verifyData.user.role);
            localStorage.setItem("userEmail", verifyData.user.email);
            localStorage.setItem("userName", verifyData.user.name);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", verifyData.user._id);
            localStorage.setItem("sourceSystem", "100acress");
            localStorage.setItem("originalRole", verifyData.user.originalRole || verifyData.user.role);
            
            // 🎯 CRITICAL FIX: Store profile picture during login
            if (verifyData.user.profileImage) {
              localStorage.setItem("userProfileImage", verifyData.user.profileImage);
              console.log("✅ Profile picture loaded during 100acress login:", verifyData.user.profileImage);
            } else {
              // Check if there's a saved profile picture from previous session
              const savedProfileImage = localStorage.getItem("userProfileImage");
              if (savedProfileImage) {
                console.log("✅ Using saved profile picture from previous session");
              } else {
                console.log("ℹ️ No profile picture found for this user");
              }
            }

            // 🎯 GOOGLE PROFILE: Save Google profile icon if available
            if (verifyData.user.photoURL) {
              localStorage.setItem("googleProfileImage", verifyData.user.photoURL);
              console.log("✅ Google profile icon saved during 100acress login:", verifyData.user.photoURL);
            }
            
            // Clear other login states
            localStorage.removeItem("isDeveloperLoggedIn");
            localStorage.removeItem("isHrFinanceLoggedIn");
            localStorage.removeItem("isAdminLoggedIn");
            localStorage.removeItem("isSalesHeadLoggedIn");
            localStorage.removeItem("isHRLoggedIn");
            localStorage.removeItem("isBlogLoggedIn");

            // Redirect based on mapped role
            redirectBasedOnRole(verifyData.user.role);
            return;
          } else {
            setError(verifyData.message || "Failed to verify 100acress account with CRM");
          }
        } else {
          setError(acressData.message || "Invalid email or password");
        }
      } catch (acressErr) {
        // If 100acress login also fails, show error
        setError(crmData.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Logo in the absolute top left corner */}
      <img
        src="https://100acress-media-bucket.s3.ap-south-1.amazonaws.com/100acre/logo/logowhite.webp.webp"
        alt="100acres Logo"
        className="fixed top-2 left-4 w-20 h-20 object-contain z-50"
      />
      
      {/* Simplified Mobile Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-10 left-10 w-8 h-8 bg-white bg-opacity-10 rounded-lg flex items-center justify-center animate-pulse"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          <Home className="w-4 h-4 text-white opacity-60" />
        </div>
        <div
          className="absolute top-20 right-10 w-8 h-8 bg-white bg-opacity-10 rounded-lg flex items-center justify-center animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        >
          <Building className="w-4 h-4 text-white opacity-60" />
        </div>
        <div
          className="absolute bottom-20 left-10 w-8 h-8 bg-white bg-opacity-10 rounded-lg flex items-center justify-center animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        >
          <MapPin className="w-4 h-4 text-white opacity-60" />
        </div>
        <div
          className="absolute bottom-10 right-10 w-8 h-8 bg-white bg-opacity-10 rounded-lg flex items-center justify-center animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "3s" }}
        >
          <Shield className="w-4 h-4 text-white opacity-60" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Mobile Login Form */}
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white border-opacity-20">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Email address"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-700 text-sm"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-700 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="text-xs text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Forgot?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold text-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "SIGN IN"
              )}
            </button>
          </div>

          {/* Mobile Branding */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-xs">
              <span className="font-semibold text-red-600">100acres.com</span>{" "}
              - Rishto Ki Shuruwat
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Forgot Password
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Enter your email address to receive a password reset link.
            </p>

            <input
              type="email"
              placeholder="Your email address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3 text-sm"
            />

            <div className="flex space-x-2">
              <button
                onClick={handleForgotPassword}
                disabled={!forgotEmail || forgotLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotEmail("");
                  setForgotStatus("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>

            {forgotStatus && (
              <div
                className={`mt-3 p-2 rounded-lg text-sm ${
                  forgotStatus.includes("sent")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <p className="font-medium">{forgotStatus}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginMobile;
