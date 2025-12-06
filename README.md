# Pathwise

AI-powered executive coaching simulation platform for practicing difficult leadership conversations.

## Overview

Pathwise transforms executive coaching from episodic engagement to continuous partnership by providing:

- **AI-Powered Practice Lab**: Safe, high-fidelity simulation environment
- **Multi-Agent System**: Realistic employee + HR observer agents
- **Shadow Channel**: Real-time insights into hidden thoughts and legal risks
- **Coach Dashboard**: Live metrics and behavioral analysis
- **Automated Reports**: "The Cringe List" and coaching recommendations

## Features

### For Middle Managers
- Practice difficult performance reviews in a safe environment
- Build muscle memory for high-stakes conversations
- Get immediate feedback on communication approach
- Identify blind spots before real conversations
- **NEW**: Hear AI agents speak with distinct, realistic voices

### For Executive Coaches
- Assign "simulation hours" as homework between sessions
- Receive detailed reports on client performance
- Data-driven insights instead of subjective recall
- Scale high-touch support without burnout
- **NEW**: More immersive practice sessions with voice interaction

## Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express + WebSocket
- **AI**: Gemini 2.0 Flash (Google Generative AI)
- **Voice**: Gemini Live API (Real-time bidirectional audio) + Google Cloud Text-to-Speech (Neural2 voices)
- **Multi-Agent**: Custom TypeScript orchestration

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI**: Split-screen (Chat + Dashboard)

## Project Structure

```
pathwise/
├── src/                    # Backend source
│   ├── agents/            # Multi-agent system
│   │   ├── EmployeeAgent.ts
│   │   ├── HRAgent.ts
│   │   └── SimulationCoordinator.ts
│   ├── engine/            # Scenario engine
│   │   ├── engine.ts
│   │   ├── scenarioTypes.ts
│   │   └── scenarios/
│   │       └── performanceReview.ts
│   ├── llm/               # LLM adapters
│   │   ├── geminiAdapter.ts
│   │   ├── claudeAdapter.ts
│   │   └── ollamaAdapter.ts
│   ├── server/            # Express server
│   └── utils/             # Utilities
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── types.ts
│   └── package.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- Gemini API key with Live API access (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
- Note: Gemini Live API requires a compatible version of `@google/generative-ai` package (v0.21.0+)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. Set up environment variables:
   ```bash
   # Create .env file with:
   GEMINI_API_KEY=your_api_key_here
   GEMINI_LIVE_MODEL=gemini-live-2.5-flash-preview-native-audio-09-2025
   PORT=3000
   ```

### Running the Application

#### Backend
```bash
# Run backend server
npm run dev
```
Server will start on `http://localhost:3000`

#### Frontend
```bash
# In a separate terminal
cd client
npm run dev
```
Frontend will start on `http://localhost:5173`

### Testing

Test individual components:

```bash
# Test Gemini adapter
npm run dev src/test-gemini.ts

# Test multi-agent system
npm run dev src/test-agents.ts

# Test full scenario engine
npm run dev src/test-scenario.ts
```

## Available Scenarios

### Performance Review (MVP)
Practice delivering feedback to an underperforming employee:
- Defensive employee behaviors
- HR risk monitoring
- Real-time legal risk assessment
- Automated coaching report

## Roadmap

### Phase 1: MVP (Current)
- [x] Gemini LLM integration
- [x] Multi-agent system (Employee + HR)
- [x] Scenario engine with performance review
- [x] React frontend with chat + dashboard
- [x] WebSocket integration
- [x] Gemini Live real-time voice chat
- [ ] Full end-to-end testing

### Phase 2: Beta
- [ ] Additional scenarios (Layoff, Promotion Denial)
- [ ] RAG document upload (handbook, policies)
- [ ] PDF report generation
- [ ] Coach admin panel

## License

MIT