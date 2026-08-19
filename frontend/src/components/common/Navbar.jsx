// frontend/src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, User, Bell, Menu } from 'lucide-react'; // Added Menu icon

const Navbar = ({ user, onLogout, toggleSidebar }) => { // Added toggleSidebar
  // NEW: State to hold your REAL user data
  const [realUser, setRealUser] = useState(user);

  // NEW: Fetch the real logged-in user from localStorage when the Navbar loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setRealUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage");
      }
    }
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Left Area: Hamburger Menu + Logo */}
        <div className="flex items-center gap-3">
          
          {/* NEW: Mobile Hamburger Button (Hidden on large screens) */}
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Area */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            {/* Hide text on very small screens to save space */}
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hidden sm:block">
              QuizMaster
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:block p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          
          <div className="hidden sm:block h-6 w-px bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              {/* FIXED: Display the REAL user's name and role */}
              <p className="text-sm font-medium text-slate-700">{realUser?.username || realUser?.name || 'Guest'}</p>
              <p className="text-xs text-slate-500 capitalize">{realUser?.role || 'Student'}</p>
            </div>
            
            {/* Update the avatar icon to show the user's first initial */}
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-indigo-600 font-bold text-sm uppercase">
                {(realUser?.username || realUser?.name || 'G').charAt(0)}
              </span>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="ml-1 sm:ml-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;