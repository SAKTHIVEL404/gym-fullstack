import axios from 'axios';

const API_URL = 'http://localhost:8080/api/categories';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllCategories = () => {
  return axios.get(API_URL);
};

export const getCategoryById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createCategory = (categoryData) => {
  return axios.post(API_URL, categoryData, getAuthHeaders());
};

export const updateCategory = (id, categoryData) => {
  return axios.put(`${API_URL}/${id}`, categoryData, getAuthHeaders());
};

export const deleteCategory = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};