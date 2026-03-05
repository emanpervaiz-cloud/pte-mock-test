import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ScoreDisplay from '../common/ScoreDisplay';
import AIEvaluationService from '../../services/aiEvaluationService';

const WriteEssay = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState(null);

  useEffect(() => {
    const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [essay]);

  const handleChange = (e) => {
    setEssay(e.target.value);
  };

  const handleSave = () => {
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'writing',
      type: 'write_essay',
      response: essay,
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
    try {
      const evaluator = new AIEvaluationService();
      const result = await evaluator.evaluateWriting(
        `PROMPT: "${question.prompt}"\n\nTASK: Write an essay in response to the prompt above. Use your own words. Do NOT copy the prompt text directly. Direct copying will result in a score of 0.`,
        essay,
        'write_essay'
      );
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
      setEvalError(err.message || 'Failed to evaluate. Please try again.');
    }
    setEvalLoading(false);
  };

  const handleSubmit = () => {
    if (!isSaved) handleSave();
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

      <div className="answer-section" style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Write your essay here:</h3>
        <textarea
          className="response-textarea"
          value={essay}
          onChange={handleChange}
          placeholder="Write your essay (200-300 words)..."
          rows={window.innerWidth < 480 ? 12 : 10}
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
          color: (wordCount < 200 || wordCount > 300) ? 'var(--danger-color)' : 'var(--success-color)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          {wordCount}/300 words
          {wordCount < 200 && wordCount > 0 && <span> (Min 200 required)</span>}
          {wordCount > 300 && <span> (Max 300 exceeded)</span>}
        </div>
      </div>

      <div className="instructions">
        <p><strong>Time allowed:</strong> 20 minutes</p>
        <p><strong>Word limit:</strong> 200-300 words</p>
        <p><strong>Guidelines:</strong> Organize your essay with an introduction, body paragraphs, and conclusion. Support your ideas with examples.</p>
      </div>

      {/* Score Display */}
      <ScoreDisplay
        evaluation={evaluation}
        loading={evalLoading}
        error={evalError}
        onGetScore={handleGetScore}
        hasResponse={wordCount >= 50}
        questionType="writing"
      />

      <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={wordCount < 200}
          style={{ height: '56px', fontSize: '18px', width: '100%' }}
        >
          Submit & Continue →
        </button>
      </div>
    </div>
  );
};

export default WriteEssay;