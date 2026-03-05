import React from 'react';

const ListItem = ({ title, subtitle, icon, rightElement, onClick, style = {} }) => {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                background: '#ffffff',
                borderRadius: 'var(--mobile-radius)',
                border: '1px solid var(--color-border)',
                marginBottom: '12px',
                cursor: onClick ? 'pointer' : 'default',
                gap: '16px',
                WebkitTapHighlightColor: 'transparent',
                ...style
            }}
            onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
            onMouseLeave={e => { if (onClick) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        >
            {icon && (
                <div style={{
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-background)',
                    borderRadius: '10px'
                }}>
                    {icon}
                </div>
            )}
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {title}
                </div>
                {subtitle && (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', marginTop: '2px' }}>
                        {subtitle}
                    </div>
                )}
            </div>
            {rightElement || (onClick && <div style={{ color: 'var(--color-text-sub)', fontSize: '18px' }}>›</div>)}
        </div>
    );
};

export default ListItem;
