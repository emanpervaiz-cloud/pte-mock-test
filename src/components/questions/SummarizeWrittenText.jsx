import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ScoreDisplay from '../common/ScoreDisplay';
import AIEvaluationService from '../../services/aiEvaluationService';

const SummarizeWrittenText = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [summary, setSummary] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const words = summary.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [summary]);

  const handleChange = (e) => {
    const text = e.target.value;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length <= 75) {
      setSummary(text);
    }
  };

  const handleSave = () => {
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'writing',
      type: 'summarize_written_text',
      response: summary,
      meta: { wordCount: wordCount }
    });
    setIsSaved(true);
  };

  const handleGetScore = async () => {
    // Auto-save if not saved yet
    if (!isSaved) {
      handleSave();
    }

    setEvalLoading(true);
    setEvalError(null);
    console.log('SummarizeWrittenText: Getting AI score...', { summaryLength: summary.length });
    try {
      const evaluator = new AIEvaluationService();
      console.log('SummarizeWrittenText: Calling evaluateWriting...');
      const result = await evaluator.evaluateWriting(
        `PASSAGE: "${question.passage}"\n\nTASK: Summarize the passage above in ONE SINGLE SENTENCE (5-75 words). Use your own words. Do NOT copy the text directly. Direct copying will result in a score of 0.`,
        summary,
        'summarize_written_text'
      );
      console.log('SummarizeWrittenText: Evaluation result:', result);
      setEvaluation(result);

      // Store AI evaluation in localStorage for ResultsPage
      try {
        const aiEvaluations = JSON.parse(localStorage.getItem('pte_ai_evaluations') || '{}');
        aiEvaluations[question.id] = result;
        localStorage.setItem('pte_ai_evaluations', JSON.stringify(aiEvaluations));
        console.log('AI evaluation saved for question:', question.id);
      } catch (storageError) {
        console.error('Failed to save AI evaluation:', storageError);
      }
    } catch (err) {
      console.error('SummarizeWrittenText: Evaluation error:', err);
      setEvalError(err.message || 'Failed to evaluate. Please try again.');
    }
    setEvalLoading(false);
  };

  const handleSubmit = () => {
    if (!isSaved) handleSave();
    onNext();
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
        <h3 style={{ margin: '0 0 16px', fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Read the passage below:</h3>
        <div style={{
          background: 'rgba(13, 59, 102, 0.03)',
          padding: isMobile ? 16 : 24,
          borderRadius: 12,
          maxHeight: isMobile ? 200 : 'none',
          overflowY: 'auto'
        }}>
          <p style={{ margin: 0, lineHeight: 1.7, fontSize: isMobile ? 15 : 16, color: '#334155' }}>{question.passage}</p>
        </div>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: isMobile ? 16 : 20,
        padding: isMobile ? '20px 16px' : '32px',
        border: '1px solid #eef2f6',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Write your summary here:</h3>
        <textarea
          style={{
            width: '100%',
            padding: isMobile ? 16 : 20,
            borderRadius: 12,
            border: '1.5px solid #e2e8f0',
            fontSize: isMobile ? 15 : 16,
            lineHeight: 1.6,
            minHeight: isMobile ? 120 : 160,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit'
          }}
          value={summary}
          onChange={handleChange}
          placeholder="Write your summary in 5-75 words..."
          onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        <div style={{
          marginTop: 12, display: 'flex', justifyContent: 'space-between',
          fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)'
        }}>
          <span>{wordCount}/75 words</span>
          {wordCount < 5 && wordCount > 0 && <span style={{ color: '#dc2626' }}>Minimum 5 words</span>}
          {wordCount > 75 && <span style={{ color: '#dc2626' }}>Maximum exceeded</span>}
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 12, padding: '0 8px',
        fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>⏱️</span> 10 minutes
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📝</span> 5-75 words
        </div>
      </div>

      {/* Score Display */}
      <ScoreDisplay
        evaluation={evaluation}
        loading={evalLoading}
        error={evalError}
        onGetScore={handleGetScore}
        hasResponse={wordCount >= 5}
        questionType="writing"
      />

      <div style={{ display: 'flex', marginTop: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={wordCount < 5 || wordCount > 75}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: wordCount < 5 || wordCount > 75 ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: wordCount < 5 || wordCount > 75 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Submit & Continue →
        </button>
      </div>
    </div>
  );
};

export default SummarizeWrittenText;