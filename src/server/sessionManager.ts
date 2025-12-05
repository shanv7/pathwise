// Session management for SimulationEngine instances

import { SimulationEngine } from '../engine/engine.js';
import type { Scenario } from '../engine/scenarioTypes.js';

// In-memory session store
const sessions = new Map<string, SimulationEngine>();

/**
 * Creates a default scenario for new sessions
 */
function createDefaultScenario(): Scenario {
  return {
    id: 'default',
    title: 'Default Coaching Scenario',
    description: 'A default coaching scenario',
    participants: [
      {
        role: 'user',
        displayName: 'User',
      },
      {
        role: 'agent',
        displayName: 'Coach',
        personaPrompt: 'You are an executive coach helping with leadership skills.',
      },
    ],
    rubric: {
      skills: [
        {
          id: 'communication',
          label: 'Communication',
          weight: 1.0,
        },
        {
          id: 'leadership',
          label: 'Leadership',
          weight: 1.0,
        },
      ],
    },
  };
}

/**
 * Gets or creates a SimulationEngine instance for a session
 * @param sessionId - Unique session identifier
 * @returns SimulationEngine instance
 */
export function getOrCreateSession(sessionId: string): SimulationEngine {
  if (!sessions.has(sessionId)) {
    const scenario = createDefaultScenario();
    const engine = new SimulationEngine(scenario);
    engine.startSession();
    sessions.set(sessionId, engine);
  }
  return sessions.get(sessionId)!;
}

/**
 * Gets an existing session
 * @param sessionId - Unique session identifier
 * @returns SimulationEngine instance or undefined if not found
 */
export function getSession(sessionId: string): SimulationEngine | undefined {
  return sessions.get(sessionId);
}

/**
 * Removes a session from the store
 * @param sessionId - Unique session identifier
 */
export function removeSession(sessionId: string): void {
  sessions.delete(sessionId);
}

