import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFoundMobile = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="mb-6">
          <h1 className="text-7xl font-bold text-gray-300">404</h1>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-sm text-gray-600 mb-2">
            The page you're looking for doesn't exist.
          </p>
          <p className="text-xs text-gray-500">
            Path: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{location.pathname}</code>
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Go to Dashboard
          </Link>
          
          <div className="text-xs text-gray-500">
            Or{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              go to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundMobile;
