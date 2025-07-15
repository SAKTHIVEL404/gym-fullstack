
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.error('No refresh token available');
        return null;
      }
      console.log('Attempting to refresh token with:', refreshToken);
      const response = await authAPI.refresh(refreshToken);
      if (response.data.success) {
        const { token, refreshToken: newRefreshToken, user } = response.data.data;
        localStorage.setItem('token', token);
        if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
        setUser(user);
        setIsAuthenticated(true);
        console.log('Token refreshed successfully:', token);
        return token;
      }
      throw new Error(response.data.error || 'Failed to refresh token');
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return null;
    }
  }, [navigate]);

  const validateToken = useCallback(
    async (token) => {
      try {
        if (!token) throw new Error('No token provided');
        console.log('Validating token:', token);

        // Decode token to check expiration and role
        let decoded;
        try {
          decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            console.log('Token expired, attempting refresh');
            const newToken = await refreshToken();
            if (!newToken) throw new Error('Token refresh failed');
            token = newToken;
          }
          if (decoded.role !== 'ADMIN' && decoded.role !== 'ROLE_ADMIN' && window.location.pathname.startsWith('/admin')) {
            throw new Error('Access denied. Admin privileges required.');
          }
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          throw new Error('Invalid token');
        }

        // Validate with API
        const response = await authAPI.validateToken(token);
        if (!response.data.success) throw new Error(response.data.error || 'Token validation failed');
        console.log('Validation response:', response.data);
        setUser(response.data.data);
        setIsAuthenticated(true);
        if (response.data.data.role === 'ADMIN' && window.location.pathname === '/login') {
          navigate('/admin/users');
        } else if (window.location.pathname === '/login') {
          navigate('/shop');
        }
      } catch (error) {
        console.error('Token validation error:', error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setIsAuthenticated(false);
        toast.error(error.message === 'Access denied. Admin privileges required.' ? error.message : 'Session expired or invalid token. Please login again.');
        if (error.message === 'Access denied. Admin privileges required.') {
          navigate('/access-denied');
        } else {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate, refreshToken]
  );

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
