import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    fullWidth = false,
    disabled = false,
    icon,
    style = {}
}) => {
    const baseStyle = {
        height: 'var(--btn-height-mobile)',
        padding: '0 24px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 700,
        fontSize: 'var(--font-size-base)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        border: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style
    };

    const variants = {
        primary: {
            background: 'var(--color-primary)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(13, 59, 102, 0.2)'
        },
        secondary: {
            background: 'var(--color-secondary)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(103, 58, 183, 0.2)'
        },
        danger: {
            background: 'var(--color-danger)',
            color: '#ffffff',
        },
        ghost: {
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            border: '1.5px solid var(--color-primary)'
        },
        outline: {
            background: 'transparent',
            color: 'var(--color-text-main)',
            border: '1.5px solid var(--color-border)'
        }
    };

    const activeVariant = variants[variant] || variants.primary;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                ...baseStyle,
                ...activeVariant,
                opacity: disabled ? 0.6 : 1
            }}
            onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
