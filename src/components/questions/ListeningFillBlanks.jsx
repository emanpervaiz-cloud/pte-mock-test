import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const ListeningFillBlanks = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [answers, setAnswers] = useState({});
  const [availableOptions, setAvailableOptions] = useState([...question.options]);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOptionSelect = (blankNumber, selectedOption) => {
    const prevSelection = answers[blankNumber];

    // Update the answer for this blank
    setAnswers(prev => ({
      ...prev,
      [blankNumber]: selectedOption
    }));

    // Update available options
    if (selectedOption) {
      // Remove selected option and add back previous selection if any
      setAvailableOptions(opts => {
        let newOpts = opts.filter(opt => opt !== selectedOption);
        if (prevSelection && prevSelection !== selectedOption) {
          newOpts = [...newOpts, prevSelection];
        }
        return newOpts;
      });
    } else if (prevSelection) {
      // If clearing the selection, add back the previous selection
      setAvailableOptions(opts => [...opts, prevSelection]);
    }
  };

  const handleAudioPlay = () => {
    setAudioPlayed(true);
  };

  const handleSubmit = () => {
    // Save the answers
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'listening',
      type: 'listening_fill_blanks',
      responses: answers,
      meta: { audioPlayed: audioPlayed }
    });

    // Move to next question
    onNext();
  };

  const renderPassageWithBlanks = () => {
    // Split the passage by blank markers like ___1___, ___2___, etc.
    const parts = question.passage.split(/(___\d+___)/);

    return parts.map((part, index) => {
      const blankMatch = part.match(/___(\d+)___/);

      if (blankMatch) {
        const blankNumber = blankMatch[1];
        const currentAnswer = answers[blankNumber] || '';

        return (
          <select
            key={`blank-${blankNumber}`}
            value={currentAnswer}
            onChange={(e) => handleOptionSelect(blankNumber, e.target.value)}
            style={{
              padding: isMobile ? '4px 8px' : '4px 12px',
              margin: '0 4px',
              borderRadius: 6,
              border: `1.5px solid ${currentAnswer ? 'var(--primary-color)' : '#cbd5e1'}`,
              background: currentAnswer ? 'rgba(13, 59, 102, 0.04)' : '#fff',
              fontSize: isMobile ? 14 : 15,
              fontWeight: 600,
              color: 'var(--primary-color)',
              minWidth: isMobile ? 100 : 120,
              cursor: isSubmitted ? 'default' : 'pointer',
              outline: 'none',
              height: isMobile ? 32 : 36
            }}
            disabled={isSubmitted}
          >
            <option value="">{isMobile ? "..." : "Select option"}</option>
            {availableOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
            {currentAnswer && !availableOptions.includes(currentAnswer) && (
              <option value={currentAnswer}>{currentAnswer}</option>
            )}
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
        background: '#fff',
        borderRadius: isMobile ? 16 : 20,
        padding: isMobile ? '20px 16px' : '32px',
        border: '1px solid #eef2f6',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          fontSize: isMobile ? 15 : 16,
          color: '#334155',
          lineHeight: isMobile ? 2.2 : 1.8,
          textAlign: 'justify'
        }}>
          {renderPassageWithBlanks()}
        </div>
      </div>

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
        background: '#f8fafc',
        borderRadius: 16,
        padding: isMobile ? '16px' : '20px 24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Available Options:
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: isMobile ? 100 : 'none', overflowY: 'auto', padding: '4px' }}>
          {availableOptions.map((option, index) => (
            <span key={index} style={{
              background: '#fff', padding: '6px 12px', borderRadius: 8,
              fontSize: 13, color: 'var(--primary-color)', fontWeight: 600,
              border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              {option}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8
      }}>
        <div style={{ marginBottom: 4 }}><strong>Instructions:</strong> Complete the text with the words from the bank.</div>
        <div style={{ fontStyle: 'italic', color: '#64748b' }}>Note: You can only play the audio once.</div>
      </div>

      <div style={{ display: 'flex' }}>
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length === 0 && !isSubmitted}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: Object.keys(answers).length === 0 && !isSubmitted ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: Object.keys(answers).length === 0 && !isSubmitted ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isSubmitted ? 'Next Question →' : 'Submit Answers'}
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
          <h4 style={{ color: 'var(--primary-color)', margin: '0 0 12px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>✅</span> Correct Solutions
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {question.answers.map((ans, idx) => (
              <div key={idx} style={{
                padding: '8px 12px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #dcfce7',
                fontSize: '14px',
                color: '#166534',
                fontWeight: 500
              }}>
                Blank {ans.blank}: <strong style={{ color: '#15803d' }}>{ans.correct}</strong>
              </div>
            ))}
          </div>
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

export default ListeningFillBlanks;