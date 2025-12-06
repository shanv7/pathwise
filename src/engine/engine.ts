// Scenario engine - Orchestrates scenario execution with multi-agent system

import { SimulationCoordinator } from '../agents/SimulationCoordinator.js';
import type { ShadowThought } from '../agents/types.js';
import type { LLMProvider } from '../llm/index.js';
import { logger } from '../utils/logger.js';
import { ScenarioOutcome } from './scenarioTypes.js';
import type {
  Scenario,
  ScenarioState,
  ScenarioContext,
  ScenarioReport
} from './scenarioTypes.js';

export interface ScenarioTurnResult {
  employeeResponse: string;
  shadowFeed: ShadowThought[];
  metrics: {
    psychologicalSafety: number;
    legalCompliance: number;
    clarityOfFeedback: number;
  };
}

export class ScenarioEngine {
  private coordinator?: SimulationCoordinator;
  private state?: ScenarioState;
  private llm: LLMProvider;

  // Tracking for report generation
  private issueLog: Array<{
    timestamp: Date;
    managerStatement: string;
    flags: string[];
    legalCompliance: number;
  }> = [];

  constructor(llm: LLMProvider) {
    this.llm = llm;
  }

  /**
   * Initialize a new scenario session
   */
  async initialize(scenario: Scenario, userContext?: Partial<ScenarioContext>): Promise<void> {
    logger.info('Initializing scenario', { scenarioId: scenario.id, scenarioName: scenario.name });

    // Merge default context with user-provided context
    const context: ScenarioContext = {
      ...scenario.defaultContext,
      ...userContext,
      situationBrief: userContext?.situationBrief || scenario.defaultContext.situationBrief || ''
    };

    // Create simulation coordinator
    this.coordinator = new SimulationCoordinator(this.llm, {
      situationBrief: context.situationBrief,
      employeeName: context.employeeName,
      employeeHandbook: context.employeeHandbook,
      competencyMatrix: context.competencyMatrix,
      roleDescription: context.roleDescription,
      characterBio: scenario.characterBio // Pass character bio to coordinator
    });

    // Initialize state
    this.state = {
      scenario,
      context,
      isActive: true,
      startedAt: new Date(),
      turnCount: 0,
      outcome: ScenarioOutcome.IN_PROGRESS
    };

    // Reset tracking
    this.issueLog = [];

    logger.info('Scenario initialized successfully');
  }

  /**
   * Process manager input and get employee response
   */
  async processInput(managerInput: string): Promise<ScenarioTurnResult> {
    if (!this.coordinator || !this.state) {
      throw new Error('Scenario not initialized. Call initialize() first.');
    }

    if (!this.state.isActive) {
      throw new Error('Scenario has ended. Cannot process more input.');
    }

    logger.debug('Processing manager input', { turnCount: this.state.turnCount + 1 });

    // Process through coordinator
    const result = await this.coordinator.processManagerInput(managerInput);

    // Update turn count
    this.state.turnCount++;

    // Log issues for report
    const shadowFlags = result.shadowFeed.flatMap(s => s.flags || []);
    if (shadowFlags.length > 0 || result.metrics.legalCompliance < 80) {
      this.issueLog.push({
        timestamp: new Date(),
        managerStatement: managerInput,
        flags: shadowFlags,
        legalCompliance: result.metrics.legalCompliance
      });
    }

    return result;
  }

  /**
   * End the scenario and generate report
   */
  async endScenario(outcome?: ScenarioOutcome): Promise<ScenarioReport> {
    if (!this.coordinator || !this.state) {
      throw new Error('Scenario not initialized.');
    }

    logger.info('Ending scenario', { turnCount: this.state.turnCount });

    // Mark as ended
    this.state.isActive = false;
    this.state.endedAt = new Date();

    // Get final metrics
    const finalMetrics = this.coordinator.getMetrics();
    this.state.finalMetrics = finalMetrics;

    // Determine outcome if not provided
    if (outcome) {
      this.state.outcome = outcome;
    } else {
      this.state.outcome = this.determineOutcome(finalMetrics);
    }

    // Generate report
    const report = this.generateReport();

    logger.info('Scenario ended', { outcome: this.state.outcome });

    return report;
  }

