// frontend/src/services/quizService.js
import api from './api';

const quizService = {
  // Now accepts a params object to handle search, category, and difficulty simultaneously
  getQuizzes: async (params = {}) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get('/api/v1/quizzes/', { params });
    return response.data;
  },

  getQuizById: async (id) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get(`/api/v1/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (quizData) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.post('/api/v1/quizzes/', quizData);
    return response.data;
  },

  updateQuiz: async (id, quizData) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.put(`/api/v1/quizzes/${id}`, quizData);
    return response.data;
  },

  deleteQuiz: async (id) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.delete(`/api/v1/quizzes/${id}`);
    return response.data;
  }
};

export default quizService;