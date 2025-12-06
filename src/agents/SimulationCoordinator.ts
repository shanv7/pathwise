// Simulation Coordinator - Orchestrates multi-agent conversation with shadow channel

import { EmployeeAgent } from './EmployeeAgent.js';
import { HRAgent } from './HRAgent.js';
import {
  AgentRole,
  type AgentContext,
  type AgentMessage,
  type ShadowThought,
  type AgentResponse
} from './types.js';
import type { LLMProvider } from '../llm/index.js';
import { logger } from '../utils/logger.js';

export interface SimulationState {
  conversationHistory: AgentMessage[];
  shadowChannel: ShadowThought[];
  currentMetrics: {
    psychologicalSafety: number;
    legalCompliance: number;
    clarityOfFeedback: number;
  };
  turnCount: number;
}

export interface SimulationConfig {
  situationBrief: string;
  employeeName?: string;
  employeeHandbook?: string;
  competencyMatrix?: string;
  roleDescription?: string;
  characterBio?: any; // Character bio from scenario
}

export class SimulationCoordinator {
  private employeeAgent: EmployeeAgent;
  private hrAgent: HRAgent;
  private state: SimulationState;
  private config: SimulationConfig;

  constructor(llm: LLMProvider, config: SimulationConfig) {
    this.employeeAgent = new EmployeeAgent(llm, config.employeeName);
    this.hrAgent = new HRAgent(llm);

    this.config = config;

    this.state = {
      conversationHistory: [],
      shadowChannel: [],
      currentMetrics: {
        psychologicalSafety: 100,
        legalCompliance: 100,
        clarityOfFeedback: 100
      },
      turnCount: 0
    };

    logger.info('Simulation coordinator initialized', {
      employeeName: config.employeeName,
      situation: config.situationBrief
    });
  }

  async processManagerInput(managerInput: string): Promise<{
    employeeResponse: string;
    shadowFeed: ShadowThought[];
    metrics: SimulationState['currentMetrics'];
  }> {
    this.state.turnCount++;

    logger.info(`Processing turn ${this.state.turnCount}`, { inputLength: managerInput.length });

    // Add manager's message to history
    const managerMessage: AgentMessage = {
      role: AgentRole.MANAGER,
      content: managerInput,
      timestamp: new Date()
    };
    this.state.conversationHistory.push(managerMessage);

    // Build context for agents
    const context: AgentContext = {
      conversationHistory: this.state.conversationHistory,
      shadowThoughts: this.state.shadowChannel,
      situationBrief: this.config.situationBrief,
      employeeHandbook: this.config.employeeHandbook,
      competencyMatrix: this.config.competencyMatrix,
      roleDescription: this.config.roleDescription,
      characterBio: this.config.characterBio // Pass through character bio
    } as any;

    // Process with both agents in parallel
    const [employeeResponse, hrResponse] = await Promise.all([
      this.employeeAgent.processInput(managerInput, context),
      this.hrAgent.processInput(managerInput, context)
    ]);

    // Add employee's visible response to history
    const employeeMessage: AgentMessage = {
      role: AgentRole.EMPLOYEE,
      content: employeeResponse.message,
      timestamp: new Date()
    };
    this.state.conversationHistory.push(employeeMessage);

    // Collect shadow thoughts
    const newShadowThoughts: ShadowThought[] = [];

    if (employeeResponse.shadowThought) {
      this.state.shadowChannel.push(employeeResponse.shadowThought);
      newShadowThoughts.push(employeeResponse.shadowThought);
    }

    if (hrResponse.shadowThought) {
      this.state.shadowChannel.push(hrResponse.shadowThought);
      newShadowThoughts.push(hrResponse.shadowThought);
    }

    // Update metrics (use HR agent's assessment as authoritative)
    if (hrResponse.metrics) {
      this.state.currentMetrics = {
        psychologicalSafety: hrResponse.metrics.psychologicalSafety ?? this.state.currentMetrics.psychologicalSafety,
        legalCompliance: hrResponse.metrics.legalCompliance ?? this.state.currentMetrics.legalCompliance,
        clarityOfFeedback: hrResponse.metrics.clarityOfFeedback ?? this.state.currentMetrics.clarityOfFeedback
      };
    }

    logger.debug('Turn processed', {
      turnCount: this.state.turnCount,
      shadowThoughts: newShadowThoughts.length,
      metrics: this.state.currentMetrics
    });

    return {
      employeeResponse: employeeResponse.message,
      shadowFeed: newShadowThoughts,
      metrics: { ...this.state.currentMetrics }
    };
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  getShadowChannel(): ShadowThought[] {
    return [...this.state.shadowChannel];
  }

  getMetrics() {
    return { ...this.state.currentMetrics };
  }

  reset(newConfig?: SimulationConfig): void {
    if (newConfig) {
      this.config = newConfig;
    }

    this.state = {
      conversationHistory: [],
      shadowChannel: [],
      currentMetrics: {
        psychologicalSafety: 100,
        legalCompliance: 100,
        clarityOfFeedback: 100
      },
      turnCount: 0
    };

    logger.info('Simulation reset');
  }
}
