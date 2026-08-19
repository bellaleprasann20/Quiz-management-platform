import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, XCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

import attemptService from '../../services/attemptService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { calculatePercentage } from '../../utils/helpers';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const attemptId = location.state?.attemptId;

  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!attemptId) {
      navigate('/student/quizzes', { replace: true });
      return;
    }

    attemptService.getAttemptDetails(attemptId)
      .then((data) => {
        setResultData(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load your quiz results. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, [attemptId, navigate]);

  if (isLoading) return <Loader fullScreen text="Calculating your score..." />;

  if (error || !resultData) {
    return (
      <div className="p-8 text-center mt-10">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2>
        <Button variant="outline" onClick={() => navigate('/student/quizzes')}>Back to Dashboard</Button>
      </div>
    );
  }

  // FIXED: Changed total_questions to total to match the FastAPI backend perfectly
  const score = resultData.score || 0;
  const totalQuestions = resultData.total || 0; 
  
  // Guard against divide-by-zero if a quiz has no questions
  const percentage = totalQuestions > 0 ? calculatePercentage(score, totalQuestions) : 0;
  
  const passingScore = 60; // Default passing threshold
  const isPassed = percentage >= passingScore;

  // NEW: Dynamically calculate time taken using the start_time and end_time from the database
  let timeTaken = '< 1';
  if (resultData.start_time && resultData.end_time) {
    const start = new Date(resultData.start_time);
    const end = new Date(resultData.end_time);
    const diffMinutes = Math.round((end - start) / 60000);
    if (diffMinutes > 0) {
      timeTaken = diffMinutes.toString();
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Dynamic Header based on Pass/Fail */}
        <div className={`px-8 py-12 text-center relative overflow-hidden ${
          isPassed ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          
          <div className="relative z-10 w-24 h-24 mx-auto bg-white rounded-full p-2 mb-6 shadow-lg">
            <div className={`w-full h-full rounded-full flex items-center justify-center border-4 ${
              isPassed ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-rose-100 bg-rose-50 text-rose-600'
            }`}>
              {isPassed ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>
          </div>
          
          <h1 className="relative z-10 text-3xl font-bold text-white mb-2">
            {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="relative z-10 text-white/80">
            {isPassed 
              ? 'You have successfully passed this assessment.' 
              : 'You did not meet the minimum requirement this time.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <p className="text-sm font-medium text-slate-500 mb-1">Final Score</p>
              <p className={`text-3xl font-black ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {percentage}%
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <p className="text-sm font-medium text-slate-500 mb-1">Questions Right</p>
              <p className="text-3xl font-black text-slate-800">
                {score} <span className="text-lg text-slate-400 font-medium">/ {totalQuestions}</span>
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Time Taken
              </p>
              <p className="text-xl font-bold text-slate-800">
                {timeTaken} min
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-4 mb-8">
            <CheckCircle2 className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">What's Next?</h4>
              <p className="text-sm text-indigo-700/80">
                Your results have been saved to your attempt history. You can review your performance trends in the Analytics dashboard.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/student/history" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                View History
              </Button>
            </Link>
            <Link to="/student/quizzes" className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                Take Another Quiz <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;