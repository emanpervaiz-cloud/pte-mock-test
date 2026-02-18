import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';

const WriteEssay = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count whenever essay changes
  useEffect(() => {
    const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [essay]);

  const handleChange = (e) => {
    setEssay(e.target.value);
  };

  const handleSubmit = () => {
    // Save the answer
    saveAnswer(question.id, {
      type: 'text',
      response: essay,
      wordCount: wordCount
    });
    
    // Move to next question
    onNext();
  };

  return (
    <div className="write-essay-question">
      <div className="prompt-section">
        <h3>Essay Prompt:</h3>
        <div className="prompt-text">
          <p>{question.prompt}</p>
        </div>
      </div>
      
      <div className="answer-section">
        <h3>Write your essay here:</h3>
        <textarea
          className="response-textarea"
          value={essay}
          onChange={handleChange}
          placeholder="Write your essay (200-300 words)..."
          rows={10}
        />
        <div className="word-count">
          {wordCount}/300 words
          {wordCount < 200 && wordCount > 0 && <span className="warning"> Minimum 200 words recommended</span>}
          {wordCount > 300 && <span className="error"> Maximum 300 words exceeded</span>}
        </div>
      </div>
      
      <div className="instructions">
        <p><strong>Time allowed:</strong> 20 minutes</p>
        <p><strong>Word limit:</strong> 200-300 words</p>
        <p><strong>Guidelines:</strong> Organize your essay with an introduction, body paragraphs, and conclusion. Support your ideas with examples.</p>
      </div>
      
      <div className="action-buttons">
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={wordCount < 200}
        >
          Submit Essay
        </button>
      </div>
    </div>
  );
};

export default WriteEssay;