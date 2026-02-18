# PTE Academic Mock Test Application

An AI-powered PTE Academic mock test web application that simulates the real PTE Academic exam experience, evaluates user performance using AI, and produces section-wise + overall scores with feedback.

## Features

- ✅ Realistic PTE Academic exam simulation
- ✅ All question types covered (Speaking, Writing, Reading, Listening)
- ✅ AI-powered evaluation using GPT-4o
- ✅ Comprehensive scoring system (10-90 scale)
- ✅ CEFR level mapping (B1/B2/C1)
- ✅ Detailed feedback and recommendations
- ✅ Responsive design for desktop and mobile
- ✅ Webhook integration for n8n automation
- ✅ State management for exam flow

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS Modules, Responsive Design
- **State Management**: Context API + useReducer
- **Routing**: React Router v6
- **Audio**: Web Audio API + MediaRecorder API
- **AI Evaluation**: OpenAI GPT-4o API
- **Build Tool**: Vite

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_WEBHOOK_URL=your_n8n_webhook_url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
pte-mock-test/
├── public/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   ├── sections/         # Main exam sections
│   │   └── questions/        # Individual question types
│   ├── context/              # React Context providers
│   ├── services/             # Business logic services
│   ├── utils/                # Utility functions
│   ├── styles/               # Global styles
│   └── App.jsx
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── index.html
├── package.json
└── vite.config.js
```

## Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key for AI evaluation
- `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key as an alternative to OpenAI
- `VITE_WEBHOOK_URL`: URL for n8n webhook integration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## API Integration

The application integrates with:

1. **OpenAI API**: For AI-powered evaluation of speaking and writing responses
2. **OpenRouter API**: Alternative API provider for AI evaluation (supports GPT-4o and other models)
3. **n8n Webhooks**: For sending exam results to automated workflows
4. **Web Audio API**: For recording and playback functionality

## Question Types Implemented

### Speaking Section
- Read Aloud
- Repeat Sentence
- Describe Image
- Re-tell Lecture
- Answer Short Question

### Writing Section
- Summarize Written Text
- Write Essay

### Reading Section
- Reading & Writing: Fill in the Blanks
- Multiple Choice (Single + Multiple)
- Reorder Paragraph
- Reading Fill in the Blanks

### Listening Section
- Summarize Spoken Text
- Multiple Choice (Single + Multiple)
- Fill in the Blanks
- Highlight Correct Summary
- Select Missing Word
- Highlight Incorrect Words
- Write from Dictation

## Scoring System

- **Overall Score**: 10-90 scale (matches real PTE)
- **Section Scores**: Individual scores for each section
- **CEFR Level**: B1, B2, C1, C2 classification
- **Eligibility Classification**: 
  - Needs Improvement (10-29)
  - Borderline (30-59)
  - Competitive (60-90)

## AI Evaluation Criteria

### Speaking Evaluation
- Content accuracy (25%)
- Fluency (25%)
- Pronunciation (25%)
- Vocabulary/Grammar (25%)

### Writing Evaluation
- Task fulfillment (30%)
- Coherence/Cohesion (25%)
- Grammar range (25%)
- Lexical resource (20%)

## Deployment

The application is designed to be deployed as a static site. You can deploy it to:

- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Browser Compatibility

- Chrome 71+
- Firefox 63+
- Safari 14.1+
- Edge 79+

> Note: Audio recording requires secure context (HTTPS)

## License

MIT