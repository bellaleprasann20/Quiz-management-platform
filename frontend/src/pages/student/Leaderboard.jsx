import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, User, AlertCircle } from 'lucide-react';

// 1. Correctly import the default service
import leaderboardService from '../../services/leaderboardService';

import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    // 2. Call the correct method
    leaderboardService.getGlobalLeaderboard(20) // Fetch top 20
      .then((data) => {
        setLeaderboard(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load the leaderboard at this time.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader fullScreen text="Loading rankings..." />;

  if (error) {
    return (
      <div className="p-8 text-center mt-10">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Helper to render the correct rank badge
  const renderRankBadge = (index) => {
    if (index === 0) return <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><Trophy className="w-4 h-4" /></div>;
    if (index === 1) return <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center"><Medal className="w-4 h-4" /></div>;
    if (index === 2) return <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center"><Award className="w-4 h-4" /></div>;
    
    return (
      <div className="w-8 h-8 bg-slate-50 text-slate-400 font-bold text-sm rounded-full flex items-center justify-center border border-slate-200">
        {index + 1}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Global Leaderboard</h1>
        <p className="text-slate-500">See how you stack up against the top learners.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Table Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
          <div className="col-span-7 sm:col-span-8">Student</div>
          <div className="col-span-3 text-right">Total XP</div>
        </div>

        {/* Table Body */}
        {leaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No rankings available yet. Be the first to take a quiz!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leaderboard.map((user, index) => (
              <div 
                key={user.id || index} 
                className={`px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors ${
                  index < 3 ? 'bg-indigo-50/30' : ''
                }`}
              >
                {/* Rank */}
                <div className="col-span-2 sm:col-span-1 flex justify-center">
                  {renderRankBadge(index)}
                </div>
                
                {/* User Info */}
                <div className="col-span-7 sm:col-span-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center shrink-0 font-bold border border-indigo-200">
                    {user.username ? user.username.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${index < 3 ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {user.username || 'Anonymous User'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {user.quizzes_taken || 0} quizzes completed
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-3 flex justify-end">
                  <div className="text-right">
                    <span className="font-black text-lg text-indigo-600">{user.total_score || 0}</span>
                    <span className="text-xs font-bold text-indigo-300 ml-1">XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;