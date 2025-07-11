
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AtSign, Eye, EyeOff, Hash, Code, Briefcase, Monitor } from 'lucide-react';
import '../style/Login.css'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // Static developer credentials
  const DEVELOPER_CREDENTIALS = {
    email: "amandev@gmail.com",
    password: "dev123"
  };

  // NEW STATIC HR & FINANCE CREDENTIALS
  const HR_FINANCE_CREDENTIALS = {
    email: "amanhr@gmail.com",
    password: "hr123"
  };

    // NEW: IT INFRASTRUCTURE CREDENTIALS
    const IT_INFRASTRUCTURE_CREDENTIALS = {
      email: "amanit@gmail.com",
      password: "it123"
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check if it's developer login
    if (credentials.email === DEVELOPER_CREDENTIALS.email && 
        credentials.password === DEVELOPER_CREDENTIALS.password) {
      
      // Set developer session
      localStorage.setItem("isDeveloperLoggedIn", "true");
      localStorage.setItem("developerEmail", credentials.email);
      localStorage.setItem("developerName", "Aman Developer");
      localStorage.setItem("developerRole", "developer");
      localStorage.removeItem("isHrFinanceLoggedIn");
      
      navigate("/developer-dashboard");
      window.location.reload();
      setIsLoading(false);
      return;
    }

// NEW: Check if it's HR & Finance login
if (credentials.email === HR_FINANCE_CREDENTIALS.email &&
  credentials.password === HR_FINANCE_CREDENTIALS.password) {

// Set HR & Finance session
localStorage.setItem("isHrFinanceLoggedIn", "true");
localStorage.setItem("hrFinanceEmail", credentials.email);
localStorage.setItem("hrFinanceName", "HR/Finance User"); // You can make this dynamic
localStorage.setItem("hrFinanceRole", "hr_finance"); // A specific role for this department
localStorage.removeItem("isDeveloperLoggedIn"); // Clear other specific roles

navigate("/hr-finance"); // Redirect to the HR & Finance section
window.location.reload();
setIsLoading(false);
return;
}


  // NEW: Check if it's IT Infrastructure login
  if (credentials.email === IT_INFRASTRUCTURE_CREDENTIALS.email &&
    credentials.password === IT_INFRASTRUCTURE_CREDENTIALS.password) {

    // Set IT Infrastructure session
    localStorage.setItem("isItLoggedIn", "true");
    localStorage.setItem("itEmail", credentials.email);
    localStorage.setItem("itName", "IT Team Lead");
    localStorage.setItem("itRole", "it_infrastructure");
    localStorage.removeItem("isDeveloperLoggedIn");
    localStorage.removeItem("isHrFinanceLoggedIn");

    navigate("/it-infrastructure");
    window.location.reload();
    setIsLoading(false);
    return;
  }

    // Regular user login
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.user._id);
        localStorage.removeItem("isDeveloperLoggedIn"); // Clear specific roles
        localStorage.removeItem("isHrFinanceLoggedIn"); // Clear specific role
        navigate('/');
        window.location.reload();
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        {/* Left Side - Brand Section */}
        <div className="left">
          <h1 className="crm-title">100acres.com</h1>
          <p className="crm-subtitle">Rishto Ki Shuruwat</p>
          <p className="crm-desc">
            India's Best Property Site. Post and Search Your Property.
          </p>
          <div className="credentials-hint developer-hint">
            <h3 className="hint-title flex items-center justify-center">
              <Code size={20} className="mr-2" />Developer Access:
            </h3>
            <p className="hint-text">Email: {DEVELOPER_CREDENTIALS.email}</p>
            <p className="hint-text">Password: {DEVELOPER_CREDENTIALS.password}</p>
          </div>

          {/* NEW: HR & Finance Credentials Hint */}
          <div className="credentials-hint hr-finance-hint">
            <h3 className="hint-title flex items-center justify-center">
              <Briefcase size={20} className="mr-2" />HR & Finance Access:
            </h3>
            <p className="hint-text">Email: {HR_FINANCE_CREDENTIALS.email}</p>
            <p className="hint-text">Password: {HR_FINANCE_CREDENTIALS.password}</p>
          </div>

          {/* IT Infrastructure Credentials Hint - moved inside left */}
          <div className="credentials-hint it-hint">
            <h3 className="hint-title flex items-center justify-center">
              <Monitor size={20} className="mr-2" />IT Infrastructure Access:
            </h3>
            <p className="hint-text">Email: {IT_INFRASTRUCTURE_CREDENTIALS.email}</p>
            <p className="hint-text">Password: {IT_INFRASTRUCTURE_CREDENTIALS.password}</p>
          </div>
        </div>


        {/* Right Side - Login Form */}
        <div className="right">
          <form className="login-box" onSubmit={handleSubmit}>
            <div className="logo-container">
              <Code size={40} />
            </div>
            <h2 className="login-heading">Welcome Back</h2>

            {error && <div className="error-msg">{error}</div>}

            {/* Email Input */}
            <div className="input-group">
              <AtSign className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-group">
              <Hash className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Options */}
            <div className="options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                />
                Remember me
              </label>

              <button type="button" className="forgot-password" onClick={() => setShowForgotModal(true)}>Forgot Password?</button>

              {/* <a href="#" className="forgot-password">
                Forgot password?
              </a> */}

            </div>

            {/* Submit Button */}
            <button className="login-btn" disabled={isLoading}>
              {isLoading ? "Signing In..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
      

      {showForgotModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Forgot Password</h3>
            <p>Enter your email to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="modal-input"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
            />
            <button
              className="modal-btn"
              onClick={async () => {
                setForgotLoading(true);
                setForgotStatus("");
                try {
                  const res = await fetch("http://localhost:5001/api/auth/request-password-reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: forgotEmail }),
                  });
                  const data = await res.json();
                  if (res.ok) setForgotStatus("Reset link sent! Check your email.");
                  else setForgotStatus(data.message || "Error sending reset link.");
                } catch (err) {
                  setForgotStatus("Error sending reset link.");
                }
                setForgotLoading(false);
              }}
              disabled={forgotLoading || !forgotEmail}
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </button>
            {forgotStatus && <div style={{ marginTop: 8, color: forgotStatus.includes('sent') ? 'green' : 'red' }}>{forgotStatus}</div>}
            <button className="modal-btn" style={{ background: '#888', marginTop: 12 }} onClick={() => setShowForgotModal(false)}>Close</button>
          </div>
        </div>
      )}

    
    </>
  );
};

export default Login;