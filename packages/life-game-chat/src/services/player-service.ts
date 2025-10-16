/**
 * Player Service - Manages player data and game state
 */

import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { playerProfile, gameEvents, playerSkills } from '@toobix/core/db/schema';
import type { GameEngineResult, PlayerStats } from '../types';

export class PlayerService {
  constructor(private db: any) {}

  /**
   * Get or create player profile
   */
  async getOrCreatePlayer(playerId: string, playerName: string) {
    // Try to find existing player
    const existing = await this.db
      .select()
      .from(playerProfile)
      .where(eq(playerProfile.id, playerId))
      .get();

    if (existing) {
      return existing;
    }

    // Create new player
    const newPlayer = {
      id: playerId,
      name: playerName,
      level: 1,
      xp: 0,
      xp_to_next_level: 100,
      creativity: 50,
      wisdom: 50,
      love: 50,
      energy: 50,
      focus: 50,
      class: 'Seeker',
      total_runs: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await this.db.insert(playerProfile).values(newPlayer);

    return newPlayer;
  }

  /**
   * Apply game engine results to player
   */
  async applyGameResults(playerId: string, results: GameEngineResult) {
    const player = await this.db
      .select()
      .from(playerProfile)
      .where(eq(playerProfile.id, playerId))
      .get();

    if (!player) throw new Error('Player not found');

    // Calculate new values
    const newXP = player.xp + results.xp_gained;
    const updates: any = {
      xp: newXP,
      updated_at: new Date(),
    };

    // Apply stat changes
    if (results.stat_changes) {
      Object.keys(results.stat_changes).forEach((stat) => {
        const statKey = stat as keyof PlayerStats;
        updates[statKey] = Math.min(
          100,
          player[statKey] + (results.stat_changes![statKey] || 0)
        );
      });
    }

    // Handle level up
    if (results.level_up) {
      updates.level = results.level_up.new_level;
      updates.xp = newXP - player.xp_to_next_level; // Carry over XP
      updates.xp_to_next_level = 100 * Math.pow(results.level_up.new_level, 1.5);
    }

    // Update player
    await this.db
      .update(playerProfile)
      .set(updates)
      .where(eq(playerProfile.id, playerId));

    // Log event
    await this.logGameEvent(playerId, 'xp_gain', results);

    return updates;
  }

  /**
   * Log a game event
   */
  async logGameEvent(
    playerId: string,
    type: string,
    details: GameEngineResult
  ) {
    await this.db.insert(gameEvents).values({
      id: nanoid(),
      player_id: playerId,
      type,
      description: JSON.stringify(details),
      xp_change: details.xp_gained,
      stat_changes: details.stat_changes ? JSON.stringify(details.stat_changes) : null,
      rewards: details.rewards ? JSON.stringify(details.rewards) : null,
      created_at: new Date(),
    });
  }

  /**
   * Get player stats
   */
  async getPlayerStats(playerId: string) {
    const player = await this.db
      .select()
      .from(playerProfile)
      .where(eq(playerProfile.id, playerId))
      .get();

    if (!player) return null;

    return {
      level: player.level,
      xp: player.xp,
      xp_to_next_level: player.xp_to_next_level,
      stats: {
        creativity: player.creativity,
        wisdom: player.wisdom,
        love: player.love,
        energy: player.energy,
        focus: player.focus,
      },
      class: player.class,
      total_runs: player.total_runs,
    };
  }
}
