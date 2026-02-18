import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';

const ReadingFillBlanks = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [answers, setAnswers] = useState({});
  const [availableOptions, setAvailableOptions] = useState([...question.options]);

  const handleOptionSelect = (blankNumber, selectedOption) => {
    // Update the answer for this blank
    setAnswers(prev => ({
      ...prev,
      [blankNumber]: selectedOption
    }));

    // Update available options
    if (selectedOption) {
      // Remove selected option from available options
      setAvailableOptions(prev => prev.filter(opt => opt !== selectedOption));
    } else {
      // If clearing the selection, add back the previous selection
      const prevSelection = prev[blankNumber];
      if (prevSelection) {
        setAvailableOptions(prev => [...prev, prevSelection]);
      }
    }
  };

  const handleSubmit = () => {
    // Save the answers
    saveAnswer(question.id, {
      type: 'reading_fill_blanks',
      responses: answers
    });
    
    // Move to next question
    onNext();
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
            className="blank-select"
          >
            <option value="">Select option</option>
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
      
      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
};

export default ReadingFillBlanks;