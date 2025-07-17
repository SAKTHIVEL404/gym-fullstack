import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Attaching token to request:', token, config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // Try to get a new refresh token by logging in
          const userEmail = localStorage.getItem('user_email');
          const userPassword = localStorage.getItem('user_password');
          
          if (userEmail && userPassword) {
            const loginResponse = await axios.post(
              `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/login`,
              { email: userEmail, password: userPassword }
            );

            if (loginResponse.data.success) {
              const { token, refreshToken: newRefreshToken } = loginResponse.data.data;
              localStorage.setItem('token', token);
              localStorage.setItem('refresh_token', newRefreshToken);
              
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            }
          }
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        if (refreshResponse.data.success) {
          const { token, refreshToken: newRefreshToken } = refreshResponse.data.data;
          localStorage.setItem('token', token);
          if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
        throw new Error('Token refresh failed');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_password');
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  validateToken: async (token) => {
    try {
      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        // Try to refresh token if it exists
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshResponse = await api.post('/auth/refresh', { refresh_token: refreshToken });
          if (refreshResponse.data.success) {
            const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
            localStorage.setItem('token', newToken);
            localStorage.setItem('refresh_token', newRefreshToken);
            // Retry validation with new token
            return api.get('/auth/validate', {
              headers: { Authorization: `Bearer ${newToken}` },
            });
          }
        }
      }
      throw error;
    }
  },
  refresh: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  getAllUsers: () => api.get('/users'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Sessions API
export const sessionsAPI = {
  getAll: () => api.get('/sessions'),
  getById: (id) => api.get(`/sessions/${id}`),
  book: (sessionId, bookingData) => api.post(`/sessions/${sessionId}/book`, bookingData),
  create: (sessionData) => api.post('/sessions', sessionData),
  update: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  delete: (id) => api.delete(`/sessions/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getUserBookings: () => api.get('/bookings/user'),
  getAll: () => api.get('/bookings'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

// Payment API
export const paymentAPI = {
  createOrder: (orderData) => api.post('/payments/create-order', orderData),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};

export default api;
