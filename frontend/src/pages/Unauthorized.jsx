// frontend/src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12 text-center transform transition-all">
        
        <div className="w-20 h-20 bg-rose-50 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner border border-rose-100">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Access Denied
        </h1>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          You do not have the required permissions to view this directory or page using the credentials you supplied.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} // Goes back to the previous page
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => navigate('/')} 
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;