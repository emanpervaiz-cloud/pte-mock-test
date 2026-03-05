import React, { useEffect, useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { useNavigate } from 'react-router-dom';
import scoringEngine from '../../services/scoringEngine';
import { AuthService } from '../../services/authService';
import { ghlService } from '../../services/ghlService';

const ResultsPage = () => {
  const { state, setScores, completeExam, resetExam } = useExam();
  const navigate = useNavigate();
  const [scores, setLocalScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Calculate scores using AI evaluations if available
    const calculateScores = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('=== ResultsPage: Starting score calculation ===');
        console.log('Answers count:', Object.keys(state.answers || {}).length);

        const answers = state.answers || {};

        // Load AI evaluations from localStorage
        let aiEvaluations = {};
        try {
          const stored = localStorage.getItem('pte_ai_evaluations');
          console.log('Raw stored evaluations:', stored);
          aiEvaluations = JSON.parse(stored || '{}');
          console.log('Loaded AI evaluations:', Object.keys(aiEvaluations));
          console.log('AI Evaluation contents:', aiEvaluations);
        } catch (e) {
          console.error('Failed to load AI evaluations:', e);
        }

        // Calculate scores using scoring engine with AI evaluations
        const scores = scoringEngine.calculateAllScores(answers, aiEvaluations);
        console.log('Calculated scores:', scores);

        // Extract individual section scores
        const speakingScore = scores.speaking?.scaledScore || 10;
        const writingScore = scores.writing?.scaledScore || 10;
        const readingScore = scores.reading?.scaledScore || 10;
        const listeningScore = scores.listening?.scaledScore || 10;
        const overallScore = scores.overall?.overallScore || 10;

        const getCefrLevel = (score) => {
          if (score >= 85) return 'C2';
          if (score >= 75) return 'C1';
          if (score >= 65) return 'B2';
          if (score >= 55) return 'B1';
          if (score >= 45) return 'A2';
          return 'A1';
        };

        // Count completed questions for feedback
        const speakingCount = Object.values(answers).filter(a => a.section === 'speaking').length;
        const writingCount = Object.values(answers).filter(a => a.section === 'writing').length;
        const readingCount = Object.values(answers).filter(a => a.section === 'reading').length;
        const listeningCount = Object.values(answers).filter(a => a.section === 'listening').length;

        const calculatedScores = {
          overall: {
            overallScore: overallScore,
            cefrLevel: scores.overall?.cefrLevel || getCefrLevel(overallScore),
            classification: scores.overall?.classification || (overallScore >= 70 ? 'Advanced' : overallScore >= 50 ? 'Intermediate' : 'Beginner')
          },
          speaking: {
            scaledScore: speakingScore,
            cefrLevel: scores.speaking?.cefrLevel || getCefrLevel(speakingScore),
            feedback: scores.speaking?.feedback || `Completed ${speakingCount} speaking tasks`
          },
          writing: {
            scaledScore: writingScore,
            cefrLevel: scores.writing?.cefrLevel || getCefrLevel(writingScore),
            feedback: scores.writing?.feedback || `Completed ${writingCount} writing tasks`
          },
          reading: {
            scaledScore: readingScore,
            cefrLevel: scores.reading?.cefrLevel || getCefrLevel(readingScore),
            feedback: scores.reading?.feedback || `Completed ${readingCount} reading tasks`
          },
          listening: {
            scaledScore: listeningScore,
            cefrLevel: scores.listening?.cefrLevel || getCefrLevel(listeningScore),
            feedback: scores.listening?.feedback || `Completed ${listeningCount} listening tasks`
          }
        };

        setLocalScores(calculatedScores);
        setScores(calculatedScores);
        completeExam();

        // Save result history
        const result = {
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          overall: overallScore,
          speaking: speakingScore,
          writing: writingScore,
          reading: readingScore,
          listening: listeningScore,
          cefrLevel: getCefrLevel(overallScore),
          totalAnswered: Object.keys(answers).length,
        };

        try {
          const history = JSON.parse(localStorage.getItem('pteTestHistory') || '[]');
          history.push(result);
          localStorage.setItem('pteTestHistory', JSON.stringify(history));
        } catch (e) { }

        // Sync to GHL
        const user = AuthService.getUser();
        if (user) {
          ghlService.syncTestResults(user, {
            overall: overallScore,
            speaking: speakingScore,
            writing: writingScore,
            reading: readingScore,
            listening: listeningScore,
            cefr: getCefrLevel(overallScore)
          }).catch(err => console.error('GHL sync error:', err));
        }

      } catch (error) {
        console.error('Error calculating scores:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    calculateScores();
  }, [state.answers]);

  const handleRetakeExam = () => {
    // Clear AI evaluations for new exam
    try {
      localStorage.removeItem('pte_ai_evaluations');
      console.log('Cleared AI evaluations for new exam');
    } catch (e) {
      console.error('Failed to clear AI evaluations:', e);
    }

    resetExam();
    navigate('/');
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'var(--success-color)';
    if (score >= 50) return 'var(--secondary-color)';
    if (score >= 30) return '#fb8c00';
    return '#dc2626';
  };

  const getScoreBarWidth = (score) => {
    return `${((score - 10) / 80) * 100}%`;
  };

  if (loading) {
    return (
      <div className="exam-container exam-theme">
        <main className="main-content">
          <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>Calculating your scores...</h2>
            <p>Please wait while we process your responses.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-container exam-theme">
        <main className="main-content">
          <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>Error Loading Results</h2>
            <p style={{ color: 'red' }}>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
          </div>
        </main>
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="exam-container exam-theme">
        <main className="main-content">
          <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2>No Results Available</h2>
            <p>Please complete the exam first.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
          </div>
        </main>
      </div>
    );
  }

  const overallScore = scores.overall?.overallScore || 10;
  const cefrLevel = scores.overall?.cefrLevel || 'A1';
  const classification = scores.overall?.classification || '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', fontFamily: "'Inter', sans-serif" }}>
      <header style={{
        background: '#fff', borderBottom: '1px solid var(--accent-color)',
        padding: isMobile ? '0 16px' : '0 24px', height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: 'var(--primary-color)', margin: 0 }}>
          PTE Academic — Test Results
        </h1>
      </header>

      <main style={{ padding: isMobile ? '20px 12px' : '40px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* Overall Score Card */}
          <div style={{
            background: '#fff', textAlign: 'center', marginBottom: '24px',
            padding: isMobile ? '32px 20px' : '48px 32px', borderRadius: 24,
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid var(--accent-color)'
          }}>
            <h2 style={{ marginBottom: '8px', fontSize: isMobile ? 18 : 22, color: '#1a1f36' }}>Overall Score</h2>
            <div style={{
              fontSize: isMobile ? '56px' : '72px',
              fontWeight: '800',
              color: getScoreColor(overallScore),
              lineHeight: '1.1',
              margin: '12px 0'
            }}>
              {overallScore}
              <span style={{ fontSize: isMobile ? '20px' : '24px', color: '#64748b' }}>/90</span>
            </div>
            <div style={{
              display: 'inline-block',
              padding: '8px 24px',
              borderRadius: '24px',
              background: 'var(--primary-color)',
              color: '#fff',
              fontWeight: '700',
              fontSize: isMobile ? '14px' : '16px',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(13, 59, 102, 0.2)'
            }}>
              CEFR Level: {cefrLevel}
            </div>
            <p style={{ color: '#64748b', marginTop: '12px', fontSize: isMobile ? '14px' : '16px', fontWeight: 500 }}>{classification}</p>
          </div>

          {/* Section Scores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '16px' : '20px',
            marginBottom: '24px'
          }}>
            {[
              { key: 'speaking', label: 'Speaking', icon: '🎤' },
              { key: 'writing', label: 'Writing', icon: '✍️' },
              { key: 'reading', label: 'Reading', icon: '📖' },
              { key: 'listening', label: 'Listening', icon: '🎧' }
            ].map(({ key, label, icon }) => {
              const sectionScore = scores[key]?.scaledScore || 10;
              const sectionCefr = scores[key]?.cefrLevel || 'A1';
              const sectionFeedback = scores[key]?.feedback || '';

              return (
                <div key={key} style={{
                  background: '#fff', padding: isMobile ? '20px' : '24px', borderRadius: 20,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--accent-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: isMobile ? 16 : 18 }}>{icon} {label}</h3>
                    <span style={{
                      padding: '4px 12px', borderRadius: '12px',
                      background: 'var(--bg-color)', color: 'var(--primary-color)',
                      fontSize: '13px', fontWeight: '700', border: '1px solid var(--accent-color)'
                    }}>
                      {sectionCefr}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '800', color: getScoreColor(sectionScore) }}>
                      {sectionScore}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '15px' }}>/90</span>
                  </div>

                  {/* Score bar */}
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: getScoreBarWidth(sectionScore),
                      background: getScoreColor(sectionScore),
                      borderRadius: '4px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <p style={{ margin: 0, fontSize: isMobile ? '13px' : '14px', color: '#64748b', lineHeight: '1.6', fontWeight: 500 }}>
                    {sectionFeedback}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Answers Summary */}
          <div style={{
            background: '#fff', padding: isMobile ? '20px' : '32px', marginBottom: '32px',
            borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--accent-color)'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18 }}>Exam Summary</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
              gap: isMobile ? '20px' : '24px'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Total</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-color)' }}>{Object.keys(state.answers).length}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Speaking</div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{Object.values(state.answers).filter(a => a.section === 'speaking').length}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Writing</div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{Object.values(state.answers).filter(a => a.section === 'writing').length}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Reading</div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{Object.values(state.answers).filter(a => a.section === 'reading').length}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Listening</div>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{Object.values(state.answers).filter(a => a.section === 'listening').length}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <button
              onClick={handleRetakeExam}
              style={{
                padding: '16px 48px', borderRadius: 12,
                background: 'var(--primary-color)', color: '#fff',
                fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(13, 59, 102, 0.2)', transition: 'all 0.2s'
              }}
            >
              Retake Exam
            </button>
            <button
              onClick={() => window.print()}
              style={{
                padding: '16px 48px', borderRadius: 12,
                background: '#fff', color: 'var(--primary-color)',
                fontWeight: 700, fontSize: 16, border: '1.5px solid var(--primary-color)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Print Results
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;