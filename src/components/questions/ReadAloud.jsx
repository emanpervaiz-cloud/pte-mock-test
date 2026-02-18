import React, { useState, useRef } from 'react';
import { useExam } from '../../context/ExamContext';

const ReadAloud = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Stop recording after 50 seconds (standard PTE time limit)
    setTimeout(stopRecording, 50000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    // Save the recording (in a real app, this would be the recorded audio)
    saveAnswer(question.id, {
      type: 'audio',
      response: 'recorded_audio_blob',
      duration: recordingTime
    });
  };

  const handleNext = () => {
    if (isRecording) {
      stopRecording();
    }
    onNext();
  };

  return (
    <div className="read-aloud-question">
      <div className="prompt-text">
        <p>{question.prompt}</p>
      </div>
      
      <div className="audio-controls">
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={recordingTime >= 50}
        >
          {isRecording ? '●' : '●'}
        </button>
        <span>Click and read the text aloud</span>
      </div>
      
      {isRecording && (
        <div className="recording-timer">
          Recording: {recordingTime}s / 50s
        </div>
      )}
      
      <div className="instructions">
        <p><strong>Preparation time:</strong> You will see the text for 35 seconds before recording starts.</p>
        <p><strong>Recording time:</strong> You will have up to 50 seconds to read the text aloud.</p>
      </div>
      
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleNext}>
          {isRecording ? 'Stop and Continue' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default ReadAloud;