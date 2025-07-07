import React, { useState } from "react";
import { Eye, EyeOff, AtSign, Hash, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from '/image/logo.png';

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
        console.log('LOGIN USER:', data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.user._id);
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

  const handleDeveloperLogin = () => {
    navigate('/developer-login');
  }
  return (
    <>
      <div className="container">
        {/* Left Side (Red) */}
        <div className="left">
          <h1 className="crm-title">100acres.com</h1>
          <p className="crm-subtitle">Rishto Ki Shuruwat</p>
          <p className="crm-desc">
            Indias Best Property Property Site
          </p>
          <p className="crm-quote">
            Post and Search Your Property .
          </p>
        </div>

        {/* Right Side (Login Form) */}
        <div className="right">
          <form className="login-box" onSubmit={handleSubmit}>
            <div className="logo-container">
              <img src={logo} alt="CRM Logo" className="crm-logo" />
            </div>
            <h2 className="login-heading">Sign In</h2>

            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <AtSign className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" className="checkbox" /> Remember Me
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button className="login-btn" disabled={isLoading}>
              {isLoading ? "Signing In..." : "LOG IN"}
            </button>
          </form>

         <div className="developer-login-container">
  <button
    onClick={handleDeveloperLogin}
    className="developer-login-button"
  >
    <Code className="icon" />
    Developer Access
  </button>
</div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .container {
          display: flex;
          min-height: 100vh;
          overflow: hidden; /* Prevent scroll issues with clip-path */
        }

        .left {
          width: 50%;
          background-color: #dc2626; /* Original red */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          text-align: center;
          padding: 3rem;
          /* More pronounced, smoother curve */
          clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
          position: relative; /* For decorative elements if desired */
        }

        .crm-title {
          font-size: 3.5rem; /* Larger font size */
          font-weight: 700; /* Bolder */
          margin-bottom: 0.8rem;
          letter-spacing: 2px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .crm-subtitle {
          font-size: 1.6rem; /* Larger */
          font-weight: 500;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .crm-desc {
          font-size: 1.1rem; /* Slightly larger */
          line-height: 1.7;
          max-width: 400px; /* Wider text block */
          margin-bottom: 2rem;
          font-weight: 300;
        }

        .crm-quote {
            font-size: 1.2rem;
            font-style: italic;
            margin-top: 2rem;
            opacity: 0.8;
            border-left: 3px solid rgba(255, 255, 255, 0.6);
            padding-left: 1rem;
        }

        .right {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          
          position: relative;
        }

        .login-box {
          width: 100%;
          max-width: 700px;
          background: white;
          padding: 3.5rem 3rem;
          border-radius: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .logo-container {
            margin-bottom: 2rem;
            background-color: #dc2626; /* Red background for logo */
            border-radius: 50%;
            padding: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .crm-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            filter: invert(100%);
        }

        .login-heading {
          font-size: 2rem; /* Larger heading */
          text-align: center;
          color: #059669; /* Original green */
          margin-bottom: 2rem; /* More space below heading */
          font-weight: 600;
        }

        .input-group {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db; /* Lighter border */
          border-radius: 0.75rem; /* More rounded input fields */
          margin-bottom: 1.2rem; /* More space between inputs */
          padding: 0.75rem 1rem; /* More padding inside inputs */
          background: #ffffff; /* White background for inputs */
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05); /* Subtle inner shadow */
          transition: all 0.2s ease-in-out;
          width: 100%;
        }

        .input-group:focus-within {
            border-color: #10b981; /* Green border on focus */
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); /* Green glow on focus */
        }

        .input-icon {
          color: #9ca3af; /* Softer icon color */
          margin-right: 0.75rem;
        }

        .input-group input {
          border: none;
          outline: none;
          flex: 1;
          background: transparent;
          font-size: 1rem;
          color: #374151; /* Darker text color */
        }

        .input-group input::placeholder {
            color: #9ca3af; /* Placeholder color */
        }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 0 0.5rem;
          display: flex;
          align-items: center;
        }

        .options {
          display: flex;
          justify-content: space-between;
          align-items: center; /* Align items vertically */
          font-size: 0.9rem;
          margin-bottom: 1.8rem; /* More space */
          width: 100%;
        }

        .remember-me {
            display: flex;
            align-items: center;
            color: #4b5563;
        }

        .remember-me .checkbox {
            margin-right: 0.5rem;
            accent-color: #10b981; /* Green checkbox */
        }

        .forgot-password {
            color: #10b981; /* Green link */
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .forgot-password:hover {
            color: #059669; /* Darker green on hover */
            text-decoration: underline;
        }

        .login-btn {
          width: 100%;
          background-color: #10b981; /* Original green */
          color: white;
          padding: 1rem 0; /* More padding */
          font-weight: 600; /* Bolder text */
          border-radius: 999px; /* Fully rounded button */
          transition: background-color 0.3s ease, transform 0.1s ease;
          border: none;
          cursor: pointer;
          font-size: 1.1rem; /* Slightly larger text */
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); /* Green shadow */
        }

        .login-btn:hover {
          background-color: #059669; /* Darker green on hover */
          transform: translateY(-2px); /* Slight lift effect */
        }

        .login-btn:disabled {
          background-color: #9ca3af; /* Grey when disabled */
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .error-msg {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          padding: 0.75rem; /* More padding */
          color: #b91c1c;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border-radius: 0.75rem; /* More rounded */
          text-align: center;
          width: 100%;
        }

        /* Responsive adjustments */
        @media screen and (max-width: 992px) {
            .crm-title {
                font-size: 3rem;
            }
            .crm-subtitle {
                font-size: 1.4rem;
            }
            .crm-desc {
                font-size: 1rem;
            }
            .crm-quote {
                font-size: 1.1rem;
            }
            .login-heading {
                font-size: 1.8rem;
            }
            .login-box {
                padding: 2.5rem 2rem;
            }
            .crm-logo {
                width: 70px;
                height: 70px;
            }
        }


        @media screen and (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .left {
            width: 100%;
            clip-path: none; /* Remove clip-path on smaller screens */
            padding: 3rem 1.5rem;
            min-height: 250px; /* Ensure some height */
          }

          .right {
            width: 100%;
            padding: 2rem 1.5rem;
          }

          .login-box {
            max-width: 400px; /* Adjust max-width for mobile */
            margin: 0 auto; /* Center the form */
            padding: 2rem 1.5rem;
          }

          .crm-title {
            font-size: 2.8rem;
          }

          .crm-subtitle {
            font-size: 1.3rem;
          }

          .crm-desc {
            font-size: 0.95rem;
            max-width: 90%;
          }
          .crm-quote {
            font-size: 1rem;
            padding-left: 0.8rem;
          }
          .login-heading {
            font-size: 1.6rem;
          }
          .crm-logo {
            width: 60px;
            height: 60px;
          }
        }

        @media screen and (max-width: 480px) {
            .login-box {
                padding: 1.5rem 1rem;
            }
            .login-heading {
                font-size: 1.4rem;
            }
            .input-group {
                padding: 0.6rem 0.8rem;
            }
            .input-group input {
                font-size: 0.9rem;
            }
            .options {
                flex-direction: column; /* Stack options vertically */
                align-items: flex-start;
                margin-bottom: 1rem;
            }
            .forgot-password {
                margin-top: 0.5rem;
            }
            .login-btn {
                font-size: 1rem;
                padding: 0.8rem 0;
            }
            .crm-title {
                font-size: 2.2rem;
            }
            .crm-subtitle {
                font-size: 1.1rem;
            }
            .crm-desc {
                font-size: 0.85rem;
            }
            .crm-logo {
                width: 50px;
                height: 50px;
            }
                
        }
             .developer-login-container {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb; /* light gray */
}

.developer-login-button {
  width: 100%;
  height: 48px;
  border: 2px solid #334155; /* slate-700 */
  color: #334155;
  background-color: transparent;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.developer-login-button:hover {
  background-color: #334155;
  color: white;
  transform: scale(1.02);
}

.icon {
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
}

           
      `}</style>
    </>
  );
};

export default Login;