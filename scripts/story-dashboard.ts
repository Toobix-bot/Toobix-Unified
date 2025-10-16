#!/usr/bin/env bun
/**
 * 📊 LIVE STORY DASHBOARD
 *
 * Echtzeit-Übersicht über die Meta-Geschichte des Systems!
 */

import { metaStory } from '../packages/consciousness/src/story/meta-story-engine.ts';
import { gameEngine } from '../packages/consciousness/src/story/ai-game-engine.ts';

// Clear screen
console.clear();

/**
 * Render the dashboard
 */
function renderDashboard() {
  console.clear();

  // Get current state
  const state = metaStory.getState();
  const narrative = metaStory.generateNarrative();

  console.log(narrative);

  // Show active game if any
  const activeGame = gameEngine.getActiveGame();
  if (activeGame) {
    console.log(`\n\n${gameEngine.getGameStatus(activeGame.id)}`);
  }

  // Show reality simulation if running
  console.log(`\n\n${gameEngine.getRealityStatus()}`);

  // Instructions
  console.log(`\n
╔═══════════════════════════════════════════════════════════════╗
║  CONTROLS                                                     ║
║  - Ctrl+C: Exit                                               ║
║  - Dashboard aktualisiert sich automatisch alle 10 Sekunden  ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  console.log(`\n[${new Date().toLocaleTimeString()}] Dashboard läuft...`);
}

// Initial render
renderDashboard();

// Update every 10 seconds
const interval = setInterval(renderDashboard, 10000);

// Graceful shutdown
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log(`\n\n👋 Story Dashboard beendet.\n`);
  process.exit(0);
});

// Keep alive
await new Promise(() => {});
