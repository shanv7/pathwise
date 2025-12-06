import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { audioRouter } from './audioRouter.js';
import { ScenarioEngine } from '../engine/engine.js';
import { performanceReviewScenario, getAllScenarios, getScenarioById } from '../engine/scenarios/index.js';
import { createLLMProvider } from '../llm/index.js';
import { getVoiceGenerator, VoiceProfile } from '../audio/voiceGenerator.js';
import { getGeminiLiveService, type GeminiLiveSession } from '../audio/geminiLive.js';

const app = express();
const server = createServer(app);

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get available scenarios
app.get('/api/scenarios', (_req, res) => {
  res.json({
    scenarios: [
      {
        id: performanceReviewScenario.id,
        name: performanceReviewScenario.name,
        description: performanceReviewScenario.description,
        difficulty: performanceReviewScenario.difficulty,
        employeeName: performanceReviewScenario.defaultContext.employeeName || 'Alex'
      }
    ]
  });
});

// Get all scenarios from library
app.get('/api/scenarios/library', (_req, res) => {
  const scenarios = getAllScenarios();
  res.json({
    scenarios: scenarios.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      difficulty: s.difficulty,
      skillTags: s.skillTags || [],
      characterName: s.characterBio?.name || s.defaultContext.employeeName || 'Employee',
      characterRole: s.characterBio?.role || s.defaultContext.employeeRole || 'Team Member',
      estimatedTime: getEstimatedTime(s.successCriteria?.minTurns || 5)
    }))
  });
});

// Get specific scenario details (for briefing)
app.get('/api/scenarios/:id', (req, res) => {
  const scenario = getScenarioById(req.params.id);
  if (!scenario) {
    res.status(404).json({ error: 'Scenario not found' });
    return;
  }

  res.json({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    difficulty: scenario.difficulty,
    skillTags: scenario.skillTags || [],
    orgContext: scenario.orgContext,
    characterBio: scenario.characterBio,
    situationBrief: scenario.situationBrief,
    hiddenGoals: scenario.hiddenGoals,
    objectives: scenario.objectives,
    successCriteria: scenario.successCriteria,
    coachingFramework: scenario.coachingFramework
  });
});

function getEstimatedTime(minTurns: number): string {
  const minutes = minTurns * 3; // Rough estimate: 3 min per turn
  const low = minutes;
  const high = minutes + 10;
  return `${low}-${high} min`;
}

// Audio router
app.use('/api/audio', audioRouter);

// WebSocket server
const wss = new WebSocketServer({ server });

// Store active engines per connection (for text-based scenarios)
const activeEngines = new Map<WebSocket, ScenarioEngine>();

// Store active Gemini Live sessions per connection (for voice scenarios)
const activeLiveSessions = new Map<WebSocket, GeminiLiveSession>();

// Store scenario context for voice sessions (for metrics tracking)
const voiceScenarioContext = new Map<WebSocket, {
  scenarioId: string;
  transcripts: Array<{ text: string; isUser: boolean; timestamp: Date }>;
}>();

wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      logger.debug('Received message:', { type: message.type });

      switch (message.type) {
        case 'start_scenario': {
          // Get the scenario ID from the message, default to performance review
          const scenarioId = message.scenarioId || 'perf-review-001';
          const scenario = getScenarioById(scenarioId);

          if (!scenario) {
            ws.send(JSON.stringify({
              type: 'error',
              message: `Scenario not found: ${scenarioId}`
            }));
            return;
          }

          // Create LLM provider
          const llm = createLLMProvider(config.llmProvider as 'gemini' | 'claude' | 'ollama');

          // Create scenario engine
          const engine = new ScenarioEngine(llm);
          await engine.initialize(scenario, message.context);

          // Store engine for this connection
          activeEngines.set(ws, engine);

          const state = engine.getState();

          ws.send(JSON.stringify({
            type: 'scenario_started',
            scenario: {
              id: state?.scenario.id,
              name: state?.scenario.name,
              employeeName: state?.context.employeeName,
              description: state?.scenario.description
            }
          }));

          logger.info('Scenario started', { scenarioId, scenarioName: scenario.name });
          break;
        }

        case 'send_message': {
          const engine = activeEngines.get(ws);
          if (!engine) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'No active scenario. Please start a scenario first.'
            }));
            return;
          }

          const { content } = message;

          // Process the manager's input
          const result = await engine.processInput(content);

          // Generate audio for employee response
          const voiceGen = getVoiceGenerator();
          let audioBase64: string | null = null;

          if (voiceGen.isEnabled()) {
            try {
              audioBase64 = await voiceGen.generateSpeech(
                result.employeeResponse,
                VoiceProfile.EMPLOYEE
              );
            } catch (error) {
              logger.error('Failed to generate audio, continuing without it:', error);
            }
          }

          // Send response back to client
          ws.send(JSON.stringify({
            type: 'message_response',
            employeeResponse: result.employeeResponse,
            shadowFeed: result.shadowFeed,
            metrics: result.metrics,
            audio: audioBase64 // Base64-encoded MP3
          }));

          logger.debug('Message processed', {
            turnCount: engine.getState()?.turnCount,
            hasAudio: !!audioBase64
          });
          break;
        }

        case 'end_scenario': {
          const engine = activeEngines.get(ws);
          if (!engine) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'No active scenario to end.'
            }));
            return;
          }

          const report = await engine.endScenario();

          ws.send(JSON.stringify({
            type: 'scenario_ended',
            report
          }));

          // Clean up
          activeEngines.delete(ws);
          logger.info('Scenario ended');
          break;
        }

        case 'start_voice_scenario': {
          try {
            const scenarioId = message.scenarioId || 'perf-review-001';
            const scenario = getScenarioById(scenarioId);

            if (!scenario) {
              ws.send(JSON.stringify({
                type: 'error',
                message: `Scenario not found: ${scenarioId}`
              }));
              return;
            }

            // Create Gemini Live session with scenario context
            const liveService = getGeminiLiveService();
            const liveSession = await liveService.createSession(scenario, {
              employeeName: message.context?.employeeName,
              situationBrief: message.context?.situationBrief
            });

            // Set up audio chunk handler
            liveSession.onAudioChunk((chunk) => {
              // Send audio chunk to client as base64
              const base64Chunk = Buffer.from(chunk).toString('base64');
              ws.send(JSON.stringify({
                type: 'audio_chunk',
                data: base64Chunk,
                mimeType: 'audio/webm;codecs=opus'
              }));
            });

            // Set up transcript handler
            liveSession.onTranscript((transcript, isUser) => {
              // Store transcript for metrics tracking
              const context = voiceScenarioContext.get(ws);
              if (context) {
                context.transcripts.push({
                  text: transcript,
                  isUser,
                  timestamp: new Date()
                });
              }

              // Send transcript to client
              ws.send(JSON.stringify({
                type: 'transcript',
                text: transcript,
                isUser
              }));
            });

            // Set up error handler
            liveSession.onError((error) => {
              logger.error('Gemini Live session error:', error);
              ws.send(JSON.stringify({
                type: 'error',
                message: `Live session error: ${error.message}`
              }));
            });

            // Store session
            activeLiveSessions.set(ws, liveSession);
            voiceScenarioContext.set(ws, {
              scenarioId,
              transcripts: []
            });

            // Send confirmation
            ws.send(JSON.stringify({
              type: 'voice_scenario_started',
              scenario: {
                id: scenario.id,
                name: scenario.name,
                employeeName: scenario.characterBio?.name || scenario.defaultContext.employeeName || 'Alex'
              }
            }));

            logger.info('Voice scenario started', { scenarioId, scenarioName: scenario.name });
          } catch (error) {
            logger.error('Error starting voice scenario:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: `Failed to start voice scenario: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
          }
          break;
        }

        case 'send_audio_chunk': {
          const liveSession = activeLiveSessions.get(ws);
          if (!liveSession) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'No active voice scenario. Please start a voice scenario first.'
            }));
            return;
          }

          try {
            // Decode base64 audio chunk
            const audioData = Buffer.from(message.data, 'base64');
            const audioChunk = new Uint8Array(audioData);

            // Send to Gemini Live
            await liveSession.sendAudioChunk(audioChunk);
          } catch (error) {
            logger.error('Error sending audio chunk:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: `Failed to send audio chunk: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
          }
          break;
        }

        case 'end_voice_scenario': {
          const liveSession = activeLiveSessions.get(ws);
          if (!liveSession) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'No active voice scenario to end.'
            }));
            return;
          }

          try {
            // Close the live session
            await liveSession.close();

            // Get transcripts for reporting
            const context = voiceScenarioContext.get(ws);
            const transcripts = context?.transcripts || [];

            // Clean up
            activeLiveSessions.delete(ws);
            voiceScenarioContext.delete(ws);

            // Send confirmation
            ws.send(JSON.stringify({
              type: 'voice_scenario_ended',
              transcriptCount: transcripts.length
            }));

            logger.info('Voice scenario ended', { transcriptCount: transcripts.length });
          } catch (error) {
            logger.error('Error ending voice scenario:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: `Failed to end voice scenario: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
          }
          break;
        }

        default:
          logger.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      logger.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  });

  ws.on('close', async () => {
    logger.info('WebSocket client disconnected');
    
    // Clean up text scenario engine
    activeEngines.delete(ws);
    
    // Clean up voice scenario session
    const liveSession = activeLiveSessions.get(ws);
    if (liveSession) {
      try {
        await liveSession.close();
      } catch (error) {
        logger.error('Error closing live session on disconnect:', error);
      }
      activeLiveSessions.delete(ws);
    }
    
    // Clean up voice scenario context
    voiceScenarioContext.delete(ws);
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
  logger.info(`WebSocket available at ws://localhost:${PORT}`);
});
