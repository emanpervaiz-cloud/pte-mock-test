import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ScoreDisplay from '../common/ScoreDisplay';
import AIEvaluationService from '../../services/aiEvaluationService';

const WriteEssay = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [essay, setEssay] = useState('');
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
    const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [essay]);

  const handleChange = (e) => {
    setEssay(e.target.value);
  };

  const handleSave = () => {
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'writing',
      type: 'write_essay',
      response: essay,
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
    try {
      const evaluator = new AIEvaluationService();
      const result = await evaluator.evaluateWriting(
        `PROMPT: "${question.prompt}"\n\nTASK: Write an essay in response to the prompt above. Use your own words. Do NOT copy the prompt text directly. Direct copying will result in a score of 0.`,
        essay,
        'write_essay'
      );
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
        <h3 style={{ margin: '0 0 16px', fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Essay Prompt:</h3>
        <div style={{
          background: 'rgba(13, 59, 102, 0.03)',
          padding: isMobile ? 16 : 24,
          borderRadius: 12,
          borderLeft: '4px solid var(--primary-color)'
        }}>
          <p style={{ margin: 0, lineHeight: 1.6, fontSize: isMobile ? 15 : 16, color: '#334155', fontWeight: 500 }}>{question.prompt}</p>
        </div>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: isMobile ? 16 : 20,
        padding: isMobile ? '20px 16px' : '32px',
        border: '1px solid #eef2f6',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Write your essay here:</h3>
        <textarea
          style={{
            width: '100%',
            padding: isMobile ? 16 : 20,
            borderRadius: 12,
            border: '1.5px solid #e2e8f0',
            fontSize: isMobile ? 15 : 16,
            lineHeight: 1.6,
            minHeight: isMobile ? 200 : 300,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit'
          }}
          value={essay}
          onChange={handleChange}
          placeholder="Write your essay (200-300 words)..."
          onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        <div style={{
          marginTop: 12, display: 'flex', justifyContent: 'space-between',
          fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)'
        }}>
          <span>{wordCount}/300 words</span>
          {wordCount < 200 && wordCount > 0 && <span style={{ color: '#e6a23c' }}>Min 200 recommended</span>}
          {wordCount > 300 && <span style={{ color: '#dc2626' }}>Max exceeded</span>}
        </div>
      </div>

      <div style={{
        background: '#f8fafc',
        padding: isMobile ? '16px' : '20px 24px',
        borderRadius: 16,
        fontSize: 13,
        color: '#475569',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>⏱️</span> <strong>20 minutes</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>📝</span> <strong>200-300 words</strong>
          </div>
        </div>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          <strong>Guidelines:</strong> Organize your essay with an introduction, body paragraphs, and conclusion. Support your ideas with examples.
        </p>
      </div>

      {/* Score Display */}
      <ScoreDisplay
        evaluation={evaluation}
        loading={evalLoading}
        error={evalError}
        onGetScore={handleGetScore}
        hasResponse={wordCount >= 50}
        questionType="writing"
      />

      <div style={{ display: 'flex', marginTop: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={wordCount < 200}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: wordCount < 200 ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: wordCount < 200 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Submit & Continue →
        </button>
      </div>
    </div>
  );
};

export default WriteEssay;