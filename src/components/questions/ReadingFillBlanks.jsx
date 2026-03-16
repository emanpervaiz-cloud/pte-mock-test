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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)',
        fontStyle: 'italic', display: isSubmitted ? 'none' : 'block'
      }}>
        <strong>Instructions:</strong> Complete the text with the most appropriate words for each blank. Each word can only be used once.
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
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '16px', fontSize: 16, fontWeight: 700 }}>Correct Answers:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.answers?.map((answer, idx) => {
                const userAnswer = answers[answer.blank];
                const isCorrect = userAnswer === answer.correct;
                return (
                  <div key={idx} style={{
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
                      minWidth: 80
                    }}>Blank {answer.blank}:</span>
                    <span style={{
                      color: isCorrect ? '#166534' : '#991b1b',
                      flex: 1,
                      textDecoration: isCorrect ? 'none' : 'line-through'
                    }}>
                      {userAnswer || 'No answer'}
                    </span>
                    {!isCorrect && (
                      <span style={{ color: '#166534', fontWeight: 700 }}>
                        → {answer.correct}
                      </span>
                    )}
                    <span style={{ fontWeight: 700 }}>
                      {isCorrect ? '✓' : '✗'}
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

      <div style={{ marginTop: '8px' }}>
        <button
          onClick={handleSubmit}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(13, 59, 102, 0.15)'
          }}
        >
          {isSubmitted ? 'Next Question →' : 'Submit Answers'}
        </button>
      </div>
    </div>
  );
};

export default ReadingFillBlanks;