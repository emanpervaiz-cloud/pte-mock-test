import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import AudioPlayer from '../common/AudioPlayer';

const WriteFromDictation = ({ question, onNext }) => {
  const { saveAnswer } = useExam();
  const [sentence, setSentence] = useState('');
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    if (isSubmitted) return;
    setSentence(e.target.value);
  };

  const handleAudioPlay = () => {
    setAudioPlayed(true);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      onNext();
      return;
    }

    // Save the answer
    saveAnswer(question.id, {
      questionId: question.id,
      section: 'listening',
      
      correct_answer: question.correct || question.answers || (question.options ? question.options.find(o => o.isCorrect)?.id : undefined) || question.correctResponse || question.transcript,
      response: sentence,
      meta: { audioPlayed: audioPlayed }
    });

    // Move to next question
    onNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 24 }}>
      <div style={{
        background: '#fff', padding: isMobile ? 16 : 24, borderRadius: 16, border: '1px solid #eef2f6'
      }}>
        <AudioPlayer
          src={question.audioUrl}
          title={isMobile ? "Listen" : "Listen to the sentence"}
          onPlay={handleAudioPlay}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: isMobile ? 16 : 18, color: '#1a1f36', fontWeight: 700 }}>Type the sentence:</h3>
        <input
          type="text"
          style={{
            width: '100%',
            height: isMobile ? 52 : 60,
            padding: '0 20px',
            borderRadius: 14,
            border: '1.5px solid #e2e8f0',
            fontSize: isMobile ? 16 : 18,
            color: '#1a1f36',
            outline: 'none',
            transition: 'border-color 0.2s',
            background: '#fff'
          }}
          value={sentence}
          onChange={handleChange}
          placeholder="Type what you heard..."
        />
      </div>

      <div style={{
        padding: '0 8px', fontSize: 13, color: 'var(--text-secondary)'
      }}>
        <div style={{ marginBottom: 4 }}><strong>Instructions:</strong> Type the sentence exactly as you hear it.</div>
        <div style={{ fontStyle: 'italic', color: '#64748b' }}>Note: You can only play the audio once.</div>
      </div>

      <div style={{ display: 'flex' }}>
        <button
          onClick={handleSubmit}
          disabled={sentence.trim() === ''}
          style={{
            width: isMobile ? '100%' : 'auto',
            padding: '14px 40px', borderRadius: 12,
            background: sentence.trim() === '' ? '#e2e8f0' : 'var(--primary-color)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: 16,
            cursor: sentence.trim() === '' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(13, 59, 102, 0.15)'
          }}
        >
          {isSubmitted ? 'Next Question →' : 'Submit Sentence'}
        </button>
      </div>

      {isSubmitted && (
        <div style={{
          marginTop: 24,
          padding: '20px',
          background: 'rgba(13, 59, 102, 0.05)',
          borderRadius: '12px',
          border: '1px solid var(--primary-color)',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <h4 style={{ color: 'var(--primary-color)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>✅</span> Correct Sentence
          </h4>
          <p style={{ color: 'var(--primary-color)', fontWeight: 600, margin: 0, fontSize: 16 }}>
            {question.correctResponse || question.transcript}
          </p>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default WriteFromDictation;