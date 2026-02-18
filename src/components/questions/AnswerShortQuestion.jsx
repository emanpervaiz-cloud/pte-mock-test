import React, { useState, useRef } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const AnswerShortQuestion = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [questionPlayed, setQuestionPlayed] = useState(false);
  const recordingInterval = useRef(null);

  const handleQuestionEnd = () => {
    setQuestionPlayed(true);
    // Start recording automatically after question ends
    startRecording();
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Stop recording after 10 seconds (standard PTE time limit for answer short question)
    setTimeout(stopRecording, 10000);
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
    <div className="answer-short-question">
      <div className="question-section">
        {!questionPlayed ? (
          <div>
            <h3>Listen to the question</h3>
            <AudioPlayer 
              src={question.audioUrl || '/placeholder-audio.mp3'} 
              title="Question Audio"
              onPlay={() => console.log('Question started')}
              onPause={() => console.log('Question paused')}
            />
            <p className="instructions">Please listen to the question carefully.</p>
          </div>
        ) : (
          <div>
            <h3>Your Answer</h3>
            <p>{question.prompt}</p>
            <div className="recording-section">
              <div className="audio-controls">
                <button 
                  className={`record-button ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={recordingTime >= 10}
                >
                  {isRecording ? '●' : '●'}
                </button>
                <span>Click to record your answer</span>
              </div>
              
              {isRecording && (
                <div className="recording-timer">
                  Recording: {recordingTime}s / 10s
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="instructions">
        <p><strong>Question:</strong> Listen to the question once.</p>
        <p><strong>Response time:</strong> You will have 10 seconds to answer the question.</p>
      </div>
      
      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={questionPlayed && !isRecording}
        >
          {isRecording ? 'Stop and Continue' : questionPlayed ? 'Finish Answer' : 'Wait for Question to Finish'}
        </button>
      </div>
    </div>
  );
};

export default AnswerShortQuestion;