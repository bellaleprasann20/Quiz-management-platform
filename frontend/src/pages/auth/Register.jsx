// frontend/src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle, Shield, GraduationCap, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext'; 

const Register = () => {
  const navigate = useNavigate();
  
  // Safe fallback in case useAuth is not wrapping the app correctly
  const authContext = useAuth() || {};
  const { register, login } = authContext; 
  
  const [formData, setFormData] = useState({ role: 'student', name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (formData.role === 'admin') {
        if (!login) throw new Error("The 'login' function is missing from AuthContext!");
        await login({ email: formData.email, password: formData.password });
        navigate('/admin/dashboard');
      } else {
        if (!register) throw new Error("The 'register' function is missing from AuthContext! Is it named 'signup' instead?");
        await register(formData);
        navigate('/student/dashboard');
      }
    } catch (err) {
      // === BUG CATCHER ===
      console.error("🚨 FRONTEND CRASH REPORT:", err);
      
      const serverError = err.response?.data?.detail;
      const localError = err.message; // Grabs exact JS or Network errors (e.g. "Network Error" or "register is not a function")
      
      // Display the exact error on the UI
      setError(serverError || localError || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-100 p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transform transition-all">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-2xl">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {formData.role === 'admin' ? 'Admin Sign In' : 'Create an Account'}
          </h1>
          <p className="text-sm text-slate-500">
            {formData.role === 'admin' ? 'Welcome back, Administrator' : 'Join QuizMaster to get started'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-3 text-rose-600">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                formData.role === 'student' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="font-medium text-sm">Student</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                formData.role === 'admin' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-6 h-6" />
              <span className="font-medium text-sm">Admin</span>
            </button>
          </div>

          {formData.role === 'student' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
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
            {!isLoading && (formData.role === 'admin' ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />)}
            {formData.role === 'admin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          {formData.role === 'admin' ? "Don't have an admin account? " : "Already have an account? "}
          <Link to="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            {formData.role === 'admin' ? 'Contact Support' : 'Sign in instead'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;