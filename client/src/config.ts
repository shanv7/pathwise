// API configuration
const API_URL = import.meta.env.VITE_API_URL
  ? `https://${import.meta.env.VITE_API_URL}`
  : 'http://localhost:3000';

const WS_URL = import.meta.env.VITE_API_URL
  ? `wss://${import.meta.env.VITE_API_URL}`
  : 'ws://localhost:3000';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const config = {
  apiUrl: API_URL,
  wsUrl: WS_URL,
  geminiApiKey: GEMINI_API_KEY,
};

