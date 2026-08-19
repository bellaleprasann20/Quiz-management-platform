// frontend/src/services/quizService.js
import api from './api';

const quizService = {
  // Now accepts a params object to handle search, category, and difficulty simultaneously
  getQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes/', { params });
    return response.data;
  },

  getQuizById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (quizData) => {
    const response = await api.post('/quizzes/', quizData);
    return response.data;
  },

  updateQuiz: async (id, quizData) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  }
};

export default quizService;