// frontend/src/services/userService.js
import api from './api';

const userService = {
  getUsers: async (skip = 0, limit = 100) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get(`/api/v1/users/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getUserById: async (id) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.put(`/api/v1/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  },
};

export default userService;