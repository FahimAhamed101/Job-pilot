/* eslint-disable react/prop-types */
// AdminRoutes.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && (user.role === "admin" ||  user.role === "superAdmin");
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // If admin, render the requested admin route component
  return <>{children}</>;
};

export default AdminRoutes;
