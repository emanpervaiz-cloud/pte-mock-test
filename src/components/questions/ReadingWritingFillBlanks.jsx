import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AIEvaluationService from '../../services/aiEvaluationService';
import ScoreDisplay from '../common/ScoreDisplay';

const ReadingWritingFillBlanks = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // AI Evaluation State
  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);

  useEffect(() => {
    if (question) {
      setAnswers({});
      setIsSubmitted(false);
      setEvaluation(null);
      setEvalLoading(false);
      setEvalError(null);
    }
  }, [question?.id]);

  const handleOptionChange = (blankId, value) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
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
      type: 'reading_writing_fill_blanks',
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
        type: 'reading_writing_fill_blanks',
        passage: question.passage,
        correct_answer: question.answers.reduce((acc, a) => ({ ...acc, [`blank_${a.blank}`]: a.correct }), {}),
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
    // Split by blank markers like ___1___, ___2___, etc.
    const parts = question.passage.split(/(___\d+___)/);

    return parts.map((part, index) => {
      const blankMatch = part.match(/___(\d+)___/);
      if (blankMatch) {
        const blankNum = parseInt(blankMatch[1]);
        const blankData = question.options?.[blankNum - 1];
        const options = blankData?.options || [];
        const blankId = `blank_${blankNum}`;

        return (
          <select
            key={`blank-${blankNum}`}
            value={answers[blankId] || ''}
            onChange={(e) => handleOptionChange(blankId, e.target.value)}
            className="blank-select"
            disabled={isSubmitted}
          >
            <option value="">Select option</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="reading-writing-fill-blanks-question">
      <div className="passage-section">
        <div className="passage-text">
          {renderPassageWithBlanks()}
        </div>
      </div>

      <div className="instructions">
        <p><strong>Instructions:</strong> For each blank, select the most appropriate word from the dropdown menu.</p>
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
              const userAnswer = answers[`blank_${answer.blank}`];
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
                  {question.answers.filter(a => answers[`blank_${a.blank}`] === a.correct).length} / {question.answers.length}
                </p>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                  ({((question.answers.filter(a => answers[`blank_${a.blank}`] === a.correct).length / question.answers.length) * 100).toFixed(0)}% Accuracy)
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
          disabled={!isSubmitted && Object.keys(answers).length !== (question.options?.length || question.answers?.length || 0)}
        >
          {isSubmitted ? 'Next Question' : 'Submit Answers'}
        </button>
      </div>
    </div>
  );
};

export default ReadingWritingFillBlanks;