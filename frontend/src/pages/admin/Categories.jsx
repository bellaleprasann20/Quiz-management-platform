// frontend/src/pages/admin/Categories.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import Button from '../../components/common/Button';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // NEW: Hook to make categories clickable
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  // Helper function to grab the auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch real categories from your backend
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // FIXED: Added Auth headers
      const response = await axios.get('http://127.0.0.1:8000/api/v1/categories/', {
        headers: getAuthHeaders()
      });
      
      // FIXED: Safely extract the array just like we did in Users.jsx
      const catsArray = Array.isArray(response.data) 
        ? response.data 
        : response.data.items || response.data.categories || response.data.data || [];
        
      setCategories(catsArray);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // FIXED: Added Auth headers for the POST request
      await axios.post('http://127.0.0.1:8000/api/v1/categories/', formData, {
        headers: getAuthHeaders()
      });
      
      // Close modal, reset form, and refresh the list!
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to create category. It might already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500">Organize your quizzes into logical groups.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Category
        </Button>
      </div>

      {/* Show a loading spinner while fetching data */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <Folder className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No categories found</h3>
          <p className="text-slate-500 mt-1">Get started by creating a new category for your quizzes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              // NEW: Added cursor-pointer and onClick navigation
              onClick={() => navigate(`/admin/quizzes?category=${cat.id}`)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Folder className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* NEW: Stop propagation so clicking edit/delete doesn't trigger the card navigation */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Add edit logic later */ }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); /* Add delete logic later */ }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                {cat.description || "No description provided."}
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {/* Safely defaults to 0 if your backend doesn't send quiz_count yet */}
                  {cat.quiz_count || 0} Quizzes
                </span>
                <span className="text-sm font-semibold text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">
                  View Quizzes <span className="ml-1">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Create New Category</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name *</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g., Python Programming"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea 
                  rows="3"
                  placeholder="What kind of quizzes belong here?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;