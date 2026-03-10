import React, { useState, useEffect } from'react';
import AIEvaluationService from '../services/aiEvaluationService';

const TestAIScoring = () => {
 const [testResults, setTestResults] = useState([]);
 const [loading, setLoading] = useState(false);
 const [service, setService] = useState(null);

  useEffect(() => {
    // Initialize service
   const aiService = new AIEvaluationService();
    setService(aiService);
    
   console.log('=== AI SCORING DIAGNOSTIC TEST ===');
   console.log('Service initialized:', !!aiService);
   console.log('OpenRouter Key:', !!aiService.openRouterKey);
   console.log('Gemini Key:', !!aiService.geminiApiKey);
   console.log('OpenAI Key:', !!aiService.openAiKey);
  }, []);

 const testWritingEvaluation = async () => {
   if (!service) return;
    
    setLoading(true);
   const results = [];
    
   try {
      // Test 1: Check API keys
      results.push({
        test: 'API Keys Check',
        status: '✅ Pass',
        details: {
          openRouter: !!service.openRouterKey,
          gemini: !!service.geminiApiKey,
          openai: !!service.openAiKey
        }
      });
      
      // Test 2: Simple writing evaluation
      results.push({ test: 'Starting Writing Evaluation...', status: '⏳ Running', details: {} });
      setTestResults([...results]);
      
     const testPrompt = 'Summarize the following text about climate change.';
     const testResponse = 'Climate change is caused by human activities and requires immediate action.';
      
     const startTime = Date.now();
     const evaluation = await service.evaluateWriting(testPrompt, testResponse, 'summarize_written_text');
     const duration = Date.now() - startTime;
      
      results.pop(); // Remove "running" entry
      results.push({
        test: 'Writing Evaluation',
        status: evaluation?.overallScore ? '✅ Success' : '❌ Failed',
        details: {
          source: evaluation?.source,
          overallScore: evaluation?.overallScore,
          taskScore: evaluation?.taskScore,
          grammarScore: evaluation?.grammarScore,
          spellingScore: evaluation?.spellingScore,
          vocabularyScore: evaluation?.vocabularyScore,
          fluencyScore: evaluation?.fluencyScore,
          duration: `${duration}ms`,
          feedback: evaluation?.feedback?.substring(0, 100) + '...'
        }
      });
      
    } catch (error) {
      results.push({
        test: 'Writing Evaluation Error',
        status: '❌ Failed',
        details: { error: error.message, stack: error.stack }
      });
    }
    
    setTestResults(results);
    setLoading(false);
  };

 const testSpeakingEvaluation = async () => {
   if (!service) return;
    
    setLoading(true);
   const results = [...testResults];
    
   try {
      results.push({ test: 'Starting Speaking Evaluation...', status: '⏳ Running', details: {} });
      setTestResults(results);
      
     const testPrompt = 'Describe your favorite hobby.';
     const testTranscript = 'My favorite hobby is reading books. I enjoy it because it helps me relax.';
      
     const startTime = Date.now();
     const evaluation = await service.evaluateSpeaking(testPrompt, testTranscript, 'describe_image');
     const duration = Date.now() - startTime;
      
      results.pop();
      results.push({
        test: 'Speaking Evaluation',
        status: evaluation?.overallScore ? '✅ Success' : '❌ Failed',
        details: {
          source: evaluation?.source,
          overallScore: evaluation?.overallScore,
          fluencyScore: evaluation?.fluencyScore,
          pronunciationScore: evaluation?.pronunciationScore,
          grammarScore: evaluation?.grammarScore,
          vocabularyScore: evaluation?.vocabularyScore,
          duration: `${duration}ms`
        }
      });
      
    } catch (error) {
      results.push({
        test: 'Speaking Evaluation Error',
        status: '❌ Failed',
        details: { error: error.message }
      });
    }
    
    setTestResults(results);
    setLoading(false);
  };

  return(
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Scoring Diagnostic Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testWritingEvaluation}
          disabled={loading || !service}
          style={{
            padding: '12px 24px',
            marginRight: '10px',
            background: '#3b82f6',
           color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || !service ? 'not-allowed' : 'pointer',
            opacity: loading || !service ? 0.5 : 1
          }}
        >
          Test Writing Evaluation
        </button>
        
        <button 
          onClick={testSpeakingEvaluation}
          disabled={loading || !service}
          style={{
            padding: '12px 24px',
            background: '#10b981',
           color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || !service ? 'not-allowed' : 'pointer',
            opacity: loading || !service ? 0.5 : 1
          }}
        >
          Test Speaking Evaluation
        </button>
      </div>
      
      {testResults.length> 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Test Results:</h2>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{
                padding: '16px',
                marginBottom: '12px',
                background: result.status.includes('✅') ? '#dcfce7' : 
                           result.status.includes('❌') ? '#fef2f2' : '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {result.status} {result.test}
              </div>
              <pre style={{ 
                background: 'rgba(0,0,0,0.05)', 
                padding: '12px', 
                borderRadius: '4px',
                overflow: 'auto',
               fontSize: '13px'
              }}>
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click one of the test buttons above</li>
          <li>Check the browser console for detailed logs</li>
          <li>Look for which provider is being used (OpenRouter/Gemini/OpenAI)</li>
          <li>Check if scores are returned or if there are errors</li>
        </ol>
      </div>
    </div>
  );
};

export default TestAIScoring;