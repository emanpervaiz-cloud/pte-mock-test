import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';

const AiBadge = () => (
  <span style={{
    fontSize: 10, fontWeight: 800, color: '#fff',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    padding: '2px 8px', borderRadius: 20, marginLeft: 6,
    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
    display: 'inline-flex', alignItems: 'center', height: 18,
    verticalAlign: 'middle', border: '1px solid rgba(255,255,255,0.2)'
  }}>
    Ai✦
  </span>
);

const ARROW_UP = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const ARROW_DOWN = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

const DASH = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

const PRACTICE_DATA = [
  {
    key: 'speaking',
    label: 'Speaking',
    icon: '🎤',
    route: '/exam/speaking',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    tasks: [
      { label: 'Read Aloud', indicator: 'up', ai: true },
      { label: 'Repeat Sentence', indicator: 'up', ai: true },
      { label: 'Describe Image', indicator: 'dash', ai: true },
      { label: 'Re-tell Lecture', indicator: 'up', ai: true },
      { label: 'Answer Short Question', indicator: 'down', ai: true },
    ]
  },
  {
    key: 'writing',
    label: 'Writing',
    icon: '✍️',
    route: '/exam/writing',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    tasks: [
      { label: 'Summarize Written Text', indicator: 'up', ai: true },
      { label: 'Write Essay', indicator: 'up', ai: true },
    ]
  },
  {
    key: 'reading',
    label: 'Reading',
    icon: '📖',
    route: '/exam/reading',
    color: '#10b981',
    bgColor: '#ecfdf5',
    tasks: [
      { label: 'R&W Fill in the blanks', indicator: 'up' },
      { label: 'Multiple Choice (Multiple)', indicator: 'dash' },
      { label: 'Re-order Paragraphs', indicator: 'up' },
      { label: 'Reading: Fill in the blanks', indicator: 'up' },
      { label: 'Multiple Choice (Single)', indicator: 'down' },
    ]
  },
  {
    key: 'listening',
    label: 'Listening',
    icon: '🎧',
    route: '/exam/listening',
    color: '#db2777',
    bgColor: '#fdf2f8',
    tasks: [
      { label: 'Summarize Spoken Text', indicator: 'up', ai: true },
      { label: 'Multiple Choice (Multiple)', indicator: 'down' },
      { label: 'Fill in the blanks', indicator: 'up', ai: true },
      { label: 'Highlight Correct Summary', indicator: 'dash' },
      { label: 'Multiple Choice (Single)', indicator: 'down' },
      { label: 'Select Missing Word', indicator: 'dash', ai: true },
      { label: 'Highlight Incorrect Words', indicator: 'up' },
      { label: 'Write From Dictation', indicator: 'up', ai: true },
    ]
  }
];

const PracticePage = () => {
  const navigate = useNavigate();
  const [hoveredTask, setHoveredTask] = useState(null);

  const renderIndicator = (type) => {
    if (type === 'up') return <ARROW_UP />;
    if (type === 'dash') return <DASH />;
    return <ARROW_DOWN />;
  };

  return (
    <DashboardLayout activePath="/landing">
      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--primary-color)' }}>Practice Library</h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            Choose a question type to master your PTE preparation with AI feedback.
          </p>
        </div>

        {/* Grid */}
        <div className="practice-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {PRACTICE_DATA.map((section) => (
            <div
              key={section.key}
              style={{
                background: '#fff',
                borderRadius: 20,
                border: '1px solid var(--accent-color)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Section header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid var(--accent-color)',
                display: 'flex', alignItems: 'center', gap: 14,
                background: section.bgColor + '30'
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: section.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {section.icon}
                </div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--primary-color)' }}>{section.label}</h3>
              </div>

              {/* Task list - simplified */}
              <div style={{ padding: '16px 0', flex: 1 }}>
                {section.tasks.map((task, idx) => {
                  const taskId = `${section.key}-${idx}`;
                  const isHovered = hoveredTask === taskId;
                  return (
                    <div
                      key={idx}
                      onClick={() => navigate(section.route)}
                      onMouseEnter={() => setHoveredTask(taskId)}
                      onMouseLeave={() => setHoveredTask(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 24px', cursor: 'pointer',
                        background: isHovered ? 'var(--accent-color)' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: section.color, opacity: 0.6 }} />
                      <span style={{
                        fontSize: 14, color: isHovered ? 'var(--primary-color)' : '#475569',
                        fontWeight: isHovered ? 600 : 500,
                        flex: 1,
                      }}>
                        {task.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{ padding: '0 24px 24px' }}>
                <button
                  onClick={() => navigate(section.route)}
                  style={{
                    width: '100%', padding: '14px',
                    background: section.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: `0 4px 14px ${section.color}40`
                  }}
                >
                  Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .practice-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default PracticePage;
