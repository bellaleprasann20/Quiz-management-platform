// frontend/src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderTree, 
  Library, 
  PieChart, 
  Trophy, 
  Settings 
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const AdminLayout = () => {
  const navigate = useNavigate();
  
  // State to track if the mobile sidebar is open or closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock Admin User
  const adminUser = {
    username: 'Admin User',
    role: 'admin'
  };

  // Admin Navigation Links
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/quizzes', label: 'Quizzes', icon: Library },
    { path: '/admin/analytics', label: 'Analytics', icon: PieChart },
    { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate('/auth/login');
  };

  return (
    // FIX IS HERE: Replaced 'min-h-screen' with 'h-screen overflow-hidden'
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col font-sans">
      
      <Navbar 
        user={adminUser} 
        onLogout={handleLogout} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Overlay Background */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        <Sidebar 
          links={adminLinks} 
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

export default AdminLayout;