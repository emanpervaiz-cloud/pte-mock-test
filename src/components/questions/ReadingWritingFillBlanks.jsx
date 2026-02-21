import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext';

const ReadingWritingFillBlanks = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [answers, setAnswers] = useState({});

  const handleOptionChange = (blankId, value) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
  };

  const handleSubmit = () => {
    // Save the answers
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'reading',
      type: 'reading_writing_fill_blanks',
      responses: answers
    });

    // Move to next question
    onNext();
  };

  const renderPassageWithBlanks = () => {
    const parts = question.passage.split(/(\{\{|\}\})/);
    let blankCounter = 0;

    return parts.map((part, index) => {
      if (part === '{{') {
        blankCounter++;
        const blankId = question.questions.find(q => q.position === blankCounter)?.id;
        const options = question.questions.find(q => q.position === blankCounter)?.options || [];

        return (
          <select
            key={`blank-${blankCounter}`}
            value={answers[blankId] || ''}
            onChange={(e) => handleOptionChange(blankId, e.target.value)}
            className="blank-select"
          >
            <option value="">Select option</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else if (part !== '{{' && part !== '}}') {
        return <span key={index}>{part}</span>;
      }
      return null;
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

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== question.questions.length}
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
};

export default ReadingWritingFillBlanks;