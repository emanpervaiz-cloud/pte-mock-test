import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';
import ScoreDisplay from '../common/ScoreDisplay';
import AIEvaluationService from '../../services/aiEvaluationService';

const SelectMissingWord = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [selectedOption, setSelectedOption] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // AI Scoring States
  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);
  const aiService = new AIEvaluationService();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    // Reset states when question changes
    setEvaluation(null);
    setEvalLoading(false);
    setEvalError(null);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAudioPlayed(false);
    return () => window.removeEventListener('resize', handleResize);
  }, [question.id]);

  const handleOptionSelect = (option) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleAudioPlay = () => {
    setAudioPlayed(true);
  };

  const handleGetScore = async () => {
    if (!selectedOption || evalLoading) return;
    
    setEvalLoading(true);
    setEvalError(null);
    
    try {
      const result = await aiService.evaluateListeningQuestion(question, selectedOption);
      setEvaluation(result);
      
      // Store AI evaluation for ResultsPage
      try {
        const aiEvaluations = JSON.parse(localStorage.getItem('pte_ai_evaluations') || '{}');
        aiEvaluations[question.id] = result;
        localStorage.setItem('pte_ai_evaluations', JSON.stringify(aiEvaluations));
      } catch (storageError) {
        console.error('Failed to save AI evaluation:', storageError);
      }
      
    } catch (err) {
      console.error('AI scoring error:', err);
      setEvalError('Could not get AI explanation. Please check your connection.');
    } finally {
      setEvalLoading(false);
    }
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
      correct_answer: question.correct || question.correct_answer,
      response: selectedOption,
      meta: { audioPlayed: audioPlayed }
    });

    setIsSubmitted(true);
    // Don't auto-navigate, let user see feedback/get AI score
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

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            style={{
              flex: isMobile ? 1 : 'none',
              padding: '14px 40px', borderRadius: 12,
              background: (selectedOption === null) ? '#e2e8f0' : 'var(--primary-color)',
              color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
              cursor: (selectedOption === null) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(13, 59, 102, 0.15)'
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={onNext}
            style={{
              flex: isMobile ? 1 : 'none',
              padding: '14px 40px', borderRadius: 12,
              background: '#f1f5f9',
              color: 'var(--primary-color)', border: '1px solid var(--primary-color)', 
              fontWeight: 700, fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Next Question →
          </button>
        )}
      </div>

      {isSubmitted && !evaluation && !evalLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <button
                onClick={handleGetScore}
                style={{
                    padding: '12px 24px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                    display: 'flex', alignItems: 'center', gap: 8
                }}
            >
                ✨ Get AI Explanation
            </button>
        </div>
      )}

      {/* AI Score Display */}
      <ScoreDisplay 
          evaluation={evaluation} 
          loading={evalLoading} 
          error={evalError} 
          onGetScore={handleGetScore}
          hasResponse={isSubmitted}
          questionType="writing" // Reusing writing styling for feedback
      />

      {isSubmitted && !evaluation && !evalLoading && (
        <div style={{
          marginTop: 16,
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
              {selectedOption}) {question.options.find(opt => (opt.id || opt.charAt(0)) === selectedOption)?.text}
            </p>
          </div>

          {selectedOption !== question.correct && (
            <div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Correct Answer:</p>
              <p style={{ color: '#15803d', fontWeight: 600, margin: 0, fontSize: 16 }}>
                {question.correct}) {question.options.find(opt => (opt.id || opt.charAt(0)) === question.correct)?.text}
              </p>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SelectMissingWord;