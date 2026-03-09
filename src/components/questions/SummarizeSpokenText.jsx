import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';
import ScoreDisplay from '../common/ScoreDisplay';
import AIEvaluationService from '../../services/aiEvaluationService';

const SummarizeSpokenText = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [summary, setSummary] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // AI Evaluation State
  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);

  // Reset state when question changes
  useEffect(() => {
    setSummary('');
    setWordCount(0);
    setAudioPlayed(false);
    setIsSaved(false);
    setIsSubmitted(false);
    setEvaluation(null);
    setEvalLoading(false);
    setEvalError(null);
  }, [question?.id]);

  // Calculate word count whenever summary changes
  useEffect(() => {
    const words = summary.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [summary]);

  const handleChange = (e) => {
    setSummary(e.target.value);
  };

  const handleAudioPlay = () => {
    setAudioPlayed(true);
  };

  const handleSave = () => {
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'listening',
      type: 'summarize_spoken_text',
      response: summary,
      meta: { wordCount: wordCount, audioPlayed: audioPlayed }
    });
    setIsSaved(true);
  };

  const handleGetScore = async () => {
    if (!isSaved) handleSave();

    setEvalLoading(true);
    setEvalError(null);
    console.log('=== Starting AI Evaluation ===');
    console.log('Question ID:', question?.id);
    console.log('Summary length:', summary?.length);
    console.log('Summary content:', summary?.substring(0, 100));

    try {
      const evaluator = new AIEvaluationService();
      console.log('Evaluator created, calling evaluateWriting...');

      // Use evaluateWriting for Summarize Spoken Text since the student's output is written text
      // We pass the transcript or instruction as the 'prompt' context for the LLM
      const result = await evaluator.evaluateWriting(
        `AUDIO TRANSCRIPT CONTEXT: "${question.transcript || question.title || question.instruction}"\n\nTASK: Summarize the spoken lecture in your own words. Do NOT copy the transcript directly if provided. Direct copying will result in a score of 0.`,
        summary,
        'summarize_spoken_text'
      );

      console.log('AI Evaluation Result:', JSON.stringify(result, null, 2));
      setEvaluation(result);

      // Store AI evaluation in localStorage for ResultsPage
      try {
        const aiEvaluations = JSON.parse(localStorage.getItem('pte_ai_evaluations') || '{}');
        aiEvaluations[question.id] = result;
        localStorage.setItem('pte_ai_evaluations', JSON.stringify(aiEvaluations));
        console.log('AI evaluation saved for question:', question.id);
        console.log('Current stored evaluations:', Object.keys(aiEvaluations));
      } catch (storageError) {
        console.error('Failed to save AI evaluation:', storageError);
      }
    } catch (err) {
      console.error('=== AI Evaluation Error ===');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setEvalError(err.message || 'Failed to evaluate. Please try again.');
    }
    setEvalLoading(false);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      onNext();
      return;
    }
    if (!isSaved) handleSave();
    setIsSubmitted(true);

    // Auto navigate to next question after showing answer for 3 seconds
    setTimeout(() => {
      onNext();
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 24 }}>
      <div style={{
        background: '#fff', padding: isMobile ? 16 : 24, borderRadius: 16, border: '1px solid #eef2f6'
      }}>
        <AudioPlayer
          src={question.audioUrl}
          title={isMobile ? "Listen" : "Listen to the lecture"}
          onPlay={handleAudioPlay}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Write your summary:</h3>
        <textarea
          style={{
            width: '100%',
            minHeight: isMobile ? 180 : 220,
            padding: isMobile ? '16px' : '20px',
            borderRadius: 16,
            border: '1.5px solid #e2e8f0',
            fontSize: isMobile ? 15 : 16,
            lineHeight: 1.6,
            color: '#1a1f36',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
            background: '#fff'
          }}
          value={summary}
          onChange={handleChange}
          placeholder={`Write your summary (${question.minWords}-${question.maxWords} words)...`}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', fontSize: 13,
          color: (wordCount < question.minWords || wordCount > question.maxWords) ? '#ef4444' : '#64748b',
          fontWeight: 600, padding: '0 4px'
        }}>
          <span>{wordCount}/{question.maxWords} words</span>
          {wordCount > 0 && wordCount < question.minWords && <span>Min {question.minWords} required</span>}
          {wordCount > question.maxWords && <span>Max {question.maxWords} exceeded</span>}
        </div>
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)'
      }}>
        <div style={{ marginBottom: 4 }}><strong>Instructions:</strong> Summarize lecture in {question.minWords}-{question.maxWords} words.</div>
        <div style={{ fontStyle: 'italic', color: '#64748b' }}>Note: You can only play the audio once.</div>
      </div>

      {/* AI Score Button - Shows when user has written summary */}
      {wordCount >= 5 && audioPlayed && !evaluation && !evalLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
          <button
            onClick={handleGetScore}
            style={{
              padding: '14px 36px', borderRadius: 14,
              background: 'var(--secondary-color)',
              color: 'var(--primary-color)', border: 'none',
              fontWeight: 700, fontSize: 16, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(250, 169, 22, 0.3)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span style={{ fontSize: 22 }}>📊</span>
            Get AI Score
          </button>
        </div>
      )}

      {/* Score Display - Only shows results, not the button */}
      <ScoreDisplay
        evaluation={evaluation}
        loading={evalLoading}
        error={evalError}
        onGetScore={handleGetScore}
        hasResponse={false}
        questionType="writing"
        responseText={summary}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={wordCount > question.maxWords || wordCount === 0}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: (wordCount > question.maxWords || wordCount === 0) ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: (wordCount > question.maxWords || wordCount === 0) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(13, 59, 102, 0.15)'
          }}
        >
          {isSubmitted ? 'Next Question →' : 'Submit Summary →'}
        </button>
      </div>

      {isSubmitted && (
        <div style={{
          marginTop: 24,
          padding: '24px',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <h4 style={{ color: 'var(--primary-color)', margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>💡</span> Suggested Model Answer / Key Points
          </h4>

          {question.keyPoints ? (
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
              {question.keyPoints.map((point, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>{point}</li>
              ))}
            </ul>
          ) : question.modelAnswer ? (
            <p style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: '1.6', fontStyle: 'italic' }}>
              {question.modelAnswer}
            </p>
          ) : (
            <p style={{ margin: 0, color: '#475569', fontSize: '15px' }}>
              Refer to the transcript above for self-review.
            </p>
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

export default SummarizeSpokenText;