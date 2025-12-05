// Claude API adapter

import type { LanguageModel, Message } from './index.js';

export class ClaudeAdapter implements LanguageModel {
  async generate(_prompt: string, _history?: Message[]): Promise<string> {
    // TODO: Implement Claude API integration
    return 'Claude response';
  }
}
