// Gemini Live API service - Manages real-time bidirectional audio streaming
// Uses @google/genai package with built-in Live API support

import { GoogleGenAI, Modality, Session, LiveServerMessage } from '@google/genai';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import type { Scenario } from '../engine/scenarioTypes.js';

export interface GeminiLiveSession {
  sendAudioChunk(chunk: Uint8Array): Promise<void>;
  onAudioChunk(callback: (chunk: Uint8Array) => void): void;
  onTranscript(callback: (transcript: string, isUser: boolean) => void): void;
  onError(callback: (error: Error) => void): void;
  close(): Promise<void>;
}

export class GeminiLiveService {
  private client: GoogleGenAI;
  private model: string;

  constructor() {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.client = new GoogleGenAI({
      apiKey: config.geminiApiKey
    });
    this.model = config.geminiLiveModel;
  }

  /**
   * Create a new Gemini Live session with scenario context
   */
  async createSession(
    scenario: Scenario,
    context?: {
      employeeName?: string;
      situationBrief?: string;
    }
  ): Promise<GeminiLiveSession> {
    try {
      logger.info('Creating Gemini Live session', { model: this.model });

      // Build system instructions from scenario context
      const systemInstructions = this.buildSystemInstructions(scenario, context);

      // Create Live session using the SDK
      const session = await this.client.live.connect({
        model: this.model,
        callbacks: {
          onopen: () => {
            logger.info('Gemini Live session opened');
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle audio responses
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              const audio = parts[0]?.inlineData;
              if (audio && audio.data) {
                // Decode base64 audio data
                const audioBuffer = Buffer.from(audio.data, 'base64');
                // Notify audio callbacks (will be set up by wrapper)
                (session as any)._audioCallbacks?.forEach((cb: (chunk: Uint8Array) => void) => {
                  cb(new Uint8Array(audioBuffer));
                });
              }

              // Handle transcripts from model
              const textPart = parts.find((p: any) => p.text);
              if (textPart?.text && typeof textPart.text === 'string') {
                (session as any)._transcriptCallbacks?.forEach((cb: (text: string, isUser: boolean) => void) => {
                  cb(textPart.text as string, false); // false = model response
                });
              }
            }

            // Handle interruptions
            if (message.serverContent?.interrupted) {
              logger.debug('Model response was interrupted');
            }
          },
          onerror: (e: any) => {
            const errorMessage = e?.message || e?.toString() || 'Unknown error';
            logger.error('Gemini Live session error:', errorMessage);
            (session as any)._errorCallbacks?.forEach((cb: (error: Error) => void) => {
              cb(new Error(errorMessage));
            });
          },
          onclose: (e: any) => {
            const reason = e?.reason || e?.toString() || 'Unknown reason';
            logger.info('Gemini Live session closed', { reason });
            (session as any)._isClosed = true;
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          enableAffectiveDialog: true,
          systemInstruction: {
            parts: [{ text: systemInstructions }]
          }
        }
      });

      logger.info('Gemini Live session created successfully');

      // Wrap the session with our interface
      return new GeminiLiveSessionWrapper(session);
    } catch (error) {
      logger.error('Failed to create Gemini Live session:', error);
      throw new Error(
        `Failed to create Gemini Live session: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Build system instructions from scenario context
   */
  private buildSystemInstructions(
    scenario: Scenario,
    context?: {
      employeeName?: string;
      situationBrief?: string;
    }
  ): string {
    const employeeName = context?.employeeName || scenario.characterBio?.name || 'Alex';
    const characterBio = scenario.characterBio;
    const situationBrief = context?.situationBrief || scenario.situationBrief?.whatHappened || '';
    const orgContext = scenario.orgContext;

    let instructions = `You are ${employeeName}, ${characterBio?.role || 'an employee'} at ${orgContext?.companyName || 'the company'}.\n\n`;

    // Character personality and background
    if (characterBio) {
      instructions += `## Your Character Profile:\n`;
      instructions += `- Name: ${characterBio.name}\n`;
      instructions += `- Role: ${characterBio.role}\n`;
      instructions += `- Tenure: ${characterBio.tenure}\n`;
      instructions += `- Persona Type: ${characterBio.personaType}\n\n`;

      if (characterBio.motivations?.length) {
        instructions += `- Motivations: ${characterBio.motivations.join(', ')}\n`;
      }
      if (characterBio.stressors?.length) {
        instructions += `- Current Stressors: ${characterBio.stressors.join(', ')}\n`;
      }
      if (characterBio.communicationStyle) {
        instructions += `- Communication Style: ${characterBio.communicationStyle}\n`;
      }
      if (characterBio.triggerPoints?.length) {
        instructions += `- Trigger Points: ${characterBio.triggerPoints.join(', ')}\n`;
      }
      instructions += `\n`;
    }

    // Situation context
    if (situationBrief) {
      instructions += `## Current Situation:\n${situationBrief}\n\n`;
    }

    // Organizational context
    if (orgContext) {
      instructions += `## Company Context:\n`;
      instructions += `- Company: ${orgContext.companyName} (${orgContext.companySize})\n`;
      instructions += `- Industry: ${orgContext.industry}\n`;
      instructions += `- Team: ${orgContext.teamName} (${orgContext.teamSize} people)\n`;
      if (orgContext.recentEvents?.length) {
        instructions += `- Recent Events: ${orgContext.recentEvents.join(', ')}\n`;
      }
      instructions += `\n`;
    }

    // Behavioral guidelines
    instructions += `## How to Respond:\n`;
    instructions += `- Stay in character as ${employeeName}\n`;
    instructions += `- Respond naturally and conversationally\n`;
    instructions += `- Match the emotional tone and persona type (${characterBio?.personaType || 'defensive'})\n`;
    instructions += `- Be authentic to your character's background and motivations\n`;
    instructions += `- React appropriately to the manager's statements\n`;
    instructions += `- Use natural speech patterns, including pauses and emotional expressions\n`;

    return instructions;
  }
}

/**
 * Wrapper class that implements GeminiLiveSession interface
 * Wraps the @google/genai Session object
 */
class GeminiLiveSessionWrapper implements GeminiLiveSession {
  private session: Session;
  private audioCallbacks: Array<(chunk: Uint8Array) => void> = [];
  private transcriptCallbacks: Array<(transcript: string, isUser: boolean) => void> = [];
  private errorCallbacks: Array<(error: Error) => void> = [];
  private isClosed: boolean = false;

