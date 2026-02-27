import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';

const MultipleChoice = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleOptionToggle = (optionId) => {
    if (isSubmitted) return; // Prevent changes after submission
    
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
    // Save the answer
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'reading',
      type: 'multiple_choice',
      responses: selectedOptions
    });
    
    setIsSubmitted(true);
    setShowAnswer(true);
  };
  
  const handleNext = () => {
    onNext();
  };
  
  const isCorrect = () => {
    if (question.multiple) {
      const correct = question.correct;
      const selected = selectedOptions.sort();
      return JSON.stringify(correct.sort()) === JSON.stringify(selected);
    } else {
      return selectedOptions[0] === question.correct;
    }
  };

  return (
    <div className="multiple-choice-question">
      <div className="question-text">
        <h3>{question.question}</h3>
      </div>

      <div className="options-container">
        {question.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isCorrectAnswer = question.multiple 
            ? question.correct.includes(option.id)
            : question.correct === option.id;
          
          let optionClass = 'option-item';
          if (showAnswer) {
            if (isCorrectAnswer) {
              optionClass += ' correct';
            } else if (isSelected && !isCorrectAnswer) {
              optionClass += ' incorrect';
            }
          } else if (isSelected) {
            optionClass += ' selected';
          }
          
          return (
            <div
              key={option.id}
              className={optionClass}
              onClick={() => handleOptionToggle(option.id)}
              style={{
                padding: '16px 20px',
                margin: '8px 0',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: showAnswer 
                  ? (isCorrectAnswer ? '#22c55e' : (isSelected ? '#ef4444' : '#e2e8f0'))
                  : (isSelected ? '#673ab7' : '#e2e8f0'),
                backgroundColor: showAnswer
                  ? (isCorrectAnswer ? '#dcfce7' : (isSelected ? '#fee2e2' : '#ffffff'))
                  : (isSelected ? '#f3f0ff' : '#ffffff'),
                cursor: isSubmitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <input
                type={question.multiple ? 'checkbox' : 'radio'}
                checked={isSelected}
                onChange={() => { }}
                className="option-input"
                disabled={isSubmitted}
              />
              <div className="option-text" style={{ flex: 1 }}>
                <strong>{option.id}.</strong> {option.text}
              </div>
              {showAnswer && isCorrectAnswer && (
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓ Correct</span>
              )}
              {showAnswer && isSelected && !isCorrectAnswer && (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗ Your Answer</span>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="instructions" style={{ margin: '20px 0', padding: '12px 16px', background: '#f8f9fe', borderRadius: '8px' }}>
          <p style={{ margin: 0 }}><strong>Instructions:</strong> {question.multiple ? 'Select all that apply.' : 'Select one answer.'}</p>
        </div>
      )}
      
      {showAnswer && (
        <div style={{ 
          margin: '20px 0', 
          padding: '20px', 
          backgroundColor: isCorrect() ? '#dcfce7' : '#fee2e2',
          borderRadius: '12px',
          border: '2px solid',
          borderColor: isCorrect() ? '#22c55e' : '#ef4444'
        }}>
          <h4 style={{ margin: '0 0 10px', color: isCorrect() ? '#166534' : '#991b1b' }}>
            {isCorrect() ? '✓ Correct!' : '✗ Incorrect'}
          </h4>
          <p style={{ margin: 0, color: '#374151' }}>
            <strong>Correct Answer:</strong> {question.multiple 
              ? question.correct.join(', ') 
              : question.correct}
          </p>
          {selectedOptions.length > 0 && (
            <p style={{ margin: '8px 0 0', color: '#374151' }}>
              <strong>Your Answer:</strong> {selectedOptions.join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="action-buttons" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        {!isSubmitted ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            style={{
              padding: '12px 32px',
              background: selectedOptions.length > 0 ? 'linear-gradient(135deg, #673ab7, #5e35b1)' : '#9ca3af',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: selectedOptions.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #673ab7, #5e35b1)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;