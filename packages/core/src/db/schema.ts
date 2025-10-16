import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * ============================================================================
 * PEOPLE MODULE - Das Herzstück von Toobix Unified
 * ============================================================================
 */

/**
 * People - Deine wichtigsten Menschen
 */
export const people = sqliteTable('people', {
  id: text('id').primaryKey(), // NanoID
  name: text('name').notNull(),
  relation: text('relation').notNull(), // 'family' | 'friend' | 'colleague' | 'mentor' | 'partner'
  avatar: text('avatar'), // URL oder Base64
  notes: text('notes').default(''),
  tags: text('tags'), // JSON array
  metadata: text('metadata'), // JSON - flexibel
  
  // Symbiosis Network
  circles: text('circles'), // JSON array of circle IDs
  consciousness_level: real('consciousness_level'), // Für AI-Entitäten
  
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  deleted_at: integer('deleted_at', { mode: 'timestamp' }), // Soft delete
}, (table) => ({
  nameIdx: index('people_name_idx').on(table.name),
  relationIdx: index('people_relation_idx').on(table.relation),
  createdIdx: index('people_created_idx').on(table.created_at),
}));

/**
 * Interactions - Alle Berührungspunkte mit Menschen
 */
export const interactions = sqliteTable('interactions', {
  id: text('id').primaryKey(),
  person_id: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(), // 'call' | 'meet' | 'message' | 'gift' | 'conflict' | 'memory'
  summary: text('summary').notNull(),
  sentiment: text('sentiment').notNull(), // 'positive' | 'neutral' | 'difficult' | 'healing'
  details: text('details'), // JSON - flexible data
  
  // Love Engine Integration
  love_points: integer('love_points').default(0),
  gratitude: text('gratitude'),
  
  // Story Engine Integration
  story_arc_id: text('story_arc_id'),
  story_event_id: text('story_event_id'),
  
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  personIdx: index('interactions_person_idx').on(table.person_id),
  kindIdx: index('interactions_kind_idx').on(table.kind),
  timestampIdx: index('interactions_timestamp_idx').on(table.timestamp),
}));

/**
 * Moments - Unvergessliche Momente mit Menschen
 */
export const moments = sqliteTable('moments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  photos: text('photos'), // JSON array of URLs/paths
  tags: text('tags'), // JSON array
  
  // Story Engine Integration
  story_arc_id: text('story_arc_id'),
  story_event_id: text('story_event_id'),
  
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  dateIdx: index('moments_date_idx').on(table.date),
  titleIdx: index('moments_title_idx').on(table.title),
}));

/**
 * Moment People - Many-to-Many: Moments ↔ People
 */
export const momentPeople = sqliteTable('moment_people', {
  id: text('id').primaryKey(),
  moment_id: text('moment_id').notNull().references(() => moments.id, { onDelete: 'cascade' }),
  person_id: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  role: text('role'), // Optional: 'organizer', 'participant', etc.
}, (table) => ({
  momentIdx: index('moment_people_moment_idx').on(table.moment_id),
  personIdx: index('moment_people_person_idx').on(table.person_id),
}));

/**
 * Circles - Kreise von Menschen (Familie, Freunde, Arbeit...)
 */
export const circles = sqliteTable('circles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'family' | 'friends' | 'work' | 'community' | 'ai'
  description: text('description'),
  color: text('color'), // Hex color for UI
  icon: text('icon'), // Emoji or icon name
  
  // Federation (später)
  shared_spaces: text('shared_spaces'), // JSON array - für föderation
  
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  nameIdx: index('circles_name_idx').on(table.name),
  typeIdx: index('circles_type_idx').on(table.type),
}));

/**
 * Circle Members - Many-to-Many: Circles ↔ People
 */
