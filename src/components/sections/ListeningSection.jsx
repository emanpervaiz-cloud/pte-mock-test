import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ProgressBar from '../common/ProgressBar';
import Timer from '../common/Timer';
import SummarizeSpokenText from '../questions/SummarizeSpokenText';
import ListeningMultipleChoice from '../questions/ListeningMultipleChoice';
import ListeningFillBlanks from '../questions/ListeningFillBlanks';
import HighlightCorrectSummary from '../questions/HighlightCorrectSummary';
import SelectMissingWord from '../questions/SelectMissingWord';
import HighlightIncorrectWords from '../questions/HighlightIncorrectWords';
import WriteFromDictation from '../questions/WriteFromDictation';
import { SUMMARIZE_SPOKEN_TEXT_DB } from '../../data/listeningData';
import { useNavigate } from 'react-router-dom';

const ListeningSection = () => {
  const { state, setCurrentQuestionIndex, setCurrentSection } = useExam();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  // Mock listening questions data - Integrating the new Summarize Spoken Text database
  const listeningQuestions = [
    ...SUMMARIZE_SPOKEN_TEXT_DB.map(lecture => ({
      id: `lq_sst_${lecture.id}`,
      type: 'summarize_spoken_text',
      audioUrl: lecture.audioUrl || '/assets/listening/listening_fb_1.wav',
      instruction: 'You will hear a short lecture. Write a summary for the lecture in 50-70 words. You will have 10 minutes to finish this task.',
      minWords: lecture.minWords,
      maxWords: lecture.maxWords,
      transcript: lecture.transcript // Keeping transcript for potential accessibility/fallback
    })).slice(0, 1), // Keeping only the first one as Question 1 for now, as per standard structure
    {
      id: 'lq2',
      type: 'listening_multiple_choice',
      audioUrl: '/assets/listening/listening_fb_1.wav',
      question: 'According to the lecture, what is a significant consequence of microplastics for humans?',
      options: [
        { id: 'lmc1', text: 'They cause immediate starvation in coastal populations.' },
        { id: 'lmc2', text: 'They absorb toxins that enter the human food chain through seafood.' },
        { id: 'lmc3', text: 'They lead to a massive increase in the price of sustainable alternatives.' },
        { id: 'lmc4', text: 'They prevent researchers from discovering deep ocean trenches.' }
      ],
      correct: 'lmc2',
      multiple: false
    },
    {
      id: 'lq3',
      type: 'listening_fill_blanks',
      audioUrl: '/assets/listening/placeholder_health.mp3',
      passage: 'The research shows that ___1___ is crucial for maintaining a healthy lifestyle. Regular exercise combined with a balanced diet can significantly improve one\'s ___2___.',
      options: ['exercise', 'diet', 'sleep', 'health', 'wellness', 'activity'],
      answers: [
        { blank: 1, correct: 'exercise' },
        { blank: 2, correct: 'health' }
      ]
    },
    {
      id: 'lq4',
      type: 'highlight_correct_summary',
      audioUrl: '/assets/listening/placeholder_lecture_misc.mp3',
      options: [
        { id: 'hcs1', text: 'The presentation discusses the importance of renewable energy sources.' },
        { id: 'hcs2', text: 'The speaker focuses on traditional energy production methods.' },
        { id: 'hcs3', text: 'The lecture explores the economic benefits of fossil fuels.' },
        { id: 'hcs4', text: 'The talk examines the impact of climate change on agriculture.' }
      ],
      correct: 'hcs1'
    },
    {
      id: 'lq5',
      type: 'select_missing_word',
      audioUrl: '/assets/listening/placeholder_lecture_misc.mp3',
      transcript: 'The research indicates that the new policy will have a significant impact on the ___1___ market. Experts predict that the changes will lead to increased investment and growth.',
      options: ['stock', 'real estate', 'commodity', 'energy'],
      correct: 'real estate'
    },
    {
      id: 'lq6',
      type: 'highlight_incorrect_words',
      audioUrl: '/assets/listening/placeholder_lecture_misc.mp3',
      transcript: 'The annual report shows that the company has made substantial progress in the last quarter. The revenue has increased by fifteen percent, which exceeds the expectations of most investors.',
      mistakes: [5, 12] // positions of incorrect words
    },
    {
      id: 'lq7',
      type: 'write_from_dictation',
      audioUrl: '/assets/listening/placeholder_lecture_misc.mp3',
      instruction: 'You will hear a sentence. Type the sentence exactly as you hear it.'
    }
  ];

  const currentQuestionData = listeningQuestions[currentQuestion];

  const handleNextQuestion = () => {
    if (currentQuestion < listeningQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentQuestionIndex(currentQuestion + 1);
    } else {
      // Move to results section
      navigate('/exam/results');
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
    setCurrentSection('listening');
  }, [setCurrentSection]);

  return (
    <div className="exam-container exam-theme">
      <header className="exam-header">
        <div className="container">
          <h1 className="exam-title">PTE Academic Mock Test</h1>
          <div className="timer-display">
            <Timer initialTime={600} /> {/* 10 minutes for listening section */}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="exam-section">
            <h2>Listening Section</h2>

            <ProgressBar
              current={currentQuestion + 1}
              total={listeningQuestions.length}
            />

            <div className="exam-question">
              <div className="question-number">
                Question {currentQuestion + 1} of {listeningQuestions.length}
              </div>

              <div className="exam-instructions">
                <p>{currentQuestionData.instruction || 'Listen to the audio and answer the question.'}</p>
              </div>

              {/* Render the appropriate question component based on type */}
              {currentQuestionData.type === 'summarize_spoken_text' && (
                <SummarizeSpokenText question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'listening_multiple_choice' && (
                <ListeningMultipleChoice question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'listening_fill_blanks' && (
                <ListeningFillBlanks question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'highlight_correct_summary' && (
                <HighlightCorrectSummary question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'select_missing_word' && (
                <SelectMissingWord question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'highlight_incorrect_words' && (
                <HighlightIncorrectWords question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'write_from_dictation' && (
                <WriteFromDictation question={currentQuestionData} onNext={handleNextQuestion} />
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
                {currentQuestion === listeningQuestions.length - 1 ? 'Finish Exam' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListeningSection;