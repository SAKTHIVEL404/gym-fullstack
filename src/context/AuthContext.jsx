
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import api from '../services/api'; // Import default export
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
        // Try to get a new refresh token from the server
        const loginResponse = await authAPI.login({
          email: localStorage.getItem('user_email'),
          password: localStorage.getItem('user_password')
        });
        if (loginResponse.data.success) {
          const { token, refreshToken: newRefreshToken, user } = loginResponse.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refresh_token', newRefreshToken);
          setUser(user);
          setIsAuthenticated(true);
          console.log('New token obtained:', token);
          return token;
        }
        throw new Error('Failed to obtain new token');
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
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_password');
      setUser(null);
      setIsAuthenticated(false);
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return null;
    }
  }, [navigate]);

  const validateToken = useCallback(
    async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          console.log('No token in storage');
          return false;
        }
        console.log('Validating token:', token);

        // Decode token to check expiration and role
        let decoded;
        try {
          decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);
          const currentTime = Date.now() / 1000;
          
          // Only refresh token if it's about to expire (within 5 minutes)
          if (decoded.exp && decoded.exp - 300 < currentTime) { // 300 seconds = 5 minutes
            console.log('Token near expiration, attempting refresh');
            const newToken = await refreshToken();
            if (!newToken) {
              // Try to get a new token by logging in
              const email = localStorage.getItem('user_email');
              const password = localStorage.getItem('user_password');
              if (email && password) {
                const loginResponse = await authAPI.login({
                  email,
                  password
                });
                if (loginResponse.data.success) {
                  const { token, refreshToken } = loginResponse.data.data;
                  localStorage.setItem('token', token);
                  localStorage.setItem('refresh_token', refreshToken);
                  return true;
                }
              }
              throw new Error('Token refresh failed');
            }
            token = newToken;
            localStorage.setItem('token', token); // Update storage with new token
          }

          // Check admin role only for admin routes
          if (window.location.pathname.startsWith('/admin')) {
            if (decoded.role !== 'ADMIN' && decoded.role !== 'ROLE_ADMIN') {
              throw new Error('Access denied. Admin privileges required.');
            }
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
        
        // Only redirect if we're on the login page
        if (window.location.pathname === '/login') {
          if (response.data.data.role === 'ADMIN' || response.data.data.role === 'ROLE_ADMIN') {
            navigate('/admin/users');
          } else {
            navigate('/shop');
          }
        }
        return true;
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_password');
        setUser(null);
        setIsAuthenticated(false);
        toast.error(error.message);
        if (error.message === 'Access denied. Admin privileges required.') {
          navigate('/access-denied');
        } else {
          navigate('/login');
        }
        return false;
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
          
          // Store tokens and user info
          localStorage.setItem('token', token);
          if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
          localStorage.setItem('user_email', credentials.email);
          localStorage.setItem('user_password', credentials.password);
          
          // Update auth state
          setUser(user);
          setIsAuthenticated(true);
          
          // Validate token immediately
          const isValid = await validateToken();
          if (!isValid) {
            throw new Error('Token validation failed after login');
          }
          
          toast.success('Login successful!');
          navigate(user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN' ? '/admin/users' : '/shop');
          return { success: true };
        }
        throw new Error(response.data.error || 'Login failed');
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        // Clean up on failure
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_password');
        setUser(null);
        setIsAuthenticated(false);
        toast.error(error.response?.data?.message || 'Login failed');
        return { success: false, error: error.response?.data?.message };
      }
    },
    [navigate, validateToken]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  const register = useCallback(async (userData) => {
    try {
      console.log('Sending registration request with data:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      if (response.data.success) {
        return { 
          success: true,
          message: response.data.data || 'Registration successful! Please log in.'
        };
      }
      
      throw new Error(response.data.error || 'Registration failed');
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Registration failed. Please check your details and try again.';
      
      throw new Error(errorMessage);
    }
  }, []);

  const value = { 
    user, 
    isAuthenticated, 
    loading, 
    login, 
    logout, 
    register, 
    refreshToken, 
    validateToken 
  };

  return (
    <AuthContext.Provider value={value}>
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
