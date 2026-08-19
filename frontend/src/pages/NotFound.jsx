// frontend/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Floating Icon */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-indigo-50 rounded-full w-full h-full flex items-center justify-center border-4 border-white shadow-xl">
            <SearchX className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        <div>
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
          <p className="text-slate-500 mb-8">
            Oops! It seems the page you're looking for has wandered off or doesn't exist. Let's get you back on track.
          </p>
        </div>

        <Link to="/">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            <Home className="w-5 h-5 mr-2" />
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;