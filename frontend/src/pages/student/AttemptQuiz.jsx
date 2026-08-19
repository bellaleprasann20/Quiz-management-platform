import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import useTimer from '../../hooks/useTimer';

const AttemptQuiz = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]); // Store questions separately!
  const [attemptId, setAttemptId] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Fetch the basic Quiz details (Title, Time Limit, etc.)
        const quizRes = await axios.get(`http://127.0.0.1:8000/api/v1/quizzes/${quizId}`, config);
        setQuiz(quizRes.data);

        // 2. Fetch the SECURE randomized questions for this specific attempt!
        const questionsRes = await axios.get(`http://127.0.0.1:8000/api/v1/questions/quiz/${quizId}/take`, config);
        setQuestions(questionsRes.data);

        // 3. Tell the backend we are starting an attempt (Requires your attempts backend!)
        const attemptRes = await axios.post(`http://127.0.0.1:8000/api/v1/attempts/start`, { quiz_id: parseInt(quizId) }, config);
        setAttemptId(attemptRes.data.id); 

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to start the quiz. Make sure your backend attempts route is running!");
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuiz();
  }, [quizId]);

  const handleSubmit = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
        question_id: parseInt(qId),
        selected_option_id: parseInt(oId)
      }));

      // Submit the answers to be graded!
      await axios.post(
        `http://127.0.0.1:8000/api/v1/attempts/${attemptId}/submit`, 
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      navigate(`/student/quizzes/${quizId}/result`, { state: { attemptId } });
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit the quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const { formattedTime, isWarning, start } = useTimer(
    quiz?.time_limit ? quiz.time_limit * 60 : 900, 
    () => {
      alert("Time is up! Auto-submitting your quiz.");
      handleSubmit();
    }
  );

  useEffect(() => {
    if (!isLoading && !error && quiz) {
      start();
    }
  }, [isLoading, error, quiz, start]);

  if (isLoading) return <Loader fullScreen text="Preparing your assessment..." />;
  
  if (error || !quiz) {
    return (
      <div className="p-8 text-center mt-10">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2>
        <Button variant="outline" onClick={() => navigate('/student/quizzes')}>Back to Quizzes</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];
  const progress = ((currentQIndex + 1) / questions.length) * 100;

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center mt-10">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Questions Found</h2>
        <p className="text-slate-500 mb-4">This quiz hasn't been fully set up by the admin yet.</p>
        <Button variant="outline" onClick={() => navigate('/student/quizzes')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      
      {/* Quiz Header Area (Sticky) */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 sticky top-20 z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full">
          <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
            <span>Question {currentQIndex + 1} of {questions.length}</span>
            <span className="text-indigo-600">{Math.round(progress)}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold shrink-0 border shadow-inner transition-colors ${
          isWarning ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200'
        }`}>
          <Clock className="w-5 h-5" />
          {formattedTime}
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-24">
        <h2 className="text-xl md:text-2xl font-medium text-slate-900 mb-8 leading-relaxed">
          <span className="font-bold text-slate-400 mr-3">{currentQIndex + 1}.</span>
          {currentQuestion?.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion?.options?.map((opt) => {
            const isSelected = answers[currentQuestion.id] === opt.id;
            return (
              <label 
                key={opt.id} 
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm shadow-indigo-100' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-indigo-600' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                </div>
                <input 
                  type="radio" 
                  name={`question_${currentQuestion.id}`}
                  className="hidden"
                  checked={isSelected}
                  onChange={() => {
                    setAnswers(prev => ({
                      ...prev,
                      [currentQuestion.id]: opt.id
                    }));
                  }}
                />
                <span className={`text-base font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {opt.text}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation (Fixed) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button 
            variant="outline" 
            disabled={currentQIndex === 0 || isSubmitting}
            onClick={() => setCurrentQIndex(prev => prev - 1)}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </Button>
          
          {currentQIndex < questions.length - 1 ? (
            <Button 
              variant="primary" 
              onClick={() => setCurrentQIndex(prev => prev + 1)}
            >
              Next Question <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-200"
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;