/**
 * Audio utility functions for Gemini Live Voice
 * Based on the pathwise-gais implementation
 */

/**
 * Base64 encode a Uint8Array
 */
export function encode(uint8Array: Uint8Array): string {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

/**
 * Base64 decode a string
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Create a blob from PCM audio data (Float32Array)
 */
export function createBlob(float32Array: Float32Array): { data: string; mimeType: string } {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    // Simple conversion: multiply by 32768 to convert float32 to int16
    int16Array[i] = float32Array[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16Array.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

/**
 * Decode audio data from Uint8Array to AudioBuffer
 */
export async function decodeAudioData(
  uint8Array: Uint8Array,
  audioContext: AudioContext,
  sampleRate: number,
  numberOfChannels: number
): Promise<AudioBuffer> {
  // Create WAV header for proper decoding
  const wavHeader = createWavHeader(uint8Array.length, sampleRate, numberOfChannels);
  const wavData = new Uint8Array(wavHeader.length + uint8Array.length);
  wavData.set(wavHeader, 0);
  wavData.set(uint8Array, wavHeader.length);

  // Decode the WAV data
  return await audioContext.decodeAudioData(wavData.buffer);
}

/**
 * Create a WAV header for PCM audio data
 */
function createWavHeader(
  dataLength: number,
  sampleRate: number,
  numberOfChannels: number
): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // File length minus RIFF identifier length and file description length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (raw)
  view.setUint16(20, 1, true);
  // Channel count
  view.setUint16(22, numberOfChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, numberOfChannels * 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, dataLength, true);

  return new Uint8Array(header);
}

/**
 * Write a string to a DataView
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
