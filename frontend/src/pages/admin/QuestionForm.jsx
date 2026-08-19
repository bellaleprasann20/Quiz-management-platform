// frontend/src/pages/admin/QuestionForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';

const QuestionForm = () => {
  const navigate = useNavigate();
  // We grab the quizId from the URL so the backend knows which quiz this question belongs to
  const { quizId, questionId } = useParams(); 
  const isEditing = Boolean(questionId);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // The Question State
  const [questionText, setQuestionText] = useState('');
  
  // The Options State (Always 4 options)
  const [options, setOptions] = useState([
    { text: '', isCorrect: true },  // Default the first option to be correct
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  // Handle typing in an option field
  const handleOptionTextChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  // Handle clicking the radio button for the correct answer
  const handleCorrectAnswerSelect = (selectedIndex) => {
    const newOptions = options.map((opt, index) => ({
      ...opt,
      isCorrect: index === selectedIndex
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validation to ensure no empty fields are sent to the database
    if (!questionText.trim()) {
      return setError('Question text is required.');
    }
    if (options.some(opt => !opt.text.trim())) {
      return setError('All 4 options must be filled out.');
    }

    setIsSaving(true);

    // 2. Format the payload to match what your FastAPI backend will expect
    const payload = {
      quiz_id: parseInt(quizId),
      question_text: questionText,
      options: options.map(opt => ({
        option_text: opt.text,
        is_correct: opt.isCorrect
      }))
    };

    try {
      if (isEditing) {
        // Edit existing question (if your backend supports it)
        await axios.put(`http://127.0.0.1:8000/api/v1/questions/${questionId}`, payload);
      } else {
        // Create new question
        await axios.post('http://127.0.0.1:8000/api/v1/questions/', payload);
      }
      
      // Redirect back to the Question Bank for this specific quiz
      navigate(`/admin/quizzes/${quizId}/questions`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred while saving the question.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </h1>
          <p className="text-slate-500">Provide the question text and 4 multiple-choice options.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl shadow-sm">
            {error}
          </div>
        )}

        {/* Question Text Area */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <label className="block text-base font-bold text-slate-800 mb-2">Question Text *</label>
          <textarea 
            required
            rows="3"
            placeholder="e.g., What is the primary purpose of a React useEffect hook?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-none bg-slate-50 focus:bg-white text-base"
          />
        </div>

        {/* Options Area */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-800">Answer Options *</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Select the correct answer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <div 
                key={index} 
                className={`relative flex items-center p-2 rounded-xl border-2 transition-all ${
                  option.isCorrect 
                    ? 'border-emerald-500 bg-emerald-50/30' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                {/* Radio Button for Correct Answer */}
                <div className="px-4 flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="correct_answer"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectAnswerSelect(index)}
                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                
                {/* Option Text Input */}
                <input 
                  type="text" 
                  required
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionTextChange(index, e.target.value)}
                  className="w-full py-3 pr-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
                
                {/* Correct Badge Indicator */}
                {option.isCorrect && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> Correct
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Question</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;