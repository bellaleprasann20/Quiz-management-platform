// frontend/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// FIXED: Import your actual Auth Context
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  
  // FIXED: Pull the REAL user data and loading state from your context
  const { user, isAuthenticated, isLoading } = useAuth();

  // If the context is still verifying the token, wait for a second
  // so we don't accidentally redirect a valid user to the login screen.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 1. If the user is not logged in, redirect them to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 2. Check if the route requires a specific role.
  // Because your backend role might be 'admin' but the frontend expects 'ADMIN', 
  // we use .toLowerCase() to make it case-insensitive and prevent mismatches.
  if (allowedRoles && user?.role) {
    const hasRole = allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase());
    if (!hasRole) {
       return <Navigate to="/unauthorized" replace />;
    }
  }

  // 3. If everything is valid, render the child routes (the Outlet).
  return <Outlet />;
};

export default ProtectedRoute;