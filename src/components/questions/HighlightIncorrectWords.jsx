import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';
import ScoreDisplay from '../common/ScoreDisplay';
import AIEvaluationService from '../../services/aiEvaluationService';

const HighlightIncorrectWords = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [incorrectWords, setIncorrectWords] = useState([]);
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset states when question changes
  useEffect(() => {
    setEvaluation(null);
    setEvalLoading(false);
    setEvalError(null);
    setIncorrectWords([]);
    setIsSubmitted(false);
    setAudioPlayed(false);
  }, [question.id]);

  const handleWordClick = (index) => {
    if (isSubmitted) return;
    if (incorrectWords.includes(index)) {
      setIncorrectWords(incorrectWords.filter(i => i !== index));
    } else {
      setIncorrectWords([...incorrectWords, index]);
    }
  };

  const handleAudioPlay = () => {
    setAudioPlayed(true);
  };

  const handleGetScore = async () => {
    if (incorrectWords.length === 0 || evalLoading) return;
    
    setEvalLoading(true);
    setEvalError(null);
    
    try {
      // Get the actual words that were selected
      const words = question.transcript.split(' ');
      const responseWords = incorrectWords.map(idx => words[idx]);
      const result = await aiService.evaluateListeningQuestion(question, responseWords.join(', '));
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
      setEvalError('Could not get AI explanation. Please try again.');
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
      correct_answer: question.correct || question.answers || (question.options ? question.options.find(o => o.isCorrect)?.id : undefined) || question.correctResponse || question.transcript,
      response: incorrectWords,
      meta: { audioPlayed: audioPlayed }
    });

    setIsSubmitted(true);
  };

  const renderTranscriptWithClickableWords = () => {
    const words = question.transcript.split(' ');

    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const punctuation = word.match(/[.,!?;:]/g)?.join('') || '';
      const isHighlighted = incorrectWords.includes(index);

      return (
        <span
          key={index}
          style={{
            display: 'inline-block',
            padding: isMobile ? '4px 6px' : '2px 4px',
            margin: isMobile ? '2px' : '1px',
            borderRadius: 6,
            backgroundColor: isHighlighted ? '#fee2e2' : 'transparent',
            color: isHighlighted ? '#991b1b' : 'inherit',
            border: `1.5px solid ${isHighlighted ? '#fecaca' : 'transparent'}`,
            cursor: isSubmitted ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: isHighlighted ? 600 : 400,
            userSelect: 'none'
          }}
          onClick={() => handleWordClick(index)}
        >
          {cleanWord}{punctuation}
        </span>
      );
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
        background: '#fff',
        borderRadius: isMobile ? 16 : 20,
        padding: isMobile ? '20px 16px' : '32px',
        border: '1px solid #eef2f6',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Identify the incorrect words:</h3>
        <div style={{
          fontSize: isMobile ? 15 : 16,
          color: '#334155',
          lineHeight: isMobile ? 2.4 : 2.0,
          textAlign: 'justify'
        }}>
          {renderTranscriptWithClickableWords()}
        </div>
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)'
      }}>
        <div style={{ marginBottom: 4 }}><strong>Instructions:</strong> Click on the words that are different from what you heard.</div>
        <div style={{ fontStyle: 'italic', color: '#64748b' }}>Note: You can only play the audio once.</div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={incorrectWords.length === 0}
            style={{
              flex: isMobile ? 1 : 'none',
              padding: '14px 40px', borderRadius: 12,
              background: incorrectWords.length === 0 ? '#e2e8f0' : 'var(--primary-color)',
              color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
              cursor: incorrectWords.length === 0 ? 'not-allowed' : 'pointer',
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

      <ScoreDisplay 
          evaluation={evaluation} 
          loading={evalLoading} 
          error={evalError} 
          onGetScore={handleGetScore}
          hasResponse={isSubmitted}
          questionType="writing"
      />

      {isSubmitted && !evaluation && !evalLoading && (
        <div style={{
          marginTop: 24,
          padding: '20px',
          background: 'rgba(13, 59, 102, 0.05)',
          borderRadius: '12px',
          border: '1px solid var(--primary-color)',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <h4 style={{ color: 'var(--primary-color)', margin: '0 0 12px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>✅</span> Self-Review Feedback
          </h4>
          <p style={{ color: 'var(--primary-color)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
            Compare your highlighted words with the recording. In a real test, points are deducted for incorrect selections.
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

export default HighlightIncorrectWords;