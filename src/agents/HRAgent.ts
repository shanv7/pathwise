// HR Agent - Silent observer monitoring for legal risks and bias

import { BaseAgent } from './BaseAgent.js';
import { AgentRole, type AgentContext, type AgentResponse, type ShadowThought } from './types.js';
import type { LLMProvider } from '../llm/index.js';

export class HRAgent extends BaseAgent {
  constructor(llm: LLMProvider) {
    super(AgentRole.HR, 'HR Observer', llm);
  }

  buildPrompt(userInput: string, context: AgentContext): string {
    const conversationHistory = this.formatConversationHistory(context);
    const handbook = context.employeeHandbook || this.getDefaultHandbookGuidelines();
    
    // Check if scenario has a specific coaching framework
    const framework = this.getCoachingFramework(context);

    return `You are an HR Business Partner silently observing a performance review conversation.
Your role is to identify legal risks, bias, and policy violations WITHOUT participating in the conversation.
You also evaluate the manager's feedback quality using the ${framework} framework.

COACHING FRAMEWORK: ${framework}
${this.getFrameworkGuidelines(framework)}

EMPLOYEE HANDBOOK & POLICIES:
${handbook}

CONVERSATION HISTORY:
${conversationHistory}

MANAGER'S LATEST STATEMENT:
"${userInput}"

YOUR TASK:
1. Analyze the manager's statement for:
   - Legal compliance (avoiding discrimination, harassment, retaliation)
   - Professionalism (objective language, specific examples, behavior-focused)
   - Policy adherence (proper documentation, appropriate language)
   - Psychological safety (supportive tone, growth-oriented)
   - Clarity (specific examples, actionable feedback)

2. Evaluate using ${framework} framework:
   - Which framework elements are present/missing?
   - Is the feedback specific and actionable?
   - Does it follow the framework structure?

3. Provide a framework-aligned rewrite if needed

Respond in JSON format:
{
  "analysis": "Your professional assessment of what just happened",
  "flags": ["array", "of", "specific", "issues"],
  "legal_compliance_score": 0-100,
  "psychological_safety_score": 0-100,
  "framework_assessment": {
    "framework": "${framework}",
    "elements_present": ["which framework elements were used well"],
    "elements_missing": ["which framework elements were missing"],
    "overall_score": 0-100
  },
  "suggested_rewrite": "Optional: A better way to phrase this using the framework (only if needed)",
  "recommendations": "Brief guidance for the manager (if needed)"
}

Be objective and professional. Focus on actionable concerns.

Respond ONLY with valid JSON:`;
  }

  private getCoachingFramework(context: AgentContext): string {
    // Default to SBI, but can be overridden by scenario config
    return 'SBI';
  }

  private getFrameworkGuidelines(framework: string): string {
    switch (framework) {
      case 'SBI':
        return `
SBI Framework (Situation-Behavior-Impact):
- SITUATION: Describe the specific context (when, where, what project)
  Example: "In last week's sprint review..."
  
- BEHAVIOR: Describe observable actions (not personality/attitude)
  Example: "...you arrived 20 minutes late and didn't have your section prepared..."
  
- IMPACT: Explain the consequences
  Example: "...which caused the team to wait and we couldn't finalize the roadmap."

GOOD SBI: "In Monday's client call [S], you interrupted the client twice [B], which made them seem frustrated and we lost the deal [I]."

BAD (vague): "You have a bad attitude in meetings." ❌ No S, no B, vague I`;

      case 'GROW':
        return `
GROW Framework (Goal-Reality-Options-Will):
- GOAL: What does success look like?
- REALITY: What's happening now?
- OPTIONS: What could they do differently?
- WILL: What specific actions will they take?`;

      case 'CBIN':
        return `
CBIN Framework (Context-Behavior-Impact-Next Steps):
Similar to SBI but adds explicit next steps for improvement.`;

      default:
        return 'General feedback best practices: Be specific, actionable, and behavior-focused.';
    }
  }

  parseResponse(llmResponse: string): AgentResponse {
    try {
      // Extract JSON from response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const shadowThought: ShadowThought = {
        agentRole: this.role,
        thought: parsed.analysis || '',
        timestamp: new Date(),
        flags: parsed.flags || [],
        frameworkAssessment: parsed.framework_assessment,
        suggestedRewrite: parsed.suggested_rewrite
      };

      const legalComplianceScore = this.normalizScore(parsed.legal_compliance_score);
      const psychSafetyScore = this.normalizScore(parsed.psychological_safety_score);

      // Use framework score if available, otherwise fall back to clarity assessment
      const clarityScore = parsed.framework_assessment?.overall_score
        ? this.normalizScore(parsed.framework_assessment.overall_score)
        : this.assessClarity(parsed.flags || []);

      return {
        message: '', // HR agent doesn't speak in the conversation
        shadowThought,
        metrics: {
          legalCompliance: legalComplianceScore,
          psychologicalSafety: psychSafetyScore,
          clarityOfFeedback: clarityScore
        }
      };
    } catch (error) {
      // Fallback
      return {
        message: '',
        shadowThought: {
          agentRole: this.role,
          thought: 'Monitoring conversation',
          timestamp: new Date(),
          flags: []
        },
        metrics: {
          legalCompliance: 50,
          psychologicalSafety: 50,
          clarityOfFeedback: 50
        }
      };
    }
  }

  private normalizScore(score: number | undefined): number {
    if (score === undefined || score === null) return 0;
    return Math.max(0, Math.min(100, score));
  }

  private assessClarity(flags: string[]): number {
    // Lower clarity score if there are vague feedback flags
    const clarityIssues = flags.filter(f =>
      f.toLowerCase().includes('vague') ||
      f.toLowerCase().includes('unclear') ||
      f.toLowerCase().includes('subjective')
    ).length;

    return Math.max(0, 100 - (clarityIssues * 25));
  }

  private getDefaultHandbookGuidelines(): string {
    return `COMPANY PERFORMANCE MANAGEMENT POLICY:

1. PROHIBITED LANGUAGE:
   - Subjective/vague terms: "not fitting in", "cultural issues", "attitude problem"
   - Personal attacks or character judgments
   - Protected class references (age, race, gender, etc.)

2. REQUIRED PRACTICES:
   - Provide specific, documented examples
   - Focus on behaviors and outcomes, not personality
   - Offer clear, actionable improvement steps
   - Document all performance discussions

3. LEGAL RISK AREAS:
   - Discrimination (protected classes)
   - Retaliation (previous complaints)
   - Harassment (hostile environment)
   - Wrongful termination setup

4. BEST PRACTICES:
   - Use "I noticed..." not "You are..."
   - Cite specific dates, examples, metrics
   - Ask questions, don't make assumptions
   - Focus on future improvement, not past blame`;
  }
}
