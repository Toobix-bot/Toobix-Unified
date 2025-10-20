/**
 * Create AI Memory System tables
 */

import { Database } from 'bun:sqlite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'toobix-unified.db');

console.log('🗄️ Creating AI Memory System tables...\n');
console.log(`Database: ${dbPath}\n`);

const db = new Database(dbPath, { create: true });

// Create ai_memories table
db.exec(`
CREATE TABLE IF NOT EXISTS ai_memories (
    id TEXT PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    importance INTEGER NOT NULL,
    tags TEXT,
    embedding TEXT,
    related_memories TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    accessed_count INTEGER DEFAULT 0,
    last_accessed INTEGER
);

CREATE INDEX IF NOT EXISTS ai_memories_timestamp_idx ON ai_memories(timestamp);
CREATE INDEX IF NOT EXISTS ai_memories_type_idx ON ai_memories(type);
CREATE INDEX IF NOT EXISTS ai_memories_importance_idx ON ai_memories(importance);
CREATE INDEX IF NOT EXISTS ai_memories_created_idx ON ai_memories(created_at);
`);

console.log('✅ Created table: ai_memories');

// Create ai_memory_patterns table
db.exec(`
CREATE TABLE IF NOT EXISTS ai_memory_patterns (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    occurrences INTEGER NOT NULL,
    first_seen INTEGER NOT NULL,
    last_seen INTEGER NOT NULL,
    strength REAL NOT NULL,
    related_memory_ids TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS ai_memory_patterns_strength_idx ON ai_memory_patterns(strength);
CREATE INDEX IF NOT EXISTS ai_memory_patterns_last_seen_idx ON ai_memory_patterns(last_seen);
`);

console.log('✅ Created table: ai_memory_patterns');

// Create ai_memory_learnings table
db.exec(`
CREATE TABLE IF NOT EXISTS ai_memory_learnings (
    id TEXT PRIMARY KEY,
    lesson TEXT NOT NULL,
    confidence REAL NOT NULL,
    evidence TEXT,
    applied_count INTEGER DEFAULT 0,
    success_rate REAL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    last_applied INTEGER
);

CREATE INDEX IF NOT EXISTS ai_memory_learnings_confidence_idx ON ai_memory_learnings(confidence);
CREATE INDEX IF NOT EXISTS ai_memory_learnings_success_rate_idx ON ai_memory_learnings(success_rate);
`);

console.log('✅ Created table: ai_memory_learnings');

db.close();

console.log('\n🎉 AI Memory System tables created successfully!\n');
