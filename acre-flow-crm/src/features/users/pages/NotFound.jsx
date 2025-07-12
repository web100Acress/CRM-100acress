import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <style>{`
        .notfound-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8fafc;
          padding: 20px;
          animation: fadeIn 0.4s ease-in-out;
        }

        .notfound-box {
          text-align: center;
          max-width: 400px;
          background-color: #ffffff;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .notfound-box:hover {
          transform: translateY(-4px);
        }

        .notfound-icon {
          margin-bottom: 20px;
        }

        .icon {
          width: 60px;
          height: 60px;
          color: #dc2626;
        }

        .notfound-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .notfound-subtitle {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .notfound-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .notfound-button:hover {
          background-color: #1d4ed8;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="notfound-container">
        <div className="notfound-box">
          <div className="notfound-icon">
            <svg
              className="icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4.5c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="notfound-title">404</h1>
          <p className="notfound-subtitle">Sorry, the page you're looking for doesn't exist.</p>
          <Link to="/" className="notfound-button">
            Go to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
