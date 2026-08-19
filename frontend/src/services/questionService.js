// frontend/src/services/questionService.js
import api from './api';

const questionService = {
  getQuestionsByQuiz: async (quizId) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.get(`/api/v1/quizzes/${quizId}/questions`);
    return response.data;
  },

  createQuestion: async (quizId, questionData) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.post(`/api/v1/quizzes/${quizId}/questions`, questionData);
    return response.data;
  },

  updateQuestion: async (questionId, questionData) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.put(`/api/v1/questions/${questionId}`, questionData);
    return response.data;
  },

  deleteQuestion: async (questionId) => {
    // FIX APPLIED: Added /api/v1
    const response = await api.delete(`/api/v1/questions/${questionId}`);
    return response.data;
  }
};

export default questionService;