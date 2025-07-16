import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sessions';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllSessions = () => {
  return axios.get(API_URL);
};

export const getSessionById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getUpcomingSessions = () => {
  return axios.get(`${API_URL}/upcoming`);
};

export const bookSession = (id, bookingData) => {
  return axios.post(`${API_URL}/${id}/book`, bookingData, getAuthHeaders());
};

export const createSession = (sessionData) => {
  return axios.post(API_URL, sessionData, getAuthHeaders());
};

export const updateSession = (id, sessionData) => {
  return axios.put(`${API_URL}/${id}`, sessionData, getAuthHeaders());
};

export const deleteSession = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};