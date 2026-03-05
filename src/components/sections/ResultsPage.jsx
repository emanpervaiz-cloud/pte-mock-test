import React, { useEffect, useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { useNavigate } from 'react-router-dom';
import scoringEngine from '../../services/scoringEngine';
import { AuthService } from '../../services/authService';
import { ghlService } from '../../services/ghlService';
import ProgressBar from '../ui/ProgressBar';
import StatCard from '../ui/StatCard';
import Button from '../ui/Button';

const ResultsPage = () => {
  const { state, setScores, completeExam, resetExam } = useExam();
  const navigate = useNavigate();
  const [scores, setLocalScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Calculate scores using AI evaluations if available
    const calculateScores = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('=== ResultsPage: Starting score calculation ===');
        const answers = state.answers || {};

        // Load AI evaluations from localStorage
        let aiEvaluations = {};
        try {
          const stored = localStorage.getItem('pte_ai_evaluations');
          aiEvaluations = JSON.parse(stored || '{}');
        } catch (e) {
          console.error('Failed to load AI evaluations:', e);
        }

        const scores = scoringEngine.calculateAllScores(answers, aiEvaluations);
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

        const calculatedScores = {
          overall: {
            overallScore: overallScore,
            cefrLevel: scores.overall?.cefrLevel || getCefrLevel(overallScore),
            classification: scores.overall?.classification || (overallScore >= 70 ? 'Advanced' : overallScore >= 50 ? 'Intermediate' : 'Beginner')
          },
          speaking: {
            scaledScore: speakingScore,
            cefrLevel: scores.speaking?.cefrLevel || getCefrLevel(speakingScore),
            feedback: scores.speaking?.feedback || `Completed ${Object.values(answers).filter(a => a.section === 'speaking').length} speaking tasks`
          },
          writing: {
            scaledScore: writingScore,
            cefrLevel: scores.writing?.cefrLevel || getCefrLevel(writingScore),
            feedback: scores.writing?.feedback || `Completed ${Object.values(answers).filter(a => a.section === 'writing').length} writing tasks`
          },
          reading: {
            scaledScore: readingScore,
            cefrLevel: scores.reading?.cefrLevel || getCefrLevel(readingScore),
            feedback: scores.reading?.feedback || `Completed ${Object.values(answers).filter(a => a.section === 'reading').length} reading tasks`
          },
          listening: {
            scaledScore: listeningScore,
            cefrLevel: scores.listening?.cefrLevel || getCefrLevel(listeningScore),
            feedback: scores.listening?.feedback || `Completed ${Object.values(answers).filter(a => a.section === 'listening').length} listening tasks`
          }
        };

        setLocalScores(calculatedScores);
        setScores(calculatedScores);
        completeExam();

        // Save result history
        const result = {
          id: Date.now(),
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
    try {
      localStorage.removeItem('pte_ai_evaluations');
    } catch (e) { }
    resetExam();
    navigate('/');
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981'; // Green
    if (score >= 50) return 'var(--color-secondary)';
    if (score >= 30) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '40px auto' }}></div>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Calculating Scores...</h2>
      </div>
    );
  }

  const overallScore = scores.overall?.overallScore || 10;
  const cefrLevel = scores.overall?.cefrLevel || 'A1';

  return (
    <div style={{ padding: 'var(--spacing-lg)', background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Test Results</h1>
        <div style={{ fontSize: '14px', color: 'var(--color-text-sub)' }}>
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Main Overall Score Display */}
      <div style={{
        background: '#fff',
        borderRadius: 'var(--mobile-radius)', // Actually using generic radius since --mobile-radius is context dependent
        padding: '32px',
        textAlign: 'center',
        marginBottom: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-sub)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Overall Score
        </div>
        <div style={{
          fontSize: '84px',
          fontWeight: 900,
          color: getScoreColor(overallScore),
          lineHeight: 1,
          margin: '16px 0'
        }}>
          {overallScore}
        </div>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          borderRadius: '20px',
          background: 'var(--color-primary)',
          color: '#fff',
          fontWeight: 800,
          fontSize: '14px'
        }}>
          CEFR {cefrLevel}
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <StatCard
          label="Total Items"
          value={Object.keys(state.answers).length}
          icon="📋"
          color="#3b82f6"
        />
        <StatCard
          label="Last Score"
          value={overallScore}
          icon="📈"
          color="#10b981"
        />
      </div>

      {/* Section Score Breakdown */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text)' }}>Score Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'speaking', label: 'Speaking', icon: '🎤' },
            { key: 'writing', label: 'Writing', icon: '✍️' },
            { key: 'reading', label: 'Reading', icon: '📖' },
            { key: 'listening', label: 'Listening', icon: '🎧' }
          ].map(({ key, label, icon }) => {
            const val = scores[key]?.scaledScore || 10;
            return (
              <div key={key} style={{
                background: '#fff',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: getScoreColor(val) }}>
                    {val}<span style={{ color: 'var(--color-text-sub)', fontSize: '12px', fontWeight: 500 }}>/90</span>
                  </div>
                </div>
                <ProgressBar
                  current={val - 10}
                  total={80}
                  color={getScoreColor(val)}
                  label={scores[key]?.cefrLevel}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        position: 'sticky',
        bottom: 'calc(var(--spacing-lg) + var(--safe-area-bottom))',
        background: 'rgba(240, 244, 248, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <Button onClick={handleRetakeExam} fullWidth>
          Start New Practice
        </Button>
        <Button variant="secondary" onClick={() => navigate('/history')} fullWidth>
          View Test History
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
