#!/usr/bin/env bun
/**
 * 📔 System Diary Service (Separate from main API)
 * Port 3002 - Auto-creates daily entries with Groq AI
 */

import { Database } from 'bun:sqlite'
import { randomUUID } from 'crypto'

const DB_PATH = './data/toobix-unified.db'
const PORT = 3002
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''

console.log('📔 Diary Service starting...\n')

// Open database (read-write mode)
const db = new Database(DB_PATH)

// Initialize diary table
try {
  db.run(`
    CREATE TABLE IF NOT EXISTS system_diary (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      day_number INTEGER,
      mood TEXT,
      stats TEXT,
      ai_reflection TEXT,
      version INTEGER DEFAULT 8,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('✅ Diary table initialized')
} catch (error) {
  console.error('❌ Table init error:', error)
}

// === HELPER FUNCTIONS ===

function getDiaryStats() {
  try {
    const people = db.query('SELECT COUNT(*) as count FROM people').get() as any
    const interactions = db.query('SELECT COUNT(*) as count FROM interactions').get() as any
    const moments = db.query('SELECT COUNT(*) as count FROM moments').get() as any
    const circles = db.query('SELECT COUNT(*) as count FROM circles').get() as any
    
    const loveResult = db.query('SELECT COALESCE(SUM(love_points), 0) as total FROM interactions').get() as any
    
    // Calculate peace from sentiment
    const sentimentStats = db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral
      FROM interactions
    `).get() as any
    
    let peaceLevel = 92
    if (sentimentStats && sentimentStats.total > 0) {
      const positiveRatio = (sentimentStats.positive || 0) / sentimentStats.total
      const neutralRatio = (sentimentStats.neutral || 0) / sentimentStats.total
      peaceLevel = Math.round((positiveRatio * 100) + (neutralRatio * 70))
    }

    return {
      people: people?.count || 0,
      interactions: interactions?.count || 0,
      moments: moments?.count || 0,
      circles: circles?.count || 0,
      lovePoints: Math.round(loveResult?.total || 0),
      peaceLevel: peaceLevel,
      storyLevel: 5
    }
  } catch (error) {
    console.error('Stats error:', error)
    return {
      people: 0,
      interactions: 0,
      moments: 0,
      circles: 0,
      lovePoints: 0,
      peaceLevel: 92,
      storyLevel: 5
    }
  }
}

function calculateMood(stats: any): string {
  const score = (stats.lovePoints + stats.peaceLevel) / 2
  if (score >= 90) return 'Fantastic'
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Great'
  if (score >= 60) return 'Good'
  if (score >= 50) return 'Okay'
  if (score >= 40) return 'Fair'
  if (score >= 30) return 'Meh'
  if (score >= 20) return 'Poor'
  return 'Bad'
}

async function generateAIReflection(stats: any, dayNumber: number): Promise<string> {
  const fallbacks = [
    `Tag ${dayNumber}: ${stats.interactions} wertvolle Interaktionen mit ${stats.people} Menschen. Jede Begegnung ist ein Geschenk 💝`,
    `${stats.people} Menschen in deinem Leben, ${stats.lovePoints} Love Points gesammelt. Du bist auf dem richtigen Weg! 🌟`,
    `Peace Level bei ${stats.peaceLevel}% - Harmonie wächst mit jedem Tag. Weiter so! 🕊️`,
    `Tag ${dayNumber}: Vom Ich zum Wir, vom Wir zum Ich. Die Reise geht weiter! 🎈`
  ]
  const fallback = fallbacks[dayNumber % fallbacks.length] || fallbacks[0]
  
  if (!GROQ_API_KEY) {
    console.log('⚠️  No Groq API key, using fallback')
    return fallback
  }

  try {
    console.log('🤖 Calling Groq API...')
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{
          role: 'system',
          content: 'Du bist Luna, eine weise KI-Begleiterin. Erstelle kurze, inspirierende Tagesreflexionen (max 100 Wörter) auf Deutsch.'
        }, {
          role: 'user',
          content: `Tag ${dayNumber}: ${stats.people} Menschen, ${stats.interactions} Interaktionen, ${stats.lovePoints} Love Points, ${stats.peaceLevel}% Peace. Erstelle eine kurze inspirierende Reflexion.`
        }],
        temperature: 0.8,
        max_tokens: 150
      })
    })

    if (response.ok) {
      const data = await response.json() as any
      const reflection = data.choices?.[0]?.message?.content
      if (reflection) {
        console.log('✅ Groq AI reflection generated!')
        return reflection
      }
    } else {
      console.log(`⚠️  Groq API error ${response.status}, using fallback`)
    }
  } catch (error) {
    console.error('❌ Groq error:', error)
  }
  
  return fallback
}

// === HTTP SERVER ===

