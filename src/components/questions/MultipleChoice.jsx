import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AIEvaluationService from '../../services/aiEvaluationService';
import ScoreDisplay from '../common/ScoreDisplay';

const MultipleChoice = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [selectedOptions, setSelectedOptions] = useState([]);
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
    if (question) {
      setSelectedOptions([]);
      setIsSubmitted(false);
      setEvaluation(null);
      setEvalLoading(false);
      setEvalError(null);
    }
  }, [question?.id]);

  const handleOptionToggle = (optionId) => {
    if (question.multiple) {
      // For multiple choice, allow multiple selections
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      // For single choice, only allow one selection
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      onNext();
      return;
    }

    // Don't submit if no answer selected
    if (selectedOptions.length === 0) {
      return;
    }

    // Save the answer
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'reading',
      type: 'multiple_choice',
      responses: selectedOptions
    });

    setIsSubmitted(true);
    handleGetAIScore(selectedOptions);
  };

  const handleGetAIScore = async (currentResponses) => {
    setEvalLoading(true);
    setEvalError(null);

    try {
      const evaluator = new AIEvaluationService();

      // Format current answer for evaluation
      const questionsWithAnswers = [{
        id: question.id,
        type: 'multiple_choice',
        question: question.question,
        correct_answer: question.correct,
        response: currentResponses
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
        <h3 style={{ margin: 0, fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700, lineHeight: 1.5 }}>
          {question.question}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <div
              key={option.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: isMobile ? '14px 16px' : '16px 20px',
                background: isSelected ? 'rgba(13, 59, 102, 0.04)' : '#fff',
                borderRadius: 12,
                border: `1.5px solid ${isSelected ? 'var(--primary-color)' : '#eef2f6'}`,
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(13, 59, 102, 0.08)' : 'none'
              }}
              onClick={() => !isSubmitted && handleOptionToggle(option.id)}
            >
              <div style={{
                width: 20,
                height: 20,
                borderRadius: question.multiple ? 4 : '50%',
                border: `2px solid ${isSelected ? 'var(--primary-color)' : '#cbd5e1'}`,
                background: isSelected ? 'var(--primary-color)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isSelected && (
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: question.multiple ? 1 : '50%',
                    background: '#fff'
                  }} />
                )}
              </div>
              <div style={{
                fontSize: isMobile ? 14 : 15,
                color: isSelected ? '#1a1f36' : '#475569',
                fontWeight: isSelected ? 600 : 500,
                lineHeight: 1.5
              }}>
                {option.text}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)',
        fontStyle: 'italic', display: isSubmitted ? 'none' : 'block'
      }}>
        <strong>Instructions:</strong> {question.multiple ? 'Select all that apply.' : 'Select one answer.'}
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
              {question.multiple ? 'Correct Answers:' : 'Correct Answer:'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                const isCorrect = Array.isArray(question.correct)
                  ? question.correct.includes(option.id)
                  : question.correct === option.id;

                if (!isCorrect && !isSelected) return null;

                return (
                  <div key={option.id} style={{
                    padding: isMobile ? '12px' : '12px 16px',
                    backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2',
                    borderRadius: 10,
                    border: `1px solid ${isCorrect ? '#bcf0da' : '#fecaca'}`,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    <span style={{
                      fontWeight: 800,
                      color: isCorrect ? '#166534' : '#991b1b',
                      minWidth: 20
                    }}>{option.id}.</span>
                    <span style={{ color: isCorrect ? '#166534' : '#991b1b', flex: 1 }}>
                      {option.text}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: isCorrect ? '#166534' : '#991b1b'
                    }}>
                      {isCorrect && isSelected && '✓ Your answer'}
                      {isCorrect && !isSelected && '✓ Correct'}
                      {!isCorrect && isSelected && '✗ Incorrect'}
                    </span>
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
                  {Array.isArray(question.correct)
                    ? selectedOptions.filter(id => question.correct.includes(id)).length
                    : (selectedOptions.includes(question.correct) ? 1 : 0)} / {Array.isArray(question.correct) ? question.correct.length : 1}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ marginTop: '8px' }}>
        <button
          onClick={handleSubmit}
          disabled={!isSubmitted && selectedOptions.length === 0}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 32px', borderRadius: 12,
            background: !isSubmitted && selectedOptions.length === 0 ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: !isSubmitted && selectedOptions.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(13, 59, 102, 0.15)'
          }}
        >
          {isSubmitted ? 'Next Question →' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default MultipleChoice;