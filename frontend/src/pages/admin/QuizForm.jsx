// frontend/src/pages/admin/QuizForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';

const QuizForm = () => {
  const navigate = useNavigate();
  const { quizId } = useParams(); // If this exists, we are editing. If not, creating.
  const isEditing = Boolean(quizId);

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditing); // Only loading initially if editing
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    time_limit: 15,
    status: 'DRAFT'
  });

  // Fetch categories (for the dropdown) and fetch existing quiz data (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Categories - FIX APPLIED HERE
        const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/categories/`);
        setCategories(catRes.data);
        
        // Default to the first category if creating a new quiz
        if (!isEditing && catRes.data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: catRes.data[0].id }));
        }

        // 2. Fetch Quiz Data if Editing - FIX APPLIED HERE
        if (isEditing) {
          const quizRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/quizzes/${quizId}`);
          setFormData({
            title: quizRes.data.title || '',
            description: quizRes.data.description || '',
            category_id: quizRes.data.category_id || (catRes.data.length > 0 ? catRes.data[0].id : ''),
            time_limit: quizRes.data.time_limit || 15,
            status: quizRes.data.status || 'DRAFT'
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load necessary data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [quizId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (isEditing) {
        // Update existing quiz - FIX APPLIED HERE
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/quizzes/${quizId}`, formData);
      } else {
        // Create new quiz - FIX APPLIED HERE
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/quizzes/`, formData);
      }
      // Redirect back to quizzes list on success
      navigate('/admin/quizzes');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred while saving the quiz.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/quizzes')}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <p className="text-slate-500">Configure your quiz settings and details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          {error && (
            <div className="p-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Quiz Title *</label>
            <input 
              type="text" 
              name="title"
              required
              placeholder="e.g., Advanced JavaScript Concepts"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea 
              name="description"
              rows="3"
              placeholder="What will this quiz cover?"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
              <select 
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Time Limit (Minutes) *</label>
              <input 
                type="number" 
                name="time_limit"
                required
                min="1"
                value={formData.time_limit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="DRAFT" 
                  checked={formData.status === 'DRAFT'}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Draft (Hidden from students)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="PUBLISHED" 
                  checked={formData.status === 'PUBLISHED'}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-700">Published (Visible to students)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/quizzes')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Quiz</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;