import React, { useEffect, useState } from 'react';
import { Clock, FileQuestion, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

// 1. Correctly import the default service
import quizService from '../../services/quizService';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the real quiz data on load
  useEffect(() => {
    setIsLoading(true);
    quizService.getQuizById(id)
      .then((data) => {
        setQuiz(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load quiz details. It may have been removed.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader fullScreen text="Loading quiz details..." />;
  
  if (error || !quiz) {
    return (
      <div className="p-8 text-center mt-10">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">{error || "Quiz not found"}</h2>
        <Button variant="outline" onClick={() => navigate('/student/quizzes')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20"></div>
          {quiz.category && (
            <span className="relative z-10 text-xs font-bold text-indigo-300 bg-indigo-900/50 px-3 py-1 rounded-full mb-4 inline-block">
              {quiz.category.name || 'General'}
            </span>
          )}
          <h1 className="relative z-10 text-3xl font-bold text-white mb-4">{quiz.title}</h1>
          <p className="relative z-10 text-slate-300 text-sm max-w-lg mx-auto">
            {quiz.description}
          </p>
        </div>

        {/* Info & Rules */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Duration</p>
                <p className="text-lg font-bold text-slate-900">{quiz.duration} Minutes</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Passing Score</p>
                <p className="text-lg font-bold text-slate-900">{quiz.passing_score}%</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Instructions
            </h3>
            <ul className="space-y-3">
              {[
                "You cannot pause the quiz once it has started.",
                "Navigating away from the page will automatically submit your quiz.",
                "Each question carries equal weight with no negative marking.",
                `A minimum of ${quiz.passing_score}% is required to pass this assessment.`
              ].map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <Link to="/student/quizzes">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Link to={`/student/quizzes/${id}/attempt`}>
              <Button variant="primary" size="lg">Start Assessment Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;