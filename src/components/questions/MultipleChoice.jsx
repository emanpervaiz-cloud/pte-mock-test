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
    <div className="multiple-choice-question">
      <div className="question-text">
        <h3>{question.question}</h3>
      </div>

      <div className="options-container">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`option-item ${selectedOptions.includes(option.id) ? 'selected' : ''
              }`}
            onClick={() => handleOptionToggle(option.id)}
          >
            <input
              type={question.multiple ? 'checkbox' : 'radio'}
              checked={selectedOptions.includes(option.id)}
              onChange={() => { }}
              className="option-input"
            />
            <div className="option-text">
              {option.text}
            </div>
          </div>
        ))}
      </div>

      <div className="instructions">
        <p><strong>Instructions:</strong> {question.multiple ? 'Select all that apply.' : 'Select one answer.'}</p>
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
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>
              {question.multiple ? 'Correct Answers:' : 'Correct Answer:'}
            </h4>
            {question.options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              const isCorrect = Array.isArray(question.correct)
                ? question.correct.includes(option.id)
                : question.correct === option.id;

              if (!isCorrect && !isSelected) return null;

              return (
                <div key={option.id} style={{
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}`
                }}>
                  <strong>{option.id}.</strong>{' '}
                  <span style={{ color: isCorrect ? '#22c55e' : '#ef4444' }}>
                    {option.text}
                  </span>
                  {isCorrect && isSelected && <span style={{ color: '#22c55e', marginLeft: '10px' }}>✓ Your answer</span>}
                  {isCorrect && !isSelected && <span style={{ color: '#22c55e', marginLeft: '10px' }}>✓ Correct</span>}
                  {!isCorrect && isSelected && <span style={{ color: '#ef4444', marginLeft: '10px' }}>✗ Your answer (Incorrect)</span>}
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
                  {Array.isArray(question.correct)
                    ? selectedOptions.filter(id => question.correct.includes(id)).length
                    : (selectedOptions.includes(question.correct) ? 1 : 0)} / {Array.isArray(question.correct) ? question.correct.length : 1}
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
          disabled={!isSubmitted && selectedOptions.length === 0}
        >
          {isSubmitted ? 'Next Question' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default MultipleChoice;