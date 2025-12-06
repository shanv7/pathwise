import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  wsPort: parseInt(process.env.WS_PORT || '3001', 10),
  llmProvider: process.env.LLM_PROVIDER || 'ollama',
  claudeApiKey: process.env.CLAUDE_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiLiveModel: process.env.GEMINI_LIVE_MODEL || 'gemini-2.5-flash-native-audio-preview-09-2025',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama2',
  // Audio format settings for Gemini Live
  audioSampleRate: 24000, // Gemini Live standard sample rate
};
