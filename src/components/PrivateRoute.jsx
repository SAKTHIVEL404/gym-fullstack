import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading, validateToken, refreshToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await validateToken();
        if (!isValid) {
          if (!isAuthenticated || !user) {
            console.log('Redirecting to /login due to unauthenticated or no user');
            window.location.href = '/login';
          } else if (requiredRole && user?.role !== requiredRole) {
            console.log('Redirecting to / due to role mismatch:', user?.role, requiredRole);
            window.location.href = '/';
          }
          return false;
        }
        return true;
      } catch (error) {
        console.error('Auth validation failed:', error);
        return false;
      }
    };

    checkAuth();
  }, [user, isAuthenticated, requiredRole, validateToken, location]);

  // Only show loading spinner for non-admin routes
  if (loading && !window.location.pathname.startsWith('/admin')) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
      </div>
    );
  }

  // If we're here, auth is valid - return children immediately
  return children;
};

export default PrivateRoute;