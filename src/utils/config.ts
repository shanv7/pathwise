import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  wsPort: parseInt(process.env.WS_PORT || '3001', 10),
  llmProvider: process.env.LLM_PROVIDER || 'ollama',
  claudeApiKey: process.env.CLAUDE_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaApiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama2',
  whisperModelPath: process.env.WHISPER_MODEL_PATH || '',
  piperModelPath: process.env.PIPER_MODEL_PATH || '',
};
