import React, { useState } from "react";
import { Eye, EyeOff, AtSign, Hash, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import '@/styles/DeveloperLogin.css'

const DeveloperLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  // Static developer credentials
  const DEVELOPER_CREDENTIALS = {
    email: "amandev@gmail.com",
    password: "dev123"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token); // Store the JWT token
        localStorage.setItem("isDeveloperLoggedIn", "true");
        localStorage.setItem("developerEmail", credentials.email);
        localStorage.setItem("developerName", "Aman Developer");
        localStorage.setItem("developerRole", "developer");
        navigate("/developer-dashboard");
        window.location.reload();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        {/* Left Side (Developer Theme) */}
        <div className="left developer-theme">
          <Code className="developer-icon" />
          <h1 className="crm-title">Developer Console</h1>
          <p className="crm-subtitle">Advanced System Management</p>
          <p className="crm-desc">
            Access technical tools, database management, API configurations, and system monitoring
          </p>
          <div className="credentials-hint">
            <p className="hint-title">Developer Credentials:</p>
            <p className="hint-text">Email: amandev@gmail.com</p>
            <p className="hint-text">Password: dev123</p>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="right">
          <form className="login-box" onSubmit={handleSubmit}>
            <div className="logo-container developer-logo">
              <Code size={40} />
            </div>
            <h2 className="login-heading">Developer Access</h2>

            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <AtSign className="input-icon" />
              <input
                type="email"
                placeholder="Developer Email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <Hash className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Developer Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
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

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" className="checkbox" /> Remember Me
              </label>
              <button type="button" className="forgot-password" onClick={() => setShowForgotModal(true)}>Forgot Password?</button>
              <a href="/login" className="back-to-main">Back to Main Login</a>
            </div>

            <button className="login-btn developer-btn" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "ACCESS DEVELOPER CONSOLE"}
            </button>
          </form>
        </div>
      </div>

      {showForgotModal && (
        <div className="modal-backdrop">
          <div className="modal">
            {/* <h3>Forgot Password</h3> */}
            <p>Enter your developer email to receive a password reset link.</p>
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

export default DeveloperLogin;