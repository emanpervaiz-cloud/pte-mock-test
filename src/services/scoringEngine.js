// Scoring Engine for PTE Mock Test
// Handles calculation of scores across all sections and maps to CEFR levels

class ScoringEngine {
  constructor() {
    // PTE score ranges (10-90 scale)
    this.PTE_SCORE_RANGES = {
      'Needs Improvement': { min: 10, max: 29 },
      'Borderline': { min: 30, max: 59 },
      'Competitive': { min: 60, max: 90 }
    };

    // CEFR to PTE score mapping
    this.CEFR_MAPPING = {
      'A1': { min: 10, max: 22 },
      'A2': { min: 23, max: 34 },
      'B1': { min: 35, max: 49 },
      'B2': { min: 50, max: 69 },
      'C1': { min: 70, max: 85 },
      'C2': { min: 86, max: 90 }
    };

    // Weight distribution for overall score
    this.SECTION_WEIGHTS = {
      speaking: 0.25,
      writing: 0.25,
      reading: 0.25,
      listening: 0.25
    };
  }

  // Calculate speaking section score
  calculateSpeakingScore(answers, aiEvaluations) {
    if (!answers || !aiEvaluations) {
      return { rawScore: 0, scaledScore: 10, cefrLevel: 'A1', detailedBreakdown: [] };
    }

    let totalRawScore = 0;
    const detailedBreakdown = [];

    for (const [questionId, answer] of Object.entries(answers)) {
      const aiEval = aiEvaluations[questionId];
      
      if (aiEval) {
        // Calculate raw score based on AI evaluation
        let questionScore = 0;
        
        if (aiEval.content_accuracy) {
          questionScore += aiEval.content_accuracy.score * 2; // Weighted score
        }
        if (aiEval.fluency) {
          questionScore += aiEval.fluency.score * 2;
        }
        if (aiEval.pronunciation) {
          questionScore += aiEval.pronunciation.score * 2;
        }
        if (aiEval.vocabulary) {
          questionScore += aiEval.vocabulary.score * 2;
        }
        if (aiEval.grammar) {
          questionScore += aiEval.grammar.score * 2;
        }
        if (aiEval.speech_rate) {
          questionScore += aiEval.speech_rate.score * 2;
        }
        if (aiEval.hesitations) {
          questionScore += aiEval.hesitations.score * 2;
        }

        // Normalize to 0-90 scale
        const normalizedScore = Math.min(90, Math.max(10, questionScore));
        totalRawScore += normalizedScore;

        detailedBreakdown.push({
          questionId,
          rawScore: questionScore,
          normalizedScore,
          cefrLevel: aiEval.cefr_level || this.mapScoreToCEFR(normalizedScore),
          feedback: aiEval.detailed_feedback || 'Well done!'
        });
      }
    }

    // Calculate average score
    const avgRawScore = answers ? totalRawScore / Object.keys(answers).length : 0;
    const speakingScore = this.scaleToPTE(avgRawScore);
    const cefrLevel = this.mapScoreToCEFR(speakingScore);

    return {
      rawScore: avgRawScore,
      scaledScore: speakingScore,
      cefrLevel,
      detailedBreakdown
    };
  }

  // Calculate writing section score
  calculateWritingScore(answers, aiEvaluations) {
    if (!answers || !aiEvaluations) {
      return { rawScore: 0, scaledScore: 10, cefrLevel: 'A1', detailedBreakdown: [] };
    }

    let totalRawScore = 0;
    const detailedBreakdown = [];

    for (const [questionId, answer] of Object.entries(answers)) {
      const aiEval = aiEvaluations[questionId];
      
      if (aiEval) {
        // Calculate raw score based on AI evaluation
        let questionScore = 0;
        
        if (aiEval.task_fulfillment) {
          questionScore += aiEval.task_fulfillment.score * 2;
        }
        if (aiEval.coherence_cohesion) {
          questionScore += aiEval.coherence_cohesion.score * 2;
        }
        if (aiEval.grammar_range_accuracy) {
          questionScore += aiEval.grammar_range_accuracy.score * 2;
        }
        if (aiEval.lexical_resource) {
          questionScore += aiEval.lexical_resource.score * 2;
        }
        if (aiEval.spelling) {
          questionScore += aiEval.spelling.score * 2;
        }
        if (aiEval.structure) {
          questionScore += aiEval.structure.score * 2;
        }

        // Normalize to 0-90 scale
        const normalizedScore = Math.min(90, Math.max(10, questionScore));
        totalRawScore += normalizedScore;

        detailedBreakdown.push({
          questionId,
          rawScore: questionScore,
          normalizedScore,
          cefrLevel: aiEval.cefr_level || this.mapScoreToCEFR(normalizedScore),
          feedback: aiEval.detailed_feedback || 'Well done!'
        });
      }
    }

    // Calculate average score
    const avgRawScore = answers ? totalRawScore / Object.keys(answers).length : 0;
    const writingScore = this.scaleToPTE(avgRawScore);
    const cefrLevel = this.mapScoreToCEFR(writingScore);

    return {
      rawScore: avgRawScore,
      scaledScore: writingScore,
      cefrLevel,
      detailedBreakdown
    };
  }

