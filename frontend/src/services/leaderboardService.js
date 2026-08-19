// frontend/src/services/leaderboardService.js
import api from './api';

const leaderboardService = {
  getGlobalLeaderboard: async (limit = 10) => {
    // FIX APPLIED: Added /api/v1 to the route
    const response = await api.get(`/api/v1/leaderboard/global?limit=${limit}`);
    return response.data;
  },

  getQuizLeaderboard: async (quizId, limit = 10) => {
    // FIX APPLIED: Added /api/v1 to the route
    const response = await api.get(`/api/v1/leaderboard/quiz/${quizId}?limit=${limit}`);
    return response.data;
  }
};

export default leaderboardService;