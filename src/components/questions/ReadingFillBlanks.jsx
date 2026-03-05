import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AIEvaluationService from '../../services/aiEvaluationService';
import ScoreDisplay from '../common/ScoreDisplay';

const ReadingFillBlanks = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [answers, setAnswers] = useState({});
  const [availableOptions, setAvailableOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // AI Evaluation State
  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);

  // Mobile Native UI State
  const [activeBlank, setActiveBlank] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (question) {
      setAnswers({});
      setAvailableOptions(question.options ? [...question.options] : []);
      setIsSubmitted(false);
      setEvaluation(null);
      setEvalLoading(false);
      setEvalError(null);
    }
  }, [question?.id]);

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

  const handleSubmit = () => {
    if (isSubmitted) {
      onNext();
      return;
    }

    // Don't submit if no answers selected
    if (Object.keys(answers).length === 0) {
      return;
    }

    // Save the answers
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'reading',
      type: 'reading_fill_blanks',
      responses: answers
    });

    setIsSubmitted(true);
    handleGetAIScore(answers);
  };

  const handleGetAIScore = async (currentAnswers) => {
    setEvalLoading(true);
    setEvalError(null);

    try {
      const evaluator = new AIEvaluationService();

      // Format current answer for evaluation
      const questionsWithAnswers = [{
        id: question.id,
        type: 'reading_fill_blanks',
        passage: question.passage,
        correct_answer: question.answers.reduce((acc, a) => ({ ...acc, [a.blank]: a.correct }), {}),
        response: currentAnswers
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

  const renderPassageWithBlanks = () => {
    // Split the passage by blank markers like ___1___, ___2___, etc.
    const parts = question.passage.split(/(___\d+___)/);

    return parts.map((part, index) => {
      const blankMatch = part.match(/___(\d+)___/);

      if (blankMatch) {
        const blankNumber = blankMatch[1];
        const currentAnswer = answers[blankNumber] || '';

        return (
          <button
            key={`blank-${blankNumber}`}
            onClick={() => {
              if (!isSubmitted) {
                setActiveBlank(blankNumber);
                setIsSheetOpen(true);
              }
            }}
            className={`blank-trigger ${currentAnswer ? 'filled' : ''} ${activeBlank === blankNumber ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px',
              height: '32px',
              padding: '0 12px',
              margin: '0 4px',
              border: `2px solid ${activeBlank === blankNumber ? 'var(--primary-color)' : '#e2e8f0'}`,
              borderRadius: '6px',
              backgroundColor: currentAnswer ? 'rgba(13, 59, 102, 0.05)' : '#fff',
              fontSize: '16px',
              fontWeight: '600',
              color: currentAnswer ? 'var(--primary-color)' : '#94a3b8',
              cursor: isSubmitted ? 'default' : 'pointer',
              verticalAlign: 'middle',
              transition: 'all 0.2s ease'
            }}
          >
            {currentAnswer || `Blank ${blankNumber}`}
          </button>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className="reading-fill-blanks-question">
      <div className="passage-section">
        <div className="passage-text">
          {renderPassageWithBlanks()}
        </div>
      </div>

      <div className="options-bank">
        <h3>Available Options:</h3>
        <div className="options-list">
          {availableOptions.map((option, index) => (
            <span key={index} className="option-chip">
              {option}
            </span>
          ))}
        </div>
      </div>

      <div className="instructions">
        <p><strong>Instructions:</strong> Complete the text with the most appropriate words from the options bank. Each word can only be used once.</p>
      </div>

      {isSubmitted && (
        <>
          <div className="answer-feedback" style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(13, 59, 102, 0.05)',
            borderRadius: '8px',
            border: '1px solid var(--primary-color)'
          }}>
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Correct Answers:</h4>
            {question.answers?.map((answer, idx) => {
              const userAnswer = answers[answer.blank];
              const isCorrect = userAnswer === answer.correct;
              return (
                <div key={idx} style={{
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}`
                }}>
                  <strong>Blank {answer.blank}:</strong>{' '}
                  <span style={{ textDecoration: 'line-through', color: '#ef4444' }}>{userAnswer || 'No answer'}</span>{' '}
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>→ {answer.correct}</span>
                  {isCorrect && <span style={{ color: '#22c55e', marginLeft: '10px' }}>✓</span>}
                  {!isCorrect && <span style={{ color: '#ef4444', marginLeft: '10px' }}>✗</span>}
                </div>
              );
            })}
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
                  {question.answers.filter(a => answers[a.blank] === a.correct).length} / {question.answers.length}
                </p>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                  ({((question.answers.filter(a => answers[a.blank] === a.correct).length / question.answers.length) * 100).toFixed(0)}% Accuracy)
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <div className="action-buttons" style={{ marginTop: '20px' }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          style={{ height: '56px', fontSize: '18px' }}
        >
          {isSubmitted ? 'Next Question' : 'Submit Answers'}
        </button>
      </div>

      {/* Mobile Choice Sheet */}
      {isSheetOpen && (
        <>
          <div
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000
            }}
            onClick={() => setIsSheetOpen(false)}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: '#fff',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', paddingBottom: 'calc(24px + var(--safe-area-bottom))',
            zIndex: 2001,
            animation: 'slideUp 0.3s ease-out',
            boxShadow: '0 -10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Select word for Blank {activeBlank}</h3>
              <button onClick={() => setIsSheetOpen(false)} style={{ background: 'none', fontSize: '24px', color: '#94a3b8' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Combine available options + current answer if exists */}
              {[...new Set([...availableOptions, ...(answers[activeBlank] ? [answers[activeBlank]] : [])])].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleOptionSelect(activeBlank, option);
                    setIsSheetOpen(false);
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${answers[activeBlank] === option ? 'var(--primary-color)' : '#f1f5f9'}`,
                    backgroundColor: answers[activeBlank] === option ? 'rgba(13, 59, 102, 0.05)' : '#f8fafc',
                    color: answers[activeBlank] === option ? 'var(--primary-color)' : '#1e293b',
                    fontWeight: '600',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}
                >
                  {option}
                </button>
              ))}
              <button
                onClick={() => {
                  handleOptionSelect(activeBlank, '');
                  setIsSheetOpen(false);
                }}
                style={{
                  gridColumn: 'span 2',
                  padding: '16px',
                  marginTop: '4px',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  fontWeight: '600'
                }}
              >
                Clear Selection
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default ReadingFillBlanks;