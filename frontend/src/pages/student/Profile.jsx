import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Lock, 
  Save, 
  Loader2, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText 
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext'; 

const Profile = () => {
  const { user, token } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    const payload = { name, phone, location, title, bio, password };
    
    try {
      // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/profile`, payload, {
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      });
      
      // Success Toast!
      toast.success("Profile saved successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      setPassword(''); 
      
    } catch (error) {
      console.error("Error saving profile:", error);
      
      // Error Toast!
      toast.error(error.response?.data?.detail || "Failed to save profile. Please try again.", {
        position: "bottom-right",
        autoClose: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Profile Header (Avatar) */}
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-lg flex items-center justify-center text-indigo-600 text-3xl font-bold">
              {initial}
            </div>
            <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 mb-2 capitalize">{user.role} Account</p>
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="p-8 space-y-10">
          
          {/* Section 1: Personal Information */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91" 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Agra, India" 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Professional Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Headline / Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., MERN Stack Developer" 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">About Me</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="I specialize in JavaScript programming..." 
                    rows="4"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                  />
                </div>
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Security */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Security</h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current" 
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Action Area */}
        <div className="p-6 bg-slate-50 flex justify-end">
          <Button variant="primary" onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Profile</>
            )}
          </Button>
        </div>
      </div>

      {/* Renders the toast popups on the screen */}
      <ToastContainer />
    </div>
  );
};

export default Profile;