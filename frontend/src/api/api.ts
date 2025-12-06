import axios from 'axios';

export interface TurnAudioResponse {
  transcript: string;
  agentText: string;
  agentAudioFile: string;
}

const API_BASE_URL = '/api';

/**
 * @deprecated This function uses the legacy audio pipeline which is no longer supported.
 * Use Gemini Live WebSocket API instead for real-time voice chat.
 * 
 * Sends an audio turn to the backend for processing
 * @param sessionId - Unique session identifier
 * @param audioFile - The audio file to send
 * @param llmProvider - LLM provider to use ('claude' | 'gemini' | 'ollama')
 * @returns Response containing transcript, agent text, and audio file path
 */
export async function sendAudioTurn(
  sessionId: string,
  audioFile: File,
  llmProvider: string
): Promise<TurnAudioResponse> {
  // Create FormData for multipart/form-data upload
  const formData = new FormData();
  formData.append('sessionId', sessionId);
  formData.append('audioFile', audioFile);
  formData.append('llmProvider', llmProvider);

  const response = await axios.post<TurnAudioResponse>(
    `${API_BASE_URL}/audio/turn_audio`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