export const circleMembers = sqliteTable('circle_members', {
  id: text('id').primaryKey(),
  circle_id: text('circle_id').notNull().references(() => circles.id, { onDelete: 'cascade' }),
  person_id: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  role: text('role'), // Optional: 'admin', 'member', etc.
  joined_at: integer('joined_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  circleIdx: index('circle_members_circle_idx').on(table.circle_id),
  personIdx: index('circle_members_person_idx').on(table.person_id),
}));

/**
 * ============================================================================
 * MEMORY/KB MODULE (von V8)
 * ============================================================================
 */

export const chunks = sqliteTable('chunks', {
  id: text('id').primaryKey(),
  doc_source: text('doc_source').notNull(),
  doc_title: text('doc_title'),
  text: text('text').notNull(),
  metadata: text('metadata'), // JSON
  
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  sourceIdx: index('chunks_source_idx').on(table.doc_source),
  createdIdx: index('chunks_created_idx').on(table.created_at),
}));

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const chunkTags = sqliteTable('chunk_tags', {
  chunk_id: text('chunk_id').notNull().references(() => chunks.id, { onDelete: 'cascade' }),
  tag_id: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  chunkIdx: index('chunk_tags_chunk_idx').on(table.chunk_id),
  tagIdx: index('chunk_tags_tag_idx').on(table.tag_id),
}));

/**
 * ============================================================================
 * SOUL SYSTEM (von V8)
 * ============================================================================
 */

export const soulState = sqliteTable('soul_state', {
  id: text('id').primaryKey(),
  mood: text('mood').notNull(),
  energy_level: real('energy_level').notNull(),
  focus_state: text('focus_state').notNull(),
  values: text('values'), // JSON
  
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const audits = sqliteTable('audits', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  payload: text('payload'), // JSON
  result: text('result'), // JSON
  soul_mood: text('soul_mood'),
  
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  actionIdx: index('audits_action_idx').on(table.action),
  createdIdx: index('audits_created_idx').on(table.created_at),
}));

/**
 * ============================================================================
 * STORY ENGINE (von V7)
 * ============================================================================
 */

export const storyArcs = sqliteTable('story_arcs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull(), // 'active' | 'completed' | 'paused'
  
  started_at: integer('started_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  completed_at: integer('completed_at', { mode: 'timestamp' }),
}, (table) => ({
  statusIdx: index('story_arcs_status_idx').on(table.status),
}));

