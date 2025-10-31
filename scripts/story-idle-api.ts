#!/usr/bin/env bun
/**
 * STORY-IDLE GAME API SERVER (Minimal)
 * Port: 3004
 * Endpoints:
 *  - GET  /health
 *  - GET  /state
 *  - GET  /options
 *  - POST /choose   { id?: string, index?: number }
 *  - POST /tick     { delta?: number }
 *  - GET  /         Quick-Play UI (HTML)
 */

import { serve } from 'bun'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const PORT = 3004
const ROOT = process.cwd()
const DATA_DIR = join(ROOT, 'data')
const STATE_FILE = join(DATA_DIR, 'story-idle-state.json')

function ensureDataDir() {
  try { mkdirSync(DATA_DIR, { recursive: true }) } catch {}
}

type Stats = { love: number; peace: number; wisdom: number; creativity: number; stability: number }
interface GameState {
  xp: number
  level: number
  stats: Stats
  lastUpdated: number
  log: string[]
}

function defaultState(): GameState {
  return {
    xp: 0,
    level: 1,
    stats: { love: 50, peace: 50, wisdom: 50, creativity: 50, stability: 50 },
    lastUpdated: Date.now(),
    log: ['Story-Idle born in this moment.']
  }
}

function clamp(v: number, min = 0, max = 100) { return Math.max(min, Math.min(max, v)) }
function computeLevel(xp: number) { return Math.max(1, Math.floor(xp / 100) + 1) }

function loadState(): GameState {
  ensureDataDir()
  try {
    const raw = readFileSync(STATE_FILE, 'utf8')
    const s = JSON.parse(raw)
    // Backward-safe defaults
    s.level = computeLevel(s.xp || 0)
    s.stats = s.stats || defaultState().stats
    s.log = Array.isArray(s.log) ? s.log : []
    return s
  } catch {
    const s = defaultState()
    saveState(s)
    return s
  }
}

function saveState(s: GameState) {
  ensureDataDir()
  writeFileSync(STATE_FILE, JSON.stringify(s, null, 2))
}

function generateOptions(state: GameState) {
  const t = Date.now()
  return [
    { id: `peace-${t}`, label: 'Meditate for inner peace', expected: { peace: +8, stability: +2 } },
    { id: `wisdom-${t}`, label: 'Study a powerful concept', expected: { wisdom: +10, creativity: +3 } },
    { id: `brave-${t}`, label: 'Take on a bold challenge', expected: { creativity: +7, love: +2, stability: -3 } },
  ]
}

function applyExpected(stats: Stats, expected: Record<string, number>) {
  const out: Stats = { ...stats }
  for (const [k, v] of Object.entries(expected || {})) {
    if ((out as any)[k] !== undefined) (out as any)[k] = clamp((out as any)[k] + v)
  }
  return out
}

function htmlUI() {
  return `<!doctype html>
<html><head><meta charset="utf-8"/><title>Story-Idle Quick Play</title>
<style>body{font-family:ui-sans-serif,system-ui;max-width:680px;margin:24px auto;padding:0 12px}button{padding:8px 12px;margin:4px}pre{background:#111;color:#0f0;padding:10px;overflow:auto}</style>
</head><body>
<h1>Story-Idle Quick Play</h1>
<p>Minimal UI to test state, options and choices.</p>
<div>
  <button onclick="loadState()">Load State</button>
  <button onclick="loadOptions()">Get Options</button>
  <button onclick="tick()">Tick</button>
</div>
<h3>State</h3>
<pre id="state">(empty)</pre>
<h3>Options</h3>
<div id="opts"></div>
<script>
async function loadState(){ const r=await fetch('/state'); const j=await r.json(); stateEl().textContent=JSON.stringify(j,null,2) }
async function loadOptions(){ const r=await fetch('/options'); const j=await r.json(); const el=document.getElementById('opts'); el.innerHTML=''; (j.options||[]).forEach((o,i)=>{ const b=document.createElement('button'); b.textContent = (i+1)+') '+o.label; b.onclick=()=>choose(o.id); el.appendChild(b); }) }
async function choose(id){ const r=await fetch('/choose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); const j=await r.json(); stateEl().textContent=JSON.stringify(j.state,null,2) }
async function tick(){ const r=await fetch('/tick',{method:'POST'}); const j=await r.json(); stateEl().textContent=JSON.stringify(j.state,null,2) }
function stateEl(){ return document.getElementById('state') }
</script>
</body></html>`
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
}

const server = serve({
  port: PORT,
  fetch: async (req) => {
    const url = new URL(req.url)
    const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    if (req.method === 'OPTIONS') return new Response(null, { headers })

    if (url.pathname === '/') {
      return new Response(htmlUI(), { headers: { 'content-type': 'text/html' } })
    }

    if (url.pathname === '/health' && req.method === 'GET') {
      const s = loadState()
      return json({ status: 'ok', service: 'Story-Idle API', version: 1, uptime: process.uptime(), xp: s.xp, level: s.level })
    }

    if (url.pathname === '/state' && req.method === 'GET') {
      return json({ state: loadState() })
    }

    if (url.pathname === '/options' && req.method === 'GET') {
      const s = loadState()
      return json({ options: generateOptions(s) })
    }

    if (url.pathname === '/choose' && req.method === 'POST') {
      const body = await req.json().catch(() => ({})) as any
      const s = loadState()
      const opts = generateOptions(s)
      let selected = opts[0]
      if (body?.id) {
        const found = opts.find(o => o.id === body.id)
        if (found) selected = found
      } else if (typeof body?.index === 'number' && body.index >=0 && body.index < opts.length) {
        selected = opts[body.index]
      }
      const before = s.stats
      s.stats = applyExpected(s.stats, (selected as any).expected || {})
      const delta = Object.entries((selected as any).expected || {}).map(([k,v])=>`${k}:${v}`).join(', ')
      s.xp += 20
      s.level = computeLevel(s.xp)
      s.lastUpdated = Date.now()
      s.log.push(`Chose: ${selected.label} (+20xp, ${delta||'no changes'})`)
      saveState(s)
      return json({ ok: true, choice: selected, state: s })
    }

    if (url.pathname === '/tick' && req.method === 'POST') {
      const s = loadState()
      s.xp += 5
      s.stats.peace = clamp(s.stats.peace + 1)
      s.level = computeLevel(s.xp)
      s.lastUpdated = Date.now()
      s.log.push('Tick: passive growth (+5xp, +1 peace)')
      saveState(s)
      return json({ ok: true, state: s })
    }

    return new Response('Not found', { status: 404 })
  }
})

console.log(` Story-Idle API running on port ${server.port}`)
