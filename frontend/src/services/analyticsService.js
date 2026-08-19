// frontend/src/services/analyticsService.js
import api from './api';

const analyticsService = {
  getAdminStats: async () => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get('/api/v1/analytics/admin/overview');
    return response.data;
  },

  getStudentStats: async () => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get('/api/v1/analytics/student/me');
    return response.data;
  }
};

export default analyticsService;