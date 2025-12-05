// Wrapper for piper

import { writeFile } from 'fs/promises';

/**
 * Synthesizes text to speech using Piper and saves to a file
 * @param text - The text to synthesize
 * @param outputFilePath - Path where the audio file should be saved
 * @returns Promise that resolves when the audio file is created
 */
export async function synthesize(
  _text: string,
  outputFilePath: string
): Promise<void> {
  // TODO: Implement piper integration via child_process
  // For now, create a placeholder file or log
  console.log('TTS placeholder');
  // Create an empty placeholder file
  await writeFile(outputFilePath, '');
}
