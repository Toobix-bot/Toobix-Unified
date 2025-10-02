#!/usr/bin/env bun
/**
 * Database Migration Script
 * Uses Bun's built-in SQLite instead of better-sqlite3
 */

import { Database } from 'bun:sqlite'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

const DB_PATH = '../../data/toobix-unified.db'
const MIGRATIONS_DIR = './migrations'

console.log('🗄️  Toobix Unified - Database Migration\n')

// 1. Create data directory if needed
const { mkdirSync } = require('fs')
try {
  mkdirSync('../../data', { recursive: true })
  console.log('✅ Data directory ready')
} catch (e) {
  // Already exists
}

// 2. Open database
console.log('📂 Opening database:', DB_PATH)
const db = new Database(DB_PATH, { create: true })

// 3. Create migrations table
db.run(`
  CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  )
`)
console.log('✅ Migrations table ready\n')

// 4. Get applied migrations
const applied = db.query('SELECT hash FROM __drizzle_migrations').all() as { hash: string }[]
const appliedHashes = new Set(applied.map(m => m.hash))

console.log('📋 Applied migrations:', appliedHashes.size)

// 5. Get pending migrations
const files = await readdir(MIGRATIONS_DIR)
const sqlFiles = files.filter(f => f.endsWith('.sql')).sort()

console.log('📋 Total migrations:', sqlFiles.length)
console.log('📋 Pending migrations:', sqlFiles.length - appliedHashes.size, '\n')

// 6. Apply pending migrations
let applied_count = 0

for (const file of sqlFiles) {
  const hash = file.replace('.sql', '')
  
  if (appliedHashes.has(hash)) {
    console.log(`⏭️  ${file} (already applied)`)
    continue
  }
  
  console.log(`🔄 Applying ${file}...`)
  
  const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf-8')
  
  try {
    // Execute migration
    db.exec(sql)
    
    // Record migration
    db.run('INSERT INTO __drizzle_migrations (hash) VALUES (?)', [hash])
    
    console.log(`✅ ${file} applied successfully`)
    applied_count++
  } catch (error) {
    console.error(`❌ ${file} failed:`, error)
    process.exit(1)
  }
}

db.close()

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
if (applied_count > 0) {
  console.log(`✅ Migration complete! ${applied_count} migrations applied.`)
} else {
  console.log('✅ Database is up to date!')
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
