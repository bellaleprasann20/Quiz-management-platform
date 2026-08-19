// frontend/src/hooks/useQuiz.js
import { useQuiz as useQuizContext } from '../context/QuizContext';

/**
 * Custom hook to access the active quiz session state.
 * Provides: activeQuiz, answers, status, startQuiz, selectAnswer, submitQuiz, clearQuizSession
 */
export const useQuiz = () => {
  return useQuizContext();
};

export default useQuiz;