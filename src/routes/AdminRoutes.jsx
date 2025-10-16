/* eslint-disable react/prop-types */
// AdminRoutes.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Check if user has admin, superAdmin, analyst, or recruiter role
  const isAdmin = user && (user.role === "admin" || user.role === "superAdmin" || user.role === "analyst" || user.role === "recruiter");
  
  // Check if user has user role
  const isUser = user && user.role === "user";

  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/auth/login" replace />;
  }

  if (isUser) {
    // If user has "user" role, show access denied page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is restricted to administrators, analysts, and recruiters only.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // If user doesn't have any of the required roles, redirect to login
    return <Navigate to="/auth/login" replace />;
  }

  // If user has admin, superAdmin, analyst, or recruiter role, render the children
  return <>{children}</>;
};

export default AdminRoutes;