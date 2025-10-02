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
