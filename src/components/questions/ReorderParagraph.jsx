import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AIEvaluationService from '../../services/aiEvaluationService';
import ScoreDisplay from '../common/ScoreDisplay';

const ReorderParagraph = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [orderedSentences, setOrderedSentences] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // AI Evaluation State
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
    if (question && question.sentences && question.sentences.length > 0) {
      setOrderedSentences([...question.sentences].sort(() => Math.random() - 0.5));
      setIsSubmitted(false);
      setEvaluation(null);
      setEvalLoading(false);
      setEvalError(null);
    }
  }, [question?.id]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    moveItem(dragIndex, dropIndex);
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= orderedSentences.length) return;

    const newOrderedSentences = [...orderedSentences];
    const item = newOrderedSentences[fromIndex];
    newOrderedSentences.splice(fromIndex, 1);
    newOrderedSentences.splice(toIndex, 0, item);
    setOrderedSentences(newOrderedSentences);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      onNext();
      return;
    }

    // Don't submit if no sentences ordered
    if (orderedSentences.length === 0) {
      return;
    }

    // Save the answer
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'reading',
      type: 'reorder_paragraph',
      responses: orderedSentences.map(sentence => sentence.id)
    });

    setIsSubmitted(true);
    handleGetAIScore(orderedSentences);
  };

  const handleGetAIScore = async (currentSentences) => {
    setEvalLoading(true);
    setEvalError(null);

    try {
      const evaluator = new AIEvaluationService();

      // Format current answer for evaluation
      const questionsWithAnswers = [{
        id: question.id,
        type: 'reorder_paragraph',
        prompt: question.prompt,
        correct_answer: question.sentences.map(s => s.id),
        response: currentSentences.map(s => s.id)
      }];

      const result = await evaluator.evaluateReading(questionsWithAnswers);
      setEvaluation(result);

      // Store in localStorage
      const aiEvaluations = JSON.parse(localStorage.getItem('pte_ai_evaluations') || '{}');
      aiEvaluations[question.id] = result;
      localStorage.setItem('pte_ai_evaluations', JSON.stringify(aiEvaluations));

    } catch (err) {
      console.error('AI Evaluation Error:', err);
      setEvalError('Failed to get AI score. Numerical score shown below.');
    } finally {
      setEvalLoading(false);
    }
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
        <p style={{ margin: 0, fontSize: isMobile ? 15 : 16, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
          {question.prompt}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ margin: 0, fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Reorder the sentences:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orderedSentences.map((sentence, index) => (
            <div
              key={sentence.id}
              draggable={!isSubmitted}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: isMobile ? '12px' : '16px 20px',
                background: '#fff',
                borderRadius: 12,
                border: '1.5px solid #eef2f6',
                cursor: isSubmitted ? 'default' : 'grab',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                position: 'relative'
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-color)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1, fontSize: isMobile ? 14 : 15, color: '#334155', lineHeight: 1.5 }}>
                {sentence.text}
              </div>

              {!isSubmitted && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    style={{
                      padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0',
                      background: '#f8fafc', color: '#64748b', fontSize: 10, cursor: 'pointer',
                      opacity: index === 0 ? 0.3 : 1
                    }}>
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === orderedSentences.length - 1}
                    style={{
                      padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0',
                      background: '#f8fafc', color: '#64748b', fontSize: 10, cursor: 'pointer',
                      opacity: index === orderedSentences.length - 1 ? 0.3 : 1
                    }}>
                    ▼
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)',
        fontStyle: 'italic', display: isSubmitted ? 'none' : 'block'
      }}>
        <strong>Instructions:</strong> {isMobile ? 'Use arrows or drag to reorder sentences.' : 'Drag and drop the sentences to restore the original order.'}
      </div>

      {isSubmitted && (
        <>
          <div style={{
            marginTop: '8px',
            padding: isMobile ? '16px' : '24px',
            backgroundColor: 'rgba(13, 59, 102, 0.03)',
            borderRadius: 16,
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '16px', fontSize: 16, fontWeight: 700 }}>
              Correct Order:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.sentences?.map((sentence, idx) => {
                const userIndex = orderedSentences.findIndex(s => s.id === sentence.id);
                const isCorrectPosition = userIndex === idx;
                return (
                  <div key={sentence.id} style={{
                    padding: isMobile ? '12px' : '12px 16px',
                    backgroundColor: isCorrectPosition ? '#f0fdf4' : '#fef2f2',
                    borderRadius: 10,
                    border: `1px solid ${isCorrectPosition ? '#bcf0da' : '#fecaca'}`,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{
                      fontWeight: 800,
                      color: isCorrectPosition ? '#166534' : '#991b1b',
                      minWidth: 20
                    }}>{idx + 1}.</span>
                    <span style={{ color: isCorrectPosition ? '#166534' : '#991b1b', flex: 1 }}>
                      {sentence.text}
                    </span>
                    {!isCorrectPosition && (
                      <span style={{ color: '#991b1b', fontSize: 12, fontWeight: 700 }}>
                        (Pos: {userIndex + 1})
                      </span>
                    )}
                    {isCorrectPosition && <span style={{ color: '#166534', fontWeight: 700 }}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="evaluation-section" style={{ marginTop: '24px' }}>
            <ScoreDisplay
              evaluation={evaluation}
              loading={evalLoading}
              error={evalError}
              questionType="reading"
            />

            {!evaluation && !evalLoading && (
              <div className="numerical-score-fallback" style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginTop: '12px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>Numerical Score:</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {question.sentences.filter((s, idx) => orderedSentences[idx]?.id === s.id).length} / {question.sentences.length}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ marginTop: '8px' }}>
        <button
          onClick={handleSubmit}
          disabled={orderedSentences.length === 0}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 32px', borderRadius: 12,
            background: orderedSentences.length === 0 ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: orderedSentences.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(13, 59, 102, 0.15)'
          }}
        >
          {isSubmitted ? 'Next Question →' : 'Submit Order'}
        </button>
      </div>
    </div>
  );
};

export default ReorderParagraph;