// frontend/src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, UserPlus, GraduationCap, Shield } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext'; 
import axios from 'axios'; // Needed for registration

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  // NEW: Added states to handle tabs and form modes!
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [isLogin, setIsLogin] = useState(true); // true = Sign In, false = Create Account
  
  const [formData, setFormData] = useState({ 
    username: '', // Added for registration
    email: '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        // === SIGN IN LOGIC ===
        // Just call login, don't worry about what it returns
        await login({ email: formData.email, password: formData.password });
        
        // FIXED: Use the 'role' state from the tabs to decide where to navigate!
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        // === CREATE ACCOUNT LOGIC (Students Only) ===
        // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
       // Old code causing the error
await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
  username: formData.username,
  email: formData.email,
  password: formData.password,
  role: 'student' 
});
        
        await login({ email: formData.email, password: formData.password });
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transform transition-all">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-2xl">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-sm text-slate-500">
            {isLogin ? 'Please sign in to your account to continue' : 'Join the platform to start taking quizzes'}
          </p>
        </div>

        {/* NEW: Role Selection Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
          <button
            onClick={() => setRole('student')}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
              role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4 mr-2" /> Student
          </button>
          
          <button
            // THIS IS THE MAGIC FIX: Clicking Admin forces the form into Sign-In mode!
            onClick={() => {
              setRole('admin');
              setIsLogin(true); 
            }}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
              role === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" /> Admin
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-3 text-rose-600">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ONLY show Username field if they are creating an account */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="username"
                required={!isLogin}
                value={formData.username}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              {isLogin && (
                <button 
                  type="button" 
                  onClick={() => navigate('/auth/forgot-password')} 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
            {!isLoading && (isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />)}
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Footer Toggle (Hidden if Admin is selected!) */}
        {role === 'student' && (
          <div className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }} 
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {isLogin ? 'Create one now' : 'Sign in instead'}
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Login;