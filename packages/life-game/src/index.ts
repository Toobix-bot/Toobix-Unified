/**
 * 🎮 Life Game Chat - Main Exports
 */

export { GameEngine, gameEngine } from './game-engine'
export { MessageAnalyzer, messageAnalyzer } from './message-analyzer'
export { default as lifeGameAPI } from './life-game-api'

export type {
  PlayerStats,
  Activity,
  LevelUpResult
} from './game-engine'

export type {
  MessageAnalysis
} from './message-analyzer'
