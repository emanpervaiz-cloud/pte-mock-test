import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const MobileShell = ({ children }) => {
    const location = useLocation();

    // Hide navigation during active exams or mock tests
    const hideNav = location.pathname.startsWith('/exam/') ||
        location.pathname === '/mock-test' ||
        location.pathname === '/intro';
    return (
        <div className="mobile-shell" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-background)',
            paddingTop: 'var(--safe-area-top)'
        }}>
            <main style={{
                flex: 1,
                paddingBottom: 'calc(70px + var(--safe-area-bottom))',
                maxWidth: '100vw',
                overflowX: 'hidden'
            }}>
                {children}
            </main>


            {/* Dynamic Navigation for Mobile - hidden during exams */}
            {!hideNav && (
                <div className="mobile-only">
                    <BottomNavigation />
                </div>
            )}

            <style>{`
        @media (min-width: 769px) {
          .mobile-only {
            display: none;
          }
          main {
            padding-bottom: 0 !important;
          }
        }
      `}</style>
        </div>
    );
};

export default MobileShell;
