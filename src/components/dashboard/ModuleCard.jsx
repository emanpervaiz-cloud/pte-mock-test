import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

const ModuleCard = ({ module, onStartPractice }) => {
    const { module_name, icon, practiced, progress_percentage, average_score } = module;

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 'var(--mobile-radius)',
                padding: 'var(--card-padding)',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-soft)',
                transition: 'all 0.2s ease',
                WebkitTapHighlightColor: 'transparent'
            }}
            onClick={onStartPractice}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: 'var(--color-primary-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', color: 'var(--color-primary)'
                    }}>
                        {icon}
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-primary)' }}>{module_name}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>{average_score || '--'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Avg Score</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-main)', fontWeight: 600 }}>
                <span>Practiced: <strong style={{ color: 'var(--color-primary)' }}>{practiced}</strong> items</span>
                <span>{Math.round(progress_percentage)}%</span>
            </div>

            <ProgressBar current={progress_percentage} total={100} />

            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onStartPractice();
                }}
                variant="ghost"
                fullWidth
            >
                Start Practice Now
            </Button>
        </div >
    );
};

export default ModuleCard;
