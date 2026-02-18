import React from 'react';

const ProgressBar = ({ current, total, showPercentage = true }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="question-counter">
        Question {current} of {total} {showPercentage && `(${percentage}%)`}
      </div>
      <div className="section-progress">
        <div 
          className="section-progress-bar" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;