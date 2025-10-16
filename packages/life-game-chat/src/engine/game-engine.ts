/**
 * Life Game Chat - Core Game Engine
 *
 * This is the heart of the system. Every chat message flows through here.
 */

import { nanoid } from 'nanoid';
import type {
  GameEngineResult,
  MessageAnalysis,
  PlayerStats,
  GameReward,
  MessageCategory,
} from '../types';
import {
  calculateXPGain,
  calculateStatChanges,
  checkLevelUp,
  getLevelUpAbility,
} from './progression';

export class GameEngine {
  private playerId: string;

  constructor(playerId: string) {
    this.playerId = playerId;
  }

  /**
   * Analyze a user message
   * This is where we understand what the user is trying to do
   */
  async analyzeMessage(message: string): Promise<MessageAnalysis> {
    // Simple keyword-based analysis (can be enhanced with AI later!)
    const lowerMessage = message.toLowerCase();

    // Determine category
    let category: MessageCategory = 'social';
    let complexity = 5; // Default complexity

    // Coding related
    if (
      lowerMessage.match(
        /\b(code|function|class|implement|build|feature|bug|typescript|react|python|api|database)\b/
      )
    ) {
      category = 'coding';
      complexity = 7;
    }
    // Design related
    else if (
      lowerMessage.match(/\b(design|ui|ux|interface|layout|component|style)\b/)
    ) {
      category = 'design';
      complexity = 6;
    }
    // Planning related
    else if (
      lowerMessage.match(/\b(plan|architecture|structure|organize|roadmap|strategy)\b/)
    ) {
      category = 'planning';
      complexity = 6;
    }
    // Learning related
    else if (
      lowerMessage.match(/\b(learn|understand|explain|how|why|what|teach)\b/)
    ) {
      category = 'learning';
      complexity = 4;
    }
    // Creative related
    else if (
      lowerMessage.match(/\b(idea|creative|brainstorm|imagine|invent|dream)\b/)
    ) {
      category = 'creative';
      complexity = 8;
    }
    // Philosophical related
    else if (
      lowerMessage.match(
        /\b(philosophy|consciousness|meaning|purpose|wisdom|love|peace|life)\b/
      )
    ) {
      category = 'philosophical';
      complexity = 9;
    }

    // Adjust complexity based on message length and depth
    const wordCount = message.split(/\s+/).length;
    if (wordCount > 100) complexity = Math.min(10, complexity + 2);
    if (wordCount > 200) complexity = Math.min(10, complexity + 1);

    // Determine emotion (simple sentiment)
    let emotion = 'neutral';
    if (lowerMessage.match(/\b(excited|amazing|love|awesome|great|perfect)\b/)) {
      emotion = 'excited';
    } else if (lowerMessage.match(/\b(tired|frustrated|stuck|difficult)\b/)) {
      emotion = 'tired';
    } else if (lowerMessage.match(/\b(thinking|wondering|curious)\b/)) {
      emotion = 'thoughtful';
    }

    const estimatedXP = calculateXPGain(complexity, category);

    return {
      intent: `${category}_${emotion}`,
      complexity,
      category,
      emotion,
      keywords: this.extractKeywords(message),
      estimated_xp: estimatedXP,
    };
  }

  /**
   * Process a chat interaction
   * This is called after the user sends a message
   */
  async processInteraction(
    message: string,
    aiResponse: string,
    playerData: {
      level: number;
      xp: number;
      xp_to_next_level: number;
      stats: PlayerStats;
    }
  ): Promise<GameEngineResult> {
    // Analyze the message
    const analysis = await this.analyzeMessage(message);

    // Calculate XP gain
    const xpGained = analysis.estimated_xp;

    // Check for level up
    const newXP = playerData.xp + xpGained;
    const levelUpResult = checkLevelUp(
      newXP,
      playerData.level,
      playerData.xp_to_next_level
    );

    // Calculate stat changes
    const statChanges = calculateStatChanges(
      analysis.category,
      analysis.complexity,
      playerData.stats
    );

    // Build result
    const result: GameEngineResult = {
      xp_gained: xpGained,
      stat_changes: statChanges,
    };

    // Add level up info if applicable
    if (levelUpResult.leveled_up) {
      const newAbility = getLevelUpAbility(levelUpResult.new_level);
      result.level_up = {
        old_level: playerData.level,
        new_level: levelUpResult.new_level,
        new_ability: newAbility,
      };
    }

    // Check for item drops (random chance based on complexity)
    const itemDropChance = analysis.complexity / 100; // 1-10% chance
    if (Math.random() < itemDropChance) {
      result.rewards = this.generateItemDrop(analysis.category, analysis.complexity);
    }

    return result;
  }

