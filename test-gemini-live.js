// Quick test script to verify Gemini Live API WebSocket connection
import { WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const model = 'gemini-2.5-flash-native-audio-preview-09-2025';

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env');
  process.exit(1);
}

console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
console.log('📡 Testing Gemini Live API WebSocket connection...\n');

const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('✅ WebSocket connected!');
  
  const setupMessage = {
    setup: {
      model: `models/${model}`,
      generationConfig: {
        responseModalities: ['AUDIO'],
        enableAffectiveDialog: true
      },
      systemInstruction: {
        parts: [{ text: 'You are a helpful assistant.' }]
      }
    }
  };
  
  console.log('📤 Sending setup message...');
  ws.send(JSON.stringify(setupMessage));
});

ws.on('message', (data) => {
  console.log('📥 Received message:', data.toString().substring(0, 200));
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  process.exit(1);
});

ws.on('close', (code, reason) => {
  console.log('🔌 WebSocket closed:', { code, reason: reason?.toString() });
  process.exit(0);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏱️  Test timeout');
  ws.close();
  process.exit(0);
}, 10000);

