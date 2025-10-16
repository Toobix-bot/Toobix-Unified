/**
 * Life Game Chat - Type Definitions
 */

export type PlayerStats = {
  creativity: number;   // 0-100
  wisdom: number;       // 0-100
  love: number;         // 0-100
  energy: number;       // 0-100
  focus: number;        // 0-100
};

export type PlayerClass = 'Seeker' | 'Builder' | 'Philosopher' | 'Artist';

export type RunMode = 'builder' | 'creative' | 'reflection' | 'play';

export type MessageCategory =
  | 'coding'
  | 'design'
  | 'planning'
  | 'learning'
  | 'creative'
  | 'social'
  | 'philosophical';

export type Rarity = 'common' | 'rare' | 'legendary';

export type RewardType = 'item' | 'achievement' | 'artifact';

export type CompanionId = 'luna' | 'blaze' | 'harmony' | 'sage' | 'nova';

export type CompanionMood =
  | 'happy'
  | 'excited'
  | 'neutral'
  | 'thoughtful'
  | 'concerned'
  | 'loving';

export type RelationshipTier =
  | 'new'
  | 'known'
  | 'trusting'
  | 'close'
  | 'devoted'
  | 'soulmate';

export type SkillMastery =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'master';

export type GameEventType =
  | 'xp_gain'
  | 'level_up'
  | 'item_drop'
  | 'quest_complete'
  | 'achievement'
  | 'companion_reaction'
  | 'stat_change'
  | 'skill_up';

/**
 * Game Engine Results
 */
export interface GameEngineResult {
  xp_gained: number;
  level_up?: {
    old_level: number;
    new_level: number;
    new_ability?: string;
  };
  stat_changes?: Partial<PlayerStats>;
  rewards?: GameReward[];
  quest_progress?: QuestProgress[];
  companion_reactions?: CompanionReaction[];
  skill_ups?: SkillUp[];
}

export interface GameReward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  rarity: Rarity;
  icon?: string;
  effects?: Record<string, any>;
}

export interface QuestProgress {
  quest_id: string;
  title: string;
  old_progress: number;
  new_progress: number;
  completed?: boolean;
  reward?: {
    xp: number;
    items?: string[];
  };
}

export interface CompanionReaction {
  companion_id: CompanionId;
  companion_name: string;
  mood: CompanionMood;
  message: string;
  relationship_change: number;
  new_tier?: RelationshipTier;
}

export interface SkillUp {
  skill_id: string;
  skill_name: string;
  old_level: number;
  new_level: number;
  new_mastery?: SkillMastery;
}

/**
 * Message Analysis Result
 */
export interface MessageAnalysis {
  intent: string;
  complexity: number;        // 1-10
  category: MessageCategory;
  emotion: string;
  keywords: string[];
  estimated_xp: number;
}
