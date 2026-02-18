import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';
import LandingPage from './components/sections/LandingPage';
import './styles/App.css';
import './styles/exam-theme.css';
import './styles/responsive.css';

function App() {
  return (
    <ExamProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/exam/introduction" element={<div>Exam Introduction</div>} />
            <Route path="/exam/speaking" element={<div>Speaking Section</div>} />
            <Route path="/exam/writing" element={<div>Writing Section</div>} />
            <Route path="/exam/reading" element={<div>Reading Section</div>} />
            <Route path="/exam/listening" element={<div>Listening Section</div>} />
            <Route path="/exam/results" element={<div>Results Page</div>} />
          </Routes>
        </div>
      </Router>
    </ExamProvider>
  );
}

export default App;