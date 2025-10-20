/**
 * 🗄️ Initialize Memory System Database Tables
 *
 * Creates the necessary tables for Memory System v2.0
 */

import { Database } from 'bun:sqlite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Find workspace root
const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = join(__dirname, '..');
const dbPath = join(workspaceRoot, 'data', 'toobix-unified.db');

const sqlite = new Database(dbPath, { create: true });

console.log('\n🗄️ INITIALIZING MEMORY SYSTEM TABLES...\n');
console.log(`Database: ${dbPath}\n`);

// Create memories table
sqlite.exec(`
    CREATE TABLE IF NOT EXISTS memories (
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
`);

console.log('✅ Created table: memories');

// Create indexes for memories
sqlite.exec(`
    CREATE INDEX IF NOT EXISTS memories_timestamp_idx ON memories(timestamp);
    CREATE INDEX IF NOT EXISTS memories_type_idx ON memories(type);
    CREATE INDEX IF NOT EXISTS memories_importance_idx ON memories(importance);
    CREATE INDEX IF NOT EXISTS memories_created_idx ON memories(created_at);
`);

console.log('✅ Created indexes for memories');

// Create memory_patterns table
sqlite.exec(`
    CREATE TABLE IF NOT EXISTS memory_patterns (
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
`);

console.log('✅ Created table: memory_patterns');

// Create indexes for memory_patterns
sqlite.exec(`
    CREATE INDEX IF NOT EXISTS memory_patterns_strength_idx ON memory_patterns(strength);
    CREATE INDEX IF NOT EXISTS memory_patterns_last_seen_idx ON memory_patterns(last_seen);
`);

console.log('✅ Created indexes for memory_patterns');

// Create memory_learnings table
sqlite.exec(`
    CREATE TABLE IF NOT EXISTS memory_learnings (
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
`);

console.log('✅ Created table: memory_learnings');

// Create indexes for memory_learnings
sqlite.exec(`
    CREATE INDEX IF NOT EXISTS memory_learnings_confidence_idx ON memory_learnings(confidence);
    CREATE INDEX IF NOT EXISTS memory_learnings_success_rate_idx ON memory_learnings(success_rate);
`);

console.log('✅ Created indexes for memory_learnings');

// Test inserts
const testMemoryId = `test-${Date.now()}`;
sqlite.exec(`
    INSERT OR REPLACE INTO memories (id, timestamp, type, content, importance, tags, related_memories)
    VALUES ('${testMemoryId}', ${Date.now()}, 'event', 'Test memory from initialization', 5, '[]', '[]');
`);

const count = sqlite.query('SELECT COUNT(*) as count FROM memories').get() as { count: number };
console.log(`\n✅ Database is ready! (${count.count} memories exist)\n`);

sqlite.close();

console.log('🎉 Memory System database initialized successfully!\n');
