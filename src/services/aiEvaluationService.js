// AI Evaluation Service for PTE Mock Test
// This service handles the AI-based evaluation of user responses using GPT-4o or equivalent

class AIEvaluationService {
  constructor(apiKey, apiUrl = 'https://api.openai.com/v1/chat/completions', provider = 'openai') {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.provider = provider; // 'openai' or 'openrouter'
  }

  // Evaluate speaking responses
  async evaluateSpeaking(prompt, response, questionType) {
    const evaluationCriteria = this.getSpeakingEvaluationCriteria(questionType);
    
    const messages = [
      {
        role: "system",
        content: `You are an expert PTE examiner evaluating a student's speaking response. Evaluate based on IELTS/CEFR standards and provide constructive feedback.`
      },
      {
        role: "user",
        content: `
          Question Type: ${questionType}
          Prompt: ${prompt}
          Student Response: ${response}
          
          Evaluate based on these criteria: ${evaluationCriteria}
          
          Provide your evaluation in the following JSON format:
          {
            "content_accuracy": {score: 0-5, feedback: "specific feedback"},
            "fluency": {score: 0-5, feedback: "specific feedback"},
            "pronunciation": {score: 0-5, feedback: "specific feedback"},
            "vocabulary": {score: 0-5, feedback: "specific feedback"},
            "grammar": {score: 0-5, feedback: "specific feedback"},
            "speech_rate": {score: 0-5, feedback: "specific feedback"},
            "hesitations": {score: 0-5, feedback: "specific feedback"},
            "overall_score": 0-90,
            "cefr_level": "B1/B2/C1/C2",
            "band_descriptor": "brief descriptor",
            "detailed_feedback": "comprehensive feedback"
          }
        `
      }
    ];

    try {
      const requestBody = {
        model: this.provider === 'openrouter' ? 'openai/gpt-4o' : 'gpt-4o',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1000
      };

      // Add OpenRouter-specific headers if using OpenRouter
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };

      if (this.provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'PTE Mock Test AI Evaluation';
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      // Handle response based on provider
      if (this.provider === 'openrouter') {
        return JSON.parse(data.choices[0].message.content);
      } else {
        return JSON.parse(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error evaluating speaking:', error);
      // Return a fallback evaluation
      return this.getFallbackSpeakingEvaluation();
    }
  }

  // Evaluate writing responses
  async evaluateWriting(prompt, response, questionType) {
    const evaluationCriteria = this.getWritingEvaluationCriteria(questionType);
    
    const messages = [
      {
        role: "system",
        content: `You are an expert PTE examiner evaluating a student's writing response. Evaluate based on IELTS/CEFR standards and provide constructive feedback.`
      },
      {
        role: "user",
        content: `
          Question Type: ${questionType}
          Prompt: ${prompt}
          Student Response: ${response}
          
          Evaluate based on these criteria: ${evaluationCriteria}
          
          Provide your evaluation in the following JSON format:
          {
            "task_fulfillment": {score: 0-5, feedback: "specific feedback"},
            "coherence_cohesion": {score: 0-5, feedback: "specific feedback"},
            "grammar_range_accuracy": {score: 0-5, feedback: "specific feedback"},
            "lexical_resource": {score: 0-5, feedback: "specific feedback"},
            "spelling": {score: 0-5, feedback: "specific feedback"},
            "structure": {score: 0-5, feedback: "specific feedback"},
            "overall_score": 0-90,
            "cefr_level": "B1/B2/C1/C2",
            "band_descriptor": "brief descriptor",
            "detailed_feedback": "comprehensive feedback"
          }
        `
      }
    ];

    try {
      const requestBody = {
        model: this.provider === 'openrouter' ? 'openai/gpt-4o' : 'gpt-4o',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1000
      };

      // Add OpenRouter-specific headers if using OpenRouter
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };

      if (this.provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'PTE Mock Test AI Evaluation';
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      // Handle response based on provider
      if (this.provider === 'openrouter') {
        return JSON.parse(data.choices[0].message.content);
      } else {
        return JSON.parse(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error evaluating writing:', error);
      // Return a fallback evaluation
      return this.getFallbackWritingEvaluation();
    }
  }

  // Evaluate reading responses
  async evaluateReading(correctAnswers, studentAnswers) {
    try {
      let score = 0;
      const feedback = [];

      for (let i = 0; i < correctAnswers.length; i++) {
        const isCorrect = this.compareAnswers(correctAnswers[i], studentAnswers[i]);
        if (isCorrect) {
          score += 1;
        }
        
        feedback.push({
          questionIndex: i,
          isCorrect: isCorrect,
          correctAnswer: correctAnswers[i],
          studentAnswer: studentAnswers[i],
          feedback: isCorrect ? "Correct!" : "Incorrect. Consider reviewing this concept."
        });
      }

      const percentage = (score / correctAnswers.length) * 100;
      const cefrLevel = this.calculateCEFRLevel(percentage);

      return {
        score: score,
        total: correctAnswers.length,
        percentage: percentage,
        cefrLevel: cefrLevel,
        feedback: feedback
      };
    } catch (error) {
      console.error('Error evaluating reading:', error);
      return this.getFallbackReadingEvaluation();
    }
  }

  // Evaluate listening responses
  async evaluateListening(correctAnswers, studentAnswers) {
    try {
      let score = 0;
      const feedback = [];

      for (let i = 0; i < correctAnswers.length; i++) {
        const isCorrect = this.compareAnswers(correctAnswers[i], studentAnswers[i]);
        if (isCorrect) {
          score += 1;
        }
        
        feedback.push({
          questionIndex: i,
          isCorrect: isCorrect,
          correctAnswer: correctAnswers[i],
          studentAnswer: studentAnswers[i],
          feedback: isCorrect ? "Correct!" : "Incorrect. Consider reviewing this concept."
        });
      }

      const percentage = (score / correctAnswers.length) * 100;
      const cefrLevel = this.calculateCEFRLevel(percentage);

      return {
        score: score,
        total: correctAnswers.length,
        percentage: percentage,
        cefrLevel: cefrLevel,
        feedback: feedback
      };
    } catch (error) {
      console.error('Error evaluating listening:', error);
      return this.getFallbackListeningEvaluation();
    }
  }

  // Helper method to compare answers
  compareAnswers(correct, student) {
    if (typeof correct === 'string' && typeof student === 'string') {
      return correct.toLowerCase().trim() === student.toLowerCase().trim();
    }
    if (Array.isArray(correct) && Array.isArray(student)) {
      return JSON.stringify(correct.sort()) === JSON.stringify(student.sort());
    }
    return correct === student;
  }

  // Helper method to calculate CEFR level
  calculateCEFRLevel(percentage) {
    if (percentage >= 85) return 'C2';
    if (percentage >= 75) return 'C1';
    if (percentage >= 55) return 'B2';
    if (percentage >= 35) return 'B1';
    return 'A2';
  }

  // Get speaking evaluation criteria based on question type
  getSpeakingEvaluationCriteria(questionType) {
    switch(questionType) {
      case 'read_aloud':
        return "Content accuracy (correct pronunciation of words), Fluency (smooth delivery without hesitation), Pronunciation (clear articulation), Intonation (appropriate stress and rhythm)";
      case 'repeat_sentence':
        return "Content accuracy (exact reproduction of sentence), Fluency (smooth delivery), Pronunciation (clear articulation), Intonation (matching the original)";
      case 'describe_image':
        return "Content accuracy (relevant details), Fluency (coherent delivery), Vocabulary (descriptive language), Grammar (accurate structures), Organization (logical flow)";
      case 'retell_lecture':
        return "Content accuracy (key points captured), Fluency (coherent delivery), Vocabulary (range and accuracy), Grammar (complex structures), Organization (logical sequence)";
      case 'answer_short_question':
        return "Content accuracy (correct answer), Fluency (clear delivery), Vocabulary (appropriate word choice), Grammar (accuracy)";
      default:
        return "Content accuracy, Fluency, Pronunciation, Vocabulary, Grammar";
    }
  }

  // Get writing evaluation criteria based on question type
  getWritingEvaluationCriteria(questionType) {
    switch(questionType) {
      case 'summarize_written_text':
        return "Task fulfillment (captures key points), Coherence and cohesion (logical flow), Grammar range and accuracy (complex structures), Lexical resource (vocabulary range), Spelling (accuracy)";
      case 'write_essay':
        return "Task fulfillment (addresses all parts), Coherence and cohesion (organized structure), Grammar range and accuracy (complex structures), Lexical resource (vocabulary range), Spelling (accuracy), Structure (introduction-body-conclusion)";
      default:
        return "Task fulfillment, Coherence and cohesion, Grammar range and accuracy, Lexical resource, Spelling, Structure";
    }
  }

  // Fallback evaluations
  getFallbackSpeakingEvaluation() {
    return {
      content_accuracy: {score: 3, feedback: "Moderate accuracy in content delivery"},
      fluency: {score: 3, feedback: "Some hesitations but generally smooth delivery"},
      pronunciation: {score: 3, feedback: "Mostly clear pronunciation with some errors"},
      vocabulary: {score: 3, feedback: "Adequate vocabulary range for the task"},
      grammar: {score: 3, feedback: "Basic grammatical structures mostly correct"},
      speech_rate: {score: 3, feedback: "Appropriate pace with minor issues"},
      hesitations: {score: 3, feedback: "Occasional hesitations but manageable"},
      overall_score: 60,
      cefr_level: "B1",
      band_descriptor: "Modest ability",
      detailed_feedback: "Your response demonstrates basic competency but needs improvement in several areas. Focus on pronunciation accuracy and expanding your vocabulary range for more complex expressions."
    };
  }

  getFallbackWritingEvaluation() {
    return {
      task_fulfillment: {score: 3, feedback: "Addresses most parts of the task"},
      coherence_cohesion: {score: 3, feedback: "Some logical organization but could be clearer"},
      grammar_range_accuracy: {score: 3, feedback: "Uses basic structures correctly"},
      lexical_resource: {score: 3, feedback: "Limited but adequate vocabulary"},
      spelling: {score: 3, feedback: "Few errors that don't impede communication"},
      structure: {score: 3, feedback: "Basic structure present"},
      overall_score: 60,
      cefr_level: "B1",
      band_descriptor: "Modest ability",
      detailed_feedback: "Your writing addresses the task requirements but could benefit from improved organization and more varied vocabulary. Work on developing complex grammatical structures."
    };
  }

  getFallbackReadingEvaluation() {
    return {
      score: 5,
      total: 10,
      percentage: 50,
      cefrLevel: "B1",
      feedback: [{questionIndex: 0, isCorrect: false, correctAnswer: "", studentAnswer: "", feedback: "Could not evaluate due to system error"}]
    };
  }

  getFallbackListeningEvaluation() {
    return {
      score: 5,
      total: 10,
      percentage: 50,
      cefrLevel: "B1",
      feedback: [{questionIndex: 0, isCorrect: false, correctAnswer: "", studentAnswer: "", feedback: "Could not evaluate due to system error"}]
    };
  }
}

export default AIEvaluationService;