  // Calculate reading section score
  calculateReadingScore(answers, aiEvaluations) {
    if (!answers || !aiEvaluations) {
      return { rawScore: 0, scaledScore: 10, cefrLevel: 'A1', detailedBreakdown: [] };
    }

    let totalCorrect = 0;
    let totalQuestions = 0;
    const detailedBreakdown = [];

    for (const [questionId, answer] of Object.entries(answers)) {
      const aiEval = aiEvaluations[questionId];
      
      if (aiEval) {
        // For reading, we typically have binary scoring (correct/incorrect)
        const questionScore = aiEval.score || 0;
        totalCorrect += questionScore;
        totalQuestions++;

        detailedBreakdown.push({
          questionId,
          rawScore: questionScore,
          normalizedScore: questionScore * 90, // Convert to 0-90 scale
          cefrLevel: aiEval.cefrLevel || this.mapScoreToCEFR(questionScore * 90),
          feedback: aiEval.feedback || 'Well done!'
        });
      }
    }

    // Calculate percentage
    const percentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    // Scale to PTE range (10-90)
    const scaledScore = this.scaleToPTE(percentage);
    const cefrLevel = this.mapScoreToCEFR(scaledScore);

    return {
      rawScore: percentage,
      scaledScore,
      cefrLevel,
      detailedBreakdown
    };
  }

  // Calculate listening section score
  calculateListeningScore(answers, aiEvaluations) {
    if (!answers || !aiEvaluations) {
      return { rawScore: 0, scaledScore: 10, cefrLevel: 'A1', detailedBreakdown: [] };
    }

    let totalCorrect = 0;
    let totalQuestions = 0;
    const detailedBreakdown = [];

    for (const [questionId, answer] of Object.entries(answers)) {
      const aiEval = aiEvaluations[questionId];
      
      if (aiEval) {
        // For listening, we typically have binary scoring (correct/incorrect)
        const questionScore = aiEval.score || 0;
        totalCorrect += questionScore;
        totalQuestions++;

        detailedBreakdown.push({
          questionId,
          rawScore: questionScore,
          normalizedScore: questionScore * 90, // Convert to 0-90 scale
          cefrLevel: aiEval.cefrLevel || this.mapScoreToCEFR(questionScore * 90),
          feedback: aiEval.feedback || 'Well done!'
        });
      }
    }

    // Calculate percentage
    const percentage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    // Scale to PTE range (10-90)
    const scaledScore = this.scaleToPTE(percentage);
    const cefrLevel = this.mapScoreToCEFR(scaledScore);

    return {
      rawScore: percentage,
      scaledScore,
      cefrLevel,
      detailedBreakdown
    };
  }

  // Calculate overall PTE score
  calculateOverallScore(sectionScores) {
    const { speaking, writing, reading, listening } = sectionScores;

    // Weighted average based on section weights
    const overallRawScore = 
      (speaking.scaledScore * this.SECTION_WEIGHTS.speaking) +
      (writing.scaledScore * this.SECTION_WEIGHTS.writing) +
      (reading.scaledScore * this.SECTION_WEIGHTS.reading) +
      (listening.scaledScore * this.SECTION_WEIGHTS.listening);

    // Determine overall CEFR level based on dominant level
    const cefrLevels = [speaking.cefrLevel, writing.cefrLevel, reading.cefrLevel, listening.cefrLevel];
    const overallCEFR = this.determineOverallCEFR(cefrLevels);

    // Classify eligibility
    const eligibility = this.classifyEligibility(overallRawScore);

    return {
      overallScore: Math.round(overallRawScore),
      cefrLevel: overallCEFR,
      eligibility,
      sectionScores
    };
  }

