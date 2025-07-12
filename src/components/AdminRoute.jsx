// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const AdminRoute = () => {
  const { isAuthenticated, isStaff } = useAuthStore();

  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (!isStaff) {
    // If logged in but not staff, redirect to home
    return <Navigate to="/" />;
  }

  // If logged in and is staff, render the child component
  return <Outlet />;
};

export default AdminRoute;