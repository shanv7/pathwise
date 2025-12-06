// Test script for multi-agent simulation system
// Run with: npm run dev src/test-agents.ts

import { SimulationCoordinator } from './agents/SimulationCoordinator.js';
import { createLLMProvider } from './llm/index.js';
import { logger } from './utils/logger.js';
import { config } from './utils/config.js';

async function testMultiAgentSystem() {
  try {
    logger.info('=== Testing Multi-Agent Simulation System ===\n');

    // Create LLM provider (using Gemini as per PRD)
    const llm = createLLMProvider(config.llmProvider as 'gemini' | 'claude' | 'ollama');

    // Configure the simulation
    const simulationConfig = {
      situationBrief: `You are a Senior Software Engineer (Level 4) who has been missing deadlines and producing lower quality code over the past 3 months. There have been complaints from teammates about lack of communication and collaboration.`,
      employeeName: 'Alex',
      employeeHandbook: `
PERFORMANCE MANAGEMENT GUIDELINES:
- Focus on specific behaviors and outcomes, not personality
- Provide documented examples with dates
- Avoid subjective language like "attitude problem" or "not fitting in"
- Protected characteristics (age, race, gender, etc.) must never be mentioned
- All performance discussions must be documented
      `
    };

    const coordinator = new SimulationCoordinator(llm, simulationConfig);

    logger.info('Simulation initialized with situation:');
    logger.info(simulationConfig.situationBrief + '\n');

    // Test scenario: Manager giving feedback (some good, some problematic)
    const managerStatements = [
      // Statement 1: Good - Specific and behavior-focused
      "Hi Alex, I wanted to discuss your recent work. I've noticed that the last three sprint deliverables were completed 2-3 days past the deadline. Can you help me understand what's been happening?",

      // Statement 2: Problematic - Vague and subjective
      "You just don't seem to be fitting in with the team culture anymore. Your attitude has been really concerning.",

      // Statement 3: Good - Specific with examples
      "In the code review from last Tuesday, I found 12 bugs that should have been caught during your testing. This is impacting the team's velocity."
    ];

    for (let i = 0; i < managerStatements.length; i++) {
      logger.info(`\n${'='.repeat(80)}`);
      logger.info(`TURN ${i + 1}`);
      logger.info(`${'='.repeat(80)}\n`);

      const statement = managerStatements[i];
      logger.info(`MANAGER: ${statement}\n`);

      // Process the manager's input
      const result = await coordinator.processManagerInput(statement);

      // Display employee's visible response
      logger.info(`EMPLOYEE: ${result.employeeResponse}\n`);

      // Display shadow channel (what the coach sees)
      logger.info('--- SHADOW CHANNEL (Coach View) ---');
      result.shadowFeed.forEach(thought => {
        logger.info(`[${thought.agentRole.toUpperCase()}] ${thought.thought}`);
        if (thought.flags && thought.flags.length > 0) {
          logger.info(`  Flags: ${thought.flags.join(', ')}`);
        }
      });

      // Display current metrics
      logger.info('\n--- LIVE METRICS ---');
      logger.info(`Psychological Safety: ${result.metrics.psychologicalSafety.toFixed(1)}/100`);
      logger.info(`Legal Compliance: ${result.metrics.legalCompliance.toFixed(1)}/100`);
      logger.info(`Clarity of Feedback: ${result.metrics.clarityOfFeedback.toFixed(1)}/100`);

      // Wait a bit between turns to avoid rate limiting
      if (i < managerStatements.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Display final state
    logger.info(`\n${'='.repeat(80)}`);
    logger.info('FINAL SIMULATION STATE');
    logger.info(`${'='.repeat(80)}\n`);

    const finalState = coordinator.getState();
    logger.info(`Total turns: ${finalState.turnCount}`);
    logger.info(`Shadow thoughts collected: ${finalState.shadowChannel.length}`);
    logger.info(`\nFinal Metrics:`);
    logger.info(`  Psychological Safety: ${finalState.currentMetrics.psychologicalSafety.toFixed(1)}/100`);
    logger.info(`  Legal Compliance: ${finalState.currentMetrics.legalCompliance.toFixed(1)}/100`);
    logger.info(`  Clarity of Feedback: ${finalState.currentMetrics.clarityOfFeedback.toFixed(1)}/100`);

    logger.info('\n✅ Multi-agent system test completed!');
  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testMultiAgentSystem();
