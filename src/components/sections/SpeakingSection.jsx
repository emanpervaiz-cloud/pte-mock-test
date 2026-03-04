import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ProgressBar from '../common/ProgressBar';
import Timer from '../common/Timer';
import ReadAloud from '../questions/ReadAloud';
import RepeatSentence from '../questions/RepeatSentence';
import DescribeImage from '../questions/DescribeImage';
import RetellLecture from '../questions/RetellLecture';
import AnswerShortQuestion from '../questions/AnswerShortQuestion';
import ModuleResults from '../common/ModuleResults';
import { useNavigate } from 'react-router-dom';

const SpeakingSection = ({ onSectionComplete, onSectionBack, isMockTest = false, nextModule = null }) => {
  const { state, setCurrentQuestionIndex, setCurrentSection, resetMockTest } = useExam();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Speaking questions data - Only including the user's voice notes as they are the priority
  const speakingQuestions = [
    {
      id: 'vn_1',
      type: 'repeat_sentence',
      audioUrl: '/assets/speaking/read_aloud_1.wav',
      instruction: 'Listen to the audio and repeat the sentence exactly as you hear it.',
      transcript: 'Global warming is one of the most serious challenges facing humanity today. Immediate action is required to reduce carbon emissions.'
    },
    {
      id: 'vn_2',
      type: 'repeat_sentence',
      audioUrl: '/assets/speaking/read_aloud_2.wav',
      instruction: 'Listen to the audio and repeat the sentence exactly as you hear it.',
      transcript: 'Education is the foundation of personal and social development. Every child deserves access to quality learning opportunities.'
    },
    {
      id: 'vn_3',
      type: 'repeat_sentence',
      audioUrl: '/assets/speaking/read_aloud_3.wav',
      instruction: 'Listen to the audio and repeat the sentence exactly as you hear it.',
      transcript: 'Technology has transformed the way we communicate. Social media platforms connect millions of people worldwide.'
    },
    {
      id: 'vn_4',
      type: 'repeat_sentence',
      audioUrl: '/assets/speaking/read_aloud_4.wav',
      instruction: 'Listen to the audio and repeat the sentence exactly as you hear it.',
      transcript: 'Healthy eating is essential for maintaining physical and mental well-being. Fruits and vegetables should be included in every meal.'
    },
    {
      id: 'vn_5',
      type: 'repeat_sentence',
      audioUrl: '/assets/speaking/read_aloud_5.wav',
      instruction: 'Listen to the audio and repeat the sentence exactly as you hear it.',
      transcript: 'Global trade has increased dramatically in the past decades. Countries are more interconnected than ever before.'
    },
    {
      id: 'vn_6_di',
      type: 'describe_image',
      imageUrl: '/assets/pte_describe_image_chart.png',
      instruction: 'Look at the image below and describe it in detail. You have 25 seconds to prepare and 40 seconds to speak.'
    }
  ];

  const currentQuestionData = speakingQuestions[currentQuestion];

  const handleNextQuestion = () => {
    console.log('Speaking: handleNextQuestion called', { currentQuestion, total: speakingQuestions.length });

    if (currentQuestion < speakingQuestions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setCurrentQuestionIndex(nextIndex);
      window.scrollTo(0, 0);
    } else {
      console.log('Speaking: Section complete', { isMockTest });
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
      // Let the user see the message for a moment then reset
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
    setCurrentSection('speaking');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Premium Header */}
      <header style={{
        background: '#fff', borderBottom: '1px solid #e8ecf4',
        padding: '0 24px', height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 16,
          }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary-color)' }}>Speaking Module</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {!isMockTest && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
              <span style={{ color: 'var(--secondary-color)' }}>●</span> Practice Mode
            </div>
          )}
          {isMockTest && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger-color)', fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: 'var(--danger-color)' }}>●</span> MOCK TEST LIVE
            </div>
          )}
          <Timer initialTime={1200} onComplete={handleTimeout} /> {/* 20 minutes */}
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

      <main style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Section Indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
            padding: '12px 20px', background: 'rgba(13, 59, 102, 0.05)',
            borderRadius: 12, color: 'var(--primary-color)'
          }}>
            <span style={{ fontSize: 20 }}>🎙️</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Section</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Speaking & Writing</div>
            </div>
          </div>

          <ProgressBar
            current={currentQuestion + 1}
            total={speakingQuestions.length}
          />

          {/* Question Card */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
            border: '1px solid #eef2f6',
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 14, fontWeight: 700, color: 'var(--primary-color)',
                marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-color)' }} />
                Instructions
              </div>
              <p style={{
                margin: 0, fontSize: 16, color: 'var(--text-main)', lineHeight: 1.6,
                background: 'var(--accent-color)', padding: '16px 20px', borderRadius: 12,
                borderLeft: '4px solid var(--primary-color)'
              }}>
                {currentQuestionData.instruction}
              </p>
            </div>

            {showResults ? (
              <ModuleResults moduleType="speaking" isInline={true} />
            ) : (
              <div style={{ flex: 1 }}>
                {/* Question components render here */}
                {currentQuestionData.type === 'read_aloud' && (
                  <ReadAloud key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'repeat_sentence' && (
                  <RepeatSentence key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'describe_image' && (
                  <DescribeImage key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'retell_lecture' && (
                  <RetellLecture key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
                {currentQuestionData.type === 'answer_short_question' && (
                  <AnswerShortQuestion key={currentQuestionData.id} question={currentQuestionData} onNext={handleNextQuestion} />
                )}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div style={{
            marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 32px', background: '#fff', borderRadius: 20,
            border: '1px solid #eef2f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            position: 'relative', zIndex: 10
          }}>
            {!showResults ? (
              <>
                {!isMockTest && (
                  <button
                    type="button"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    style={{
                      padding: '10px 24px', borderRadius: 12,
                      background: 'transparent', color: currentQuestion === 0 ? '#cbd5e1' : '#5a6270',
                      border: `1.5px solid ${currentQuestion === 0 ? '#e2e8f0' : '#d1d9e2'}`,
                      fontWeight: 600, fontSize: 14, cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ← Previous
                  </button>
                )}
                {!isMockTest && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    {currentQuestion === speakingQuestions.length - 1 && (
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                          padding: '10px 24px', borderRadius: 12,
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
                      type="button"
                      onClick={handleNextQuestion}
                      style={{
                        padding: '10px 32px', borderRadius: 12,
                        background: 'var(--primary-color)',
                        color: '#fff', border: 'none',
                        fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    >
                      {currentQuestion === speakingQuestions.length - 1
                        ? 'View Results →'
                        : 'Next Question →'}
                    </button>
                  </div>
                )}
                {isMockTest && (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      style={{
                        padding: '10px 32px', borderRadius: 12,
                        background: 'var(--primary-color)',
                        color: '#fff', border: 'none',
                        fontWeight: 700, fontSize: 14, cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: 'var(--shadow-md)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {currentQuestion === speakingQuestions.length - 1
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

export default SpeakingSection;