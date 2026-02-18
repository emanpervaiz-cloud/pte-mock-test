import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import ProgressBar from '../components/common/ProgressBar';
import Timer from '../components/common/Timer';
import ReadAloud from '../components/questions/ReadAloud';
import RepeatSentence from '../components/questions/RepeatSentence';
import DescribeImage from '../components/questions/DescribeImage';
import RetellLecture from '../components/questions/RetellLecture';
import AnswerShortQuestion from '../components/questions/AnswerShortQuestion';
import { useNavigate } from 'react-router-dom';

const SpeakingSection = () => {
  const { state, setCurrentQuestionIndex, setCurrentSection } = useExam();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  // Mock speaking questions data
  const speakingQuestions = [
    {
      id: 'saq1',
      type: 'read_aloud',
      prompt: 'There is no simple explanation for the failure of the peace talks.',
      instruction: 'You will hear a short passage. Please read it aloud as naturally and clearly as possible.'
    },
    {
      id: 'saq2',
      type: 'repeat_sentence',
      prompt: 'The government is planning to invest more money in infrastructure.',
      instruction: 'You will hear a sentence. Please repeat it as accurately as possible.'
    },
    {
      id: 'saq3',
      type: 'describe_image',
      imageUrl: '/placeholder-image.jpg',
      instruction: 'Look at the image below and describe it in detail. You have 25 seconds to prepare and 40 seconds to speak.'
    },
    {
      id: 'saq4',
      type: 'retell_lecture',
      audioUrl: '/placeholder-audio.mp3',
      instruction: 'You will hear a short lecture. After it finishes, please retell the lecture in your own words.'
    },
    {
      id: 'saq5',
      type: 'answer_short_question',
      prompt: 'What is the capital of Australia?',
      instruction: 'You will hear a short question. Give a brief, clear answer in one or two sentences.'
    }
  ];

  const currentQuestionData = speakingQuestions[currentQuestion];

  const handleNextQuestion = () => {
    if (currentQuestion < speakingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentQuestionIndex(currentQuestion + 1);
    } else {
      // Move to writing section
      navigate('/exam/writing');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentQuestionIndex(currentQuestion - 1);
    }
  };

  // Set the current section when component mounts
  useEffect(() => {
    setCurrentSection('speaking');
  }, [setCurrentSection]);

  return (
    <div className="exam-container exam-theme">
      <header className="exam-header">
        <div className="container">
          <h1 className="exam-title">PTE Academic Mock Test</h1>
          <div className="timer-display">
            <Timer initialTime={1800} /> {/* 30 minutes for speaking section */}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="exam-section">
            <h2>Speaking Section</h2>
            
            <ProgressBar 
              current={currentQuestion + 1} 
              total={speakingQuestions.length} 
            />

            <div className="exam-question">
              <div className="question-number">
                Question {currentQuestion + 1} of {speakingQuestions.length}
              </div>
              
              <div className="exam-instructions">
                <p>{currentQuestionData.instruction}</p>
              </div>

              {/* Render the appropriate question component based on type */}
              {currentQuestionData.type === 'read_aloud' && (
                <ReadAloud question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'repeat_sentence' && (
                <RepeatSentence question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'describe_image' && (
                <DescribeImage question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'retell_lecture' && (
                <RetellLecture question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'answer_short_question' && (
                <AnswerShortQuestion question={currentQuestionData} onNext={handleNextQuestion} />
              )}
            </div>

            <div className="navigation-buttons">
              <button 
                className="btn btn-secondary" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleNextQuestion}
              >
                {currentQuestion === speakingQuestions.length - 1 ? 'Finish Section' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpeakingSection;