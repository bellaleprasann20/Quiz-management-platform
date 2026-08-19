import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, ChevronRight, History as HistoryIcon, AlertCircle } from 'lucide-react';

import attemptService from '../../services/attemptService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { formatDateTime } from '../../utils/formatDate';
import { calculatePercentage } from '../../utils/helpers';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    attemptService.getMyHistory()
      .then((data) => {
        setHistory(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load your attempt history.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader fullScreen text="Loading your history..." />;

  if (error) {
    return (
      <div className="p-8 text-center mt-10">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
          <HistoryIcon className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Attempt History</h1>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">No attempts yet</h3>
          <p className="text-slate-500 mb-6">You haven't taken any quizzes yet. Ready to get started?</p>
          <Link to="/student/quizzes">
            <Button variant="primary">Browse Quizzes</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {history.map((attempt) => {
              
              // FIXED: Safe fallbacks for the raw backend data
              const score = attempt.score || 0;
              const total = attempt.total || 0; 
              
              // If the history endpoint doesn't return total yet, we just show the raw score
              const displayScore = total > 0 ? calculatePercentage(score, total) : score;
              
              const passingScore = 60; // Default passing threshold
              const isPassed = displayScore >= passingScore;

              // FIXED: Dynamic time calculation using database timestamps
              let timeTaken = '< 1';
              if (attempt.start_time && attempt.end_time) {
                const start = new Date(attempt.start_time);
                const end = new Date(attempt.end_time);
                const diffMinutes = Math.round((end - start) / 60000);
                if (diffMinutes > 0) {
                  timeTaken = diffMinutes.toString();
                }
              }

              return (
                <Link 
                  key={attempt.id}
                  // FIXED: Use raw quiz_id directly from the database row
                  to={`/student/quizzes/${attempt.quiz_id}/result`}
                  state={{ attemptId: attempt.id }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-1 mb-4 sm:mb-0">
                  <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
  {attempt.quiz_title || `Quiz #${attempt.quiz_id}`}
</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 
                        {/* FIXED: Using start_time instead of created_at */}
                        {formatDateTime(attempt.start_time)}
                      </span>
                      <span>•</span>
                      <span>Time taken: {timeTaken} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-500 mb-0.5">Score</p>
                      <p className={`font-bold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {displayScore}{total > 0 ? '%' : ' pts'}
                      </p>
                    </div>

                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {isPassed ? 'Passed' : 'Failed'}
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors hidden sm:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;