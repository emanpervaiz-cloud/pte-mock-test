import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';

const SummarizeWrittenText = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [summary, setSummary] = useState('');
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count whenever summary changes
  useEffect(() => {
    const words = summary.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [summary]);

  const handleChange = (e) => {
    const text = e.target.value;
    // Limit to 75 words
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length <= 75) {
      setSummary(text);
    }
  };

  const handleSubmit = () => {
    // Save the answer
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'writing',
      type: 'summarize_written_text',
      response: summary,
      meta: { wordCount: wordCount }
    });

    // Move to next question
    onNext();
  };

  return (
    <div className="summarize-written-text-question">
      <div className="passage-section">
        <h3>Read the passage below:</h3>
        <div className="passage-text">
          <p>{question.passage}</p>
        </div>
      </div>

      <div className="answer-section">
        <h3>Write your summary here:</h3>
        <textarea
          className="response-textarea"
          value={summary}
          onChange={handleChange}
          placeholder="Write your summary in 5-75 words..."
          rows={4}
        />
        <div className="word-count">
          {wordCount}/75 words
          {wordCount < 5 && wordCount > 0 && <span className="warning"> Minimum 5 words required</span>}
          {wordCount > 75 && <span className="error"> Maximum 75 words exceeded</span>}
        </div>
      </div>

      <div className="instructions">
        <p><strong>Time allowed:</strong> 10 minutes</p>
        <p><strong>Word limit:</strong> 5-75 words</p>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={wordCount < 5 || wordCount > 75}
        >
          Submit Summary
        </button>
      </div>
    </div>
  );
};

export default SummarizeWrittenText;