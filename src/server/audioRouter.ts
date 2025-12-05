// REST endpoints for testing audio pipeline

import { Router, type Router as ExpressRouter, type Request, type Response } from 'express';
import { transcribe } from '../audio/stt/whisper.js';
import { synthesize } from '../audio/tts/piper.js';
import { getLLM, type LLMProviderType } from '../llm/index.js';
import { getOrCreateSession } from './sessionManager.js';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';

export const audioRouter: ExpressRouter = Router();

interface TurnAudioRequest {
  sessionId: string;
  audioFilePath: string;
  llmProvider: LLMProviderType;
}

interface TurnAudioResponse {
  transcript: string;
  agentText: string;
  agentAudioFile: string;
}

/**
 * POST /turn_audio
 * Processes an audio turn: transcribe → LLM → synthesize
 */
audioRouter.post('/turn_audio', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as TurnAudioRequest;

    // Validate request body
    if (!body.sessionId || !body.audioFilePath || !body.llmProvider) {
      res.status(400).json({
        error: 'Missing required fields: sessionId, audioFilePath, llmProvider',
      });
      return;
    }

    // Get or create session
    const engine = getOrCreateSession(body.sessionId);

    // Step 1: Transcribe audio to text
    const transcript = await transcribe(body.audioFilePath);

    // Step 2: Get LLM and process user turn
    const llm = getLLM(body.llmProvider);
    const agentText = await engine.processUserTurn(transcript, llm);

    // Step 3: Synthesize agent response to audio
    const outputFilePath = join(tmpdir(), `pathwise-${randomUUID()}.wav`);
    await synthesize(agentText, outputFilePath);

    // Step 4: Return response
    const response: TurnAudioResponse = {
      transcript,
      agentText,
      agentAudioFile: outputFilePath,
    };

    res.json(response);
  } catch (error) {
    logger.error('Error processing audio turn:', error);
    res.status(500).json({
      error: 'Failed to process audio turn',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Placeholder routes
audioRouter.post('/test', (_req, res) => {
  res.json({ message: 'Audio test endpoint - not implemented yet' });
});
