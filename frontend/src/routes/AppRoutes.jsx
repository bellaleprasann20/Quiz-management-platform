// frontend/src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// --- Layouts ---
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';

// --- Public Pages ---
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// --- Auth Pages ---
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// --- Admin Pages ---
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminCategories from '../pages/admin/Categories';
import AdminQuizzes from '../pages/admin/Quizzes';
import AdminQuizForm from '../pages/admin/QuizForm'; 
import AdminQuestions from '../pages/admin/Questions'; 
import AdminQuestionForm from '../pages/admin/QuestionForm'; 
import AdminAnalytics from '../pages/admin/Analytics';
import AdminLeaderboard from '../pages/admin/Leaderboard';
import AdminSettings from '../pages/admin/Settings';
// FIXED: Changed './pages...' to '../pages...'
import BulkUploadQuestions from '../pages/admin/BulkUploadQuestions'; 

// --- Student Pages ---
import StudentDashboard from '../pages/student/Dashboard';
import StudentQuizList from '../pages/student/QuizList';
import StudentQuizDetails from '../pages/student/QuizDetails';
import StudentAttemptQuiz from '../pages/student/AttemptQuiz';
import StudentResult from '../pages/student/Result';
import StudentHistory from '../pages/student/History';
import StudentPerformance from '../pages/student/Performance';
import StudentLeaderboard from '../pages/student/Leaderboard';
import StudentProfile from '../pages/student/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 2. Authentication Routes (Wrapped in AuthLayout) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* 3. Admin Routes (Protected + Wrapped in AdminLayout) */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          
          
          {/* --- QUIZ & QUESTION MANAGEMENT ROUTES --- */}
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="quizzes/new" element={<AdminQuizForm />} />
          <Route path="quizzes/:quizId/edit" element={<AdminQuizForm />} />
          
          <Route path="quizzes/:quizId/questions" element={<AdminQuestions />} />
          <Route path="quizzes/:quizId/questions/new" element={<AdminQuestionForm />} />
          <Route path="quizzes/:quizId/questions/:questionId/edit" element={<AdminQuestionForm />} />
          {/* FIXED: Removed /questions from the path to match the button in Questions.jsx */}
          <Route path="quizzes/:quizId/bulk-upload" element={<BulkUploadQuestions />} />
          {/* ----------------------------------------- */}

          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* 4. Student Routes (Protected + Wrapped in StudentLayout) */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="quizzes" element={<StudentQuizList />} />
          <Route path="quizzes/:id" element={<StudentQuizDetails />} />
          <Route path="quizzes/:id/attempt" element={<StudentAttemptQuiz />} />
          <Route path="quizzes/:id/result" element={<StudentResult />} />
          <Route path="history" element={<StudentHistory />} />
          <Route path="performance" element={<StudentPerformance />} />
          <Route path="leaderboard" element={<StudentLeaderboard />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* 5. Catch-All Route (404 Page) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;