import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bookings';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUserBookings = () => {
  return axios.get(`${API_URL}/user`, getAuthHeaders());
};

export const getAllBookings = () => {
  return axios.get(API_URL, getAuthHeaders());
};

export const updateBookingStatus = (id, status) => {
  return axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeaders());
};