  constructor(session: Session) {
    this.session = session;
    
    // Attach callbacks to session for access in message handler
    (session as any)._audioCallbacks = this.audioCallbacks;
    (session as any)._transcriptCallbacks = this.transcriptCallbacks;
    (session as any)._errorCallbacks = this.errorCallbacks;
    (session as any)._isClosed = false;
  }

  async sendAudioChunk(chunk: Uint8Array): Promise<void> {
    if (this.isClosed) {
      throw new Error('Session is closed');
    }

    try {
      // Convert Uint8Array to ArrayBuffer for sendRealtimeInput
      // The SDK expects a Blob with the media data
      // Create a new ArrayBuffer to avoid SharedArrayBuffer issues
      const arrayBuffer = new ArrayBuffer(chunk.length);
      const view = new Uint8Array(arrayBuffer);
      view.set(chunk);
      
      // Create a Blob from the ArrayBuffer
      // Node.js 18+ has Blob support
      const blob = new Blob([arrayBuffer], { type: 'audio/webm;codecs=opus' });
      
      // Use sendRealtimeInput as shown in the sample
      this.session.sendRealtimeInput({ media: blob as any });
    } catch (error) {
      logger.error('Error sending audio chunk:', error);
      throw error;
    }
  }

  onAudioChunk(callback: (chunk: Uint8Array) => void): void {
    this.audioCallbacks.push(callback);
  }

  onTranscript(callback: (transcript: string, isUser: boolean) => void): void {
    this.transcriptCallbacks.push(callback);
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  async close(): Promise<void> {
    if (this.isClosed) {
      return;
    }

    try {
      this.isClosed = true;
      (this.session as any)._isClosed = true;
      this.session.close();
      logger.info('Gemini Live session closed successfully');
    } catch (error) {
      logger.error('Error closing session:', error);
      throw error;
    }
  }
}

// Singleton instance
let geminiLiveServiceInstance: GeminiLiveService | null = null;

export function getGeminiLiveService(): GeminiLiveService {
  if (!geminiLiveServiceInstance) {
    geminiLiveServiceInstance = new GeminiLiveService();
  }
  return geminiLiveServiceInstance;
}
