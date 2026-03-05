import React from 'react';

const ProgressBar = ({ current, total, color = 'var(--color-primary)', label, showPercentage = false }) => {
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

    return (
        <div style={{ width: '100%', marginBottom: '16px' }}>
            {(label || showPercentage) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    {label && <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>{label}</span>}
                    {showPercentage && <span style={{ fontSize: '13px', fontWeight: 700, color: color }}>{Math.round(percentage)}%</span>}
                </div>
            )}
            <div style={{
                height: '8px',
                background: 'var(--color-border)',
                borderRadius: '10px',
                overflow: 'hidden',
                width: '100%'
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: color,
                    borderRadius: '10px',
                    transition: 'width 0.5s ease-out'
                }} />
            </div>
        </div>
    );
};

export default ProgressBar;