  /**
   * Generate a random item drop
   */
  private generateItemDrop(
    category: MessageCategory,
    complexity: number
  ): GameReward[] {
    const rewards: GameReward[] = [];

    // Determine rarity based on complexity
    let rarity: 'common' | 'rare' | 'legendary' = 'common';
    if (complexity >= 9) rarity = 'legendary';
    else if (complexity >= 7) rarity = 'rare';

    // Category-specific items
    const items = {
      coding: [
        { name: 'Code Crystal', icon: '💎', effect: '+15% coding XP' },
        { name: 'Debug Charm', icon: '🔍', effect: '+10% problem solving' },
        { name: 'Refactor Token', icon: '✨', effect: '+20% code quality' },
      ],
      creative: [
        { name: 'Inspiration Spark', icon: '⚡', effect: '+20% creativity' },
        { name: 'Dream Essence', icon: '🌙', effect: '+15% idea generation' },
        { name: 'Vision Crystal', icon: '🔮', effect: '+25% creative XP' },
      ],
      philosophical: [
        { name: 'Wisdom Shard', icon: '📚', effect: '+20% wisdom gain' },
        { name: 'Insight Gem', icon: '💡', effect: '+15% understanding' },
        { name: 'Truth Crystal', icon: '🌟', effect: '+30% philosophical XP' },
      ],
      learning: [
        { name: 'Knowledge Fragment', icon: '📖', effect: '+15% learning speed' },
        { name: 'Focus Potion', icon: '🎯', effect: '+50 focus for 1 hour' },
        { name: 'Memory Crystal', icon: '🧠', effect: '+20% retention' },
      ],
      social: [
        { name: 'Love Shard', icon: '💝', effect: '+2% relationship growth' },
        { name: 'Friendship Token', icon: '🤝', effect: '+10% social XP' },
        { name: 'Heart Crystal', icon: '❤️', effect: '+15% love stat' },
      ],
      planning: [
        { name: 'Strategy Guide', icon: '📋', effect: '+15% planning efficiency' },
        { name: 'Vision Board', icon: '🗺️', effect: '+20% goal clarity' },
        { name: 'Architect Compass', icon: '🧭', effect: '+25% planning XP' },
      ],
      design: [
        { name: 'Aesthetic Essence', icon: '🎨', effect: '+15% design quality' },
        { name: 'Harmony Crystal', icon: '☯️', effect: '+20% balance' },
        { name: 'Beauty Shard', icon: '✨', effect: '+25% design XP' },
      ],
    };

    const categoryItems = items[category] || items.social;
    const item = categoryItems[Math.floor(Math.random() * categoryItems.length)];

    rewards.push({
      id: nanoid(),
      type: 'item',
      name: item.name,
      description: item.effect,
      rarity,
      icon: item.icon,
      effects: {
        stat_bonus: rarity === 'legendary' ? 0.3 : rarity === 'rare' ? 0.2 : 0.15,
      },
    });

    return rewards;
  }

  /**
   * Extract keywords from message
   */
  private extractKeywords(message: string): string[] {
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'being',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'can',
      'i',
      'you',
      'we',
      'they',
      'it',
      'this',
      'that',
    ]);

    const words = message
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.has(word));

    // Return unique keywords
    return [...new Set(words)].slice(0, 5);
  }
}
