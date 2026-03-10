import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', path: '/' },
  { icon: '📝', label: 'Practice', path: '/landing' },
  { icon: '📋', label: 'Section Test', path: '/exam/speaking' },
  { icon: '🎓', label: 'Mock Test', path: '/intro' },
  { icon: '📚', label: 'Vocab Book', path: '/vocab' },
  { icon: '📁', label: 'Materials', path: '/materials' }
];

const DashboardLayout = ({ children, activePath }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = AuthService.getUser();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const currentNavItems = NAV_ITEMS.map(item => ({
    ...item,
    active: item.path === activePath || (activePath === '/landing' && item.path === '/landing')
  }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside style={{
          width: sidebarOpen ? 240 : 72,
          background: '#fff',
          borderRight: '1px solid var(--accent-color)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--accent-color)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--primary-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
            }}>A</div>
            {sidebarOpen && <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>Migration</span>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 0' }}>
            {currentNavItems.map((item) => (
              <div
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 20px', cursor: 'pointer', position: 'relative',
                  background: item.active ? 'var(--accent-color)' : 'transparent',
                  borderRight: item.active ? '4px solid var(--secondary-color)' : '4px solid transparent',
                  color: item.active ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: item.active ? 700 : 500,
                  fontSize: 15,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </div>
            ))}
          </nav>

          {/* Collapse toggle */}
          <div
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              padding: '16px 20px', cursor: 'pointer', borderTop: '1px solid var(--accent-color)',
              display: 'flex', alignItems: 'center', gap: 12, color: '#94a3b8', fontSize: 14, fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 18 }}>{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span>Collapse</span>}
          </div>
        </aside>
      )}

      {/* Sidebar - Mobile drawer */}
      {isMobile && (
        <>
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)', zIndex: 999,
              display: mobileMenuOpen ? 'block' : 'none'
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside style={{
            position: 'fixed', left: mobileMenuOpen ? 0 : -280, top: 0, bottom: 0,
            width: 280, background: '#fff', zIndex: 1000,
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '10px 0 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--accent-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'var(--primary-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 14,
                }}>A</div>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary-color)' }}>Migration</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 24, padding: 4 }}
              >×</button>
            </div>
            <nav style={{ flex: 1, padding: '16px 0' }}>
              {currentNavItems.map((item) => (
                <div
                  key={item.label}
                  onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 20px', cursor: 'pointer',
                    background: item.active ? 'var(--accent-color)' : 'transparent',
                    color: item.active ? 'var(--primary-color)' : 'var(--text-secondary)',
                    fontWeight: item.active ? 700 : 500,
                    fontSize: 16,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
            <div style={{ padding: '20px', borderTop: '1px solid var(--accent-color)' }}>
              {user && (
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', fontWeight: 700, border: '1px solid #fee2e2' }}
                >Logout</button>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{
          background: '#fff', borderBottom: '1px solid var(--accent-color)',
          padding: isMobile ? '0 16px' : '0 32px', height: 64, display: 'flex', alignItems: 'center',
          gap: 16, position: 'sticky', top: 0, zIndex: 90,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: '4px' }}
            >☰</button>
          )}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}
            >
              Dashboard
            </button>
            {activePath !== '/' && (
              <>
                <span style={{ color: '#ccc' }}>/</span>
                <span style={{ background: 'rgba(13, 59, 102, 0.08)', color: 'var(--primary-color)', borderRadius: '6px', padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
                  {NAV_ITEMS.find(i => i.path === activePath)?.label || 'Page'}
                </span>
              </>
            )}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            {user && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {!isMobile && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Student</div>
                  </div>
                )}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#fff'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
