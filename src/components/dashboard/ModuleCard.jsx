import React from 'react';

const ModuleCard = ({ module, onStartPractice }) => {
    const { module_name, icon, total_items, practiced, progress_percentage, average_score, color, accent, border } = module;

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                border: `1px solid ${border || '#eef2f6'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
            }}
            onClick={onStartPractice}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: color || '#f3f7ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px'
                    }}>
                        {icon}
                    </div>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{module_name}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: accent || '#0ea5e9' }}>{average_score || '--'}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Score</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                <span>Practiced: <strong style={{ color: '#0f172a' }}>{practiced}</strong></span>
                <span>{Math.round(progress_percentage)}%</span>
            </div>

            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                    style={{
                        width: `${Math.max(progress_percentage, 0)}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${color}, ${accent})`,
                        borderRadius: '4px'
                    }}
                />
            </div>

            <button
                style={{
                    marginTop: 'auto',
                    width: '100%',
                    padding: '12px',
                    background: color || '#f8fafc',
                    color: accent || '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = accent ? `${accent}22` : '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = color || '#f8fafc'}
            >
                Start Practice Now
            </button>
        </div >
    );
};

export default ModuleCard;
