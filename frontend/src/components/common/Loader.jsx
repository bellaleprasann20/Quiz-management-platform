// frontend/src/components/common/Loader.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8 w-full h-full";

  return (
    <div className={containerClass}>
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      {text && (
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;