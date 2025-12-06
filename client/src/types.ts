// Frontend type definitions

export interface Message {
  id: string;
  role: 'manager' | 'employee';
  content: string;
  timestamp: Date;
}

export interface ShadowThought {
  agentRole: 'employee' | 'hr';
  thought: string;
  timestamp: Date;
  flags?: string[];
}

export interface Metrics {
  psychologicalSafety: number;
  legalCompliance: number;
  clarityOfFeedback: number;
}

export interface SimulationState {
  isActive: boolean;
  turnCount: number;
  messages: Message[];
  shadowThoughts: ShadowThought[];
  metrics: Metrics;
}

export interface ScenarioReport {
  scenarioId: string;
  scenarioName: string;
  duration: number;
  turnCount: number;
  outcome: 'success' | 'failure' | 'abandoned' | 'in_progress';
  topIssues: {
    timestamp: Date;
    managerStatement: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  behavioralAnalysis: {
    calmMoments: number;
    triggeredMoments: number;
    overallTrend: 'improving' | 'stable' | 'declining';
  };
  finalMetrics: {
    psychologicalSafety: number;
    legalCompliance: number;
    clarityOfFeedback: number;
  };
  recommendations: string[];
}

export interface ScenarioInfo {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  employeeName: string;
}