  /**
   * Get current scenario state
   */
  getState(): ScenarioState | undefined {
    return this.state ? { ...this.state } : undefined;
  }

  /**
   * Check if scenario meets success criteria
   */
  private determineOutcome(metrics: {
    psychologicalSafety: number;
    legalCompliance: number;
    clarityOfFeedback: number;
  }): ScenarioOutcome {
    if (!this.state) return ScenarioOutcome.FAILURE;

    const criteria = this.state.scenario.successCriteria;

    // Check if minimum turns met
    if (criteria.minTurns && this.state.turnCount < criteria.minTurns) {
      return ScenarioOutcome.ABANDONED;
    }

    // Check success criteria
    const meetsLegalCompliance = !criteria.maxLegalRisk || metrics.legalCompliance >= (100 - criteria.maxLegalRisk);
    const meetsPsychSafety = !criteria.minPsychologicalSafety || metrics.psychologicalSafety >= criteria.minPsychologicalSafety;
    const meetsClarity = !criteria.minClarityScore || metrics.clarityOfFeedback >= criteria.minClarityScore;

    if (meetsLegalCompliance && meetsPsychSafety && meetsClarity) {
      return ScenarioOutcome.SUCCESS;
    }

    return ScenarioOutcome.FAILURE;
  }

  /**
   * Generate comprehensive scenario report
   */
  private generateReport(): ScenarioReport {
    if (!this.state || !this.state.finalMetrics) {
      throw new Error('Cannot generate report: scenario not properly initialized or ended');
    }

    const duration = this.state.endedAt && this.state.startedAt
      ? this.state.endedAt.getTime() - this.state.startedAt.getTime()
      : 0;

    // Get top 3 issues for "The Cringe List"
    const topIssues = this.issueLog
      .sort((a, b) => a.legalCompliance - b.legalCompliance)
      .slice(0, 3)
      .map(issue => ({
        timestamp: issue.timestamp,
        managerStatement: issue.managerStatement,
        issue: issue.flags.join(', ') || 'Low legal compliance detected',
        severity: (issue.legalCompliance < 30 ? 'high' : issue.legalCompliance < 60 ? 'medium' : 'low') as 'low' | 'medium' | 'high'
      }));

    // Behavioral analysis
    const triggeredMoments = this.issueLog.filter(i => i.legalCompliance < 50).length;
    const calmMoments = this.state.turnCount - triggeredMoments;

    const behavioralAnalysis = {
      calmMoments,
      triggeredMoments,
      overallTrend: (triggeredMoments > calmMoments ? 'declining' : calmMoments > triggeredMoments * 2 ? 'improving' : 'stable') as 'improving' | 'stable' | 'declining'
    };

    // Generate recommendations
    const recommendations = this.generateRecommendations();

    return {
      scenarioId: this.state.scenario.id,
      scenarioName: this.state.scenario.name,
      duration,
      turnCount: this.state.turnCount,
      outcome: this.state.outcome || ScenarioOutcome.FAILURE,
      topIssues,
      behavioralAnalysis,
      finalMetrics: this.state.finalMetrics,
      recommendations
    };
  }

  /**
   * Generate coaching recommendations based on performance
   */
  private generateRecommendations(): string[] {
    if (!this.state || !this.state.finalMetrics) return [];

    const recommendations: string[] = [];
    const metrics = this.state.finalMetrics;

    if (metrics.legalCompliance < 50) {
      recommendations.push('CRITICAL: Review company policies on discrimination and harassment. Consider HR training.');
    }

    if (metrics.psychologicalSafety < 50) {
      recommendations.push('Focus on building trust and psychological safety. Practice active listening and empathy.');
    }

    if (metrics.clarityOfFeedback < 60) {
      recommendations.push('Work on providing specific, actionable feedback with concrete examples and metrics.');
    }

    if (this.issueLog.some(i => i.flags.includes('potential-bias'))) {
      recommendations.push('Be mindful of subjective language. Focus on observable behaviors and outcomes.');
    }

    if (this.state.turnCount < (this.state.scenario.successCriteria.minTurns || 0)) {
      recommendations.push('Practice having longer conversations. Don\'t rush to conclusions.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Strong performance! Continue practicing these scenarios to maintain your skills.');
    }

    return recommendations;
  }
}
