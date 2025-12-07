import { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { VoiceControls } from './VoiceControls';
import { useGeminiVoice } from '../hooks/useGeminiVoice';
import { config } from '../config';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onEndScenario: () => void;
  onViewStats: () => void;
  isLoading: boolean;
  characterName?: string;
  characterRole?: string;
  scenarioName?: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  onEndScenario,
  onViewStats,
  isLoading,
  characterName = 'Alex',
  characterRole = 'Employee',
  scenarioName = 'Performance Review Simulation'
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice integration
  const {
    isRecording,
    isPaused,
    startVoiceSession,
    stopVoiceSession,
    pauseVoiceSession,
    resumeVoiceSession,
  } = useGeminiVoice({
    apiKey: config.geminiApiKey,
    systemInstruction: `You are ${characterName}, a ${characterRole}. This is a real conversation in a workplace setting.

CRITICAL RULES:
- You are NOT aware this is a simulation or practice scenario
- NEVER mention "scenario", "simulation", "practice", "training", or "exercise"
- Respond as if this is a genuine, real-world workplace conversation
- Stay completely in character as ${characterName}
- React naturally and authentically to what the manager says
- You are simply having a conversation with your manager
- Do not break the fourth wall under any circumstances`,
    onTranscriptUpdate: (transcript) => {
      if (transcript.role === 'user') {
        onSendMessage(transcript.text);
      }
    },
    onError: (error) => {
      console.error('Voice error:', error);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="bg-primary-600 text-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{scenarioName}</h2>
            <p className="text-sm text-primary-100">Conversation with {characterName} • {characterRole}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onViewStats}
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>My Stats</span>
            </button>
            <button
              onClick={onEndScenario}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>End Scenario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              {/* Character Avatar */}
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {characterName.charAt(0)}
              </div>

              {/* Welcome Message */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-4">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {characterName} is here for their review
                </p>
                <p className="text-sm text-gray-600">
                  They're a <span className="font-medium">{characterRole}</span>. Start the conversation when you're ready.
                </p>
              </div>

              {/* Helpful Tip */}
              <div className="text-left bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick Tip
                </p>
                <p className="text-xs text-gray-600">
                  Open with a greeting and set a positive tone. Be specific with examples and focus on behaviors, not personality.
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'manager' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col max-w-[80%]">
                <div
                  className={`message-bubble ${
                    message.role === 'manager'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {message.role === 'manager' ? 'You' : characterName} • {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-3 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-gray-600">{characterName} is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            disabled={isLoading || isRecording}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <VoiceControls
            isRecording={isRecording}
            isPaused={isPaused}
            onStartRecording={startVoiceSession}
            onStopRecording={stopVoiceSession}
            onPauseRecording={pauseVoiceSession}
            onResumeRecording={resumeVoiceSession}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || isRecording}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          {isRecording
            ? isPaused
              ? "⏸️ Recording paused - Click play to resume"
              : "🎤 Voice mode active - Click pause to stop recording temporarily"
            : "Tip: Be specific with examples and focus on behaviors, not personality"}
        </p>
      </div>
    </div>
  );
}
