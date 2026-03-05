import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ProgressBar from '../common/ProgressBar';
import Timer from '../common/Timer';
import ReadingWritingFillBlanks from '../questions/ReadingWritingFillBlanks';
import MultipleChoice from '../questions/MultipleChoice';
import ReorderParagraph from '../questions/ReorderParagraph';
import ReadingFillBlanks from '../questions/ReadingFillBlanks';
import ReadingMultipleChoiceAudio from '../questions/ReadingMultipleChoiceAudio';
import { useNavigate } from 'react-router-dom';
import ModuleResults from '../common/ModuleResults';
import { READING_PASSAGES } from '../../data/readingData';

const ReadingSection = ({ onSectionComplete, onSectionBack, isMockTest = false, nextModule = null }) => {
  const { state, setCurrentQuestionIndex, setCurrentSection, resetMockTest } = useExam();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map the structured JSON reading passages into individual test questions
  const readingQuestions = READING_PASSAGES.flatMap(passage => {
    return passage.questions.map((q) => {
      let type = '';
      let options = [];
      let correct = null;
      let answers = [];
      let sentences = [];
      let correctOrder = [];

      if (q.type === 'MCQ Single Answer') {
        type = 'multiple_choice';
        options = Object.entries(q.options).map(([key, text]) => ({ id: key, text }));
        correct = q.correct_answer;
      } else if (q.type === 'MCQ Multiple Answers') {
        type = 'multiple_choice';
        options = Object.entries(q.options).map(([key, text]) => ({ id: key, text }));
        correct = q.correct_answer;
      } else if (q.type === 'Re-order Paragraphs') {
        type = 'reorder_paragraph';
        sentences = q.paragraphs.map((p, idx) => ({
          id: `rs_${idx + 1}`,
          text: p
        }));
        correctOrder = q.correct_order.map(num => `rs_${num}`);
      } else if (q.type === 'Reading Fill in the Blanks') {
        type = 'reading_fill_blanks';
        let blankCount = 0;
        const formattedPassage = q.passage.replace(/\[BLANK_\d+\]/g, (match) => {
          blankCount++;
          return `___${blankCount}___`;
        });

        options = q.word_bank || [];
        answers = q.blanks.map((blank) => ({
          blank: blank.blank_id,
          correct: blank.correct_answer
        }));

        return {
          id: q.id,
          type,
          passage: formattedPassage,
          prompt: q.question,
          options,
          answers,
          title: passage.title
        };
      } else if (q.type === 'R&W Fill in the Blanks') {
        type = 'reading_writing_fill_blanks';
        let blankCount = 0;
        const formattedPassage = q.passage.replace(/\[BLANK_\d+\]/g, (match) => {
          blankCount++;
          return `___${blankCount}___`;
        });

        options = q.blanks.map(b => ({
          options: b.options,
          correct: b.correct_answer
        }));

        answers = q.blanks.map((blank) => ({
          blank: blank.blank_id,
          correct: blank.correct_answer
        }));

        return {
          id: q.id,
          type,
          passage: formattedPassage,
          prompt: q.question,
          options,
          answers,
          title: passage.title
        };
      }

      return {
        id: q.id,
        type,
        passage: passage.text,
        prompt: q.question,
        question: q.question,
        options,
        correct,
        multiple: q.type === 'MCQ Multiple Answers',
        sentences,
        correctOrder,
        title: passage.title
      };
    });
  });

  const currentQuestionData = readingQuestions[currentQuestion];

  const handleNextQuestion = () => {
    console.log('Reading: handleNextQuestion called', { currentQuestion, total: readingQuestions.length });

    if (currentQuestion < readingQuestions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setCurrentQuestionIndex(nextIndex);
      window.scrollTo(0, 0);
    } else {
      console.log('Reading: Section complete', { isMockTest });
      if (isMockTest) {
        if (onSectionComplete) onSectionComplete();
      } else {
        // Individual Practice Mode: Show results inline
        setShowResults(true);
      }
    }
  };

  const handleTimeout = () => {
    if (isMockTest) {
      setShowTimeoutModal(true);
      setTimeout(() => {
        resetMockTest();
        navigate('/');
      }, 3000);
    } else {
      // Practice mode: skip to results on timeout
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentQuestionIndex(currentQuestion - 1);
    }
  };

  // Set the current section when component mounts
  useEffect(() => {
    setCurrentSection('reading');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Header */}
      <header style={{
        background: '#fff', borderBottom: '1px solid var(--accent-color)',
        padding: isMobile ? '0 16px' : '0 24px',
        height: isMobile ? 'auto' : 64,
        minHeight: 64,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        gap: isMobile ? 12 : 0,
        paddingTop: isMobile ? 12 : 0,
        paddingBottom: isMobile ? 12 : 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 16,
          }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary-color)' }}>
            {isMobile ? 'Reading' : 'Reading Module'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'space-between' : 'flex-end',
          gap: isMobile ? 16 : 24
        }}>
          {!isMockTest && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
              <span style={{ color: 'var(--secondary-color)' }}>●</span> {isMobile ? 'Practice' : 'Practice Mode'}
            </div>
          )}
          {isMockTest && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger-color)', fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: 'var(--danger-color)' }}>●</span> {isMobile ? 'LIVE' : 'MOCK TEST LIVE'}
            </div>
          )}
          <Timer initialTime={2100} onComplete={handleTimeout} />
        </div>
      </header>

      {showTimeoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', padding: 20 }}>
          <div style={{ background: '#fff', color: 'var(--text-main)', padding: 40, borderRadius: 24, maxWidth: 450, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: 'var(--danger-color)', marginBottom: 16 }}>⏰ Time Expired!</h2>
            <p style={{ fontSize: 18, marginBottom: 24, lineHeight: 1.6 }}>The time limit for this section has been reached. In Mock Test mode, the test must be completed within the fixed time limits.</p>
            <p style={{ fontWeight: 700, color: 'var(--primary-color)' }}>Restarting Mock Test...</p>
          </div>
        </div>
      )}

      <main style={{ padding: isMobile ? '16px 12px' : '32px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {!isMobile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
              padding: '12px 20px', background: 'rgba(13, 59, 102, 0.05)',
              borderRadius: 12, color: 'var(--primary-color)'
            }}>
              <span style={{ fontSize: 20 }}>📖</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Section</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>PTE Reading</div>
              </div>
            </div>
          )}

          <ProgressBar
            current={currentQuestion + 1}
            total={readingQuestions.length}
          />

          {/* Question Card */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: isMobile ? '20px 16px' : 32,
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
            border: '1px solid var(--accent-color)',
            minHeight: isMobile ? 'auto' : 400,
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 24
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 14, fontWeight: 700, color: 'var(--primary-color)',
                marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-color)' }} />
                Question {currentQuestion + 1} Guide
              </div>
              <div style={{
                margin: 0, fontSize: 16, color: 'var(--text-main)', lineHeight: 1.6,
                background: 'var(--accent-color)', padding: '16px 20px', borderRadius: 12,
                borderLeft: '4px solid var(--primary-color)'
              }}>
                <strong>{currentQuestionData.prompt}</strong>
              </div>
            </div>

            {showResults ? (
              <ModuleResults moduleType="reading" isInline={true} />
            ) : (
              <div style={{ flex: 1 }}>
                {currentQuestionData.passage && currentQuestionData.type !== 'reading_fill_blanks' && currentQuestionData.type !== 'reading_writing_fill_blanks' && (
                  <div style={{ padding: '20px', background: 'rgba(13, 59, 102, 0.03)', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--accent-color)', color: 'var(--text-main)' }}>
                    {currentQuestionData.title && <h3 style={{ margin: '0 0 12px', fontSize: 18, color: 'var(--primary-color)' }}>Topic: {currentQuestionData.title}</h3>}
                    <p style={{ margin: 0, lineHeight: 1.7 }}>{currentQuestionData.passage}</p>
                  </div>
                )}

                {/* Render the appropriate question component based on type */}
                {currentQuestionData.type === 'reading_writing_fill_blanks' && (
                  <ReadingWritingFillBlanks key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'multiple_choice' && (
                  <MultipleChoice key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'reorder_paragraph' && (
                  <ReorderParagraph key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'reading_fill_blanks' && (
                  <ReadingFillBlanks key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'reading_multiple_choice_audio' && (
                  <ReadingMultipleChoiceAudio key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isMobile ? '16px' : '20px 32px',
            background: '#fff',
            borderRadius: 20,
            border: '1px solid var(--accent-color)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            gap: isMobile ? 16 : 0
          }}>
            {!showResults ? (
              <>
                {!isMockTest && (
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    style={{
                      padding: '10px 24px', borderRadius: 12,
                      background: 'transparent', color: currentQuestion === 0 ? '#cbd5e1' : 'var(--text-secondary)',
                      border: `1.5px solid ${currentQuestion === 0 ? 'var(--accent-color)' : '#d1d9e2'}`,
                      fontWeight: 600, fontSize: 14, cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ← Previous
                  </button>
                )}
                {!isMockTest && (
                  <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 12,
                    width: isMobile ? '100%' : 'auto'
                  }}>
                    {currentQuestion === readingQuestions.length - 1 && (
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                          width: isMobile ? '100%' : 'auto',
                          padding: '12px 24px', borderRadius: 12,
                          background: '#fff', color: 'var(--danger-color)',
                          border: '1.5px solid #fee2e2',
                          fontWeight: 600, fontSize: 14, cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        ✖ Back to Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleNextQuestion}
                      style={{
                        width: isMobile ? '100%' : 'auto',
                        padding: '14px 32px', borderRadius: 12,
                        background: 'var(--primary-color)',
                        color: '#fff', border: 'none',
                        fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {currentQuestion === readingQuestions.length - 1
                        ? 'View Results →'
                        : 'Next Question →'}
                    </button>
                  </div>
                )}
                {isMockTest && (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleNextQuestion}
                      style={{
                        width: isMobile ? '100%' : 'auto',
                        padding: '14px 32px', borderRadius: 12,
                        background: 'var(--primary-color)',
                        color: '#fff', border: 'none',
                        fontWeight: 700, fontSize: 15, cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {currentQuestion === readingQuestions.length - 1
                        ? (nextModule ? `Next Module: ${nextModule} →` : 'Submit Mock Test →')
                        : 'Next Question →'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    padding: '12px 48px', borderRadius: 12,
                    background: 'var(--primary-color)',
                    color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: 16, cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadingSection;