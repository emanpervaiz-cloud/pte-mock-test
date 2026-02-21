import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const SummarizeSpokenText = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [summary, setSummary] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Calculate word count whenever summary changes
  useEffect(() => {
    const words = summary.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [summary]);

  const handleChange = (e) => {
    setSummary(e.target.value);
  };

  const handleAudioPlay = () => {
    setAudioPlayed(true);
  };

  const handleSubmit = () => {
    // Save the answer
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'listening',
      type: 'summarize_spoken_text',
      response: summary,
      meta: { wordCount: wordCount, audioPlayed: audioPlayed }
    });

    // Move to next question
    onNext();
  };

  return (
    <div className="summarize-spoken-text-question">
      <div className="audio-section">
        <AudioPlayer
          src={question.audioUrl}
          title="Listen to the lecture"
          onPlay={handleAudioPlay}
        />
      </div>

      <div className="answer-section">
        <h3>Write your summary:</h3>
        <textarea
          className="response-textarea"
          value={summary}
          onChange={handleChange}
          placeholder={`Write your summary (${question.minWords}-${question.maxWords} words)...`}
          rows={6}
        />
        <div className="word-count">
          {wordCount}/{question.maxWords} words
          {wordCount < question.minWords && wordCount > 0 &&
            <span className="warning"> Minimum {question.minWords} words required</span>}
          {wordCount > question.maxWords &&
            <span className="error"> Maximum {question.maxWords} words exceeded</span>}
        </div>
      </div>

      <div className="instructions">
        <p><strong>Instructions:</strong> Write a summary of the lecture in {question.minWords}-{question.maxWords} words.</p>
        <p><strong>Note:</strong> You will only be able to play the audio once.</p>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={wordCount < question.minWords || wordCount > question.maxWords || !audioPlayed}
        >
          Submit Summary
        </button>
      </div>
    </div>
  );
};

export default SummarizeSpokenText;