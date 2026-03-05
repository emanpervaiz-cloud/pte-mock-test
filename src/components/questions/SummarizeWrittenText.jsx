import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ScoreDisplay from '../common/ScoreDisplay';
import AIEvaluationService from '../../services/aiEvaluationService';

const SummarizeWrittenText = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [summary, setSummary] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);

  useEffect(() => {
    const words = summary.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [summary]);

  const handleChange = (e) => {
    const text = e.target.value;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length <= 75) {
      setSummary(text);
    }
  };

  const handleSave = () => {
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'writing',
      type: 'summarize_written_text',
      response: summary,
      meta: { wordCount: wordCount }
    });
    setIsSaved(true);
  };

  const handleGetScore = async () => {
    // Auto-save if not saved yet
    if (!isSaved) {
      handleSave();
    }

    setEvalLoading(true);
    setEvalError(null);
    console.log('SummarizeWrittenText: Getting AI score...', { summaryLength: summary.length });
    try {
      const evaluator = new AIEvaluationService();
      console.log('SummarizeWrittenText: Calling evaluateWriting...');
      const result = await evaluator.evaluateWriting(
        `PASSAGE: "${question.passage}"\n\nTASK: Summarize the passage above in ONE SINGLE SENTENCE (5-75 words). Use your own words. Do NOT copy the text directly. Direct copying will result in a score of 0.`,
        summary,
        'summarize_written_text'
      );
      console.log('SummarizeWrittenText: Evaluation result:', result);
      setEvaluation(result);

      // Store AI evaluation in localStorage for ResultsPage
      try {
        const aiEvaluations = JSON.parse(localStorage.getItem('pte_ai_evaluations') || '{}');
        aiEvaluations[question.id] = result;
        localStorage.setItem('pte_ai_evaluations', JSON.stringify(aiEvaluations));
        console.log('AI evaluation saved for question:', question.id);
      } catch (storageError) {
        console.error('Failed to save AI evaluation:', storageError);
      }
    } catch (err) {
      console.error('SummarizeWrittenText: Evaluation error:', err);
      setEvalError(err.message || 'Failed to evaluate. Please try again.');
    }
    setEvalLoading(false);
  };

  const handleSubmit = () => {
    if (!isSaved) handleSave();
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

      <div className="answer-section" style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Write your summary here:</h3>
        <textarea
          className="response-textarea"
          value={summary}
          onChange={handleChange}
          placeholder="Write your summary in 5-75 words..."
          rows={window.innerWidth < 480 ? 6 : 4}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '16px',
            lineHeight: '1.5',
            resize: 'none',
            backgroundColor: '#f8fafc'
          }}
        />
        <div className="word-count" style={{
          marginTop: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: (wordCount < 5 || wordCount > 75) ? 'var(--danger-color)' : 'var(--success-color)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          {wordCount}/75 words
          {wordCount < 5 && wordCount > 0 && <span> (Min 5 words required)</span>}
          {wordCount > 75 && <span> (Max 75 exceeded)</span>}
        </div>
      </div>

      <div className="instructions">
        <p><strong>Time allowed:</strong> 10 minutes</p>
        <p><strong>Word limit:</strong> 5-75 words</p>
      </div>

      {/* Score Display */}
      <ScoreDisplay
        evaluation={evaluation}
        loading={evalLoading}
        error={evalError}
        onGetScore={handleGetScore}
        hasResponse={wordCount >= 5}
        questionType="writing"
      />

      <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={wordCount < 5 || wordCount > 75}
          style={{ height: '56px', fontSize: '18px', width: '100%' }}
        >
          Submit & Continue →
        </button>
      </div>
    </div>
  );
};

export default SummarizeWrittenText;