// LLM interface + factory

import { ClaudeAdapter } from './claudeAdapter.js';
import { GeminiAdapter } from './geminiAdapter.js';
import { OllamaAdapter } from './ollamaAdapter.js';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface LanguageModel {
  generate(prompt: string, history?: Message[]): Promise<string>;
}

export type LLMProviderType = 'claude' | 'gemini' | 'ollama';

export function getLLM(provider: LLMProviderType): LanguageModel {
  switch (provider) {
    case 'claude':
      return new ClaudeAdapter();
    case 'gemini':
      return new GeminiAdapter();
    case 'ollama':
      return new OllamaAdapter();
    default:
      throw new Error(`Unknown LLM provider type: ${provider}`);
  }
}
