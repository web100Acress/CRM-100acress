import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFoundDesktop = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-gray-500">
            Path: <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          
          <div className="text-sm text-gray-500">
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

export default NotFoundDesktop;
