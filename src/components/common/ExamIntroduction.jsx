import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';

const ExamIntroduction = () => {
  const navigate = useNavigate();
  const { startExam, setTimer, state, setUser } = useExam();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartExam = () => {
    // Clear previous AI evaluations
    try {
      localStorage.removeItem('pte_ai_evaluations');
      console.log('Cleared previous AI evaluations');
    } catch (e) {
      console.error('Failed to clear AI evaluations:', e);
    }

    // set exam duration to configured minutes (default 80)
    const seconds = (state?.examDurationMinutes || 80) * 60;
    setTimer(seconds);
    startExam();
    // if logged-in user, record lastTestTaken so next test can vary
    if (state && state.user) {
      const updated = { ...state.user, lastTestTaken: new Date().toISOString() };
      setUser(updated);
      try { localStorage.setItem('pte_user', JSON.stringify(updated)); } catch { }
    }
    navigate('/exam/listening');
  };

  const sections = [
    { title: 'Listening', time: '15 Min', questions: '3 Ques', icon: '🎧', color: '#fce4ec', textColor: '#e91e63' },
    { title: 'Speaking', time: '20 Min', questions: '6 Ques', icon: '🎤', color: '#e8f4fd', textColor: '#2196f3' },
    { title: 'Writing', time: '10 Min', questions: '2 Ques', icon: '✍️', color: '#fffde7', textColor: '#f9a825' },
    { title: 'Reading', time: '35 Min', questions: '20 Ques', icon: '📖', color: '#e8f5e9', textColor: '#43a047' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-color)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Premium Header */}
      <header style={{
        background: '#fff',
        padding: isMobile ? '12px 16px' : '16px 40px',
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #e8ecf4',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{
          margin: 0,
          fontSize: isMobile ? 16 : 20,
          fontWeight: 800,
          color: 'var(--primary-color)',
          letterSpacing: '-0.5px',
          textAlign: 'center'
        }}>
          THE MIGRATION — PTE MOCK TEST
        </h1>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '20px 16px' : '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 800,
          background: '#fff',
          borderRadius: isMobile ? 20 : 24,
          padding: isMobile ? '24px' : '48px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 24 : 32
        }}>
          {/* Intro Text */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: isMobile ? 24 : 32,
              fontWeight: 800,
              color: 'var(--primary-color)',
              margin: '0 0 12px'
            }}>Ready to Begin?</h2>
            <p style={{
              color: '#666',
              fontSize: isMobile ? 14 : 16,
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              This mock test simulates the real PTE Academic experience. Please ensure you are in a quiet environment.
            </p>
          </div>

          {/* Section Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: isMobile ? 12 : 16
          }}>
            {sections.map((sec) => (
              <div key={sec.title} style={{
                background: sec.color,
                borderRadius: 16,
                padding: isMobile ? '12px' : '20px',
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: isMobile ? 24 : 28, marginBottom: 8 }}>{sec.icon}</div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 14 : 16, color: '#333', marginBottom: 2 }}>{sec.title}</div>
                <div style={{ fontSize: isMobile ? 10 : 12, fontWeight: 600, color: sec.textColor }}>{sec.time} • {sec.questions}</div>
              </div>
            ))}
          </div>

          {/* Guidelines & Timer Summary */}
          <div style={{
            background: '#f8f9fe',
            borderRadius: 16,
            padding: isMobile ? '16px' : '24px',
            borderLeft: '4px solid var(--secondary-color)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 16 : 0
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary-color)', textTransform: 'uppercase', marginBottom: 4 }}>Total Duration</div>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: 'var(--primary-color)' }}>80 Minutes</div>
              </div>
              <div style={{
                textAlign: isMobile ? 'left' : 'right',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <span style={{ fontSize: 12, color: '#555' }}>✅ Microphone Enabled</span>
                <span style={{ fontSize: 13, color: '#555', display: isMobile ? 'none' : 'block' }}>✅ Quiet Environment</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartExam}
            style={{
              width: '100%',
              background: 'var(--secondary-color)',
              color: 'var(--primary-color)',
              border: 'none',
              borderRadius: 12,
              padding: isMobile ? '16px' : '18px',
              fontSize: isMobile ? 16 : 18,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(250, 169, 22, 0.25)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = isMobile ? 'none' : 'scale(1.01)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Begin Examination →
          </button>
        </div>
      </main>

      <footer style={{ padding: '24px', textAlign: 'center', color: '#999', fontSize: 12 }}>
        © {new Date().getFullYear()} Migration PTE Mock test. All rights reserved.
      </footer>
    </div>
  );
};

export default ExamIntroduction;
