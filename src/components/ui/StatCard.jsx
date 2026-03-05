import React from 'react';

const StatCard = ({ label, value, icon, color, trend, trendValue, style = {} }) => {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: 'var(--mobile-radius)',
            padding: 'var(--card-padding)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            ...style
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {icon && (
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: color ? `${color}15` : 'var(--color-primary-light)',
                        color: color || 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                    }}>
                        {icon}
                    </div>
                )}
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-sub)' }}>
                    {label}
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    {value}
                </span>
                {trend && (
                    <span style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 700,
                        color: trend === 'up' ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatCard;
