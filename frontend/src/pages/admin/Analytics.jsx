// frontend/src/pages/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [topQuizzes, setTopQuizzes] = useState([]);
  const [chartData, setChartData] = useState([40, 70, 45, 90, 65, 85, 100]); // Fallback heights
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch users AND analytics concurrently
        // FIX APPLIED HERE: Replaced hardcoded localhost with the Vercel-ready environment variable
        const [usersRes, analyticsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/analytics/admin`, { headers })
        ]);
        
        // 1. Process Students
        const usersArray = Array.isArray(usersRes.data) 
          ? usersRes.data 
          : usersRes.data.items || usersRes.data.users || usersRes.data.data || [];
        
        const studentList = usersArray.filter(user => user.role?.toLowerCase() === 'student');
        setStudents(studentList);

        // 2. Process Real Analytics
        if (analyticsRes.data.top_quizzes) {
          setTopQuizzes(analyticsRes.data.top_quizzes);
        }
        if (analyticsRes.data.chart_data) {
          setChartData(analyticsRes.data.chart_data);
        }

      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Big Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Quiz Attempts (Activity)</h3>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          
          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 pt-10">
            {chartData.map((h, i) => (
              <div key={i} className="w-full relative group flex justify-center">
                <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Activity
                </div>
                <div style={{ height: `${h}%` }} className="w-full max-w-[3rem] bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-colors"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium mt-4 pt-4 border-t border-slate-100">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-lg text-white">
            <BarChart3 className="w-8 h-8 text-white/80 mb-4" />
            <p className="text-indigo-100 font-medium mb-1">Total Students</p>
            <h2 className="text-4xl font-bold">
              {isLoading ? "..." : students.length}
            </h2>
            <p className="text-sm text-emerald-300 mt-2 flex items-center gap-1">
              <Users className="w-4 h-4" /> Active on platform
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4">Top Performing Quizzes</h3>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-slate-500">Calculating top scores...</p>
              ) : topQuizzes.length === 0 ? (
                <p className="text-sm text-slate-500">No completed quizzes yet.</p>
              ) : (
                topQuizzes.map((q, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">#{i+1}</div>
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">{q.title}</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">{q.average}%</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real Student Data Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Registered Students</h3>
        
        {isLoading ? (
          <p className="text-slate-500">Loading student details...</p>
        ) : students.length === 0 ? (
          <p className="text-slate-500">No students have registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-medium text-slate-800">{student.name || student.username}</td>
                    <td className="py-4 text-slate-600">{student.email}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Analytics;