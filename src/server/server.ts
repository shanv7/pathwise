import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { audioRouter } from './audioRouter.js';

const app = express();
const server = createServer(app);

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Audio router
app.use('/api/audio', audioRouter);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'audioTurn') {
        // TODO: Implement real-time audio streaming
        // For now, just log that audioTurn was received
        logger.info('audioTurn received', {
          sessionId: message.sessionId,
          hasAudioChunk: !!message.audioChunk,
        });
        
        // Placeholder response
        ws.send(
          JSON.stringify({
            type: 'audioTurnResponse',
            status: 'placeholder',
            message: 'audioTurn received',
          })
        );
      }
    } catch (error) {
      logger.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
