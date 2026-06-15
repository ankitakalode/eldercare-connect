import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('eldercare_user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Service APIs
export const serviceAPI = {
  getAll: () => API.get('/services'),
  getById: (id) => API.get(`/services/${id}`),
};

// Caregiver APIs
export const caregiverAPI = {
  getAll: (params) => API.get('/caregivers', { params }),
  getById: (id) => API.get(`/caregivers/${id}`),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my'),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
};

// Admin APIs
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getBookings: () => API.get('/admin/bookings'),
  updateBookingStatus: (id, status) => API.put(`/admin/bookings/${id}`, { status }),
  getCaregivers: () => API.get('/admin/caregivers'),
  createCaregiver: (data) => API.post('/caregivers', data),
  updateCaregiver: (id, data) => API.put(`/caregivers/${id}`, data),
  deleteCaregiver: (id) => API.delete(`/caregivers/${id}`),
};

export default API;
