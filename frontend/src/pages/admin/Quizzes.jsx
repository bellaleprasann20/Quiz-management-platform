// frontend/src/pages/admin/Quizzes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, FileQuestion, Settings, Loader2, BookOpen } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Fetch all quizzes from the backend
        // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/quizzes/`);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Helper function to style the status badge dynamically
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'draft';
    if (s === 'published') return "bg-emerald-100 text-emerald-700";
    if (s === 'archived') return "bg-rose-100 text-rose-700";
    return "bg-slate-100 text-slate-700"; // default for drafts
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Quizzes</h1>
        <Button variant="primary" onClick={() => navigate('/admin/quizzes/new')}>
          <Plus className="w-4 h-4 mr-2" /> Create Quiz
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No quizzes found</h3>
            <p className="text-slate-500 mt-1">You haven't created any quizzes yet. Click "Create Quiz" to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quizzes.map((quiz, index) => (
              <div key={quiz.id || index} className="p-6 hover:bg-slate-50 transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{quiz.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(quiz.status)}`}>
                      {quiz.status || 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 max-w-2xl line-clamp-2">
                    {quiz.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> 
                      {quiz.time_limit || 0} mins
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileQuestion className="w-4 h-4 text-slate-400" /> 
                      {/* Fallback to 0 if the API doesn't return a count yet */}
                      {quiz.question_count || 0} Questions
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-0 border-slate-100 pt-4 md:pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 md:flex-none"
                    onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                  >
                    <Settings className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 md:flex-none"
                    onClick={() => navigate(`/admin/quizzes/${quiz.id}/questions`)}
                  >
                    Questions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;