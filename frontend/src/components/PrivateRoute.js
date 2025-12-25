// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Если есть спиннер, иначе просто текст

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center my-5">
        <LoadingSpinner /> {/* Или просто <p>Загрузка...</p> */}
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;