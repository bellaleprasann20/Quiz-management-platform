// frontend/src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';

// NEW: Import the toast function!
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Request the 6-digit code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/forgot-password', {
        email: formData.email
      });
      
      setStep(2);
      
      // NEW: Trigger the beautiful Toastify notifications!
      if (response.data.dev_otp) {
        toast.success("Account found! Code generated.");
        // Show the code on screen for 15 seconds so you can copy it
        toast.info(`🛠️ DEV MODE: Your reset code is ${response.data.dev_otp}`, {
          autoClose: 15000,
          position: "top-center",
          style: { fontSize: '16px', fontWeight: 'bold' }
        });
      } else {
        // If the email wasn't in the database, it shows this generic message
        toast.success("If that email is registered, a code has been sent.");
      }
    } catch (err) {
      toast.error("Failed to request reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code and save new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/auth/reset-password', {
        email: formData.email,
        otp: formData.otp,
        new_password: formData.newPassword
      });
      
      toast.success("🎉 Password reset successful! You can now log in.");
      navigate('/auth/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p className="text-sm text-slate-500">
            {step === 1 ? "Enter your email to receive a 6-digit reset code." : "Enter the code we sent and your new password."}
          </p>
        </div>

        {/* STEP 1 FORM: Ask for Email */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Send 6-Digit Code <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* STEP 2 FORM: Ask for OTP and New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">6-Digit Code</label>
              <input
                type="text"
                name="otp"
                required
                maxLength="6"
                value={formData.otp}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-2xl font-black text-slate-800"
                placeholder="------"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Update Password
            </Button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <Link to="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;