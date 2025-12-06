import { useState } from 'react';
import GeminiLiveAudio from './components/GeminiLiveAudio';
import ConversationDisplay, { type ConversationTurn } from './components/ConversationDisplay';
import './App.css';

function App() {
  const [sessionId] = useState<string>(() => {
    // Generate a simple UUID-like string
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  });
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [scenarioId, setScenarioId] = useState<string>('perf-review-001');

  const handleGeminiLiveTranscript = (transcript: string, isUser: boolean) => {
    const turn: ConversationTurn = {
      speaker: isUser ? 'user' : 'agent',
      text: transcript,
      timestamp: Date.now(),
    };

    setConversation((prev) => [...prev, turn]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pathwise - Executive Coaching Simulation</h1>
        <div className="session-info">
          <span>Session: {sessionId.slice(0, 8)}...</span>
        </div>
      </header>

      <main className="app-main">
        <div className="app-controls">
          <GeminiLiveAudio
            sessionId={sessionId}
            scenarioId={scenarioId}
            onTranscript={handleGeminiLiveTranscript}
            onError={(error) => console.error('Gemini Live error:', error)}
          />
        </div>

        <div className="app-conversation">
          <ConversationDisplay turns={conversation} />
        </div>
      </main>
    </div>
  );
}

export default App;

