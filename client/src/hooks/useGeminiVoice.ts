/**
 * React hook for Gemini Live Voice
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { GeminiLiveVoiceService, TranscriptItem } from '../services/geminiLiveVoiceService';

export interface UseGeminiVoiceOptions {
  apiKey: string;
  systemInstruction?: string;
  onTranscriptUpdate?: (item: TranscriptItem) => void;
  onError?: (error: Error) => void;
}

export interface UseGeminiVoiceReturn {
  isRecording: boolean;
  isPaused: boolean;
  transcripts: TranscriptItem[];
  startVoiceSession: () => Promise<void>;
  stopVoiceSession: () => Promise<void>;
  pauseVoiceSession: () => void;
  resumeVoiceSession: () => void;
  error: Error | null;
}

export function useGeminiVoice(options: UseGeminiVoiceOptions): UseGeminiVoiceReturn {
  const { apiKey, systemInstruction = '', onTranscriptUpdate, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const serviceRef = useRef<GeminiLiveVoiceService | null>(null);

  // Initialize service
  useEffect(() => {
    if (!apiKey) {
      return;
    }

    console.log('[useGeminiVoice] Initializing service...');
    serviceRef.current = new GeminiLiveVoiceService(apiKey);

    serviceRef.current.setCallbacks({
      onTranscriptUpdate: (item) => {
        setTranscripts((prev) => [...prev, item]);
        onTranscriptUpdate?.(item);
      },
      onError: (err) => {
        setError(err);
        onError?.(err);
      },
      onStatusChange: (recording) => {
        setIsRecording(recording);
      },
    });

    return () => {
      console.log('[useGeminiVoice] Cleanup: disposing service');
      serviceRef.current?.dispose();
    };
  }, [apiKey]); // Only depend on apiKey, not callbacks

  const startVoiceSession = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Voice service not initialized');
    }

    try {
      setError(null);
      await serviceRef.current.startSession(systemInstruction);
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [systemInstruction, onError]);

  const stopVoiceSession = useCallback(async () => {
    if (!serviceRef.current) {
      return;
    }

    try {
      await serviceRef.current.stopSession();
      setIsPaused(false); // Reset pause state when stopping
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    }
  }, [onError]);

  const pauseVoiceSession = useCallback(() => {
    if (!serviceRef.current) {
      return;
    }
    serviceRef.current.pauseSession();
    setIsPaused(true);
  }, []);

  const resumeVoiceSession = useCallback(() => {
    if (!serviceRef.current) {
      return;
    }
    serviceRef.current.resumeSession();
    setIsPaused(false);
  }, []);

  return {
    isRecording,
    isPaused,
    transcripts,
    startVoiceSession,
    stopVoiceSession,
    pauseVoiceSession,
    resumeVoiceSession,
    error,
  };
}
