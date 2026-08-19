// frontend/src/layouts/StudentLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  BarChart2, 
  Trophy, 
  UserCircle 
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const StudentLayout = () => {
  const navigate = useNavigate();

  // State to track if the mobile sidebar is open or closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock Student User (Replace with context/redux state later)
  const studentUser = {
    username: 'Alex Doe',
    role: 'student'
  };

  // Student Navigation Links
  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/quizzes', label: 'Browse Quizzes', icon: BookOpen },
    { path: '/student/history', label: 'Attempt History', icon: History },
    { path: '/student/performance', label: 'Performance', icon: BarChart2 },
    { path: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/student/profile', label: 'My Profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    // Add logout logic here (clear tokens, etc.)
    navigate('/auth/login');
  };

  return (
    // FIX APPLIED HERE: Replaced 'min-h-screen' with 'h-screen overflow-hidden'
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col font-sans">
      
      <Navbar 
        user={studentUser} 
        onLogout={handleLogout} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Overlay Background - darkens the screen when menu is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        <Sidebar 
          links={studentLinks} 
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;