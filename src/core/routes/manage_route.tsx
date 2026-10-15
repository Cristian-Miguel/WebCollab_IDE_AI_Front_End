import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../feature/auth/hook/use_auth';

interface ProtectedRouteProps {
  requiredRole?: string; 
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <Box className="route-loading"><CircularProgress aria-label="Restaurando sesión" /></Box>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

/**
 * Componente que protege las rutas públicas (Login, Register).
 * Si el usuario ya está autenticado, lo redirige al dashboard.
 */
export const PublicRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Box className="route-loading"><CircularProgress aria-label="Restaurando sesión" /></Box>;
    }

    const allowAuthenticated = location.pathname.startsWith('/validate-email') ||
      location.pathname.startsWith('/forgot-password');
    if (isAuthenticated && !allowAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};