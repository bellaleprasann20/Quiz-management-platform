// frontend/src/pages/admin/Settings.jsx
import React, { useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios'; // Added this so it's ready for you when you uncomment the API call!

const Settings = () => {
  // State to hold all our form values
  const [formData, setFormData] = useState({
    platformName: 'QuizMaster',
    supportEmail: 'support@quizmaster.com',
    showLeaderboard: true,
    enforceGracePeriod: true,
  });

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle toggle switch changes
  const handleToggle = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Handle saving the settings
  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);

    try {
      // TODO: Replace this timeout with a real Axios call when your backend endpoint is ready
      // FIX APPLIED HERE: Replaced the hardcoded localhost string in the comment with the env variable
      // await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/settings`, formData);
      
      // Simulating a network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
        
        {/* Success message popup */}
        {showSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
        
        {/* General Settings */}
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">General Configuration</h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform Name</label>
              <input 
                type="text" 
                name="platformName"
                value={formData.platformName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Email</label>
              <input 
                type="email" 
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" 
              />
            </div>
          </div>
        </div>

        {/* Quiz Preferences */}
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quiz Preferences</h2>
          <div className="space-y-6">
            
            {/* Leaderboard Toggle */}
            <div className="flex items-center justify-between max-w-lg">
              <div>
                <p className="font-medium text-slate-800">Show Leaderboard to Students</p>
                <p className="text-sm text-slate-500">Allow students to see global rankings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.showLeaderboard}
                  onChange={() => handleToggle('showLeaderboard')}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Grace Period Toggle */}
            <div className="flex items-center justify-between max-w-lg">
              <div>
                <p className="font-medium text-slate-800">Enforce Grace Period</p>
                <p className="text-sm text-slate-500">Allow 30 seconds extra for slow network submits</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.enforceGracePeriod}
                  onChange={() => handleToggle('enforceGracePeriod')}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
          </div>
        </div>

        {/* Action Area */}
        <div className="p-6 md:p-8 bg-slate-50 flex justify-end rounded-b-2xl">
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;