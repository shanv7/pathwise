/**
 * @deprecated This component uses the legacy audio pipeline which is no longer supported.
 * Use GeminiLiveAudio component instead for real-time voice chat.
 */
import { useState, useRef, useEffect } from 'react';
import { sendAudioTurn } from '../api/api';
import './AudioRecorder.css';

interface AudioRecorderProps {
  sessionId: string;
  llmProvider: string;
  onTurnComplete: (transcript: string, agentText: string, agentAudioFile: string) => void;
}

export default function AudioRecorder({
  sessionId,
  llmProvider,
  onTurnComplete,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [agentText, setAgentText] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup: stop recording if component unmounts
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        
        // Process the audio
        await processAudio(audioFile);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioFile: File) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await sendAudioTurn(sessionId, audioFile, llmProvider);
      
      setTranscript(response.transcript);
      setAgentText(response.agentText);
      
      // Play agent audio response
      if (response.agentAudioFile) {
        // For now, the backend returns a file path
        // In a real implementation, we'd need to fetch the file or use a URL
        // For MVP, we'll just log it
        console.log('Agent audio file:', response.agentAudioFile);
      }
      
      // Notify parent component
      onTurnComplete(response.transcript, response.agentText, response.agentAudioFile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process audio';
      // Check if it's the deprecated endpoint error
      if (errorMessage.includes('deprecated') || errorMessage.includes('410')) {
        setError('Legacy audio mode is no longer supported. Please switch to Gemini Live mode.');
      } else {
        setError(errorMessage);
      }
      console.error('Error processing audio:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-controls">
        {!isRecording && !isProcessing && (
          <button onClick={startRecording} className="record-button">
            🎤 Record
          </button>
        )}
        {isRecording && (
          <button onClick={stopRecording} className="stop-button">
            ⏹ Stop
          </button>
        )}
        {isProcessing && (
          <div className="processing-indicator">Processing...</div>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {transcript && (
        <div className="transcript-section">
          <h3>Your transcript:</h3>
          <p className="transcript-text">{transcript}</p>
        </div>
      )}
      
      {agentText && (
        <div className="agent-response-section">
          <h3>Agent response:</h3>
          <p className="agent-text">{agentText}</p>
        </div>
      )}
    </div>
  );
}

