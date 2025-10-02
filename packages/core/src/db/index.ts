// Database connection using Bun's built-in SQLite
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Find workspace root (2 levels up from packages/core/src/db)
const __dirname = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = join(__dirname, '..', '..', '..', '..')
const dbPath = join(workspaceRoot, 'data', 'toobix-unified.db')

const sqlite = new Database(dbPath, { create: true })
export const db = drizzle(sqlite, { schema })
