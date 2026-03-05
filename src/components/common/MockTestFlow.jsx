import React, { useEffect, useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { useNavigate } from 'react-router-dom';
import ListeningSection from '../sections/ListeningSection';
import SpeakingSection from '../sections/SpeakingSection';
import WritingSection from '../sections/WritingSection';
import ReadingSection from '../sections/ReadingSection';
import Timer from './Timer';

const MockTestFlow = () => {
  const { state, setExamMode, setCurrentMockSectionIndex } = useExam();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Set exam mode to mock test
    setExamMode('mock');
    setCurrentMockSectionIndex(0);
    window.scrollTo(0, 0);
  }, []);

  const handleSectionComplete = () => {
    const nextSectionIndex = currentSection + 1;

    if (nextSectionIndex < state.mockTestSections.length) {
      // Move to next section
      setCurrentSection(nextSectionIndex);
      setCurrentMockSectionIndex(nextSectionIndex);
    } else {
      // All sections complete, go to results
      navigate('/exam/results');
    }
  };

  const handleSectionBack = () => {
    // No back functionality in mock test - it's sequential and locked
    console.log('Navigation blocked: This is a locked mock test environment');
  };

  const getSectionTitle = () => {
    const sections = [
      'listening (15 minutes)',
      'speaking (20 minutes)',
      'writing (10 minutes)',
      'reading (35 minutes)'
    ];
    return sections[currentSection] || '';
  };

  const renderCurrentSection = () => {
    const sectionType = state.mockTestSections[currentSection];

    const nextSectionIndex = currentSection + 1;
    const nextSectionType = nextSectionIndex < state.mockTestSections.length
      ? state.mockTestSections[nextSectionIndex]
      : null;

    const sectionProps = {
      onSectionComplete: handleSectionComplete,
      onSectionBack: handleSectionBack,
      isMockTest: true,
      nextModule: nextSectionType ? nextSectionType.charAt(0).toUpperCase() + nextSectionType.slice(1) : null
    };

    switch (sectionType) {
      case 'listening':
        return <ListeningSection {...sectionProps} />;
      case 'speaking':
        return <SpeakingSection {...sectionProps} />;
      case 'writing':
        return <WritingSection {...sectionProps} />;
      case 'reading':
        return <ReadingSection {...sectionProps} />;
      default:
        return (
          <div className="exam-container exam-theme">
            <main className="main-content">
              <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h2>Invalid Section</h2>
                <p>Unknown section type: {sectionType}</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  Return to Dashboard
                </button>
              </div>
            </main>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Mock Test Header */}
      <div style={{
        background: 'var(--primary-color)',
        color: 'white',
        padding: '12px 0',
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 16px' : '0 24px',
          gap: isMobile ? 8 : 12
        }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', fontWeight: 700 }}>PTE Academic Mock Test</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: 0.8, color: 'var(--secondary-color)', fontWeight: 600 }}>
              SECTION {currentSection + 1} OF {state.mockTestSections.length}: {getSectionTitle().toUpperCase()}
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            borderTop: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
            paddingTop: isMobile ? 8 : 0
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, color: '#fff' }}>TIME REMAINING:</div>
            <Timer initialTime={4800} autoSubmit={false} />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div style={{
        background: '#fff',
        padding: '12px 0',
        borderBottom: '1px solid var(--accent-color)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {state.mockTestSections.map((section, index) => (
              <div
                key={`${section}-${index}`}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: index === currentSection ? 'var(--secondary-color)' :
                    index < currentSection ? 'var(--primary-color)' : 'var(--accent-color)',
                  transition: 'all 0.3s ease',
                  boxShadow: index === currentSection ? '0 0 0 4px rgba(250, 169, 22, 0.2)' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Section */}
      {renderCurrentSection()}
    </div>
  );
};

export default MockTestFlow;