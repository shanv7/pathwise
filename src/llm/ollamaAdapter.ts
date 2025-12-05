// Ollama adapter

import type { LanguageModel, Message } from './index.js';

export class OllamaAdapter implements LanguageModel {
  async generate(_prompt: string, _history?: Message[]): Promise<string> {
    // TODO: Implement Ollama integration
    return 'Ollama response';
  }
}
