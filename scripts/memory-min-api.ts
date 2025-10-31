#!/usr/bin/env bun
import { Database } from 'bun:sqlite'
import { Logger } from '../packages/core/src/utils/logger.ts'
import { MemoryService } from '../packages/bridge/src/memory/service.ts'

const log = new Logger('memory-min-api')
const PORT = Number(process.env.MEMORY_MIN_PORT || 3011)

function resolveDbPath(): string {
  let dbPath = process.env.UNIFIED_DB || './data/toobix-unified.db'
  if (!dbPath.match(/^[A-Z]:\\/i) && !dbPath.startsWith('/')) {
    const root = process.cwd()
    dbPath = ${root}/data/toobix-unified.db.replace(/\\/g, '/')
  }
  return dbPath
}

const dbPath = resolveDbPath()
const db = new Database(dbPath)

// Minimal ensure table
try {
  db.run(CREATE TABLE IF NOT EXISTS memory_chunks (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    metadata TEXT DEFAULT '{}',
    created_at INTEGER,
    updated_at INTEGER
  ))
} catch {}

const memory = new MemoryService(db, process.env.OPENAI_API_KEY)

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

const server = Bun.serve({
  port: PORT,
  fetch: async (req) => {
    const url = new URL(req.url)

    if (url.pathname === '/health') {
      return json({ status: 'ok', version: 1, uptime: process.uptime(), dbPath })
    }

    if (req.method === 'POST' && url.pathname === '/memory') {
      const body = await req.json().catch(() => ({})) as any
      if (!body.text || typeof body.text !== 'string') {
        return json({ error: 'text is required' }, 400)
      }
      const id = await memory.add(body.text, body.metadata || {})
      log.info('memory.add', { id })
      return json({ id })
    }

    if (req.method === 'GET' && url.pathname === '/memory/search') {
      const q = url.searchParams.get('q') || ''
      const limit = Number(url.searchParams.get('limit') || 10)
      const results = await memory.search(q, limit)
      return json({ q, limit, results })
    }

    if (req.method === 'GET' && url.pathname.startsWith('/memory/')) {
      const id = url.pathname.split('/').pop()!
      const item = await memory.get(id)
      if (!item) return json({ error: 'not found' }, 404)
      return json(item)
    }

    return new Response('Not found', { status: 404 })
  }
})

log.info('Memory Min API listening', { port: PORT, dbPath })
