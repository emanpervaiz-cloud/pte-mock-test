import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onComplete, autoSubmit = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (autoSubmit && onComplete) {
        onComplete();
      }
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, onComplete, autoSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return '#f44336'; // Red when 30 seconds or less
    if (timeLeft <= 60) return '#ff9800'; // Orange when 1 minute or less
    return '#4caf50'; // Green otherwise
  };

  return (
    <div className="timer" style={{ borderColor: getTimerColor(), color: getTimerColor() }}>
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;