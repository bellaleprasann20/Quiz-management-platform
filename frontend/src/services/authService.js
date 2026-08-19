// frontend/src/services/authService.js
import api from './api';

const authService = {
  login: async (email, password) => {
    // FastAPI OAuth2PasswordRequestForm expects form-urlencoded data
    const formData = new URLSearchParams();
    formData.append('username', email); // Assuming backend uses email for login
    formData.append('password', password);

    // FIX APPLIED: Added /api/v1
    const response = await api.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (userData) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  }
};

export default authService;