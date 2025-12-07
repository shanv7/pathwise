/**
 * Gemini Live Voice Service
 * Handles real-time voice interaction with Gemini API
 */

import { GoogleGenAI, LiveServerMessage, Modality, Session } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

export interface TranscriptItem {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface VoiceCallbacks {
  onTranscriptUpdate?: (item: TranscriptItem) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (isRecording: boolean) => void;
}

export class GeminiLiveVoiceService {
  private client: GoogleGenAI | null = null;
  private session: Session | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private scriptProcessorNode: ScriptProcessorNode | null = null;
  private audioStream: MediaStream | null = null;
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private nextStartTime = 0;
  private audioSources: AudioBufferSourceNode[] = [];
  private callbacks: VoiceCallbacks = {};
  private isRecording = false;
  private isPaused = false;
  private currentInputTranscription = '';
  private currentOutputTranscription = '';

  constructor(private apiKey: string) {
    this.initClient();
  }

  /**
   * Initialize the Gemini client and audio contexts
   */
  private initClient(): void {
    this.client = new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Initialize audio contexts (must be called after user interaction)
   */
  private async initAudioContexts(): Promise<void> {
    if (!this.inputAudioContext) {
      console.log('[GeminiVoice] Creating audio contexts...');
      // Add webkit compatibility
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
      this.outputAudioContext = new AudioContextClass({ sampleRate: 24000 });

      // Explicitly resume both contexts
      await this.inputAudioContext.resume();
      await this.outputAudioContext.resume();

      // Create input gain node
      this.inputNode = this.inputAudioContext.createGain();

      // Create output gain node
      this.outputNode = this.outputAudioContext!.createGain();
      this.outputNode.connect(this.outputAudioContext!.destination);
      console.log('[GeminiVoice] Audio contexts created and resumed');
    }
  }

  /**
   * Set callbacks for voice events
   */
  public setCallbacks(callbacks: VoiceCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Start the voice session
   */
  public async startSession(systemInstruction: string): Promise<void> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    console.log('[GeminiVoice] Starting session...');
    console.log('[GeminiVoice] API Key present:', !!this.apiKey);

    // Initialize audio contexts (requires user interaction)
    await this.initAudioContexts();

    try {
      console.log('[GeminiVoice] Connecting to Gemini Live API...');
      // Connect to Gemini Live API
      this.session = await this.client.live.connect({
        model: 'models/gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onmessage: (message: LiveServerMessage) => this.handleMessage(message),
        },
        config: {
          systemInstruction,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' },
            },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

      console.log('[GeminiVoice] Connected successfully');

      // Setup audio capture
      await this.setupAudioCapture();
      console.log('[GeminiVoice] Audio capture setup complete');

      this.isRecording = true;
      console.log('[GeminiVoice] ✅ isRecording set to TRUE');
      this.callbacks.onStatusChange?.(true);
      console.log('[GeminiVoice] Session started successfully');
    } catch (error) {
      console.error('[GeminiVoice] Error starting session:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Setup audio capture from microphone
   */
  private async setupAudioCapture(): Promise<void> {
    if (!this.inputAudioContext) {
      throw new Error('Input audio context not initialized');
    }

    try {
      console.log('[GeminiVoice] Requesting microphone access...');
      // Request microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Check if audio stream is active
      console.log('[GeminiVoice] Audio stream active:', this.audioStream.active);
      console.log('[GeminiVoice] Audio tracks:', this.audioStream.getAudioTracks().length);
      const audioTrack = this.audioStream.getAudioTracks()[0];
      if (audioTrack) {
        console.log('[GeminiVoice] Audio track enabled:', audioTrack.enabled);
        console.log('[GeminiVoice] Audio track muted:', audioTrack.muted);
        console.log('[GeminiVoice] Audio track readyState:', audioTrack.readyState);
      }

      // Create audio processing pipeline
      this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.audioStream);
      this.scriptProcessorNode = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

      console.log('[GeminiVoice] Setting up audio processor...');

      // Process audio chunks and send to Gemini
      let chunkCount = 0;
      this.scriptProcessorNode.onaudioprocess = (event) => {
        // Log every time this fires to debug
        if (chunkCount === 0) {
          console.log('[GeminiVoice] 🎤 onaudioprocess FIRED! isRecording:', this.isRecording);
        }

        if (!this.isRecording) {
          if (chunkCount === 0) {
            console.warn('[GeminiVoice] ⚠️ onaudioprocess fired but isRecording is false!');
          }
          return;
        }

        // Don't send audio if paused, but keep processing to maintain the stream
        if (this.isPaused) {
          return;
        }

        if (chunkCount === 0) {
          console.log('[GeminiVoice] ✓ Audio processing started!');
          console.log('[GeminiVoice] Session exists:', !!this.session);
        }

        const inputBuffer = event.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);

        // Check audio level (for debugging)
        if (chunkCount % 50 === 0) {
          let sum = 0;
          for (let i = 0; i < pcmData.length; i++) {
            sum += Math.abs(pcmData[i]);
          }
          const avgLevel = sum / pcmData.length;
          console.log('[GeminiVoice] Audio level:', avgLevel.toFixed(4));
        }

        const blob = createBlob(pcmData);

        if (chunkCount === 0) {
          console.log('[GeminiVoice] Sending audio chunks to Gemini...');
        }
        chunkCount++;

        if (this.session) {
          try {
            this.session.sendRealtimeInput({ media: blob });
          } catch (error) {
            console.error('[GeminiVoice] Error sending audio:', error);
          }
        } else {
          console.error('[GeminiVoice] Session is null, cannot send audio!');
        }
      };

      console.log('[GeminiVoice] Audio processor callback attached');

      // Connect audio nodes: source -> inputNode (gain) AND source -> scriptProcessor -> destination
      this.sourceNode.connect(this.inputNode!);
      this.sourceNode.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.inputAudioContext.destination);

      console.log('[GeminiVoice] Audio nodes connected');
      console.log('[GeminiVoice] Audio context state:', this.inputAudioContext.state);
    } catch (error) {
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Handle messages from Gemini Live API
   */
  private handleMessage(message: LiveServerMessage): void {
    console.log('[GeminiVoice] Received message from Gemini:', message);

    // Handle audio data
    if (message.serverContent?.modelTurn?.parts) {
      for (const part of message.serverContent.modelTurn.parts) {
        if (part.inlineData?.data) {
          this.playAudioChunk(part.inlineData.data);
        }
      }
    }

    // Handle output transcription (what AI is saying)
    if (message.serverContent?.modelTurn?.outputTranscription) {
      this.currentOutputTranscription += message.serverContent.modelTurn.outputTranscription;
    }

    // When model turn is complete, emit transcript
    if (message.serverContent?.turnComplete) {
      if (this.currentOutputTranscription) {
        this.callbacks.onTranscriptUpdate?.({
          role: 'model',
          text: this.currentOutputTranscription,
          timestamp: Date.now(),
        });
        this.currentOutputTranscription = '';
      }
    }

    // Handle input transcription (what user said)
    if (message.serverContent?.inputTranscription) {
      this.currentInputTranscription += message.serverContent.inputTranscription;
    }

    // When user turn is complete, emit transcript
    if (message.serverContent?.userTurnComplete) {
      if (this.currentInputTranscription) {
        this.callbacks.onTranscriptUpdate?.({
          role: 'user',
          text: this.currentInputTranscription,
          timestamp: Date.now(),
        });
        this.currentInputTranscription = '';
      }
    }
  }

  /**
   * Play an audio chunk from Gemini
   */
  private async playAudioChunk(base64Data: string): Promise<void> {
    if (!this.outputAudioContext || !this.outputNode) {
      return;
    }

    try {
      const audioData = decode(base64Data);
      const audioBuffer = await decodeAudioData(
        audioData,
        this.outputAudioContext,
        24000,
        1
      );

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputNode);

      // Schedule playback to avoid gaps
      const currentTime = this.outputAudioContext.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;

      this.audioSources.push(source);

      // Clean up after playback
      source.onended = () => {
        const index = this.audioSources.indexOf(source);
        if (index > -1) {
          this.audioSources.splice(index, 1);
        }
      };
    } catch (error) {
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Stop the voice session
   */
  public async stopSession(): Promise<void> {
    console.log('[GeminiVoice] 🛑 stopSession called');
    console.trace('[GeminiVoice] stopSession stack trace');

    // Stop all audio sources
    this.audioSources.forEach((source) => {
      try {
        source.stop();
      } catch (e) {
        // Ignore errors from already stopped sources
      }
    });
    this.audioSources = [];

    // Disconnect audio processing
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.scriptProcessorNode) {
      this.scriptProcessorNode.disconnect();
      this.scriptProcessorNode = null;
    }

    // Stop microphone stream
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }

    // Close session
    if (this.session) {
      // Note: The session will automatically close when disconnected
      this.session = null;
    }

    this.isRecording = false;
    console.log('[GeminiVoice] ❌ isRecording set to FALSE');
    this.nextStartTime = 0;
    this.callbacks.onStatusChange?.(false);
  }

  /**
   * Check if currently recording
   */
  public getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Check if currently paused
   */
  public getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Pause audio input (keeps session active but stops sending audio)
   */
  public pauseSession(): void {
    if (!this.isRecording) {
      return;
    }
    console.log('[GeminiVoice] ⏸️ Session paused');
    this.isPaused = true;
  }

  /**
   * Resume audio input
   */
  public resumeSession(): void {
    if (!this.isRecording) {
      return;
    }
    console.log('[GeminiVoice] ▶️ Session resumed');
    this.isPaused = false;
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    this.stopSession();

    if (this.inputAudioContext) {
      this.inputAudioContext.close();
      this.inputAudioContext = null;
    }

    if (this.outputAudioContext) {
      this.outputAudioContext.close();
      this.outputAudioContext = null;
    }
  }
}
