import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate age
    const age = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 16 || age > 80) {
      newErrors.age = 'Please enter a valid age between 16 and 80';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Store user data in localStorage or pass to context/state management
      localStorage.setItem('pteUserData', JSON.stringify(formData));
      
      // Navigate to exam introduction or first section
      navigate('/exam/introduction');
    }
  };

  return (
    <div className="exam-container">
      <header className="exam-header">
        <div className="container">
          <h1 className="exam-title">PTE Academic Mock Test</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="card">
            <h2>Start Your PTE Mock Test</h2>
            <p className="exam-instructions">
              Welcome to our AI-powered PTE Academic mock test. Please provide your information below to begin the exam.
              The test will simulate the real PTE Academic experience with accurate timing and question types.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-control ${errors.fullName ? 'error' : ''}`}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <div className="error-message">{errors.fullName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="age" className="form-label">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className={`form-control ${errors.age ? 'error' : ''}`}
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="16"
                  max="80"
                />
                {errors.age && <div className="error-message">{errors.age}</div>}
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-full-width">
                  Start PTE Mock Test
                </button>
              </div>
            </form>

            <div className="exam-instructions">
              <h3>About This Test</h3>
              <ul>
                <li>The test contains all four sections of the real PTE Academic: Speaking & Writing, Reading, and Listening</li>
                <li>Total duration is approximately 3 hours</li>
                <li>Each section has specific time limits that will be enforced</li>
                <li>Your responses will be evaluated by our AI system and compared to human examiner standards</li>
                <li>You will receive detailed feedback and scores upon completion</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} PTE Mock Test Platform. AI-powered English Assessment.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;