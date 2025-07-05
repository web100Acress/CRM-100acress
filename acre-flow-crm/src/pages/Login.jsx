import React, { useState } from "react";
import { Eye, EyeOff, AtSign, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
        window.location.reload();
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        {/* Left Side (Red) */}
        <div className="left">
          <h1 className="crm-title">C.R.M</h1>
          <p className="crm-subtitle">Customer Relationship Management</p>
          <p className="crm-desc">
            Manage your business relationships, leads, and activities from one
            dashboard.
          </p>
        </div>

        {/* Right Side (Login Form) */}
        <div className="right">
          <form className="login-box" onSubmit={handleSubmit}>
            <h2 className="login-heading">Sign In to C.R.M</h2>

            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <AtSign className="input-icon" />
              <input
                type="email"
                placeholder="Email"
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
                placeholder="Password"
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button className="login-btn" disabled={isLoading}>
              {isLoading ? "Signing In..." : "LOG IN"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .container {
          display: flex;
          min-height: 100vh;
        }
.left {
  width: 50%;
  background-color: #dc2626;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 2rem;
  clip-path: ellipse(75% 100% at 0% 50%);
}
.right {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f0fdf4;
}
        .login-box {
  width: 100%;
  max-width: 700px;
  background: white;
  padding: 3rem;
  border-radius: 0.75rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  height: 50%;
  max-height: 100%;
}


        .login-heading {
          font-size: 1.5rem;
          text-align: center;
          color: #059669;
          margin-bottom: 1.5rem;
        }

        .input-group {
          display: flex;
          align-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: #f9fafb;
        }

        .input-icon {
          color: #6b7280;
          margin-right: 0.5rem;
        }

        .input-group input {
          border: none;
          outline: none;
          flex: 1;
          background: transparent;
        }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .options {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .login-btn {
          width: 100%;
          background-color: #10b981;
          color: white;
          padding: 0.5rem;
          font-weight: bold;
          border-radius: 999px;
          transition: background 0.2s ease;
        }

        .login-btn:hover {
          background-color: #059669;
        }

        .error-msg {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          padding: 0.5rem;
          color: #b91c1c;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
        }

        .crm-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .crm-subtitle {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .crm-desc {
          font-size: 0.9rem;
          max-width: 250px;
        }

        @media screen and (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .left {
            clip-path: none;
            padding: 2rem 1rem;
          }

          .right {
            padding: 1rem;
          }

          .login-box {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Login;