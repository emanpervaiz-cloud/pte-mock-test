import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { AuthService } from '../../services/authService';
import AuthModal from './AuthModal';
import ModuleCard from '../dashboard/ModuleCard';
import SidebarOverview from '../dashboard/SidebarOverview';
import Button from '../ui/Button';
import StatCard from '../ui/StatCard';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', path: '/', active: true },
  { icon: '📝', label: 'Practice', path: '/landing' },
  { icon: '📋', label: 'Section Test', path: '/exam/speaking' },
  { icon: '🎓', label: 'Mock Test', path: '/intro' },
  { icon: '📚', label: 'Vocab Book', path: '/vocab' },
  { icon: '📁', label: 'Materials', path: '/materials' }
];

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('pteTestHistory') || '[]');
  } catch {
    return [];
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { state } = useExam();
  const [history, setHistory] = useState([]);
  const [targetScore, setTargetScore] = useState(65);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [tempTarget, setTempTarget] = useState(65);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
    setUser(AuthService.getUser());
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, t) => s + (t.overall || 0), 0) / history.length)
    : 0;
  const lastScore = history.length > 0 ? history[history.length - 1].overall : null;

  const handleStartPractice = (section) => navigate(`/exam/${section}`);
  const handleStartTest = () => navigate('/intro');
  const handleStartMockTest = () => navigate('/mock-test');

  // Define modules dynamically based on user history
  const modules = [
    {
      module_id: 'mod_listening', module_name: 'Listening', icon: '🎧',
      color: '#fce7f3', accent: '#db2777', border: '#fbcfe8',
      total_items: 4403,
      practiced: history.reduce((sum, t) => sum + (t['listeningAnswered'] || 0), 0),
      route: 'listening'
    },
    {
      module_id: 'mod_speaking', module_name: 'Speaking', icon: '🎤',
      color: '#e0f2fe', accent: '#0284c7', border: '#bae6fd',
      total_items: 7096,
      practiced: history.reduce((sum, t) => sum + (t['speakingAnswered'] || 0), 0),
      route: 'speaking'
    },
    {
      module_id: 'mod_writing', module_name: 'Writing', icon: '✍️',
      color: '#fef3c7', accent: '#d97706', border: '#fde68a',
      total_items: 473,
      practiced: history.reduce((sum, t) => sum + (t['writingAnswered'] || 0), 0),
      route: 'writing'
    },
    {
      module_id: 'mod_reading', module_name: 'Reading', icon: '📖',
      color: '#dcfce7', accent: '#16a34a', border: '#bbf7d0',
      total_items: 2766,
      practiced: history.reduce((sum, t) => sum + (t['readingAnswered'] || 0), 0),
      route: 'reading'
    }
  ].map(mod => {
    const progress_percentage = (mod.practiced / mod.total_items) * 100;
    // Calculate average score for this specific module from history
    const modScores = history.filter(h => h[mod.route] !== undefined).map(h => h[mod.route]);
    const average_score = modScores.length > 0 ? Math.round(modScores.reduce((a, b) => a + b, 0) / modScores.length) : 0;

    return { ...mod, progress_percentage, average_score };
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="desktop-nav"
        style={{
          width: sidebarOpen ? 240 : 72,
          background: 'var(--bg-color)',
          borderRight: '1px solid var(--accent-color)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--accent-color)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
          }}>P</div>
          {sidebarOpen && <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>THE MIGRATION</span>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 20px', cursor: 'pointer', position: 'relative',
                background: item.active ? 'var(--accent-color)' : 'transparent',
                borderRight: item.active ? '4px solid var(--secondary-color)' : '4px solid transparent',
                color: item.active ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: item.active ? 700 : 500,
                fontSize: 15,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--primary-color)'; } }}
              onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      marginLeft: 'auto', fontSize: 11, background: '#ef4444',
                      color: '#fff', borderRadius: 4, padding: '2px 6px', fontWeight: 600,
                    }}>{item.badge}</span>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            padding: '16px 20px', cursor: 'pointer', borderTop: '1px solid var(--accent-color)',
            display: 'flex', alignItems: 'center', gap: 12, color: '#94a3b8', fontSize: 14, fontWeight: 500,
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-color)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <span style={{ fontSize: 18 }}>{sidebarOpen ? '◀' : '▶'}</span>
          {sidebarOpen && <span>Collapse</span>}
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--color-background)' }}>
        {/* Top Bar - Hidden on mobile */}
        <header
          className="desktop-nav"
          style={{
            background: '#fff', borderBottom: '1px solid var(--color-border)',
            padding: '0 24px', height: 64, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90,
            boxShadow: 'var(--shadow-soft)',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 14,
            }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-primary)' }}>PTE Mock Test</span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: 'var(--color-primary)', fontSize: 14,
            cursor: 'pointer'
          }} onClick={() => navigate('/profile')}>
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
        </header>

        {/* Page body */}
        <div style={{
          flex: 1,
          padding: 'var(--mobile-margin)',
          paddingBottom: 'calc(80px + var(--safe-area-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>

          {/* Welcome Header */}
          <div style={{ marginTop: 8 }}>
            <h1 style={{ margin: '0 0 4px', fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-primary)' }}>
              Welcome back, {user ? user.name.split(' ')[0] : 'Student'} 👋
            </h1>
            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', fontWeight: 500 }}>
              Track your progress and achieve your target score of {targetScore}.
            </p>
          </div>

          {/* Score Overview - Using StatCards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <StatCard label="Tests Taken" value={history.length} icon="📝" color="#6366f1" />
            <StatCard label="Avg Score" value={avgScore} icon="📊" color="#10b981" />
            <StatCard label="Last Score" value={lastScore || '--'} icon="⏱" color="#f59e0b" />
            <StatCard label="Target" value={targetScore} icon="🎯" color="#8b5cf6" />
          </div>

          {/* Practice Modules Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)' }}>Practice Modules</h2>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {modules.map(mod => (
                <ModuleCard
                  key={mod.module_id}
                  module={mod}
                  onStartPractice={() => handleStartPractice(mod.route)}
                />
              ))}
            </div>
          </div>

          {/* Hero CTA for Mock Test */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), #1e293b)',
            borderRadius: 'var(--mobile-radius)',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 10px 30px rgba(13, 59, 102, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800 }}>Ready for a Full Flight?</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', opacity: 0.9, lineHeight: 1.5 }}>
                Experience the complete PTE exam environment with AI-powered scoring and detailed feedback.
              </p>
              <Button
                onClick={handleStartMockTest}
                variant="secondary"
                fullWidth
                style={{ height: '48px', fontSize: '15px' }}
              >
                Start Official Mock Test
              </Button>
            </div>
            <div style={{
              position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '120px',
              opacity: 0.1, transform: 'rotate(-15deg)', pointerEvents: 'none'
            }}>🎓</div>
          </div>

        </div>
      </div>

      {/* Target Score Modal */}
      {showTargetModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={() => setShowTargetModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-color)', borderRadius: '20px', padding: '32px', width: '480px', maxHeight: '85vh', overflowY: 'auto',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--accent-color)'
            }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>🎯 Set Your Goal</h3>

            {/* Current Target Display */}
            <div style={{ textAlign: 'center', fontSize: '48px', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '8px' }}>
              {tempTarget}
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Target PTE Score</p>

            <input
              type="range" min={30} max={90} step={1}
              value={tempTarget}
              onChange={e => setTempTarget(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '24px', accentColor: 'var(--primary-color)' }}
            />

            {/* PTE Band Levels Reference */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151' }}>📊 PTE Band Levels & Requirements</h4>

              {[
                {
                  band: 'PTE 90 (Perfect)',
                  range: '90',
                  color: '#059669',
                  requirements: [
                    'Speaking: Native-like fluency & pronunciation',
                    'Writing: Complex structures, academic vocabulary',
                    'Reading: Advanced inference & vocabulary',
                    'Listening: Complete comprehension of academic content'
                  ]
                },
                {
                  band: 'PTE 79+ (Band 8)',
                  range: '79-89',
                  color: '#0891b2',
                  requirements: [
                    'Speaking: Fluent with minor hesitations',
                    'Writing: Varied sentence structures, precise vocabulary',
                    'Reading: Strong comprehension of complex texts',
                    'Listening: Understand main ideas and most details'
                  ]
                },
                {
                  band: 'PTE 65+ (Band 7)',
                  range: '65-78',
                  color: '#7c3aed',
                  requirements: [
                    'Speaking: Clear communication with some fluency issues',
                    'Writing: Good grammar range, adequate vocabulary',
                    'Reading: Good understanding of academic texts',
                    'Listening: Understand main ideas and key details'
                  ]
                },
                {
                  band: 'PTE 50+ (Band 6)',
                  range: '50-64',
                  color: '#d97706',
                  requirements: [
                    'Speaking: Basic communication, noticeable accent',
                    'Writing: Simple structures, some grammatical errors',
                    'Reading: Understand main ideas with some difficulty',
                    'Listening: Catch main ideas, miss some details'
                  ]
                },
                {
                  band: 'PTE 36+ (Band 5)',
                  range: '36-49',
                  color: '#dc2626',
                  requirements: [
                    'Speaking: Limited vocabulary, frequent pauses',
                    'Writing: Basic sentences, frequent errors',
                    'Reading: Limited comprehension of complex texts',
                    'Listening: Understand only basic information'
                  ]
                }
              ].map((level, idx) => (
                <div
                  key={idx}
                  style={{
                    border: `2px solid ${tempTarget >= parseInt(level.range) ? level.color : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    background: tempTarget >= parseInt(level.range) ? `${level.color}08` : '#f9fafb',
                    opacity: tempTarget >= parseInt(level.range) ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#fff',
                      background: level.color,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {level.band}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Score: {level.range}</span>
                    {tempTarget >= parseInt(level.range) && tempTarget < (idx === 0 ? 91 : parseInt(['90', '79', '65', '50', '36'][idx - 1])) && (
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: level.color, fontWeight: 600 }}>✓ Your Target</span>
                    )}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#4b5563', lineHeight: '1.6' }}>
                    {level.requirements.map((req, ridx) => (
                      <li key={ridx}>{req}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowTargetModal(false)}
                style={{
                  flex: 1, padding: '12px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569',
                  borderRadius: '10px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Cancel
              </button>
              <button
                onClick={() => { setTargetScore(tempTarget); setShowTargetModal(false); }}
                style={{
                  flex: 1, padding: '12px', border: 'none',
                  background: 'var(--primary-color)',
                  color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                Save Target
              </button>
            </div>
          </div>
        </div>
      )}
      {authOpen && <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;