const server = Bun.serve({
  port: PORT,
  
  async fetch(req) {
    const url = new URL(req.url)
    
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }
    
    // GET /api/diary/today
    if (url.pathname === '/api/diary/today' && req.method === 'GET') {
      try {
        const today = new Date().toISOString().split('T')[0]
        let row = db.query('SELECT * FROM system_diary WHERE date = ?').get(today) as any
        
        // Auto-create if doesn't exist
        if (!row) {
          console.log(`📝 Creating diary entry for ${today}...`)
          
          const stats = getDiaryStats()
          const mood = calculateMood(stats)
          
          const firstEntry = db.query('SELECT MIN(date) as first FROM system_diary').get() as any
          const dayNumber = firstEntry?.first 
            ? Math.floor((Date.now() - new Date(firstEntry.first).getTime()) / (1000 * 60 * 60 * 24)) + 1
            : 1
          
          const aiReflection = await generateAIReflection(stats, dayNumber)
          const id = randomUUID()
          
          db.run(`
            INSERT INTO system_diary (id, date, day_number, mood, stats, ai_reflection)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [id, today, dayNumber, mood, JSON.stringify(stats), aiReflection])
          
          console.log(`✅ Entry created: Day ${dayNumber}, Mood: ${mood}`)
          
          row = { 
            id, 
            date: today, 
            day_number: dayNumber, 
            mood, 
            stats: JSON.stringify(stats), 
            ai_reflection: aiReflection, 
            version: 8, 
            created_at: new Date().toISOString() 
          }
        }
        
        const entry = {
          id: row.id,
          date: row.date,
          dayNumber: row.day_number,
          mood: row.mood,
          stats: JSON.parse(row.stats),
          aiReflection: row.ai_reflection,
          version: row.version || 8,
          createdAt: row.created_at
        }
        
        return new Response(JSON.stringify(entry), { headers })
      } catch (error) {
        console.error('❌ /today error:', error)
        return new Response(JSON.stringify({ 
          error: String(error),
          fallback: {
            id: 'error',
            date: new Date().toISOString().split('T')[0],
            dayNumber: 1,
            mood: 'Good',
            stats: { people: 0, interactions: 0, lovePoints: 0, peaceLevel: 92, storyLevel: 5 },
            aiReflection: 'Service lädt... Bitte aktualisiere die Seite.',
            version: 8,
            createdAt: new Date().toISOString()
          }
        }), { status: 500, headers })
      }
    }
    
    // GET /api/diary/all
    if (url.pathname === '/api/diary/all' && req.method === 'GET') {
      try {
        const rows = db.query('SELECT * FROM system_diary ORDER BY date DESC LIMIT 30').all() as any[]
        const entries = rows.map(row => ({
          id: row.id,
          date: row.date,
          dayNumber: row.day_number,
          mood: row.mood,
          stats: JSON.parse(row.stats),
          aiReflection: row.ai_reflection,
          version: row.version || 8,
          createdAt: row.created_at
        }))
        
        return new Response(JSON.stringify(entries), { headers })
      } catch (error) {
        console.error('❌ /all error:', error)
        return new Response(JSON.stringify({ error: String(error) }), { 
          status: 500, 
          headers 
        })
      }
    }
    
    // POST /api/diary/create
    if (url.pathname === '/api/diary/create' && req.method === 'POST') {
      try {
        const today = new Date().toISOString().split('T')[0]
        
        // Delete existing
        db.run('DELETE FROM system_diary WHERE date = ?', [today])
        console.log(`🔄 Recreating entry for ${today}...`)
        
        const stats = getDiaryStats()
        const mood = calculateMood(stats)
        
        const firstEntry = db.query('SELECT MIN(date) as first FROM system_diary').get() as any
        const dayNumber = firstEntry?.first 
          ? Math.floor((Date.now() - new Date(firstEntry.first).getTime()) / (1000 * 60 * 60 * 24)) + 1
          : 1
        
        const aiReflection = await generateAIReflection(stats, dayNumber)
        const id = randomUUID()
        
        db.run(`
          INSERT INTO system_diary (id, date, day_number, mood, stats, ai_reflection)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [id, today, dayNumber, mood, JSON.stringify(stats), aiReflection])
        
        const entry = {
          id,
          date: today,
          dayNumber,
          mood,
          stats,
          aiReflection,
          version: 8,
          createdAt: new Date().toISOString()
        }
        
        console.log(`✅ Entry recreated with fresh AI reflection`)
        
        return new Response(JSON.stringify(entry), { headers })
      } catch (error) {
        console.error('❌ /create error:', error)
        return new Response(JSON.stringify({ error: String(error) }), { 
          status: 500, 
          headers 
        })
      }
    }
    
    // 404
    return new Response(JSON.stringify({ 
      error: 'Not found',
      endpoints: [
        'GET  /api/diary/today',
        'GET  /api/diary/all',
        'POST /api/diary/create'
      ]
    }), { status: 404, headers })
  }
})

console.log(`✅ Diary Service running on http://localhost:${PORT}`)
console.log('\n📔 Diary Endpoints:')
console.log('   GET  /api/diary/today  - Heutiger Eintrag (auto-create)')
console.log('   GET  /api/diary/all    - Letzte 30 Einträge')
console.log('   POST /api/diary/create - Neu erstellen (force)')
console.log('\n💡 Press Ctrl+C to stop\n')
