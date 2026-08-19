// frontend/src/context/QuizContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // Stores { questionId: optionId }
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'in-progress' | 'submitted'

  // Initialize a new quiz session
  const startQuiz = useCallback((quizData) => {
    setActiveQuiz(quizData);
    setAnswers({});
    setTimeRemaining(quizData.time_limit_minutes * 60); // Convert to seconds
    setStatus('in-progress');
  }, []);

  // Record an answer selection
  const selectAnswer = useCallback((questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  }, []);

  // Update timer (intended to be called by a setInterval in the UI component)
  const tickTimer = useCallback(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        submitQuiz(); // Auto-submit when time runs out
        return 0;
      }
      return prev - 1;
    });
  }, []);

  // Finalize and clear the session
  const submitQuiz = useCallback(async () => {
    setStatus('submitted');
    
    // TODO: Send data to FastAPI backend
    // await api.post(`/quizzes/${activeQuiz.id}/submit`, { answers });

    const payload = {
      quizId: activeQuiz?.id,
      answers,
      timeRemaining
    };
    
    console.log("Submitting quiz attempt:", payload);
    return payload; 
  }, [activeQuiz, answers, timeRemaining]);

  const clearQuizSession = useCallback(() => {
    setActiveQuiz(null);
    setAnswers({});
    setTimeRemaining(null);
    setStatus('idle');
  }, []);

  const value = {
    activeQuiz,
    answers,
    timeRemaining,
    status,
    startQuiz,
    selectAnswer,
    tickTimer,
    submitQuiz,
    clearQuizSession
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};