  // Map score to CEFR level
  mapScoreToCEFR(score) {
    // Round score to nearest integer for comparison
    const roundedScore = Math.round(score);
    
    for (const [level, range] of Object.entries(this.CEFR_MAPPING)) {
      if (roundedScore >= range.min && roundedScore <= range.max) {
        return level;
      }
    }
    
    // Default to A1 if no match
    return 'A1';
  }

  // Determine overall CEFR based on section levels
  determineOverallCEFR(cefrLevels) {
    // Convert CEFR levels to numeric values for comparison
    const levelValues = {
      'A1': 1, 'A2': 2,
      'B1': 3, 'B2': 4,
      'C1': 5, 'C2': 6
    };

    // Get the average level
    const totalValue = cefrLevels.reduce((sum, level) => sum + (levelValues[level] || 1), 0);
    const avgValue = totalValue / cefrLevels.length;

    // Map back to CEFR level
    if (avgValue <= 1.5) return 'A1';
    if (avgValue <= 2.5) return 'A2';
    if (avgValue <= 3.5) return 'B1';
    if (avgValue <= 4.5) return 'B2';
    if (avgValue <= 5.5) return 'C1';
    return 'C2';
  }

  // Classify eligibility based on overall score
  classifyEligibility(score) {
    if (score >= this.PTE_SCORE_RANGES['Competitive'].min) {
      return 'Competitive';
    } else if (score >= this.PTE_SCORE_RANGES['Borderline'].min) {
      return 'Borderline';
    } else {
      return 'Needs Improvement';
    }
  }

  // Scale score to PTE range (10-90)
  scaleToPTE(rawScore) {
    // Ensure raw score is between 0-100
    const boundedScore = Math.max(0, Math.min(100, rawScore));
    
    // Scale from 0-100 to 10-90 range
    return Math.round(10 + (boundedScore * 0.8)); // 0.8 is the scaling factor (80 points over 100)
  }

  // Generate detailed score report
  generateScoreReport(examData, aiEvaluations) {
    const speakingScore = this.calculateSpeakingScore(
      this.filterBySection(examData.answers, 'speaking'), 
      this.filterBySection(aiEvaluations, 'speaking')
    );

    const writingScore = this.calculateWritingScore(
      this.filterBySection(examData.answers, 'writing'), 
      this.filterBySection(aiEvaluations, 'writing')
    );

    const readingScore = this.calculateReadingScore(
      this.filterBySection(examData.answers, 'reading'), 
      this.filterBySection(aiEvaluations, 'reading')
    );

    const listeningScore = this.calculateListeningScore(
      this.filterBySection(examData.answers, 'listening'), 
      this.filterBySection(aiEvaluations, 'listening')
    );

    const sectionScores = {
      speaking: speakingScore,
      writing: writingScore,
      reading: readingScore,
      listening: listeningScore
    };

    const overallScore = this.calculateOverallScore(sectionScores);

    return {
      ...overallScore,
      detailedReport: {
        speaking: speakingScore.detailedBreakdown,
        writing: writingScore.detailedBreakdown,
        reading: readingScore.detailedBreakdown,
        listening: listeningScore.detailedBreakdown
      }
    };
  }

  // Helper method to filter answers by section
  filterBySection(answers, section) {
    const sectionAnswers = {};
    
    for (const [questionId, answer] of Object.entries(answers)) {
      if (this.isQuestionInSection(questionId, section)) {
        sectionAnswers[questionId] = answer;
      }
    }
    
    return sectionAnswers;
  }

  // Helper method to determine if a question belongs to a section
  isQuestionInSection(questionId, section) {
    // This is a simplified approach - in a real app, you'd have more robust question categorization
    const sectionPrefixes = {
      speaking: ['saq', 'speaking'], // speaking question prefixes
      writing: ['wq', 'writing'],   // writing question prefixes
      reading: ['rq', 'reading'],   // reading question prefixes
      listening: ['lq', 'listening'] // listening question prefixes
    };

    const prefixes = sectionPrefixes[section] || [];
    return prefixes.some(prefix => questionId.toLowerCase().startsWith(prefix));
  }
}

export default ScoringEngine;