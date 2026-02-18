import React, { useState, useRef } from 'react';
import { useExam } from '../../context/ExamContext';

const DescribeImage = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [prepTime, setPrepTime] = useState(25); // 25 seconds preparation
  const recordingInterval = useRef(null);
  const prepInterval = useRef(null);

  // Start preparation timer when component mounts
  React.useEffect(() => {
    prepInterval.current = setInterval(() => {
      setPrepTime(prev => {
        if (prev <= 1) {
          clearInterval(prepInterval.current);
          startRecording(); // Start recording when prep time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (prepInterval.current) clearInterval(prepInterval.current);
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Stop recording after 40 seconds (standard PTE time limit for describe image)
    setTimeout(stopRecording, 40000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    // Save the recording
    saveAnswer(question.id, {
      type: 'audio',
      response: 'recorded_audio_blob',
      duration: recordingTime,
      prepTimeUsed: 25 - prepTime
    });
  };

  const handleNext = () => {
    if (isRecording) {
      stopRecording();
    }
    onNext();
  };

  return (
    <div className="describe-image-question">
      <div className="image-container">
        <img 
          src={question.imageUrl || '/placeholder-image.jpg'} 
          alt="Test image to describe" 
          className="test-image"
        />
      </div>
      
      <div className="countdown-section">
        {!isRecording && prepTime > 0 && (
          <div className="prep-timer">
            Preparation time remaining: {prepTime}s
          </div>
        )}
      </div>
      
      <div className="recording-section">
        {isRecording && (
          <div className="audio-controls">
            <button 
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={stopRecording}
              disabled={recordingTime >= 40}
            >
              ●
            </button>
            <span>Recording... Describe the image</span>
          </div>
        )}
        
        {isRecording && (
          <div className="recording-timer">
            Recording time: {recordingTime}s / 40s
          </div>
        )}
      </div>
      
      <div className="instructions">
        <p><strong>Preparation time:</strong> You have 25 seconds to study the image.</p>
        <p><strong>Response time:</strong> You will have 40 seconds to describe the image.</p>
      </div>
      
      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={!isRecording && prepTime > 0}
        >
          {isRecording ? 'Stop and Continue' : 'Skip to Response'}
        </button>
      </div>
    </div>
  );
};

export default DescribeImage;