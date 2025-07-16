import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllProducts = (params) => {
  return axios.get(API_URL, { params });
};

export const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getProductsByCategory = (categoryId) => {
  return axios.get(`${API_URL}/category/${categoryId}`);
};

export const createProduct = (productData) => {
  return axios.post(API_URL, productData, getAuthHeaders());
};

export const updateProduct = (id, productData) => {
  return axios.put(`${API_URL}/${id}`, productData, getAuthHeaders());
};

export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};