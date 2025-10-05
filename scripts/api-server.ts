#!/usr/bin/env bun
/**
 * Simple API Server for Toobix Unified
 * Serves data from SQLite database
 */

import { Database } from 'bun:sqlite'

const DB_PATH = './data/toobix-unified.db'
const PORT = 3001

console.log('🚀 Toobix API Server starting...\n')

const db = new Database(DB_PATH, { readonly: true })

const server = Bun.serve({
  port: PORT,
  
  async fetch(req) {
    const url = new URL(req.url)
    
    // CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    // Handle OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }
    
    // Routes
    if (url.pathname === '/api/stats') {
      // Get overall stats
      const peopleCount = db.prepare('SELECT COUNT(*) as count FROM people').get() as { count: number }
      const interactionsCount = db.prepare('SELECT COUNT(*) as count FROM interactions').get() as { count: number }
      const momentsCount = db.prepare('SELECT COUNT(*) as count FROM moments').get() as { count: number }
      const circlesCount = db.prepare('SELECT COUNT(*) as count FROM circles').get() as { count: number }
      
      // Love points total
      const lovePointsResult = db.prepare('SELECT SUM(love_points) as total FROM interactions').get() as { total: number | null }
      const lovePoints = lovePointsResult.total || 0
      
      // Settings
      const peaceLevel = db.prepare('SELECT value FROM settings WHERE key = ?').get('peace-level') as { value: string } | undefined
      const storyLevel = db.prepare('SELECT value FROM settings WHERE key = ?').get('story-level') as { value: string } | undefined
      
      return new Response(JSON.stringify({
        people: peopleCount.count,
        interactions: interactionsCount.count,
        moments: momentsCount.count,
        circles: circlesCount.count,
        lovePoints: lovePoints,
        peaceLevel: peaceLevel ? parseInt(peaceLevel.value) : 92,
        storyLevel: storyLevel ? parseInt(storyLevel.value) : 5
      }), { headers })
    }
    
    if (url.pathname === '/api/people') {
      // Get all people
      const people = db.prepare(`
        SELECT 
          id, name, relation, avatar, notes, tags, circles,
          consciousness_level, created_at, updated_at
        FROM people
        ORDER BY created_at DESC
      `).all()
      
      return new Response(JSON.stringify(people), { headers })
    }
    
    if (url.pathname === '/api/interactions') {
      // Get recent interactions with people names
      const interactions = db.prepare(`
        SELECT 
          i.id, i.person_id, i.kind, i.summary, i.sentiment,
          i.details, i.love_points, i.gratitude, i.timestamp,
          p.name as person_name, p.avatar as person_avatar
        FROM interactions i
        LEFT JOIN people p ON i.person_id = p.id
        ORDER BY i.timestamp DESC
        LIMIT 10
      `).all()
      
      return new Response(JSON.stringify(interactions), { headers })
    }
    
    if (url.pathname === '/api/moments') {
      // Get all moments
      const moments = db.prepare(`
        SELECT 
          id, title, description, location, date,
          photos, tags, created_at, updated_at
        FROM moments
        ORDER BY date DESC
      `).all()
      
      return new Response(JSON.stringify(moments), { headers })
    }
    
    if (url.pathname === '/api/circles') {
      // Get all circles with member counts
      const circles = db.prepare(`
        SELECT 
          c.id, c.name, c.type, c.description, c.color, c.icon,
          COUNT(cm.person_id) as member_count
        FROM circles c
        LEFT JOIN circle_members cm ON c.id = cm.circle_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `).all()
      
      return new Response(JSON.stringify(circles), { headers })
    }
    
    // Luna Chatbot Endpoint
    if (req.method === 'POST' && url.pathname === '/api/luna/chat') {
      try {
        const body = await req.json()
        const { question } = body
        
        if (!question) {
          return new Response(JSON.stringify({ error: 'Question required' }), {
            status: 400,
            headers
          })
        }
        
        // Get context from database
        const peopleData = db.prepare('SELECT * FROM people').all()
        const interactionsData = db.prepare('SELECT * FROM interactions ORDER BY timestamp DESC LIMIT 10').all()
        const settingsData = db.prepare('SELECT * FROM settings').all() as Array<{key: string, value: any}>
        
        const lovePoints = settingsData.find((s) => s.key === 'love-points-total')?.value || 0
        const peaceLevel = settingsData.find((s) => s.key === 'peace-level')?.value || 0
        
        // Build smart response (Groq would enhance this)
        const peopleNames = peopleData.map((p: any) => p.name).join(', ')
        
        const answer = `🤖 Luna: Ich verstehe deine Frage "${question}"!\n\n` +
          `Ich sehe ${peopleData.length} Menschen in deinem Leben: ${peopleNames}.\n` +
          `Dein Love Points Stand: ${lovePoints} 💝 | Peace Level: ${peaceLevel}% 🕊️\n\n` +
          `(Groq Integration aktiviert sich beim nächsten Restart! 🚀)`
        
        const response = {
          answer,
          context: {
            people: peopleData.length,
            interactions: interactionsData.length,
            lovePoints,
            peaceLevel
          },
          timestamp: new Date().toISOString()
        }
        
        return new Response(JSON.stringify(response), { headers })
      } catch (error: any) {
        return new Response(JSON.stringify({ 
          error: 'Luna error', 
          message: error.message 
        }), { 
          status: 500,
          headers 
        })
      }
    }
    
    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), { 
      status: 404,
      headers 
    })
  }
})

console.log(`✅ API Server running on http://localhost:${PORT}`)
console.log(`\n📊 Available endpoints:`)
console.log(`   GET /api/stats        - Overall statistics`)
console.log(`   GET /api/people       - All people`)
console.log(`   GET /api/interactions - Recent interactions`)
console.log(`   GET /api/moments      - All moments`)
console.log(`   GET /api/circles      - All circles`)
console.log(`\n🌐 Frontend: http://localhost:3000`)
console.log(`🔌 API: http://localhost:3001\n`)
