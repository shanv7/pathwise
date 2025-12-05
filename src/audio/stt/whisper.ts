// Wrapper for whisper.cpp

/**
 * Transcribes an audio file to text using whisper.cpp
 * @param audioFilePath - Path to the audio file to transcribe
 * @returns The transcribed text
 */
export async function transcribe(_audioFilePath: string): Promise<string> {
  // TODO: Implement whisper.cpp integration via child_process
  // For now, return placeholder
  return 'User transcript placeholder';
}
