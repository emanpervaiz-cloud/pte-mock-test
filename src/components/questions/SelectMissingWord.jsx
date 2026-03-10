import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const SelectMissingWord = ({ question, onNext }) => {
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

  const handleOptionSelect = (option) => {
    if (isSubmitted) return;
    setSelectedOption(option);
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

    // Show answer and auto-proceed to next after delay
    setIsSubmitted(true);

    // Auto navigate to next question after showing answer for 2 seconds
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const renderTranscriptWithBlank = () => {
    // Use context if available, otherwise use transcript
    const text = question.context || question.transcript || '';

    // Replace ... or ___ with a blank marker
    const blankPattern = /(\.\.\.|___+|\[blank\])/i;
    const parts = text.split(blankPattern);

    return parts.map((part, index) => {
      if (part && (part === '...' || part === '___' || part.match(/^___+$/))) {
        return (
          <select
            key={`blank-${index}`}
            value={selectedOption || ''}
            onChange={(e) => handleOptionSelect(e.target.value)}
            disabled={isSubmitted}
            style={{
              padding: isMobile ? '4px 8px' : '8px 16px',
              fontSize: isMobile ? 14 : 16,
              borderRadius: 8,
              border: `2px solid ${selectedOption ? 'var(--primary-color)' : '#cbd5e1'}`,
              backgroundColor: '#fff',
              color: selectedOption ? 'var(--primary-color)' : '#64748b',
              cursor: isSubmitted ? 'not-allowed' : 'pointer',
              margin: '0 4px',
              height: isMobile ? 32 : 40,
              fontWeight: 600
            }}
          >
            <option value="">{isMobile ? "..." : "Select..."}</option>
            {question.options && question.options.map(option => (
              <option key={option.id || option} value={option.id || option}>
                {option.id ? `${option.id}) ${option.text}` : option}
              </option>
            ))}
          </select>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 24 }}>
      <div style={{
        background: '#fff', padding: isMobile ? 16 : 24, borderRadius: 16, border: '1px solid #eef2f6'
      }}>
        <AudioPlayer
          src={question.audioUrl}
          title={isMobile ? "Listen" : "Listen to the passage"}
          onPlay={handleAudioPlay}
        />
      </div>

      <div style={{
        background: '#f8f9fe',
        borderRadius: 20,
        padding: isMobile ? '20px 16px' : '24px 32px',
        border: '1px solid #eef2f6',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Select the missing word:</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.5 }}>
          {isMobile ? "Select the word that completes the final sentence." : "Listen to the audio carefully and select the word that completes the final sentence."}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Options:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options && question.options.map((option, idx) => {
            const optionId = option.id || option.charAt(0);
            const optionText = option.text || option.substring(3);
            const isSelected = selectedOption === optionId;

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(optionId)}
                disabled={isSubmitted}
                style={{
                  padding: isMobile ? '14px 16px' : '16px 24px',
                  borderRadius: 12,
                  border: '1.5px solid',
                  borderColor: isSelected ? 'var(--primary-color)' : '#e2e8f0',
                  backgroundColor: isSelected ? 'rgba(13, 59, 102, 0.04)' : '#fff',
                  color: isSelected ? 'var(--primary-color)' : '#475569',
                  fontSize: isMobile ? 14 : 15,
                  textAlign: 'left',
                  cursor: isSubmitted ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 2px 8px rgba(13, 59, 102, 0.08)' : 'none'
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: isSelected ? 'var(--primary-color)' : '#e2e8f0',
                  color: isSelected ? '#fff' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12
                }}>
                  {optionId}
                </span>
                <span style={{ fontWeight: isSelected ? 600 : 500 }}>{optionText}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)'
      }}>
        <div style={{ marginBottom: 4 }}><strong>Instructions:</strong> Select the most appropriate word to complete the passage.</div>
        <div style={{ fontStyle: 'italic', color: '#64748b' }}>Note: You can only play the audio once.</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={!isSubmitted && selectedOption === null}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: (!isSubmitted && selectedOption === null) ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: (!isSubmitted && selectedOption === null) ? 'not-allowed' : 'pointer',
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
          <h4 style={{
            color: 'var(--primary-color)',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 20 }}>
              {selectedOption === question.correct ? '✅' : '❌'}
            </span>
            {selectedOption === question.correct ? 'Correct Answer!' : 'Incorrect Answer'}
          </h4>

          <div style={{ marginBottom: '8px' }}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Your Answer:</p>
            <p style={{
              color: selectedOption === question.correct ? 'var(--primary-color)' : '#dc2626',
              fontWeight: 600,
              margin: 0,
              fontSize: 16
            }}>
              {selectedOption}) {question.options.find(opt => (opt.id || opt.charAt(0)) === selectedOption)?.text || question.options.find(opt => opt.charAt(0) === selectedOption)?.substring(3)}
            </p>
          </div>

          {selectedOption !== question.correct && (
            <div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Correct Answer:</p>
              <p style={{ color: '#15803d', fontWeight: 600, margin: 0, fontSize: 16 }}>
                {question.correct}) {question.options.find(opt => (opt.id || opt.charAt(0)) === question.correct)?.text || question.options.find(opt => opt.charAt(0) === question.correct)?.substring(3)}
              </p>
            </div>
          )}

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

export default SelectMissingWord;