import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Monitor, StopCircle, Mic, PlayCircle } from 'lucide-react';
import axios from 'axios';
import Button from '../../components/common/Button';

// Sample questions (Later, we can fetch these from your FastAPI backend!)
const INTERVIEW_QUESTIONS = [
  "Welcome to your technical interview. To start, could you please introduce yourself?",
  "Can you explain the difference between front-end and back-end development?",
  "How do you handle debugging when your code doesn't work as expected?",
  "Thank you. That concludes the interview practice. You may end the session now."
];

const AiInterview = () => {
  const navigate = useNavigate();
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  
  // NEW: Track the current question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const videoRef = useRef(null);

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Anti-Cheat Tab Switch Detector
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (isInterviewActive && document.hidden) {
        setIsInterviewActive(false);
        setHasFailed(true);
        window.speechSynthesis.cancel(); // Stop the AI from talking if they cheat!
        stopScreenShare();

        try {
          await axios.post('http://127.0.0.1:8000/api/v1/interviews/cheat-detected', {}, {
            headers: getAuthHeaders()
          });
        } catch (err) {
          console.error("Failed to update ban status", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isInterviewActive]);

  // NEW: The Text-to-Speech Function
  const askQuestion = (index) => {
    if (index >= INTERVIEW_QUESTIONS.length) return;
    
    // Cancel any currently playing speech to avoid overlapping
    window.speechSynthesis.cancel(); 
    
    const textToSpeak = INTERVIEW_QUESTIONS[index];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Optional: Tweak the voice settings to sound more natural
    utterance.rate = 0.95; 
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setCurrentQuestionIndex(index);
  };

  // Start Screen Share
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      setIsInterviewActive(true);
      
      // Start asking the first question immediately after sharing starts!
      askQuestion(0);

      stream.getVideoTracks()[0].onended = () => {
        setIsInterviewActive(false);
        window.speechSynthesis.cancel();
      };
    } catch (err) {
      alert("You must share your entire screen to begin the interview.");
    }
  };

  const stopScreenShare = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {hasFailed ? (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Interview Failed</h1>
          <p className="text-slate-600 mb-6">Tab switching or leaving the interview window is strictly prohibited.</p>
          <Button variant="primary" onClick={() => navigate('/student/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Interview Practice</h1>
              <p className="text-slate-500">Warning: Do not switch tabs once the interview begins.</p>
            </div>
            
            {!isInterviewActive ? (
              <Button variant="primary" onClick={startScreenShare}>
                <Monitor className="w-4 h-4 mr-2" /> Start Interview
              </Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setIsInterviewActive(false);
                window.speechSynthesis.cancel();
                stopScreenShare();
              }}>
                <StopCircle className="w-4 h-4 mr-2" /> End Interview
              </Button>
            )}
          </div>

          <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative mb-4">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-50" />
            
            {/* Display the AI status over the video */}
            {isInterviewActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isSpeaking ? 'bg-indigo-600 scale-110 shadow-[0_0_30px_rgba(79,70,229,0.5)]' : 'bg-slate-700'}`}>
                  <Mic className={`w-8 h-8 ${isSpeaking ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <p className="mt-4 text-white font-medium bg-slate-900/80 px-4 py-2 rounded-lg text-center max-w-lg">
                  {currentQuestionIndex >= 0 ? INTERVIEW_QUESTIONS[currentQuestionIndex] : "Connecting to AI..."}
                </p>
              </div>
            )}
          </div>

          {/* Controls to move to the next question */}
          {isInterviewActive && (
            <div className="flex justify-end">
              <Button 
                variant="primary" 
                onClick={() => askQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex >= INTERVIEW_QUESTIONS.length - 1}
              >
                <PlayCircle className="w-4 h-4 mr-2" /> 
                Next Question
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiInterview;