import React from 'react';

const InputField = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    icon,
    style = {}
}) => {
    return (
        <div style={{ marginBottom: '16px', ...style }}>
            {label && (
                <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600,
                    color: 'var(--color-text-sub)',
                    marginBottom: '8px'
                }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                {icon && (
                    <span style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '18px',
                        color: 'var(--color-text-sub)'
                    }}>
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        height: 'var(--touch-target-min)',
                        padding: `0 16px 0 ${icon ? '44px' : '16px'}`,
                        borderRadius: '12px',
                        border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        fontSize: 'var(--font-size-base)',
                        color: 'var(--color-text-main)',
                        background: '#ffffff',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'}
                />
            </div>
            {error && (
                <span style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-danger)',
                    marginTop: '4px',
                    display: 'block'
                }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default InputField;
