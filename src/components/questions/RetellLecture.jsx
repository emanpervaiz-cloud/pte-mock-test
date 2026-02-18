import React, { useState, useRef } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const RetellLecture = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [lecturePlayed, setLecturePlayed] = useState(false);
  const recordingInterval = useRef(null);

  const handleLectureEnd = () => {
    setLecturePlayed(true);
    // Start recording automatically after lecture ends
    startRecording();
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Stop recording after 40 seconds (standard PTE time limit for retell lecture)
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
    <div className="retell-lecture-question">
      <div className="lecture-section">
        {!lecturePlayed ? (
          <div>
            <h3>Listen to the lecture</h3>
            <AudioPlayer 
              src={question.audioUrl || '/placeholder-audio.mp3'} 
              title="Lecture Audio"
              onPlay={() => console.log('Lecture started')}
              onPause={() => console.log('Lecture paused')}
            />
            <p className="instructions">Please listen to the entire lecture before continuing.</p>
          </div>
        ) : (
          <div>
            <h3>Retell the lecture</h3>
            <div className="recording-section">
              <div className="audio-controls">
                <button 
                  className={`record-button ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={recordingTime >= 40}
                >
                  {isRecording ? '●' : '●'}
                </button>
                <span>Click to start recording your retelling</span>
              </div>
              
              {isRecording && (
                <div className="recording-timer">
                  Recording: {recordingTime}s / 40s
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="instructions">
        <p><strong>Lecture:</strong> Listen to the entire lecture once.</p>
        <p><strong>Response time:</strong> You will have 40 seconds to retell the lecture in your own words.</p>
      </div>
      
      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={lecturePlayed && !isRecording}
        >
          {isRecording ? 'Stop and Continue' : lecturePlayed ? 'Finish Recording' : 'Wait for Lecture to Finish'}
        </button>
      </div>
    </div>
  );
};

export default RetellLecture;