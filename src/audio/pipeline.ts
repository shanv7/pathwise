// Glue between stt → core engine → tts

import { transcribe } from './stt/whisper.js';
import { synthesize } from './tts/piper.js';
import type { LanguageModel } from '../llm/index.js';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

export interface AudioTurnResult {
  transcript: string;
  responseText: string;
  responseAudioFile: string;
}

/**
 * Processes a complete audio turn: transcribe → LLM → synthesize
 * @param audioFilePath - Path to the input audio file
 * @param llm - The language model to use for generating responses
 * @returns Object containing transcript, response text, and output audio file path
 */
export async function processAudioTurn(
  audioFilePath: string,
  llm: LanguageModel
): Promise<AudioTurnResult> {
  // Step 1: Transcribe audio to text
  const transcript = await transcribe(audioFilePath);

  // Step 2: Generate LLM response
  const responseText = await llm.generate(transcript);

  // Step 3: Synthesize response to audio
  const outputFilePath = join(tmpdir(), `pathwise-${randomUUID()}.wav`);
  await synthesize(responseText, outputFilePath);

  return {
    transcript,
    responseText,
    responseAudioFile: outputFilePath,
  };
}
