import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleCard from '../dashboard/ModuleCard';

const PRACTICE_DATA = [
  {
    module_id: 'mod_listening', module_name: 'Listening', icon: '🎧',
    practiced: 120, progress_percentage: 45, average_score: 68,
    route: 'listening'
  },
  {
    module_id: 'mod_speaking', module_name: 'Speaking', icon: '🎤',
    practiced: 85, progress_percentage: 32, average_score: 72,
    route: 'speaking'
  },
  {
    module_id: 'mod_writing', module_name: 'Writing', icon: '✍️',
    practiced: 45, progress_percentage: 60, average_score: 65,
    route: 'writing'
  },
  {
    module_id: 'mod_reading', module_name: 'Reading', icon: '📖',
    practiced: 210, progress_percentage: 75, average_score: 70,
    route: 'reading'
  }
];

const PracticePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: 'var(--mobile-margin)',
      background: 'var(--color-background)',
      minHeight: '100vh',
      paddingBottom: 'calc(80px + var(--safe-area-bottom))'
    }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>Practice Library</h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', margin: '4px 0 0 0' }}>Focus on specific modules to improve your skills.</p>
      </header>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {PRACTICE_DATA.map((mod) => (
          <ModuleCard
            key={mod.module_id}
            module={mod}
            onStartPractice={() => navigate(`/exam/${mod.route}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default PracticePage;
