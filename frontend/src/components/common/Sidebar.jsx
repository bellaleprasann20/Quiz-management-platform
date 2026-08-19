// frontend/src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// NEW: Added isOpen and closeSidebar to the props
const Sidebar = ({ links, isOpen, closeSidebar }) => {
  return (
    <aside 
      className={`
        absolute md:relative z-30
        w-64 h-full md:h-[calc(100vh-4rem)]
        bg-white border-r border-slate-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={index}
              to={link.path}
              onClick={closeSidebar} // NEW: Auto-close menu when a link is clicked on mobile!
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {link.label}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
      
      {/* Sidebar Footer Area (e.g., Help/Support) */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 font-medium mb-2">Need help?</p>
          <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Contact Support</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;