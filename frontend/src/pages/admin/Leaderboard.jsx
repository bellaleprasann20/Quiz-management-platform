// frontend/src/pages/admin/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch real leaderboard data from the backend
        // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/leaderboard/global?limit=20`);
        setLeaders(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Leaderboard</h1>
          <p className="text-slate-500">Top performing students across all quizzes.</p>
        </div>
        <select className="bg-white border border-slate-200 text-sm font-medium rounded-lg px-4 py-2 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500">
          <option>All-Time</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4 w-24 text-center">Rank</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4 text-center">Quizzes Taken</th>
              <th className="px-6 py-4 text-right">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                  Loading leaderboard...
                </td>
              </tr>
            ) : leaders.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  No quizzes have been completed yet. Check back later!
                </td>
              </tr>
            ) : (
              leaders.map((student, index) => {
                const rank = index + 1;
                return (
                  <tr key={student.id || index} className={`transition-colors ${rank <= 3 ? 'bg-amber-50/10' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {rank === 1 ? <Trophy className="w-6 h-6 text-amber-500" /> : 
                         rank === 2 ? <Medal className="w-6 h-6 text-slate-400" /> : 
                         rank === 3 ? <Award className="w-6 h-6 text-amber-700" /> : 
                         <span className="font-bold text-slate-400">#{rank}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 uppercase">
                          {(student.username || student.name || 'S').charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{student.username || student.name}</p>
                          <p className="text-xs text-slate-500 font-normal">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {student.quizzes_taken !== undefined ? student.quizzes_taken : 0}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      {student.total_score !== undefined ? student.total_score : 0} pts
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;