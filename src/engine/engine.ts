// Scenario engine for managing simulations

import type { Scenario, Turn } from './scenarioTypes.js';
import type { LanguageModel } from '../llm/index.js';

export class SimulationEngine {
  private scenario: Scenario;
  private sessionHistory: Turn[] = [];

  constructor(scenario: Scenario) {
    this.scenario = scenario;
  }

  /**
   * Initializes an empty session history
   */
  startSession(): void {
    this.sessionHistory = [];
  }

  /**
   * Processes a user turn and generates an agent response
   * @param text - The user's input text
   * @param llm - The language model to use for generating responses
   * @returns The agent's response text
   */
  async processUserTurn(
    text: string,
    llm: LanguageModel
  ): Promise<string> {
    // Add user turn to history
    const userTurn: Turn = {
      speaker: 'user',
      text,
      timestamp: Date.now(),
    };
    this.sessionHistory.push(userTurn);

    // TODO: Implement LLM logic with scenario context
    // For now, use LLM to generate response (will return placeholder from adapters)
    const agentResponse = await llm.generate(text);

    // Add agent turn to history
    const agentTurn: Turn = {
      speaker: 'agent',
      text: agentResponse,
      timestamp: Date.now(),
    };
    this.sessionHistory.push(agentTurn);

    return agentResponse;
  }

  /**
   * Returns the complete session history
   * @returns Array of all turns in the session
   */
  getSessionHistory(): Turn[] {
    return [...this.sessionHistory];
  }

  /**
   * Finalizes and returns scores for the session
   * @returns Record of skill IDs to scores
   */
  finalizeScores(): Record<string, number> {
    // TODO: Implement scoring logic based on rubric
    // For now, return placeholder scores
    const placeholderScores: Record<string, number> = {};
    this.scenario.rubric.skills.forEach((skill) => {
      placeholderScores[skill.id] = 0;
    });
    return placeholderScores;
  }
}
