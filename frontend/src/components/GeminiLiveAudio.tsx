import { useState, useRef, useEffect } from 'react';
import './GeminiLiveAudio.css';

interface GeminiLiveAudioProps {
  sessionId: string;
  scenarioId?: string;
  context?: {
    employeeName?: string;
    situationBrief?: string;
  };
  onTranscript?: (transcript: string, isUser: boolean) => void;
  onError?: (error: string) => void;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export default function GeminiLiveAudio({
  sessionId,
  scenarioId,
  context,
  onTranscript,
  onError,
}: GeminiLiveAudioProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string>('');

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);

  // Get WebSocket URL from environment or use default
  const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = import.meta.env.VITE_WS_PORT || '3000';
    return `${protocol}//${host}:${port}`;
  };

  // Connect to WebSocket and start voice scenario
  const connect = async () => {
    if (connectionState === 'connected' || connectionState === 'connecting') {
      return;
    }

    try {
      setConnectionState('connecting');
      setError('');

      const wsUrl = getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[GeminiLiveAudio] WebSocket connected to backend');
        
        // Start voice scenario
        const startMessage = {
          type: 'start_voice_scenario',
          scenarioId: scenarioId || 'perf-review-001',
          context: context
        };
        console.log('[GeminiLiveAudio] Sending start_voice_scenario:', startMessage);
        ws.send(JSON.stringify(startMessage));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[GeminiLiveAudio] Received message:', message.type, message);

          switch (message.type) {
            case 'voice_scenario_started':
              setConnectionState('connected');
              console.log('[GeminiLiveAudio] Voice scenario started');
              break;

            case 'audio_chunk':
              // Handle incoming audio chunk
              handleAudioChunk(message.data, message.mimeType);
              break;

            case 'transcript':
              // Handle transcript
              if (onTranscript) {
                onTranscript(message.text, message.isUser);
              }
              break;

            case 'error':
              // Provide user-friendly error messages
              let userMessage = message.message;
              if (message.message.includes('Gemini Live API is not available')) {
                userMessage = '⚠️ Gemini Live API is not yet available in the npm package. The Live API may require using REST API directly or a future package update. Please use "Legacy (Record & Send)" mode or the text-based WebSocket mode for now.';
              } else if (message.message.includes('GEMINI_API_KEY')) {
                userMessage = '❌ Gemini API key is missing or invalid. Please check your .env file and ensure GEMINI_API_KEY is set.';
              } else if (message.message.includes('Failed to create')) {
                userMessage = `❌ ${message.message}`;
              }
              setError(userMessage);
              if (onError) {
                onError(userMessage);
              }
              setConnectionState('error');
              break;

            case 'voice_scenario_ended':
              console.log('[GeminiLiveAudio] Voice scenario ended');
              disconnect();
              break;

            default:
              console.debug('[GeminiLiveAudio] Unknown message type:', message.type);
          }
        } catch (err) {
          console.error('[GeminiLiveAudio] Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('[GeminiLiveAudio] WebSocket error:', error);
        setError('WebSocket connection error');
        setConnectionState('error');
        if (onError) {
          onError('WebSocket connection error');
        }
      };

      ws.onclose = () => {
        console.log('[GeminiLiveAudio] WebSocket disconnected');
        setConnectionState('disconnected');
        setIsRecording(false);
        setIsSpeaking(false);
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      setConnectionState('error');
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Disconnect from WebSocket
  const disconnect = async () => {
    if (wsRef.current) {
      // End voice scenario
      if (connectionState === 'connected') {
        wsRef.current.send(JSON.stringify({
          type: 'end_voice_scenario'
        }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }

    // Clean up audio context
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setConnectionState('disconnected');
    setIsRecording(false);
    setIsSpeaking(false);
  };

  // Start recording and streaming audio
  const startRecording = async () => {
    if (!wsRef.current || connectionState !== 'connected') {
      setError('Not connected. Please connect first.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000, // Gemini Live standard
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 24000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && wsRef.current && connectionState === 'connected') {
          // Convert blob to base64 and send
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            if (wsRef.current && connectionState === 'connected') {
              wsRef.current.send(JSON.stringify({
                type: 'send_audio_chunk',
                data: base64
              }));
            }
          };
          reader.readAsDataURL(event.data);
        }
      };

      // Start recording with small chunks for low latency
      mediaRecorder.start(100); // Send chunks every 100ms
      setIsRecording(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  // Handle incoming audio chunks and play them
  const handleAudioChunk = async (base64Data: string, mimeType: string) => {
    try {
      // Decode base64
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Initialize audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      
      // Play audio
      await playAudioBuffer(audioBuffer);
    } catch (err) {
      console.error('[GeminiLiveAudio] Error handling audio chunk:', err);
    }
  };

  // Play audio buffer
  const playAudioBuffer = async (audioBuffer: AudioBuffer) => {
    if (!audioContextRef.current) return;

    try {
      setIsSpeaking(true);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      source.onended = () => {
        setIsSpeaking(false);
      };

      source.start(0);
    } catch (err) {
      console.error('[GeminiLiveAudio] Error playing audio:', err);
      setIsSpeaking(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="gemini-live-audio">
      <div className="connection-status">
        <div className={`status-indicator status-${connectionState}`} />
        <span className="status-text">
          {connectionState === 'disconnected' && 'Disconnected'}
          {connectionState === 'connecting' && 'Connecting...'}
          {connectionState === 'connected' && 'Connected'}
          {connectionState === 'error' && 'Error'}
        </span>
      </div>

      <div className="controls">
        {connectionState === 'disconnected' && (
          <button onClick={connect} className="connect-button">
            Connect
          </button>
        )}

        {connectionState === 'connected' && !isRecording && (
          <button onClick={startRecording} className="record-button">
            🎤 Start Speaking
          </button>
        )}

        {connectionState === 'connected' && isRecording && (
          <button onClick={stopRecording} className="stop-button">
            ⏹ Stop Speaking
          </button>
        )}

        {connectionState === 'connected' && (
          <button onClick={disconnect} className="disconnect-button">
            Disconnect
          </button>
        )}

        {(connectionState === 'error' || connectionState === 'connecting') && (
          <button onClick={disconnect} className="cancel-button">
            Cancel
          </button>
        )}
      </div>

      {isSpeaking && (
        <div className="speaking-indicator">
          <span className="pulse-dot" /> Listening...
        </div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
}

