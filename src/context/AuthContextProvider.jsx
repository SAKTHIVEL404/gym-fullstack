
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, api } from '../services/api';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// AuthProvider is now deprecated. Use AuthContext.jsx instead.
// export const AuthProvider = () => null;

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token check:', token);
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
      setIsAuthenticated(false);
      if (window.location.pathname.startsWith('/admin')) {
        navigate('/login');
      }
    }
  }, [validateToken, navigate]);

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await authAPI.login(credentials);
        console.log('Login response:', JSON.stringify(response.data, null, 2));
        if (response.data.success) {
          const { token, refreshToken, user } = response.data.data;
          if (!token) throw new Error('No token received from server');
          localStorage.setItem('token', token);
          if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
          setUser(user);
          setIsAuthenticated(true);
          toast.success('Login successful!');
          navigate(user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN' ? '/admin/users' : '/shop');
          return { success: true };
        }
        throw new Error(response.data.error || 'Login failed');
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Login failed');
        return { success: false, error: error.response?.data?.message };
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  const value = { user, isAuthenticated, loading, login, logout, refreshToken, validateToken };

  return (
    <AuthProvider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
