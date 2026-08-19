import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Award, ChevronRight } from 'lucide-react';

import quizService from '../../services/quizService';
import categoryService from '../../services/categoryService';
import Loader from '../../components/common/Loader';

const DIFFICULTY_STYLES = {
  BEGINNER: 'bg-emerald-50 text-emerald-600',
  INTERMEDIATE: 'bg-amber-50 text-amber-600',
  ADVANCED: 'bg-rose-50 text-rose-600',
};

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories for the dropdown
  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  // Fetch quizzes with BACKEND filtering
  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      // 1. Build the query parameters object
      const params = {};
      if (search) params.search = search;
      if (categoryId) params.category_id = categoryId;
      if (difficulty) params.difficulty = difficulty;

      // 2. Send the params directly to the backend
      quizService.getQuizzes(params)
        .then((data) => {
          setQuizzes(data); // The backend returns perfectly filtered data!
        })
        .catch(err => console.error("Error fetching quizzes:", err))
        .finally(() => setIsLoading(false));
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [search, categoryId, difficulty]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Browse Quizzes</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Difficulties</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      {isLoading ? (
        <Loader text="Loading quizzes..." />
      ) : quizzes.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-12">No quizzes match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/student/quizzes/${quiz.id}`}
              className="bg-white rounded-xl shadow-sm ring-1 ring-slate-900/5 p-5 hover:shadow-md hover:ring-indigo-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${DIFFICULTY_STYLES[quiz.difficulty] || 'bg-slate-100 text-slate-600'}`}>
                  {quiz.difficulty || 'N/A'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{quiz.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{quiz.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {quiz.duration || 0} min</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Pass {quiz.passing_score || 0}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}