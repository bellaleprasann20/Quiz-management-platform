// frontend/src/services/attemptService.js
import api from './api';

const attemptService = {
  startAttempt: async (quizId) => {
    const response = await api.post(`/attempts/start`, { quiz_id: quizId });
    return response.data;
  },

  submitAttempt: async (attemptId, submissionData) => {
    const response = await api.post(`/attempts/${attemptId}/submit`, submissionData);
    return response.data;
  },

  getMyHistory: async () => {
    const response = await api.get('/attempts/history/me');
    return response.data;
  },

  getAttemptDetails: async (attemptId) => {
    const response = await api.get(`/attempts/${attemptId}`);
    return response.data;
  }
};

export default attemptService;