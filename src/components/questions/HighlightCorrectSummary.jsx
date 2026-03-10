import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const HighlightCorrectSummary = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [selectedOption, setSelectedOption] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOptionSelect = (optionId) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleAudioPlay = () => {
    setAudioPlayed(true);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      onNext();
      return;
    }

    // Save the answer
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'listening',
      
      correct_answer: question.correct || question.answers || (question.options ? question.options.find(o => o.isCorrect)?.id : undefined) || question.correctResponse || question.transcript,
      response: selectedOption,
      meta: { audioPlayed: audioPlayed }
    });

    // Move to next question
    onNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 24 }}>
      <div style={{
        background: '#fff', padding: isMobile ? 16 : 24, borderRadius: 16, border: '1px solid #eef2f6'
      }}>
        <AudioPlayer
          src={question.audioUrl}
          title={isMobile ? "Listen" : "Listen to the talk"}
          onPlay={handleAudioPlay}
        />
      </div>

      <div style={{
        background: '#fff',
        borderRadius: isMobile ? 16 : 20,
        padding: isMobile ? '20px 16px' : '32px',
        border: '1px solid #eef2f6',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ margin: 0, fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700, lineHeight: 1.5 }}>
          Which option best summarizes the talk?
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <div
              key={option.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: isMobile ? '16px' : '16px 20px',
                background: isSelected ? 'rgba(13, 59, 102, 0.04)' : '#fff',
                borderRadius: 12,
                border: `1.5px solid ${isSelected ? 'var(--primary-color)' : '#eef2f6'}`,
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(13, 59, 102, 0.08)' : 'none'
              }}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${isSelected ? 'var(--primary-color)' : '#cbd5e1'}`,
                background: isSelected ? 'var(--primary-color)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <div style={{
                fontSize: isMobile ? 14 : 15, color: isSelected ? '#1a1f36' : '#475569',
                fontWeight: isSelected ? 600 : 500, lineHeight: 1.5
              }}>
                {option.text}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)'
      }}>
        <div style={{ marginBottom: 4 }}><strong>Instructions:</strong> Select the option that best summarizes the talk.</div>
        <div style={{ fontStyle: 'italic', color: '#64748b' }}>Note: You can only play the audio once.</div>
      </div>

      <div style={{ display: 'flex' }}>
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: selectedOption === null ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: selectedOption === null ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(13, 59, 102, 0.15)'
          }}
        >
          {isSubmitted ? 'Next Question →' : 'Submit Answer'}
        </button>
      </div>

      {isSubmitted && (
        <div style={{
          marginTop: 24,
          padding: '20px',
          background: 'rgba(13, 59, 102, 0.05)',
          borderRadius: '12px',
          border: '1px solid var(--primary-color)',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <h4 style={{ color: 'var(--primary-color)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>✅</span> Correct Answer
          </h4>
          <p style={{ color: 'var(--primary-color)', fontWeight: 600, margin: 0, fontSize: 16 }}>
            {`The correct summary is: Option ${question.correct}`}
          </p>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default HighlightCorrectSummary;