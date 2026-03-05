import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: '📊', label: 'Home', path: '/' },
        { icon: '📝', label: 'Practice', path: '/landing' },
        { icon: '🎓', label: 'Tests', path: '/mock-tests' },
        { icon: '📚', label: 'Vocab', path: '/vocab' },
        { icon: '👤', label: 'Profile', path: '/profile' }
    ];

    const isTabActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'calc(64px + var(--safe-area-bottom))',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'var(--safe-area-bottom)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            WebkitTapHighlightColor: 'transparent'
        }}>
            {navItems.map((item) => {
                const isActive = isTabActive(item.path);
                return (
                    <div
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-sub)',
                            transition: 'all 0.2s ease',
                            flex: 1,
                            position: 'relative'
                        }}
                    >
                        <span style={{
                            fontSize: '22px',
                            opacity: isActive ? 1 : 0.7,
                            transform: isActive ? 'translateY(-2px)' : 'none',
                            transition: 'transform 0.2s ease'
                        }}>
                            {item.icon}
                        </span>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: isActive ? 800 : 500,
                            letterSpacing: '0.2px'
                        }}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                width: '32px',
                                height: '3px',
                                backgroundColor: 'var(--color-primary)',
                                borderRadius: '0 0 4px 4px'
                            }} />
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default BottomNavigation;
