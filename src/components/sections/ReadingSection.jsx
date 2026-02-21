import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import ProgressBar from '../common/ProgressBar';
import Timer from '../common/Timer';
import ReadingWritingFillBlanks from '../questions/ReadingWritingFillBlanks';
import MultipleChoice from '../questions/MultipleChoice';
import ReorderParagraph from '../questions/ReorderParagraph';
import ReadingFillBlanks from '../questions/ReadingFillBlanks';
import ReadingMultipleChoiceAudio from '../questions/ReadingMultipleChoiceAudio';
import { useNavigate } from 'react-router-dom';

const ReadingSection = () => {
  const { state, setCurrentQuestionIndex, setCurrentSection } = useExam();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  // Mock reading questions data
  const readingQuestions = [
    {
      id: 'rq1',
      type: 'reading_writing_fill_blanks',
      passage: 'The development of technology has significantly impacted the way people communicate. In the past, communication was limited to face-to-face interactions, letters, and telephone calls. Today, however, individuals can instantly connect with others across the globe through various digital platforms such as email, social media, and messaging applications.',
      prompt: 'Below is a passage with several blanks. For each blank, select the most appropriate word from the dropdown menu.',
      questions: [
        {
          id: 'rq1_blank1',
          options: ['technology', 'education', 'medicine', 'transportation'],
          correct: 'technology',
          position: 1
        },
        {
          id: 'rq1_blank2',
          options: ['instantly', 'slowly', 'carefully', 'quietly'],
          correct: 'instantly',
          position: 2
        }
      ]
    },
    {
      id: 'rq2',
      type: 'multiple_choice',
      question: 'Which of the following best describes the main idea of the passage?',
      options: [
        { id: 'mc1', text: 'Technology has improved transportation systems' },
        { id: 'mc2', text: 'Communication methods have evolved with technology' },
        { id: 'mc3', text: 'Social media is the primary communication method' },
        { id: 'mc4', text: 'Face-to-face communication is becoming obsolete' }
      ],
      correct: 'mc2',
      multiple: false
    },
    {
      id: 'rq3',
      type: 'reorder_paragraph',
      prompt: 'The text boxes below have been placed in random order. Restore the original order by dragging and dropping the text boxes.',
      sentences: [
        { id: 'rs1', text: 'The first computers were created in the early 20th century.' },
        { id: 'rs2', text: 'These early machines were massive and occupied entire rooms.' },
        { id: 'rs3', text: 'Today, computing power has increased exponentially while size has decreased dramatically.' },
        { id: 'rs4', text: 'The development of microprocessors revolutionized personal computing.' },
        { id: 'rs5', text: 'Modern smartphones have more computing power than the early room-sized computers.' }
      ],
      correctOrder: ['rs1', 'rs2', 'rs4', 'rs3', 'rs5']
    },
    {
      id: 'rq4',
      type: 'reading_fill_blanks',
      passage: 'Climate change represents one of the most significant challenges facing our planet today. The ___1___ of global temperatures has led to various environmental impacts, including rising sea levels, extreme weather events, and changes in precipitation patterns. Scientists ___2___ that human activities, particularly the emission of greenhouse gases, are the primary drivers of contemporary climate change.',
      prompt: 'Complete the text with the most appropriate words from the box below. Each word can only be used once.',
      options: ['increase', 'research', 'suggest', 'decline', 'analyze', 'confirm'],
      answers: [
        { blank: 1, correct: 'increase' },
        { blank: 2, correct: 'suggest' }
      ]
    },
    {
      id: 'rq5_audio',
      type: 'reading_multiple_choice_audio',
      audioUrl: '/assets/reading/reading_audio_1.wav',
      prompt: 'Listen to the audio note and answer the question below.',
      question: 'What is the speaker mainly discussing in the audio?',
      options: [
        { id: 'rao1', text: 'The importance of consistent practice' },
        { id: 'rao2', text: 'The new grading criteria' },
        { id: 'rao3', text: 'A technical issue with the software' },
        { id: 'rao4', text: 'The schedule for the next exam' }
      ],
      correct: 'rao1',
      multiple: false
    }
  ];

  const currentQuestionData = readingQuestions[currentQuestion];

  const handleNextQuestion = () => {
    if (currentQuestion < readingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentQuestionIndex(currentQuestion + 1);
    } else {
      // Move to listening section
      navigate('/exam/listening');
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
    setCurrentSection('reading');
  }, [setCurrentSection]);

  return (
    <div className="exam-container exam-theme">
      <header className="exam-header">
        <div className="container">
          <h1 className="exam-title">PTE Academic Mock Test</h1>
          <div className="timer-display">
            <Timer initialTime={600} /> {/* 10 minutes for reading section */}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="exam-section">
            <h2>Reading Section</h2>

            <ProgressBar
              current={currentQuestion + 1}
              total={readingQuestions.length}
            />

            <div className="exam-question">
              <div className="question-number">
                Question {currentQuestion + 1} of {readingQuestions.length}
              </div>

              <div className="exam-instructions">
                <p>{currentQuestionData.prompt}</p>
              </div>

              {/* Render the appropriate question component based on type */}
              {currentQuestionData.type === 'reading_writing_fill_blanks' && (
                <ReadingWritingFillBlanks question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'multiple_choice' && (
                <MultipleChoice question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'reorder_paragraph' && (
                <ReorderParagraph question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'reading_fill_blanks' && (
                <ReadingFillBlanks question={currentQuestionData} onNext={handleNextQuestion} />
              )}
              {currentQuestionData.type === 'reading_multiple_choice_audio' && (
                <ReadingMultipleChoiceAudio question={currentQuestionData} onNext={handleNextQuestion} />
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
                {currentQuestion === readingQuestions.length - 1 ? 'Finish Section' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadingSection;