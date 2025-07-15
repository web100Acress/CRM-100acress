import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AtSign, Hash, Code, Briefcase, Monitor } from 'lucide-react';
import '@/styles/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // Static credentials
  const DEVELOPER = { email: "amandev@gmail.com", password: "dev123" };
  const HR_FINANCE = { email: "amanhr@gmail.com", password: "hr123" };
  const IT_INFRA = { email: "amanit@gmail.com", password: "it123" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check static logins
    if (credentials.email === DEVELOPER.email && credentials.password === DEVELOPER.password) {
      localStorage.setItem("isDeveloperLoggedIn", "true");
      localStorage.setItem("developerEmail", credentials.email);
      localStorage.setItem("developerName", "Aman Developer");
      localStorage.setItem("developerRole", "developer");
      localStorage.removeItem("isHrFinanceLoggedIn");
      window.location.href = "/developer-dashboard";
      return;
    }

    if (credentials.email === HR_FINANCE.email && credentials.password === HR_FINANCE.password) {
      localStorage.setItem("isHrFinanceLoggedIn", "true");
      localStorage.setItem("hrFinanceEmail", credentials.email);
      localStorage.setItem("hrFinanceName", "HR/Finance User");
      localStorage.setItem("hrFinanceRole", "hr_finance");
      localStorage.removeItem("isDeveloperLoggedIn");
      window.location.href = "/hr-finance";
      return;
    }

    if (credentials.email === IT_INFRA.email && credentials.password === IT_INFRA.password) {
      localStorage.setItem("isItLoggedIn", "true");
      localStorage.setItem("itEmail", credentials.email);
      localStorage.setItem("itName", "IT Team Lead");
      localStorage.setItem("itRole", "it_infrastructure");
      localStorage.removeItem("isDeveloperLoggedIn");
      localStorage.removeItem("isHrFinanceLoggedIn");
      window.location.href = "/it-infrastructure";
      return;
    }
    // ask

    // Backend login
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.user._id);
        localStorage.removeItem("isDeveloperLoggedIn");
        localStorage.removeItem("isHrFinanceLoggedIn");

        switch (data.user.role) {
          case 'developer':
            window.location.href = "/developer-dashboard";
            break;
          case 'hr_finance':
            window.location.href = "/hr-finance";
            break;
          case 'it_infrastructure':
            window.location.href = "/it-infrastructure";
            break;
          case 'super-admin':
            window.location.href = "/super-admin-dashboard";
            break;
          case 'head-admin':
            window.location.href = "/head-admin-dashboard";
            break;
          case 'team-leader':
            window.location.href = "/team-leader-dashboard";
            break;
          default:
            window.location.href = "/";
        }
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
        <div className="left">
          <h1 className="crm-title">100acres.com</h1>
          <p className="crm-subtitle">Rishto Ki Shuruwat</p>
          <p className="crm-desc">India's Best Property Site. Post and Search Your Property.</p>

          {/* <div className="credentials-hint developer-hint">
            <h3 className="hint-title"><Code size={20} /> Developer Access</h3>
            <p>Email: {DEVELOPER.email}</p>
            <p>Password: {DEVELOPER.password}</p>
          </div> */}
          {/* <div className="credentials-hint hr-finance-hint">
            <h3 className="hint-title"><Briefcase size={20} /> HR/Finance Access</h3>
            <p>Email: {HR_FINANCE.email}</p>
            <p>Password: {HR_FINANCE.password}</p>
          </div> */}
          {/* <div className="credentials-hint it-hint">
            <h3 className="hint-title"><Monitor size={20} /> IT Access</h3>
            <p>Email: {IT_INFRA.email}</p>
            <p>Password: {IT_INFRA.password}</p>
          </div> */}
        </div>

        <div className="right">
          <form className="login-box" onSubmit={handleSubmit}>
            <h2 className="login-heading">Welcome Back</h2>
            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <AtSign className="input-icon" />
              <input type="email" placeholder="Email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required />
            </div>

            <div className="input-group">
              <Hash className="input-icon" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="forgot-password" onClick={() => setShowForgotModal(true)}>Forgot Password?</button>
            </div>

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
            <p>Enter your email to receive a reset link.</p>
            <input type="email" placeholder="Your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
            <button
              onClick={async () => {
                setForgotLoading(true);
                setForgotStatus("");
                try {
                  const res = await fetch("http://localhost:5001api/auth/request-password-reset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: forgotEmail }),
                  });
                  const data = await res.json();
                  setForgotStatus(res.ok ? "Reset link sent!" : data.message || "Error.");
                } catch {
                  setForgotStatus("Error sending reset link.");
                }
                setForgotLoading(false);
              }}
              disabled={!forgotEmail || forgotLoading}
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <button style={{ marginTop: 10 }} onClick={() => setShowForgotModal(false)}>Close</button>
            {forgotStatus && <p style={{ color: forgotStatus.includes("sent") ? "green" : "red" }}>{forgotStatus}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