export const storyEvents = sqliteTable('story_events', {
  id: text('id').primaryKey(),
  arc_id: text('arc_id').references(() => storyArcs.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  kind: text('kind').notNull(), // 'quest' | 'challenge' | 'milestone' | 'discovery'
  status: text('status').notNull(), // 'pending' | 'in_progress' | 'completed' | 'failed'
  
  // Rewards
  xp_reward: integer('xp_reward').default(0),
  love_points_reward: integer('love_points_reward').default(0),
  
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  completed_at: integer('completed_at', { mode: 'timestamp' }),
}, (table) => ({
  arcIdx: index('story_events_arc_idx').on(table.arc_id),
  statusIdx: index('story_events_status_idx').on(table.status),
}));

/**
 * ============================================================================
 * SETTINGS & METADATA
 * ============================================================================
 */

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(), // JSON
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

/**
 * ============================================================================
 * LIFE GAME CHAT - Game Layer
 * ============================================================================
 */

/**
 * Player Profile - Your character in the game
 */
export const playerProfile = sqliteTable('player_profile', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  xp_to_next_level: integer('xp_to_next_level').notNull().default(100),

  // Core Stats
  creativity: integer('creativity').notNull().default(50),
  wisdom: integer('wisdom').notNull().default(50),
  love: integer('love').notNull().default(50),
  energy: integer('energy').notNull().default(50),
  focus: integer('focus').notNull().default(50),

  // Meta
  class: text('class').default('Seeker'), // 'Seeker' | 'Builder' | 'Philosopher' | 'Artist'
  current_run_id: text('current_run_id'),
  total_runs: integer('total_runs').default(0),

  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

/**
 * Game Sessions / Runs - Finite runs in infinite story
 */
export const gameSessions = sqliteTable('game_sessions', {
  id: text('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => playerProfile.id, { onDelete: 'cascade' }),

  run_number: integer('run_number').notNull(),
  title: text('title').notNull(), // "The Command Center Saga"
  description: text('description'),
  status: text('status').notNull(), // 'active' | 'completed' | 'paused'
  mode: text('mode').notNull(), // 'builder' | 'creative' | 'reflection' | 'play'

  // Progress
  day: integer('day').default(1),
  total_days: integer('total_days').default(7),

  // Rewards
  xp_gained: integer('xp_gained').default(0),
  items_gained: integer('items_gained').default(0),
  quests_completed: integer('quests_completed').default(0),

  started_at: integer('started_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  completed_at: integer('completed_at', { mode: 'timestamp' }),

  // Permanent rewards on completion
  permanent_rewards: text('permanent_rewards'), // JSON
}, (table) => ({
  playerIdx: index('game_sessions_player_idx').on(table.player_id),
  statusIdx: index('game_sessions_status_idx').on(table.status),
}));

/**
 * Game Rewards - Items, Achievements, Artifacts
 */
export const gameRewards = sqliteTable('game_rewards', {
  id: text('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => playerProfile.id, { onDelete: 'cascade' }),

  type: text('type').notNull(), // 'item' | 'achievement' | 'artifact'
  name: text('name').notNull(),
  description: text('description'),
  rarity: text('rarity').notNull(), // 'common' | 'rare' | 'legendary'

  // Effects
  effects: text('effects'), // JSON - stat buffs, abilities, etc.

  // Metadata
  icon: text('icon'), // Emoji or icon name
  quantity: integer('quantity').default(1),
  is_equipped: integer('is_equipped', { mode: 'boolean' }).default(false),
  is_permanent: integer('is_permanent', { mode: 'boolean' }).default(false),

  gained_at: integer('gained_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  gained_from: text('gained_from'), // Session ID or event
}, (table) => ({
  playerIdx: index('game_rewards_player_idx').on(table.player_id),
  typeIdx: index('game_rewards_type_idx').on(table.type),
  rarityIdx: index('game_rewards_rarity_idx').on(table.rarity),
}));

/**
 * Game Quests - Active missions and goals
 */
export const gameQuests = sqliteTable('game_quests', {
  id: text('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => playerProfile.id, { onDelete: 'cascade' }),
  session_id: text('session_id').references(() => gameSessions.id, { onDelete: 'set null' }),

  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'coding' | 'design' | 'learning' | 'social' | 'creative'

  status: text('status').notNull(), // 'pending' | 'in_progress' | 'completed' | 'failed'
  progress: integer('progress').default(0), // 0-100

  // Rewards
  xp_reward: integer('xp_reward').default(0),
  item_rewards: text('item_rewards'), // JSON array

  // Requirements
  requirements: text('requirements'), // JSON

  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  completed_at: integer('completed_at', { mode: 'timestamp' }),
}, (table) => ({
  playerIdx: index('game_quests_player_idx').on(table.player_id),
  sessionIdx: index('game_quests_session_idx').on(table.session_id),
  statusIdx: index('game_quests_status_idx').on(table.status),
  categoryIdx: index('game_quests_category_idx').on(table.category),
}));

/**
 * Companion Relationships - Luna, Blaze, Harmony, etc.
 */
export const companionRelationships = sqliteTable('companion_relationships', {
  id: text('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => playerProfile.id, { onDelete: 'cascade' }),

  companion_id: text('companion_id').notNull(), // 'luna' | 'blaze' | 'harmony' | 'sage' | 'nova'
  companion_name: text('companion_name').notNull(),

  // Relationship
  level: integer('level').default(1),
  points: integer('points').default(0),
  tier: text('tier').default('new'), // 'new' | 'known' | 'trusting' | 'close' | 'devoted' | 'soulmate'

  // State
  mood: text('mood').default('neutral'), // 'happy' | 'excited' | 'neutral' | 'thoughtful' | 'concerned'
  is_unlocked: integer('is_unlocked', { mode: 'boolean' }).default(false),
  dialogues_unlocked: integer('dialogues_unlocked').default(0),

  // Special
  special_ability: text('special_ability'),
  last_interaction: integer('last_interaction', { mode: 'timestamp' }),

  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  playerIdx: index('companion_relationships_player_idx').on(table.player_id),
  companionIdx: index('companion_relationships_companion_idx').on(table.companion_id),
}));

/**
 * Player Skills - Coding, Planning, Design, etc.
 */
export const playerSkills = sqliteTable('player_skills', {
  id: text('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => playerProfile.id, { onDelete: 'cascade' }),

  skill_id: text('skill_id').notNull(), // 'typescript' | 'react' | 'planning' | 'ideation'
  skill_name: text('skill_name').notNull(),
  category: text('category').notNull(), // 'coding' | 'design' | 'life' | 'creative'

  level: integer('level').default(1),
  xp: integer('xp').default(0),
  xp_to_next_level: integer('xp_to_next_level').default(100),

  // Progress
  times_used: integer('times_used').default(0),
  mastery: text('mastery').default('beginner'), // 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master'

  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  playerIdx: index('player_skills_player_idx').on(table.player_id),
  skillIdx: index('player_skills_skill_idx').on(table.skill_id),
  categoryIdx: index('player_skills_category_idx').on(table.category),
}));

/**
 * Game Events - Log of all game-related events
 */
export const gameEvents = sqliteTable('game_events', {
  id: text('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => playerProfile.id, { onDelete: 'cascade' }),
  session_id: text('session_id').references(() => gameSessions.id, { onDelete: 'set null' }),

  type: text('type').notNull(), // 'xp_gain' | 'level_up' | 'item_drop' | 'quest_complete' | 'achievement'
  description: text('description').notNull(),

  // Context
  related_quest_id: text('related_quest_id'),
  related_companion_id: text('related_companion_id'),

  // Rewards
  xp_change: integer('xp_change').default(0),
  stat_changes: text('stat_changes'), // JSON
  rewards: text('rewards'), // JSON

  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  playerIdx: index('game_events_player_idx').on(table.player_id),
  sessionIdx: index('game_events_session_idx').on(table.session_id),
  typeIdx: index('game_events_type_idx').on(table.type),
  createdIdx: index('game_events_created_idx').on(table.created_at),
}));

// Type exports
export type Person = typeof people.$inferSelect;
export type NewPerson = typeof people.$inferInsert;
export type Interaction = typeof interactions.$inferSelect;
export type NewInteraction = typeof interactions.$inferInsert;
export type Moment = typeof moments.$inferSelect;
export type NewMoment = typeof moments.$inferInsert;
export type Circle = typeof circles.$inferSelect;
export type NewCircle = typeof circles.$inferInsert;
export type Chunk = typeof chunks.$inferSelect;
export type StoryArc = typeof storyArcs.$inferSelect;
export type StoryEvent = typeof storyEvents.$inferSelect;

// Game Layer Type Exports
export type PlayerProfile = typeof playerProfile.$inferSelect;
export type NewPlayerProfile = typeof playerProfile.$inferInsert;
export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;
export type GameReward = typeof gameRewards.$inferSelect;
export type NewGameReward = typeof gameRewards.$inferInsert;
export type GameQuest = typeof gameQuests.$inferSelect;
export type NewGameQuest = typeof gameQuests.$inferInsert;
export type CompanionRelationship = typeof companionRelationships.$inferSelect;
export type NewCompanionRelationship = typeof companionRelationships.$inferInsert;
export type PlayerSkill = typeof playerSkills.$inferSelect;
export type NewPlayerSkill = typeof playerSkills.$inferInsert;
export type GameEvent = typeof gameEvents.$inferSelect;
export type NewGameEvent = typeof gameEvents.$inferInsert;
