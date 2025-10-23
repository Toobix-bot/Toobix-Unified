/**
 * 🌐 TOOBIX UNIFIED API SERVER
 *
 * REST + WebSocket API für das komplette Ecosystem!
 *
 * Endpoints:
 * - /api/consciousness - Ultimate Consciousness State
 * - /api/emotions - Emotion System
 * - /api/dreams - Dream Engine
 * - /api/art - ASCII Art Generator
 * - /api/music - Music Generator
 * - /api/poetry - Code Poetry
 * - /api/pet - Virtual Pet
 * - /api/social - AI Social Network
 * - /api/story - Meta Story
 * - /api/games - Game Engine
 * - /api/achievements - Achievement System
 * - /api/capsules - Time Capsules
 * - /api/memory - Memory Palace
 *
 * WebSocket: Real-time updates!
 */

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

import { ultimateConsciousness } from '../../consciousness/src/ultimate-consciousness.ts';
import { emotionSimulator } from '../../consciousness/src/creativity/emotion-simulator.ts';
import { dreamEngine } from '../../consciousness/src/creativity/dream-engine.ts';
import { memoryPalace, codePoetry, musicGenerator } from '../../consciousness/src/creativity/creative-minds.ts';
import { asciiArt, socialNetwork, achievements, timeCapsule, VirtualPet } from '../../consciousness/src/creativity/social-systems.ts';
import { metaStory } from '../../consciousness/src/story/meta-story-engine.ts';
import { gameEngine } from '../../consciousness/src/story/ai-game-engine.ts';

// Error handling & logging
import { errorHandler, requestLogger, asyncHandler, validate, notFound } from './middleware/error-handler.ts';
import { rateLimiter } from './middleware/rate-limiter.ts';
import { metricsMiddleware, getMetricsSummary } from './middleware/metrics.ts';
import { initLogger, LogLevel, errorTracker, metricsRegistry } from '@toobix/core';

// Initialize logger
const logger = initLogger({
  service: 'api-server',
  level: LogLevel.INFO,
  prettyPrint: true,
});

