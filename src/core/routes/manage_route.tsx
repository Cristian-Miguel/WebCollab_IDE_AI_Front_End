import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../feature/auth/hook/use_auth';

interface ProtectedRouteProps {
  requiredRole?: string; 
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();

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
    const { isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};