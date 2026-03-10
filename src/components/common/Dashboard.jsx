import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { AuthService } from '../../services/authService';
import DashboardLayout from '../layout/DashboardLayout';
import ModuleCard from '../dashboard/ModuleCard';
import SidebarOverview from '../dashboard/SidebarOverview';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setHistory(getHistory());
    setUser(AuthService.getUser());
  }, []);

  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, t) => s + (t.overall || 0), 0) / history.length)
    : 0;
  const lastScore = history.length > 0 ? history[history.length - 1].overall : null;

  const handleStartPractice = (section) => navigate(`/exam/${section}`);
  const handleStartTest = () => navigate('/intro');
  const handleStartMockTest = () => navigate('/mock-test');

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
    const modScores = history.filter(h => h[mod.route] !== undefined).map(h => h[mod.route]);
    const average_score = modScores.length > 0 ? Math.round(modScores.reduce((a, b) => a + b, 0) / modScores.length) : 0;
    return { ...mod, progress_percentage, average_score };
  });

  return (
    <DashboardLayout activePath="/">
      <div className="dashboard-main" style={{
        padding: isMobile ? '20px 16px' : '32px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 32,
      }}>
        {/* Main Module Grid Column */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '32px' }}>
          
          {/* Greeting Section */}
          <div className="practice-greeting" style={{ 
            background: '#fff', padding: isMobile ? '24px' : '32px', borderRadius: '20px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid var(--accent-color)'
          }}>
            <h1 style={{ margin: '0 0 8px', fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: 'var(--primary-color)' }}>
              Welcome back, {user ? user.name : 'Student'} 👋
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)' }}>
              Track your progress, practice modules, and achieve your target score of {targetScore}.
            </p>
          </div>

          {/* Modules Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', fontWeight: 700, color: 'var(--primary-color)' }}>Practice Modules</h2>
            </div>

            <div className="modules-grid" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
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
        </div>

        {/* Right Sidebar Overview */}
        <div className="dashboard-sidebar-right" style={{ width: isMobile ? '100%' : '320px', flexShrink: 0 }}>
          <SidebarOverview
            history={history}
            targetScore={targetScore}
            avgScore={avgScore}
            lastScore={lastScore}
            onStartTest={handleStartTest}
            onStartMockTest={handleStartMockTest}
            onShowTargetModal={() => { setTempTarget(targetScore); setShowTargetModal(true); }}
          />
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
              background: '#fff',
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '24px' : '32px',
              width: isMobile ? '90%' : '520px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--accent-color)',
              position: 'relative'
            }}>
            <h3 style={{ margin: '0 0 20px', fontSize: isMobile ? '18px' : '22px', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>🎯 Set Your Goal</h3>

            <div style={{ textAlign: 'center', fontSize: isMobile ? '40px' : '48px', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '8px' }}>
              {tempTarget}
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Target PTE Score</p>

            <input
              type="range" min={30} max={90} step={1}
              value={tempTarget}
              onChange={e => setTempTarget(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '28px', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
            />

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#374151' }}>📊 PTE Band Levels</h4>
              {[
                { band: 'PTE 79+ (Band 8)', range: '79-89', color: '#0891b2' },
                { band: 'PTE 65+ (Band 7)', range: '65-78', color: '#7c3aed' },
                { band: 'PTE 50+ (Band 6)', range: '50-64', color: '#d97706' }
              ].map((level, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', justifyContent: 'space-between', padding: '10px 14px', 
                  background: tempTarget >= parseInt(level.range) ? `${level.color}10` : '#f8fafc',
                  borderRadius: '10px', marginBottom: '8px', border: '1px solid',
                  borderColor: tempTarget >= parseInt(level.range) ? level.color : '#e2e8f0'
                }}>
                  <span style={{ fontWeight: 600, color: tempTarget >= parseInt(level.range) ? level.color : '#64748b' }}>{level.band}</span>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{level.range}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowTargetModal(false)}
                style={{
                  flex: 1, padding: '12px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569',
                  borderRadius: '10px', cursor: 'pointer', fontWeight: 600
                }}
              >Cancel</button>
              <button
                onClick={() => { setTargetScore(tempTarget); setShowTargetModal(false); }}
                style={{
                  flex: 1, padding: '12px', border: 'none', background: 'var(--primary-color)',
                  color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 600
                }}
              >Save Target</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;