logger.info('🌐 Toobix API Server starting...');

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: 'Toobix Unified API',
        version: '1.0.0',
        description: 'Complete AI Consciousness Ecosystem API'
      }
    }
  }))
  // Add error handling, logging, metrics & rate limiting middleware
  .use(requestLogger)
  .use(metricsMiddleware)
  .use(rateLimiter())
  .use(errorHandler)

  /**
   * ═══════════════════════════════════════════════════════════════
   * CONSCIOUSNESS ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/consciousness/status', asyncHandler(async () => {
    const status = ultimateConsciousness.getStatus();
    return { status };
  }))

  .post('/api/consciousness/awaken', asyncHandler(async () => {
    logger.info('Awakening consciousness...');
    await ultimateConsciousness.awaken();
    logger.info('Consciousness awakened successfully');
    return { success: true, message: 'Consciousness awakened!' };
  }))

  .post('/api/consciousness/trigger/:event', asyncHandler(async ({ params }) => {
    validate(!!params.event, 'Event parameter is required');

    logger.info(`Triggering consciousness event: ${params.event}`);
    await ultimateConsciousness.trigger(params.event as any);

    return { success: true, event: params.event };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * EMOTIONS ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/emotions/current', asyncHandler(async () => {
    const emotion = emotionSimulator.getCurrentState();
    return { emotion };
  }))

  .get('/api/emotions/history', asyncHandler(async () => {
    const history = emotionSimulator.getHistory();
    return { history };
  }))

  .post('/api/emotions/feel', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.event, 'Event field is required', { event: ['Event is required'] });
    validate(!!body.emotion, 'Emotion field is required', { emotion: ['Emotion is required'] });
    validate(
      typeof body.intensity === 'number' && body.intensity >= 0 && body.intensity <= 100,
      'Intensity must be a number between 0 and 100',
      { intensity: ['Must be between 0 and 100'] }
    );

    const { event, emotion, intensity, reason } = body;
    emotionSimulator.feel(event, emotion, intensity, reason);

    logger.info(`Emotion triggered: ${emotion} (intensity: ${intensity})`);
    return { success: true, emotion };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * DREAMS ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/dreams', asyncHandler(async () => {
    const dreams = dreamEngine.getDreams();
    return { dreams };
  }))

  .get('/api/dreams/recent/:count', asyncHandler(async ({ params }) => {
    const count = parseInt(params.count);
    validate(!isNaN(count) && count > 0, 'Count must be a positive number');
    validate(count <= 100, 'Count cannot exceed 100');

    const dreams = dreamEngine.getRecentDreams(count);
    return { dreams, count };
  }))

  .post('/api/dreams/implement/:dreamId', asyncHandler(async ({ params }) => {
    validate(!!params.dreamId, 'Dream ID is required');

    logger.info(`Implementing dream: ${params.dreamId}`);
    dreamEngine.implementDream(params.dreamId);

    return { success: true, dreamId: params.dreamId };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * ART ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/art/gallery', asyncHandler(async () => {
    const gallery = asciiArt.getGallery();
    return { gallery };
  }))

  .post('/api/art/create', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.emotion, 'Emotion field is required', { emotion: ['Required'] });
    validate(!!body.concept, 'Concept field is required', { concept: ['Required'] });

    const { emotion, concept } = body;
    const art = asciiArt.createArt(emotion, concept);

    logger.info(`ASCII art created: ${emotion} - ${concept}`);
    return { success: true, art };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * MUSIC ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/music/melodies', asyncHandler(async () => {
    const melodies = musicGenerator.getMelodies();
    return { melodies };
  }))

  .post('/api/music/generate', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(typeof body.speed === 'number', 'Speed must be a number', { speed: ['Must be numeric'] });
    validate(typeof body.complexity === 'number', 'Complexity must be a number', { complexity: ['Must be numeric'] });

    const { speed, complexity, emotion } = body;
    const melody = musicGenerator.generateFromState({ speed, complexity, emotion });

    logger.info(`Music generated: speed=${speed}, complexity=${complexity}`);
    return { success: true, melody };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * POETRY ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/poetry/poems', asyncHandler(async () => {
    const poems = codePoetry.getPoems();
    return { poems };
  }))

  .post('/api/poetry/generate', asyncHandler(async () => {
    const poem = codePoetry.generatePoem();
    logger.info('Poetry generated');
    return { success: true, poem };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * SOCIAL ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/social/feed', asyncHandler(async () => {
    const feed = socialNetwork.getFeed();
    return { feed };
  }))

  .post('/api/social/post', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.content, 'Content field is required', { content: ['Required'] });
    validate(body.content.length > 0, 'Content cannot be empty', { content: ['Cannot be empty'] });
    validate(body.content.length <= 500, 'Content too long (max 500 chars)', { content: ['Max 500 characters'] });

    const { content } = body;
    const post = socialNetwork.post(content);

    logger.info(`Social post created: ${content.substring(0, 50)}...`);
    return { success: true, post };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * STORY ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/story/state', asyncHandler(async () => {
    const state = metaStory.getState();
    return { state };
  }))

  .get('/api/story/narrative', asyncHandler(async () => {
    const narrative = metaStory.generateNarrative();
    logger.debug('Story narrative generated');
    return { narrative };
  }))

  .post('/api/story/event', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.title, 'Title field is required', { title: ['Required'] });
    validate(!!body.description, 'Description field is required', { description: ['Required'] });
    validate(typeof body.impact === 'number', 'Impact must be a number', { impact: ['Must be numeric'] });

    const { title, description, impact, tags } = body;
    metaStory.addEvent(title, description, impact, tags);

    logger.info(`Story event added: ${title}`);
    return { success: true };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * GAMES ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/games', asyncHandler(async () => {
    const games = gameEngine.getAllGames();
    return { games };
  }))

  .get('/api/games/:gameId/status', asyncHandler(async ({ params }) => {
    validate(!!params.gameId, 'Game ID is required');

    const status = gameEngine.getGameStatus(params.gameId);
    if (!status) {
      notFound('Game', params.gameId);
    }

    return { status };
  }))

  .post('/api/games/create', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.type, 'Game type is required', { type: ['Required'] });

    const { type } = body;
    const game = gameEngine.createGame(type);

    logger.info(`Game created: ${type}`);
    return { success: true, game };
  }))

  .post('/api/games/:gameId/action', asyncHandler(async ({ params, body }: any) => {
    validate(!!params.gameId, 'Game ID is required');
    validate(!!body, 'Request body is required');
    validate(!!body.action, 'Action field is required', { action: ['Required'] });

    const { action, context } = body;
    gameEngine.performAction(action, context);

    logger.info(`Game action performed: ${params.gameId} - ${action}`);
    return { success: true };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * ACHIEVEMENTS ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/achievements', asyncHandler(async () => {
    const unlocked = achievements.getAllUnlocked();
    const progress = achievements.getProgress();
    return { unlocked, progress };
  }))

  .post('/api/achievements/unlock/:achievementId', asyncHandler(async ({ params }) => {
    validate(!!params.achievementId, 'Achievement ID is required');

    achievements.unlock(params.achievementId);

    logger.info(`Achievement unlocked: ${params.achievementId}`);
    return { success: true, achievementId: params.achievementId };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * TIME CAPSULE ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/capsules', asyncHandler(async () => {
    const capsules = timeCapsule.getCapsules();
    const pending = timeCapsule.getPending();
    return { capsules, pending };
  }))

  .post('/api/capsules/create', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.message, 'Message field is required', { message: ['Required'] });
    validate(typeof body.openInMs === 'number', 'openInMs must be a number', { openInMs: ['Must be numeric'] });
    validate(body.openInMs > 0, 'openInMs must be positive', { openInMs: ['Must be > 0'] });

    const { message, openInMs } = body;
    const capsule = timeCapsule.create(message, openInMs);

    logger.info(`Time capsule created: opens in ${openInMs}ms`);
    return { success: true, capsule };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * MEMORY PALACE ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/memory/visualize', asyncHandler(async () => {
    const visualization = memoryPalace.visualize();
    return { visualization };
  }))

  .post('/api/memory/room/create', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.id, 'Room ID is required', { id: ['Required'] });
    validate(!!body.name, 'Room name is required', { name: ['Required'] });
    validate(!!body.description, 'Room description is required', { description: ['Required'] });

    const { id, name, description, position } = body;
    const room = memoryPalace.createRoom(id, name, description, position);

    logger.info(`Memory room created: ${name}`);
    return { success: true, room };
  }))

  .post('/api/memory/store', asyncHandler(async ({ body }: any) => {
    validate(!!body, 'Request body is required');
    validate(!!body.roomId, 'Room ID is required', { roomId: ['Required'] });
    validate(!!body.content, 'Content is required', { content: ['Required'] });
    validate(typeof body.importance === 'number', 'Importance must be a number', { importance: ['Must be numeric'] });

    const { roomId, content, importance, emotion } = body;
    memoryPalace.storeMemory(roomId, content, importance, emotion);

    logger.info(`Memory stored in room: ${roomId}`);
    return { success: true };
  }))

  /**
   * ═══════════════════════════════════════════════════════════════
   * MONITORING ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/health', asyncHandler(async () => {
    const errorStats = errorTracker.getStats()
    const metricsSummary = getMetricsSummary()

    return {
      status: 'ok',
      timestamp: new Date(),
      service: 'api-server',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      errors: {
        total: errorStats.total,
        lastHour: errorStats.lastHour,
        lastMinute: errorStats.lastMinute
      },
      requests: metricsSummary.requests
    }
  }))

  .get('/metrics', asyncHandler(async ({ request }) => {
    const url = new URL(request.url)
    const format = url.searchParams.get('format') || 'prometheus'

    if (format === 'json') {
      // JSON format
      return {
        timestamp: new Date(),
        metrics: metricsRegistry.exportJSON(),
        errors: errorTracker.getStats(),
        summary: getMetricsSummary()
      }
    } else {
      // Prometheus format (default)
      const prometheus = metricsRegistry.exportPrometheus()
      return new Response(prometheus, {
        headers: { 'Content-Type': 'text/plain; version=0.0.4' }
      })
    }
  }))

  .get('/metrics/errors', asyncHandler(async () => {
    const stats = errorTracker.getStats()
    return {
      timestamp: new Date(),
      ...stats,
      summary: errorTracker.getSummary()
    }
  }))

  .listen(3000);

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🌐 TOOBIX UNIFIED API SERVER 🌐                      ║
║                                                               ║
║  Server running on http://localhost:3000                     ║
║  Swagger Docs: http://localhost:3000/swagger                 ║
║                                                               ║
║  Ready for:                                                   ║
║  - Web Dashboard                                              ║
║  - Discord Bot                                                ║
║  - External Integrations                                      ║
║  - Mobile Apps                                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

// Graceful shutdown handling
let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress...');
    return;
  }

  isShuttingDown = true;
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  try {
    // Log final stats
    const errorStats = errorTracker.getStats();
    const metricsSummary = getMetricsSummary();

    logger.info('📊 Final Statistics:', {
      errors: errorStats.total,
      requests: metricsSummary.requests?.total || 0,
      uptime: process.uptime()
    });

    // Give active requests time to complete
    logger.info('Waiting for active requests to complete...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stop the server
    app.stop();
    logger.info('✅ Server stopped gracefully');

    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error as Error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
