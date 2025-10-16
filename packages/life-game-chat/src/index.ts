/**
 * Life Game Chat - Main Entry Point
 *
 * "Where Every Conversation is an Adventure"
 */

export { GameEngine } from './engine/game-engine';
export { PlayerService } from './services/player-service';

export {
  calculateXPForLevel,
  calculateXPGain,
  calculateStatChanges,
  checkLevelUp,
  getLevelUpAbility,
  calculateSkillXP,
  getSkillMastery,
} from './engine/progression';

export type {
  PlayerStats,
  PlayerClass,
  RunMode,
  MessageCategory,
  Rarity,
  RewardType,
  CompanionId,
  CompanionMood,
  RelationshipTier,
  SkillMastery,
  GameEventType,
  GameEngineResult,
  GameReward,
  QuestProgress,
  CompanionReaction,
  SkillUp,
  MessageAnalysis,
} from './types';
