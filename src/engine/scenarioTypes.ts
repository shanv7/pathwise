// Types/interfaces for scenario JSON/YAML

export interface Participant {
  role: 'user' | 'agent';
  displayName: string;
  personaPrompt?: string;
}

export interface RubricSkill {
  id: string;
  label: string;
  weight: number;
}

export interface Rubric {
  skills: RubricSkill[];
  scoringRules?: Record<string, unknown>;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  participants: Participant[];
  scenarioMeta?: Record<string, unknown>;
  rubric: Rubric;
}

export interface Turn {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
  scores?: Record<string, number>;
}
