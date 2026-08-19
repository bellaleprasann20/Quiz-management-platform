// frontend/src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen">
      
      {/* Floating Home Button (Absolute positioned on top of the auth pages) */}
      <div className="absolute top-6 left-6 z-10 hidden sm:block">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 bg-white/50 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Renders the Login, Register, or Reset Password pages */}
      <Outlet />

    </div>
  );
};

export default AuthLayout;