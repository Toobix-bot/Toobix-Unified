// Database connection using Bun's built-in SQLite
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

const sqlite = new Database('../../data/toobix-unified.db', { create: true })
export const db = drizzle(sqlite, { schema })
