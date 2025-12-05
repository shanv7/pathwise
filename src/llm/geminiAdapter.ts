// Gemini API adapter

import type { LanguageModel, Message } from './index.js';

export class GeminiAdapter implements LanguageModel {
  async generate(_prompt: string, _history?: Message[]): Promise<string> {
    // TODO: Implement Gemini API integration
    return 'Gemini response';
  }
}
