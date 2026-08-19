// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // MUST import the CSS!

import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QuizProvider>
          <BrowserRouter>
            <AppRoutes />
            
            {/* The ToastContainer sits here globally so you can call toast() from ANY page */}
            <ToastContainer 
              position="top-right" 
              autoClose={5000} 
              hideProgressBar={false}
              closeOnClick 
              pauseOnHover 
              theme="light" 
            />
          </BrowserRouter>
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;