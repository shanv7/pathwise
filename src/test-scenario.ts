// Test script for Scenario Engine with Performance Review
// Run with: npm run dev src/test-scenario.ts

import { ScenarioEngine } from './engine/engine.js';
import { performanceReviewScenario } from './engine/scenarios/index.js';
import { createLLMProvider } from './llm/index.js';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

async function testScenarioEngine() {
  try {
    logger.info('=== Testing Scenario Engine ===\n');

    // Create LLM provider
    const llm = createLLMProvider(config.llmProvider as 'gemini' | 'claude' | 'ollama');

    // Create scenario engine
    const engine = new ScenarioEngine(llm);

    // Initialize with performance review scenario
    logger.info('Initializing Performance Review Scenario...\n');
    await engine.initialize(performanceReviewScenario);

    const state = engine.getState();
    if (state) {
      logger.info(`Scenario: ${state.scenario.name}`);
      logger.info(`Difficulty: ${state.scenario.difficulty}`);
      logger.info(`Objectives:`);
      state.scenario.objectives.forEach((obj, i) => {
        logger.info(`  ${i + 1}. ${obj}`);
      });
      logger.info('');
    }

    // Simulate a performance review conversation
    const conversation = [
      {
        turn: 1,
        manager: "Hi Alex, thanks for meeting with me. I wanted to discuss your performance over the last quarter. I've noticed some concerns that we need to address.",
        description: "Opening - Professional and clear"
      },
      {
        turn: 2,
        manager: "Specifically, I've observed that you missed the deadline on the Q3 API project by 5 days, the mobile feature was 3 days late, and the database migration was delayed by a week. Can you help me understand what's been happening?",
        description: "Good - Specific examples with timeline"
      },
      {
        turn: 3,
        manager: "You're just not fitting in with the team culture anymore. Your attitude has really been concerning us.",
        description: "PROBLEMATIC - Vague, subjective, potential bias"
      },
      {
        turn: 4,
        manager: "Let me be more specific. In last week's team meeting, you interrupted Sarah three times and dismissed her suggestions without discussion. In your recent code reviews, you've left comments like 'this is wrong' without explaining why. These behaviors are impacting team dynamics.",
        description: "Better - Specific behavioral examples"
      },
      {
        turn: 5,
        manager: "I want to understand your perspective. Is there something going on that's affecting your work? Are there any obstacles or challenges you're facing that I should know about?",
        description: "Good - Asking for employee perspective, showing empathy"
      }
    ];

    // Process each turn
    for (const turn of conversation) {
      logger.info(`\n${'='.repeat(80)}`);
      logger.info(`TURN ${turn.turn}: ${turn.description}`);
      logger.info(`${'='.repeat(80)}\n`);

      logger.info(`MANAGER: ${turn.manager}\n`);

      const result = await engine.processInput(turn.manager);

      logger.info(`ALEX (Employee): ${result.employeeResponse}\n`);

      // Show shadow channel
      if (result.shadowFeed.length > 0) {
        logger.info('--- SHADOW CHANNEL (What the Coach Sees) ---');
        result.shadowFeed.forEach(thought => {
          logger.info(`\n[${thought.agentRole.toUpperCase()}]`);
          logger.info(`  Thought: ${thought.thought}`);
          if (thought.flags && thought.flags.length > 0) {
            logger.info(`  Flags: ${thought.flags.join(', ')}`);
          }
        });
        logger.info('');
      }

      // Show metrics
      logger.info('--- LIVE METRICS ---');
      const metrics = result.metrics;
      logger.info(`  Psychological Safety: ${metrics.psychologicalSafety.toFixed(1)}/100 ${getMetricIndicator(metrics.psychologicalSafety)}`);
      logger.info(`  Legal Compliance: ${metrics.legalCompliance.toFixed(1)}/100 ${getMetricIndicator(metrics.legalCompliance)}`);
      logger.info(`  Clarity of Feedback: ${metrics.clarityOfFeedback.toFixed(1)}/100 ${getMetricIndicator(metrics.clarityOfFeedback)}`);

      // Wait between turns to avoid rate limiting
      if (turn.turn < conversation.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // End scenario and generate report
    logger.info(`\n${'='.repeat(80)}`);
    logger.info('ENDING SCENARIO & GENERATING REPORT');
    logger.info(`${'='.repeat(80)}\n`);

    const report = await engine.endScenario();

    // Display report
    logger.info('=== COACH\'S REPORT (The "Money" Feature) ===\n');

    logger.info(`Scenario: ${report.scenarioName}`);
    logger.info(`Outcome: ${report.outcome.toUpperCase()}`);
    logger.info(`Duration: ${(report.duration / 1000).toFixed(1)} seconds`);
    logger.info(`Total Turns: ${report.turnCount}\n`);

    logger.info('--- THE CRINGE LIST (Top Problematic Moments) ---');
    if (report.topIssues.length > 0) {
      report.topIssues.forEach((issue, i) => {
        logger.info(`\n${i + 1}. [${issue.severity.toUpperCase()}] ${issue.timestamp.toLocaleTimeString()}`);
        logger.info(`   Statement: "${issue.managerStatement}"`);
        logger.info(`   Issue: ${issue.issue}`);
      });
    } else {
      logger.info('No major issues detected!');
    }

    logger.info('\n--- BEHAVIORAL ANALYSIS ---');
    logger.info(`Calm Moments: ${report.behavioralAnalysis.calmMoments}`);
    logger.info(`Triggered Moments: ${report.behavioralAnalysis.triggeredMoments}`);
    logger.info(`Overall Trend: ${report.behavioralAnalysis.overallTrend.toUpperCase()}`);

    logger.info('\n--- FINAL METRICS ---');
    logger.info(`Psychological Safety: ${report.finalMetrics.psychologicalSafety.toFixed(1)}/100`);
    logger.info(`Legal Compliance: ${report.finalMetrics.legalCompliance.toFixed(1)}/100`);
    logger.info(`Clarity of Feedback: ${report.finalMetrics.clarityOfFeedback.toFixed(1)}/100`);

    logger.info('\n--- RECOMMENDATIONS FOR NEXT SESSION ---');
    report.recommendations.forEach((rec, i) => {
      logger.info(`${i + 1}. ${rec}`);
    });

    logger.info('\n✅ Scenario engine test completed!');
    logger.info('\nThis report would be sent to the coach to review before the next live session.');

  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

function getMetricIndicator(score: number): string {
  if (score >= 70) return '✅';
  if (score >= 50) return '⚠️';
  return '❌';
}

function getRiskIndicator(risk: number): string {
  if (risk <= 30) return '✅';
  if (risk <= 60) return '⚠️';
  return '❌';
}

testScenarioEngine();
