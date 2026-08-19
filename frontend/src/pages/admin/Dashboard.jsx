// frontend/src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, CheckCircle, TrendingUp, Activity, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';

const StatCard = ({ title, value, trend, icon: Icon, colorClass, isLoading }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900">
        {isLoading ? <span className="animate-pulse text-slate-300">...</span> : value}
      </h3>
      <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
        <TrendingUp className="w-4 h-4" /> {trend}
      </p>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
      <Icon className="w-7 h-7" />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, quizzes: 0, attempts: 0, avgScore: 0 });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Make one single call to your powerful new backend endpoint!
        // Make sure you include auth headers if your admin route is protected
        const token = localStorage.getItem('token'); 
        
        // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/analytics/admin`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = res.data;

        setStats({
          users: data.total_users,
          quizzes: data.total_quizzes,
          attempts: data.total_attempts,
          avgScore: data.average_score 
        });

        // Set the dynamic recent activity table!
        setRecentAttempts(data.recent_activity || []);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Here's what's happening on your platform today.</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/quizzes/new')}>
          Create New Quiz
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.users} 
          trend="Platform total" 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Active Quizzes" 
          value={stats.quizzes} 
          trend="Live assessments" 
          icon={FileText} 
          colorClass="bg-indigo-50 text-indigo-600" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Total Attempts" 
          value={stats.attempts} 
          trend="Submitted tests" 
          icon={CheckCircle} 
          colorClass="bg-emerald-50 text-emerald-600" 
          isLoading={isLoading} 
        />
        <StatCard 
          title="Avg. Score" 
          value={`${stats.avgScore}%`} 
          trend="Global average" 
          icon={Activity} 
          colorClass="bg-violet-50 text-violet-600" 
          isLoading={isLoading} 
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Recent Quiz Attempts</h2>
          {isLoading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Quiz</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    Loading recent activity...
                  </td>
                </tr>
              ) : recentAttempts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No recent quiz attempts found.
                  </td>
                </tr>
              ) : (
                recentAttempts.map((attempt, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{attempt.student_name}</td>
                    <td className="px-6 py-4">{attempt.quiz_title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        attempt.score >= 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {attempt.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{attempt.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;