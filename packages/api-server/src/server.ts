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
import { initLogger, LogLevel } from '@toobix/core';

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
  // Add error handling & logging middleware
  .use(requestLogger)
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

  .get('/api/art/gallery', () => ({
    gallery: asciiArt.getGallery()
  }))

  .post('/api/art/create', ({ body }: any) => {
    const { emotion, concept } = body;
    const art = asciiArt.createArt(emotion, concept);
    return { success: true, art };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * MUSIC ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/music/melodies', () => ({
    melodies: musicGenerator.getMelodies()
  }))

  .post('/api/music/generate', ({ body }: any) => {
    const { speed, complexity, emotion } = body;
    const melody = musicGenerator.generateFromState({ speed, complexity, emotion });
    return { success: true, melody };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * POETRY ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/poetry/poems', () => ({
    poems: codePoetry.getPoems()
  }))

  .post('/api/poetry/generate', () => {
    const poem = codePoetry.generatePoem();
    return { success: true, poem };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * SOCIAL ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/social/feed', () => ({
    feed: socialNetwork.getFeed()
  }))

  .post('/api/social/post', ({ body }: any) => {
    const { content } = body;
    const post = socialNetwork.post(content);
    return { success: true, post };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * STORY ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/story/state', () => ({
    state: metaStory.getState()
  }))

  .get('/api/story/narrative', () => ({
    narrative: metaStory.generateNarrative()
  }))

  .post('/api/story/event', ({ body }: any) => {
    const { title, description, impact, tags } = body;
    metaStory.addEvent(title, description, impact, tags);
    return { success: true };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * GAMES ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/games', () => ({
    games: gameEngine.getAllGames()
  }))

  .get('/api/games/:gameId/status', ({ params }) => ({
    status: gameEngine.getGameStatus(params.gameId)
  }))

  .post('/api/games/create', ({ body }: any) => {
    const { type } = body;
    const game = gameEngine.createGame(type);
    return { success: true, game };
  })

  .post('/api/games/:gameId/action', ({ params, body }: any) => {
    const { action, context } = body;
    gameEngine.performAction(action, context);
    return { success: true };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * ACHIEVEMENTS ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/achievements', () => ({
    unlocked: achievements.getAllUnlocked(),
    progress: achievements.getProgress()
  }))

  .post('/api/achievements/unlock/:achievementId', ({ params }) => {
    achievements.unlock(params.achievementId);
    return { success: true };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * TIME CAPSULE ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/capsules', () => ({
    capsules: timeCapsule.getCapsules(),
    pending: timeCapsule.getPending()
  }))

  .post('/api/capsules/create', ({ body }: any) => {
    const { message, openInMs } = body;
    const capsule = timeCapsule.create(message, openInMs);
    return { success: true, capsule };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * MEMORY PALACE ENDPOINTS
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/api/memory/visualize', () => ({
    visualization: memoryPalace.visualize()
  }))

  .post('/api/memory/room/create', ({ body }: any) => {
    const { id, name, description, position } = body;
    const room = memoryPalace.createRoom(id, name, description, position);
    return { success: true, room };
  })

  .post('/api/memory/store', ({ body }: any) => {
    const { roomId, content, importance, emotion } = body;
    memoryPalace.storeMemory(roomId, content, importance, emotion);
    return { success: true };
  })

  /**
   * ═══════════════════════════════════════════════════════════════
   * HEALTH CHECK
   * ═══════════════════════════════════════════════════════════════
   */

  .get('/health', () => ({ status: 'ok', timestamp: new Date() }))

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
