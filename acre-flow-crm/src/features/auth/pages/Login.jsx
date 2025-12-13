import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Home,
  Code,
  Briefcase,
  Monitor,
  Building,
  MapPin,
  Key,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = null; // Remove navigate for demo

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
      case "super-admin":
        window.location.href = "/super-admin-dashboard";
        break;
      case "head-admin":
        window.location.href = "/head-admin-dashboard";
        break;
      case "team-leader":
        window.location.href = "/team-leader-dashboard";
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
        // If 100acress login fails, continue with static login
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

    // Backend login - Try CRM first, then 100acress
    try {
      // Try CRM login first
      const crmResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const crmData = await crmResponse.json();
      if (crmResponse.ok && crmData.token) {
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
            // If 100acress login fails, continue with CRM login
            // User can still use CRM features, just won't have 100acress API access
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
          const verifyResponse = await fetch("https://bcrm.100acress.com/api/auth/verify-100acress-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: acressData.token }),
            credentials: "include",
          });

          const verifyData = await verifyResponse.json();
          
          if (verifyResponse.ok && verifyData.success && verifyData.token) {
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

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotStatus("");
    try {
      const res = await fetch(
        "https://bcrm.100acress.com//api/auth/request-password-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );
      const data = await res.json();
      setForgotStatus(res.ok ? "Reset link sent!" : data.message || "Error.");
    } catch {
      setForgotStatus("Error sending reset link.");
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Logo in the absolute top left corner */}
      <img
        src="/image/100acress icon.png"
        alt="100acres Logo"
        className="fixed top-0.5 left-12 w-40 h-40 object-contain z-50"
      />
      {/* Floating Property Theme Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Property Icons */}
        <div
          className="absolute top-20 left-20 w-16 h-16 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        >
          <Home className="w-8 h-8 text-white opacity-60" />
        </div>
        <div
          className="absolute top-40 right-32 w-14 h-14 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        >
          <Building className="w-7 h-7 text-white opacity-60" />
        </div>
        <div
          className="absolute top-60 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        >
          <Key className="w-6 h-6 text-white opacity-60" />
        </div>
        <div
          className="absolute bottom-32 right-20 w-18 h-18 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        >
          <MapPin className="w-8 h-8 text-white opacity-60" />
        </div>
        <div
          className="absolute bottom-60 left-32 w-14 h-14 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "3s" }}
        >
          <Users className="w-7 h-7 text-white opacity-60" />
        </div>
        <div
          className="absolute top-32 right-1/4 w-16 h-16 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ animationDelay: "2.5s", animationDuration: "4s" }}
        >
          <TrendingUp className="w-8 h-8 text-white opacity-60" />
        </div>
        <div
          className="absolute bottom-20 right-1/3 w-12 h-12 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center animate-bounce"
          style={{ animationDelay: "3s", animationDuration: "3.5s" }}
        >
          <Shield className="w-6 h-6 text-white opacity-60" />
        </div>

        {/* Large Background Shapes */}
        <div
          className="absolute top-10 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDuration: "6s" }}
        ></div>
        <div
          className="absolute bottom-10 left-10 w-40 h-40 bg-white bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDelay: "3s", animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDelay: "4s", animationDuration: "10s" }}
        ></div>

        {/* Floating Property Cards */}
        <div
          className="absolute top-16 left-1/3 w-24 h-16 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm animate-float"
          style={{ animationDelay: "1s" }}
        >
          <div className="p-2 text-center">
            <Home className="w-4 h-4 text-white opacity-60 mx-auto mb-1" />
            <div className="text-xs text-white opacity-60">Villa</div>
          </div>
        </div>
        <div
          className="absolute bottom-32 right-1/4 w-24 h-16 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm animate-float"
          style={{ animationDelay: "2s" }}
        >
          <div className="p-2 text-center">
            <Building className="w-4 h-4 text-white opacity-60 mx-auto mb-1" />
            <div className="text-xs text-white opacity-60">Flat</div>
          </div>
        </div>
        <div
          className="absolute top-1/3 right-16 w-24 h-16 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm animate-float"
          style={{ animationDelay: "3s" }}
        >
          <div className="p-2 text-center">
            <MapPin className="w-4 h-4 text-white opacity-60 mx-auto mb-1" />
            <div className="text-xs text-white opacity-60">Plot</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center lg:justify-between gap-8 relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-start space-y-8 text-white max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {/* <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm"> */}
              {/* <Home className="w-6 h-6 text-white" /> */}
              {/* </div> */}
              <a
                href="https://www.100acress.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h1 className="text-4xl font-bold tracking-tight hover:underline cursor-pointer">
                  100acress.com
                </h1>
              </a>
            </div>
            <p className="text-2xl font-semibold text-red-100">
              Rishto Ki Shuruwat
            </p>
            <p className="text-lg text-red-200 leading-relaxed">
              India's Best Property Site. Post and Search Your Property with
              confidence and ease.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-red-100">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <span>Premium Property Listings</span>
            </div>
            <div className="flex items-center space-x-3 text-red-100">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span>Location-Based Search</span>
            </div>
            <div className="flex items-center space-x-3 text-red-100">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Market Analytics & Insights</span>
            </div>
            <div className="flex items-center space-x-3 text-red-100">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span>Secure & Verified Properties</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white border-opacity-20">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
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
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "SIGN IN"
                )}
              </button>
            </div>

            {/* Mobile Branding */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-red-600">100acres.com</span>{" "}
                - Rishto Ki Shuruwat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Forgot Password
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your email address to receive a password reset link.
            </p>

            <input
              type="email"
              placeholder="Your email address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
            />

            <div className="flex space-x-3">
              <button
                onClick={handleForgotPassword}
                disabled={!forgotEmail || forgotLoading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotEmail("");
                  setForgotStatus("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>

            {forgotStatus && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  forgotStatus.includes("sent")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <p className="text-sm font-medium">{forgotStatus}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
