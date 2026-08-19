// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col">
      
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-24 -left-24 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="text-center max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium text-sm mb-6 border border-indigo-100">
            <Sparkles className="w-4 h-4" />
            <span>The ultimate assessment platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            Master any subject with <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Interactive Quizzes
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create, take, and analyze quizzes in real-time. Whether you are a teacher evaluating students or a learner tracking your progress, QuizMaster has you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why choose QuizMaster?</h2>
            <p className="text-slate-500">Everything you need to create engaging learning experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gamified Learning</h3>
              <p className="text-slate-600 leading-relaxed">Earn XP, climb the global leaderboard, and maintain your learning streaks to stay motivated.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
              <p className="text-slate-600 leading-relaxed">Track performance instantly with beautiful charts identifying your strengths and weaknesses.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Role-based Access</h3>
              <p className="text-slate-600 leading-relaxed">Dedicated portals for students and admins. Teachers have full control over test environments.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;