import React, { useState, useEffect } from 'react';
import { PlayCircle, Trophy, Target, Clock, ArrowRight, Loader2, Sparkles, Bot, Users, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [firstName, setFirstName] = useState('Student');
  const [isLoading, setIsLoading] = useState(true);
  
  // State to hold the real backend numbers
  const [stats, setStats] = useState({
    total_score: 0,
    quizzes_passed: 0,
    total_attempts: 0,
    time_spent_minutes: 0
  });

  // State to hold real quizzes
  const [recommendedQuizzes, setRecommendedQuizzes] = useState([]);

  useEffect(() => {
    // 1. Get the user from Local Storage
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token'); // Assuming you store the auth token here
    
    if (userString) {
      const currentUser = JSON.parse(userString);
      setFirstName(currentUser?.name?.split(' ')[0] || 'Student');
    }

    // 2. Fetch the real data from FastAPI
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch real user stats
        const statsResponse = await axios.get('http://127.0.0.1:8000/api/v1/analytics/student/me', config);
        // If the backend returns data, update the state (otherwise fallback to 0s)
        if (statsResponse.data && Object.keys(statsResponse.data).length > 0) {
           setStats(statsResponse.data);
        }

        // Fetch real quizzes for the "Recommended" section
        const quizzesResponse = await axios.get('http://127.0.0.1:8000/api/v1/quizzes/', config);
        // Grab the first 2 quizzes for the UI
        setRecommendedQuizzes(quizzesResponse.data.slice(0, 2));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to format minutes into "Xh Ym"
  const formatTime = (totalMinutes) => {
    if (!totalMinutes) return "0h 0m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
        <p className="text-indigo-100 mb-6 max-w-xl">Ready to master some new skills today? Dive right back into your learning journey.</p>
        <Link to="/student/quizzes">
          <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-2">
            Explore Quizzes <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Score</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total_score} XP</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Quizzes Passed</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.quizzes_passed} / {stats.total_attempts || stats.quizzes_passed}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Time Spent</p>
            <h3 className="text-2xl font-bold text-slate-900">{formatTime(stats.time_spent_minutes)}</h3>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedQuizzes.length > 0 ? (
            recommendedQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-3 inline-block">
                    {quiz.difficulty || "General"}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{quiz.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">Pass: {quiz.passing_score}% • {quiz.duration} Mins</p>
                </div>
                <Link to={`/student/quizzes/${quiz.id}`}>
                  <button className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                    <PlayCircle className="w-6 h-6" />
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No quizzes available right now.</p>
          )}
        </div>
      </div>

      {/* Upcoming Features Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Coming Soon to QuizMaster</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: AI Interviews */}
          <div className="p-5 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white hover:border-indigo-200 hover:shadow-md transition-all group cursor-default">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">AI Mock Interviews</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Practice your technical communication. Our AI agent will ask adaptive questions and grade your verbal responses in real-time on full-stack topics from React to Node.js.
            </p>
          </div>

          {/* Feature 2: Multiplayer Battles */}
          <div className="p-5 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white hover:border-amber-200 hover:shadow-md transition-all group cursor-default">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Live Battle Mode</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drop into a lobby and compete in real-time algorithm matches against other JavaScript developers. Survive the rounds to claim top rank.
            </p>
          </div>

          {/* Feature 3: Smart Proctoring */}
          <div className="p-5 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white hover:border-emerald-200 hover:shadow-md transition-all group cursor-default">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Smart Exam Proctoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automated tab-tracking and AI-assisted camera checks to ensure complete fairness and integrity during MERN certification exams.
            </p>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;