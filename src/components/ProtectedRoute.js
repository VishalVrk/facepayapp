import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase"; // Import your Firebase auth instance

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const user = auth.currentUser; // Check if the user is authenticated

  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;