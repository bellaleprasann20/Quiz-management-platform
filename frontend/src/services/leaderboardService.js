// frontend/src/services/leaderboardService.js
import api from './api';

const leaderboardService = {
  getGlobalLeaderboard: async (limit = 10) => {
    const response = await api.get(`/leaderboard/global?limit=${limit}`);
    return response.data;
  },

  getQuizLeaderboard: async (quizId, limit = 10) => {
    const response = await api.get(`/leaderboard/quiz/${quizId}?limit=${limit}`);
    return response.data;
  }
};

export default leaderboardService;