// frontend/src/hooks/useTimer.js
import { useState, useEffect, useCallback } from 'react';

const useTimer = (initialSeconds, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // The missing start function!
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    // If the timer isn't running or time is up, do nothing
    if (!isRunning || timeLeft <= 0) return;

    // Start ticking down every 1 second (1000ms)
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          setIsRunning(false);
          // Trigger the auto-submit function when time hits 0
          if (onTimeUp) onTimeUp(); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, onTimeUp]);

  // Format the time as MM:SS for the UI
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Turn the timer red when there is 1 minute (60 seconds) or less remaining
  const isWarning = timeLeft > 0 && timeLeft <= 60;

  return { formattedTime, isWarning, start, timeLeft };
};

export default useTimer;