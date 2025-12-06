// REST endpoints for audio (deprecated - use WebSocket for Gemini Live)

import { Router } from 'express';
import { logger } from '../utils/logger.js';

export const audioRouter = Router();

// Deprecated: Old audio pipeline endpoints
// Use WebSocket with Gemini Live for real-time voice chat instead
audioRouter.post('/test', (_req, res) => {
  logger.warn('Deprecated endpoint /api/audio/test called - use WebSocket with Gemini Live instead');
  res.json({ 
    message: 'This endpoint is deprecated. Use WebSocket with Gemini Live for real-time voice chat.',
    deprecated: true
  });
});

// Deprecated: Legacy audio turn endpoint (used by AudioRecorder component in legacy mode)
audioRouter.post('/turn_audio', (_req, res) => {
  logger.warn('Deprecated endpoint /api/audio/turn_audio called - use WebSocket with Gemini Live instead');
  res.status(410).json({
    error: 'This endpoint is deprecated',
    message: 'The legacy audio pipeline is no longer supported. Please use Gemini Live mode for real-time voice chat.',
    deprecated: true,
    alternative: 'Use WebSocket with start_voice_scenario message type'
  });
});

// Health check for Gemini Live availability
audioRouter.get('/health', (_req, res) => {
  try {
    const { getGeminiLiveService } = require('../audio/geminiLive.js');
    // Just check if service can be instantiated (doesn't mean Live API works)
    getGeminiLiveService(); // Check if service can be created
    res.json({ 
      status: 'ok',
      geminiLiveAvailable: 'unknown', // Can't verify without trying to create a session
      message: 'Gemini Live service initialized (API availability unknown)'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      geminiLiveAvailable: false,
      message: error instanceof Error ? error.message : 'Gemini Live not available'
    });
  }
});
