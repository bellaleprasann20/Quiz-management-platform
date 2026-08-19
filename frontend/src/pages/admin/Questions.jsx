// frontend/src/pages/admin/Questions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, CheckCircle2, Edit2, Trash2, Loader2, HelpCircle, ArrowLeft, UploadCloud } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';
import { toast } from 'react-toastify'; // Added for notifications

const Questions = () => {
  const navigate = useNavigate();
  const { quizId } = useParams(); 

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/questions/quiz/${quizId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuestions();
    }
  }, [quizId]);

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    
    try {
      // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/questions/${questionId}`);
      setQuestions(questions.filter(q => q.id !== questionId));
      toast.success("Question deleted.");
    } catch (error) {
      console.error("Failed to delete question:", error);
      toast.error("Failed to delete question.");
    }
  };

  // NEW: Handler to instantly update the correct option via API and UI
  const handleSetCorrectOption = async (questionId, optionId) => {
    try {
      // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/questions/${questionId}/correct-option/${optionId}`);
      
      // Instantly update the UI without needing a full page reload
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(opt => ({
              ...opt,
              is_correct: opt.id === optionId // Set the clicked one to true, others to false
            }))
          };
        }
        return q;
      }));

      toast.success("Correct answer updated!");
    } catch (error) {
      console.error("Error updating option", error);
      toast.error("Failed to update correct answer.");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/quizzes')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Question Bank</h1>
            <p className="text-slate-500">Currently viewing questions for Quiz ID: <span className="font-semibold text-slate-700">{quizId}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => navigate(`/admin/quizzes/${quizId}/bulk-upload`)}
          >
            <UploadCloud className="w-4 h-4 mr-2" /> Upload CSV
          </Button>

          <Button 
            type="button"
            variant="primary" 
            onClick={() => navigate(`/admin/quizzes/${quizId}/questions/new`)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No questions found</h3>
            <p className="text-slate-500 mt-1">Your question bank is empty for this quiz. Click "Add Question" to create one.</p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div key={q.id || index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group transition-all hover:border-indigo-200">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => navigate(`/admin/quizzes/${quizId}/questions/${q.id}/edit`)}
                  className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-medium text-slate-900 mb-4 pr-20">
                <span className="text-slate-400 mr-2">{index + 1}.</span> 
                {q.text || q.question_text}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options && q.options.length > 0 ? (
                  q.options.map((opt, idx) => {
                    const isCorrect = opt.is_correct; 
                    
                    // Changed from a <div> to a <label> to make it fully clickable
                    return (
                      <label 
                        key={opt.id || idx} 
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isCorrect 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* The Radio Button */}
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={isCorrect}
                            onChange={() => handleSetCorrectOption(q.id, opt.id)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className="font-medium">{opt.text || opt.option_text}</span>
                        </div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      </label>
                    );
                  })
                ) : (
                  <p className="text-sm text-amber-600 italic col-span-2">No options added to this question yet.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Questions;