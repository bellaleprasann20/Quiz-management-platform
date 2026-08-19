// frontend/src/pages/admin/BulkUploadQuestions.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from '../../components/common/Button'; 

const BulkUploadQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error("Invalid file format. Please upload a .csv file.");
        e.target.value = null;
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Handle form submission
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/questions/bulk-upload/${quizId}`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        }
      );

      toast.success(response.data.message || "Questions uploaded successfully!");
      setFile(null); 
      
      // Send the admin back to the question bank to see their new questions!
      navigate(`/admin/quizzes/${quizId}/questions`);
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to upload CSV. Please check your formatting.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bulk Upload Questions</h2>
          <p className="text-sm text-slate-500">Upload a CSV file for Quiz #{quizId}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important:</strong> Your CSV file must have these exact headers in row 1: <br/>
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">Question Text</code>, 
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs ml-1">Option 1</code>, 
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs ml-1">Option 2</code>, 
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs ml-1">Option 3</code>, 
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs ml-1">Option 4</code>, 
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs ml-1">Correct Option (1-4)</code>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <>
                  <FileText className="w-10 h-10 text-indigo-500 mb-3" />
                  <p className="mb-2 text-sm text-slate-700 font-semibold">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="mb-2 text-sm text-slate-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500">CSV files only</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" disabled={!file || isUploading}>
              {isUploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
              ) : (
                <><UploadCloud className="w-4 h-4 mr-2" /> Upload CSV</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkUploadQuestions;