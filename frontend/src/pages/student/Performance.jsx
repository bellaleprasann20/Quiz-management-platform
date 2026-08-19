import React, { useEffect, useState } from 'react';
import { TrendingUp, Award, Target, Zap, AlertCircle } from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const Performance = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching REAL data from the backend. No fake stats allowed!
    analyticsService.getStudentStats()
      .then(setStats)
      .catch((err) => {
        console.error(err);
        setError("Could not load your performance data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader fullScreen text="Analyzing your performance..." />;

  if (error || !stats) {
    return (
      <div className="p-8 text-center mt-10">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2>
        <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }

  // Map the real backend data (with safe fallbacks)
  const averageScore = stats.average_score || 0;
  const totalQuizzes = stats.total_quizzes_taken || 0;
  const totalXp = stats.total_xp || 0;
  
  // If your backend doesn't send these yet, they will gracefully default
  const globalRank = stats.rank || null; 
  const proficiencies = stats.proficiencies || []; 

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-200 text-white">
          <Award className="w-8 h-8 text-indigo-300 mb-4" />
          <p className="text-indigo-100 text-sm mb-1">Average Score</p>
          <h2 className="text-3xl font-bold">{averageScore}%</h2>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <Target className="w-8 h-8 text-emerald-500 mb-4" />
          <p className="text-slate-500 text-sm mb-1">Quizzes Taken</p>
          <h2 className="text-3xl font-bold text-slate-900">{totalQuizzes}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <Zap className="w-8 h-8 text-amber-500 mb-4" />
          <p className="text-slate-500 text-sm mb-1">Total XP</p>
          <h2 className="text-3xl font-bold text-slate-900">{totalXp}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <TrendingUp className="w-8 h-8 text-blue-500 mb-4" />
          <p className="text-slate-500 text-sm mb-1">Global Rank</p>
          <h2 className="text-3xl font-bold text-slate-900">
            {globalRank ? `#${globalRank}` : 'N/A'}
          </h2>
        </div>
      </div>

      {/* Category Breakdown */}
      {proficiencies.length > 0 ? (
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Subject Proficiency</h2>
          <div className="space-y-6 max-w-3xl">
            {proficiencies.map((item, idx) => {
              // Cycle through colors based on index for the UI pop
              const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500'];
              const barColor = colors[idx % colors.length];

              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-700">{item.subj || item.name}</span>
                    <span className="text-slate-900">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div 
                      className={`${barColor} h-2.5 rounded-full transition-all duration-1000`} 
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 lg:p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Subject Proficiency</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Take some quizzes in different categories to see your breakdown here. Your real performance data will appear automatically!
          </p>
        </div>
      )}
    </div>
  );
};

export default Performance;