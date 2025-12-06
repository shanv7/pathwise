// Types/interfaces for scenario definitions

export enum ScenarioType {
  PERFORMANCE_REVIEW = 'performance_review',
  LAYOFF = 'layoff',
  PROMOTION_DENIAL = 'promotion_denial',
  CONFLICT_RESOLUTION = 'conflict_resolution',
  FEEDBACK_DELIVERY = 'feedback_delivery'
}

export enum ScenarioDifficulty {
  NOVICE = 'novice',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum SkillTag {
  DIFFICULT_FEEDBACK = 'difficult_feedback',
  DEI_TOPIC = 'dei_topic',
  PERFORMANCE_PIP = 'performance_pip',
  CONFLICT_RESOLUTION = 'conflict_resolution',
  CAREER_DEVELOPMENT = 'career_development',
  TERMINATION = 'termination',
  TEAM_DYNAMICS = 'team_dynamics'
}

export enum PersonaType {
  DEFENSIVE = 'defensive',
  CHECKED_OUT = 'checked_out',
  HIGH_PERFORMER = 'high_performer',
  OVERWHELMED = 'overwhelmed',
  HOSTILE = 'hostile',
  PASSIVE_AGGRESSIVE = 'passive_aggressive'
}

// Rich organizational context
export interface OrgContext {
  companyName: string;
  companySize: string; // e.g., "150-person startup"
  industry: string;
  teamName: string;
  teamSize: number;
  recentEvents: string[]; // e.g., ["Layoffs 2 months ago", "New product launch pressure"]
  performanceHistory: string; // Brief history of employee's past performance
}

// Rich character biography
export interface CharacterBio {
  name: string;
  role: string;
  tenure: string; // e.g., "2 years"
  personaType: PersonaType;
  
  // Deep psychological profile
  motivations: string[]; // What drives them
  stressors: string[]; // Current pressures
  priorFeedback: string[]; // Past conversations about performance
  
  // Identity & context
  identityDimensions?: string; // e.g., "First-generation immigrant, primary breadwinner"
  personalCircumstances?: string; // e.g., "Recently became a parent"
  
  // Behavioral patterns
  communicationStyle: string; // How they typically respond
  triggerPoints: string[]; // What makes them defensive
}

// Enhanced situation brief
export interface SituationBrief {
  whatHappened: string; // The incident or pattern that triggered this conversation
  managerGoal: string; // What you're trying to achieve
  constraints: string[]; // Limitations (time, legal, relationship dynamics)
  riskFactors: string[]; // What could go wrong
}

// Hidden success criteria
export interface HiddenGoals {
  primaryGoal: string; // Main objective
  secondaryGoals: string[]; // Additional wins
  relationshipGoal: string; // How to maintain/improve relationship
  legalConsiderations: string[]; // Specific landmines to avoid
  idealOutcome: string; // What "great" looks like beyond scores
}

// Legacy support - keeping old interface for backward compatibility
export interface ScenarioContext {
  // A. Role Description
  roleDescription?: string;

  // B. Situation Brief (user-generated)
  situationBrief: string;

  // C. Company Context
  employeeHandbook?: string;
  toneGuide?: string;

  // D. Coaching Context
  competencyMatrix?: string;

  // Additional context
  employeeName?: string;
  employeeRole?: string;
  managerName?: string;
}

// Enhanced scenario with rich storyline
export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  description: string;
  difficulty: ScenarioDifficulty;
  
  // Skill tagging for categorization
  skillTags: SkillTag[];

  // Rich storyline components
  orgContext: OrgContext;
  characterBio: CharacterBio;
  situationBrief: SituationBrief;
  hiddenGoals: HiddenGoals;

  // Default context/prompts for this scenario type (legacy support)
  defaultContext: Partial<ScenarioContext>;

  // Learning objectives
  objectives: string[];

  // Win conditions - explicit success criteria
  successCriteria: {
    minTurns?: number;
    maxLegalRisk?: number;
    minPsychologicalSafety?: number;
    minClarityScore?: number;
    noRedSpikesAfterTurn?: number; // e.g., "no legal risk >60 after turn 3"
  };

  // Coaching framework (for evaluation)
  coachingFramework?: 'GROW' | 'SBI' | 'CBIN' | 'GAIN';
}

export interface ScenarioState {
  scenario: Scenario;
  context: ScenarioContext;
  isActive: boolean;
  startedAt?: Date;
  endedAt?: Date;
  turnCount: number;

  // Outcome tracking
  finalMetrics?: {
    psychologicalSafety: number;
    legalCompliance: number;
    clarityOfFeedback: number;
  };

  outcome?: ScenarioOutcome;
}

export enum ScenarioOutcome {
  SUCCESS = 'success',
  FAILURE = 'failure',
  ABANDONED = 'abandoned',
  IN_PROGRESS = 'in_progress'
}

export interface ScenarioReport {
  scenarioId: string;
  scenarioName: string;
  duration: number; // milliseconds
  turnCount: number;
  outcome: ScenarioOutcome;

  // The "Cringe List" - top problematic statements
  topIssues: {
    timestamp: Date;
    managerStatement: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
  }[];

  // Behavioral drift analysis
  behavioralAnalysis: {
    calmMoments: number;
    triggeredMoments: number;
    overallTrend: 'improving' | 'stable' | 'declining';
  };

  // Final metrics
  finalMetrics: {
    psychologicalSafety: number;
    legalCompliance: number;
    clarityOfFeedback: number;
  };

  // Recommendations for coach
  recommendations: string[];
}
