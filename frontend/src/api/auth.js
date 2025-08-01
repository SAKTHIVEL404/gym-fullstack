import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const validateToken = (token) => {
  return axios.get(`${API_URL}/validate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};