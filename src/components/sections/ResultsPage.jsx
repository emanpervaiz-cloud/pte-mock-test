import React, { useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const { state } = useExam();
  const navigate = useNavigate();

  // In a real application, we would calculate the scores here
  // For now, we'll use mock data to demonstrate the UI
  const mockResults = {
    overallScore: 72,
    cefrLevel: 'B2',
    eligibility: 'Competitive',
    sectionScores: {
      speaking: { scaledScore: 68, cefrLevel: 'B1' },
      writing: { scaledScore: 75, cefrLevel: 'B2' },
      reading: { scaledScore: 78, cefrLevel: 'B2' },
      listening: { scaledScore: 70, cefrLevel: 'B1' }
    },
    detailedReport: {
      speaking: [
        { questionId: 'saq1', feedback: 'Good pronunciation and fluency. Work on content accuracy.' }
      ],
      writing: [
        { questionId: 'wq1', feedback: 'Clear structure and good vocabulary range.' }
      ],
      reading: [
        { questionId: 'rq1', feedback: 'Strong comprehension skills.' }
      ],
      listening: [
        { questionId: 'lq1', feedback: 'Good understanding of main ideas.' }
      ]
    }
  };

  // Determine eligibility badge color
  const getEligibilityColor = (eligibility) => {
    switch(eligibility) {
      case 'Competitive':
        return '#4CAF50'; // Green
      case 'Borderline':
        return '#FF9800'; // Orange
      case 'Needs Improvement':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  };

  // Determine CEFR level color
  const getCefrColor = (level) => {
    switch(level) {
      case 'C2':
      case 'C1':
        return '#4CAF50'; // Green
      case 'B2':
      case 'B1':
        return '#2196F3'; // Blue
      case 'A2':
      case 'A1':
        return '#FF9800'; // Orange
      default:
        return '#9E9E9E'; // Gray
    }
  };

  // Handle retake exam
  const handleRetake = () => {
    navigate('/');
  };

  // Handle view detailed feedback
  const handleViewFeedback = () => {
    // In a real app, this would navigate to a detailed feedback page
    alert('Detailed feedback would be shown here');
  };

  return (
    <div className="exam-container exam-theme">
      <header className="exam-header">
        <div className="container">
          <h1 className="exam-title">PTE Academic Mock Test</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="results-container">
            <h2>Exam Results</h2>
            
            <div className="results-summary">
              <div className="score-overview">
                <div className="overall-score">
                  <div className="score-value" style={{ color: getEligibilityColor(mockResults.eligibility) }}>
                    {mockResults.overallScore}
                  </div>
                  <div className="score-label">Overall PTE Score</div>
                </div>
                
                <div className="eligibility-badge" style={{ backgroundColor: getEligibilityColor(mockResults.eligibility) }}>
                  {mockResults.eligibility}
                </div>
              </div>
              
              <div className="cefr-level">
                <div className="cefr-value" style={{ color: getCefrColor(mockResults.cefrLevel) }}>
                  {mockResults.cefrLevel}
                </div>
                <div className="cefr-label">CEFR Level</div>
              </div>
            </div>

            <div className="section-scores">
              <h3>Section Scores</h3>
              <div className="section-grid">
                <div className="score-card">
                  <div className="section-name">Speaking</div>
                  <div className="section-score">{mockResults.sectionScores.speaking.scaledScore}</div>
                  <div className="section-cefr" style={{ color: getCefrColor(mockResults.sectionScores.speaking.cefrLevel) }}>
                    {mockResults.sectionScores.speaking.cefrLevel}
                  </div>
                </div>
                
                <div className="score-card">
                  <div className="section-name">Writing</div>
                  <div className="section-score">{mockResults.sectionScores.writing.scaledScore}</div>
                  <div className="section-cefr" style={{ color: getCefrColor(mockResults.sectionScores.writing.cefrLevel) }}>
                    {mockResults.sectionScores.writing.cefrLevel}
                  </div>
                </div>
                
                <div className="score-card">
                  <div className="section-name">Reading</div>
                  <div className="section-score">{mockResults.sectionScores.reading.scaledScore}</div>
                  <div className="section-cefr" style={{ color: getCefrColor(mockResults.sectionScores.reading.cefrLevel) }}>
                    {mockResults.sectionScores.reading.cefrLevel}
                  </div>
                </div>
                
                <div className="score-card">
                  <div className="section-name">Listening</div>
                  <div className="section-score">{mockResults.sectionScores.listening.scaledScore}</div>
                  <div className="section-cefr" style={{ color: getCefrColor(mockResults.sectionScores.listening.cefrLevel) }}>
                    {mockResults.sectionScores.listening.cefrLevel}
                  </div>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <h3>Performance Feedback</h3>
              <div className="feedback-highlights">
                <div className="feedback-item">
                  <h4>Strengths</h4>
                  <ul>
                    <li>Strong reading comprehension skills</li>
                    <li>Good writing structure and vocabulary</li>
                    <li>Effective listening abilities</li>
                  </ul>
                </div>
                
                <div className="feedback-item">
                  <h4>Areas for Improvement</h4>
                  <ul>
                    <li>Focus on speaking fluency and pronunciation</li>
                    <li>Work on complex grammar structures in writing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="recommendations-section">
              <h3>Study Recommendations</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  <h4>Speaking Practice</h4>
                  <p>Practice speaking on a variety of topics for 2-3 minutes daily. Focus on pronunciation and fluency.</p>
                </div>
                
                <div className="recommendation-item">
                  <h4>Writing Enhancement</h4>
                  <p>Work on essay structure and practice writing under timed conditions. Expand your range of linking words.</p>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleViewFeedback}>
                View Detailed Feedback
              </button>
              <button className="btn btn-secondary" onClick={handleRetake}>
                Retake Exam
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;