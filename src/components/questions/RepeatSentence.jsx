import React, { useState, useRef } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const RepeatSentence = ({ question, onNext }) => {
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
    
    // Stop recording after 15 seconds (standard PTE time limit for repeat sentence)
    setTimeout(stopRecording, 15000);
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
    <div className="repeat-sentence-question">
      <div className="prompt-text">
        <p>{question.prompt}</p>
      </div>
      
      <div className="audio-controls">
        <AudioPlayer 
          src={question.audioUrl || '/placeholder-audio.mp3'} 
          title="Listen to the sentence"
        />
      </div>
      
      <div className="recording-section">
        <div className="audio-controls">
          <button 
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={recordingTime >= 15}
          >
            {isRecording ? '●' : '●'}
          </button>
          <span>Click to record your repetition</span>
        </div>
        
        {isRecording && (
          <div className="recording-timer">
            Recording: {recordingTime}s / 15s
          </div>
        )}
      </div>
      
      <div className="instructions">
        <p><strong>Preparation time:</strong> You will hear the sentence once.</p>
        <p><strong>Response time:</strong> You will have 15 seconds to repeat the sentence.</p>
      </div>
      
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleNext}>
          {isRecording ? 'Stop and Continue' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default RepeatSentence;