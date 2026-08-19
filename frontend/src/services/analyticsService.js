// frontend/src/services/analyticsService.js
import api from './api';

const analyticsService = {
  getAdminStats: async () => {
    const response = await api.get('/analytics/admin/overview');
    return response.data;
  },

  getStudentStats: async () => {
    const response = await api.get('/analytics/student/me');
    return response.data;
  }
};

export default analyticsService;