import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsAnimating(true);
        } else {
            document.body.style.overflow = 'unset';
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [isOpen]);

    if (!isOpen && !isAnimating) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease',
            WebkitTapHighlightColor: 'transparent'
        }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: '#ffffff',
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px',
                    padding: '24px',
                    paddingBottom: 'calc(24px + var(--safe-area-bottom))',
                    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.1)',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Handle for drag indicator feel */}
                <div style={{
                    width: '40px',
                    height: '4px',
                    background: 'var(--color-border)',
                    borderRadius: '2px',
                    margin: '0 auto 16px auto',
                    flexShrink: 0
                }} />

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexShrink: 0
                }}>
                    {title && <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>{title}</h2>}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'var(--color-background)',
                                border: 'none',
                                color: 'var(--color-text-sub)',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>

                <div style={{
                    overflowY: 'auto',
                    flex: 1,
                    WebkitOverflowScrolling: 'touch'
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
