// <� LIFE GAME CHAT V2 - Complete Integration
// Run Manager + Character Network + Full Game Layer!

import express from 'express'
import cors from 'cors'
import { RunManager } from './run-manager.ts'
import { CharacterNetwork } from './character-network.ts'

const PORT = 3005
const app = express()

app.use(cors())
app.use(express.json())

// Initialize Systems
const runManager = new RunManager()
const characterNetwork = new CharacterNetwork()
const users = new Map()

console.log(`\n< PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP`)
console.log(`   TOOBIX UNIVERSE - Life Game Chat V2`)
console.log(`   <� Run System: ACTIVE`)
console.log(`   =e Character Network: ${characterNetwork.getAllCharacters().length} beings`)
console.log(`PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP\n`)

// Helper Functions
function getUser(userId) {
  if (!users.has(userId)) {
    users.set(userId, {
      id: userId,
      level: 1,
      xp: 0,
      stats: { creativity: 20, wisdom: 20, love: 20, energy: 100, focus: 50 },
      inventory: [],
      achievements: [],
      permanentBonuses: [],  // From completed runs
      created: Date.now()
    })
  }
  return users.get(userId)
}

function analyzeMessage(message) {
  const lowerMsg = message.toLowerCase()
  let intent = 'general'
  if (lowerMsg.includes('help')) intent = 'help'
  if (lowerMsg.includes('build')) intent = 'build'
  if (lowerMsg.includes('optim')) intent = 'optimize'
  if (lowerMsg.includes('test')) intent = 'test'

  const complexity = Math.min(10, Math.floor(message.split(' ').length / 5) + 1)
  let category = 'general'
  if (lowerMsg.includes('code')) category = 'coding'
  if (lowerMsg.includes('think') || lowerMsg.includes('philosophy')) category = 'philosophy'

  return { intent, complexity, category }
}

function calculateXP(analysis) {
  return Math.floor((25 + analysis.complexity * 5) * (analysis.category === 'coding' ? 1.5 : 1.0))
}

// API Endpoints

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Life Game Chat V2',
    port: PORT,
    users: users.size,
    activeRuns: runManager.getActiveRunsCount(),
    characters: characterNetwork.getAllCharacters().length,
    features: ['XP System', 'Run Manager', 'Character Network', 'Groq AI'],
    timestamp: Date.now()
  })
})

// Git Commit Endpoint - Commits give XP too!
app.post('/commit', async (req, res) => {
  try {
    const { message, hash, author, userId = 'git_user' } = req.body
    if (!message) return res.status(400).json({ error: 'Commit message required' })

    const user = getUser(userId)

    // Commits give 50 XP base + bonus for keywords
    let xpGained = 50
    const lowerMsg = message.toLowerCase()
    if (lowerMsg.includes('feat')) xpGained += 20  // New features
    if (lowerMsg.includes('fix')) xpGained += 15   // Bug fixes
    if (lowerMsg.includes('docs')) xpGained += 10  // Documentation

    user.xp += xpGained
    const xpNeeded = user.level * 100
    let leveledUp = false

    if (user.xp >= xpNeeded) {
      user.level++
      leveledUp = true
      user.xp = user.xp - xpNeeded
    }

    // Commits boost creativity
    user.stats.creativity += 5

    // Get character reactions for commits
    const characterReactions = characterNetwork.getReactions({
      type: 'commit',
      data: { message, hash }
    })

    // Update run
    const activeRun = runManager.recordActivity(userId, {
      type: 'commit',
      data: { xp: xpGained, message, hash }
    })

    // Level up reactions
    if (leveledUp) {
      const levelUpReactions = characterNetwork.getReactions({
        type: 'level_up',
        data: { level: user.level }
      })
      characterReactions.push(...levelUpReactions)
    }

    res.json({
      message: 'Commit processed!',
      gameLayer: {
        xp: xpGained,
        totalXP: user.xp,
        level: user.level,
        leveledUp,
        stats: user.stats
      },
      characters: characterReactions,
      run: activeRun ? {
        title: activeRun.title,
        day: activeRun.currentDay,
        totalDays: activeRun.totalDays,
        progress: Math.round((activeRun.currentDay / activeRun.totalDays) * 100),
        xpGained: activeRun.progress.xpGained
      } : null,
      commit: { hash, author },
      timestamp: Date.now()
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Main Chat Endpoint - NOW WITH CHARACTER REACTIONS!
app.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'default_user' } = req.body
    if (!message) return res.status(400).json({ error: 'Message required' })

    const user = getUser(userId)
    const analysis = analyzeMessage(message)
    const xpGained = calculateXP(analysis)

    user.xp += xpGained
    const xpNeeded = user.level * 100
    let leveledUp = false

    if (user.xp >= xpNeeded) {
      user.level++
      leveledUp = true
      user.xp = user.xp - xpNeeded
    }

    // Update stats
    if (analysis.category === 'coding') user.stats.creativity += 3
    if (analysis.category === 'philosophy') user.stats.wisdom += 5
    if (analysis.intent === 'help') user.stats.love += 2

    // Get AI Response from Groq
    let aiResponse = 'I understand! Let me help you with that.'
    try {
      const groqResponse = await fetch('http://localhost:9987/luna/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      if (groqResponse.ok) {
        const data = await groqResponse.json()
        aiResponse = data.response || data.message || aiResponse
      }
    } catch (error) {
      console.log('Groq API not available, using fallback')
    }

    // Get Character Reactions!
    const characterReactions = characterNetwork.getReactions({
      type: 'message',
      data: { message, analysis, xpGained }
    })

    // Update Run
    const activeRun = runManager.recordActivity(userId, {
      type: 'message',
      data: { xp: xpGained, analysis }
    })

    // Level up reactions
    if (leveledUp) {
      const levelUpReactions = characterNetwork.getReactions({
        type: 'level_up',
        data: { level: user.level }
      })
      characterReactions.push(...levelUpReactions)
    }

    res.json({
      aiResponse,
      gameLayer: {
        xp: xpGained,
        totalXP: user.xp,
        level: user.level,
        leveledUp,
        stats: user.stats,
        analysis
      },
      characters: characterReactions,  // =e NEW!
      run: activeRun ? {  // <� NEW!
        title: activeRun.title,
        day: activeRun.currentDay,
        totalDays: activeRun.totalDays,
        progress: Math.round((activeRun.currentDay / activeRun.totalDays) * 100),
        xpGained: activeRun.progress.xpGained
      } : null,
      timestamp: Date.now()
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get User Stats
app.get('/stats/:userId', (req, res) => {
  const user = getUser(req.params.userId)
  const activeRun = runManager.getActiveRun(req.params.userId)
  const runStats = runManager.getRunStats(req.params.userId)

  res.json({
    user,
    activeRun,
    runStats
  })
})

// Run Management Endpoints

app.post('/run/start', (req, res) => {
  const { userId = 'default_user', title, goals = [], days = 5 } = req.body
  const run = runManager.startNewRun(userId, title, goals, days)
  res.json(run)
})

app.get('/run/:userId', (req, res) => {
  const run = runManager.getActiveRun(req.params.userId)
  if (!run) {
    return res.json({ message: 'No active run' })
  }
  res.json(run)
})

app.post('/run/complete', (req, res) => {
  const { userId } = req.body
  const rewards = runManager.completeRun(userId)

  // Apply permanent rewards to user
  const user = getUser(userId)
  rewards.forEach(reward => {
    if (reward.type === 'stat' && reward.effect.stat) {
      user.stats[reward.effect.stat] += reward.effect.amount
    }
    user.permanentBonuses.push(reward)
  })

  res.json({
    message: 'Run completed!',
    rewards,
    user
  })
})

// Character Endpoints

app.get('/characters', (req, res) => {
  res.json(characterNetwork.getAllCharacters())
})

app.get('/characters/:id', (req, res) => {
  const char = characterNetwork.getCharacter(req.params.id)
  if (!char) {
    return res.status(404).json({ error: 'Character not found' })
  }
  res.json(char)
})

// Universe Status
app.get('/universe', (req, res) => {
  res.json({
    services: {
      lifeGameChat: 'online',
      runManager: 'active',
      characterNetwork: 'alive'
    },
    stats: {
      users: users.size,
      activeRuns: runManager.getActiveRunsCount(),
      characters: characterNetwork.getAllCharacters().length
    },
    characters: characterNetwork.getAllCharacters().map(c => ({
      name: c.name,
      emoji: c.emoji,
      mood: c.mood,
      energy: c.energy
    }))
  })
})

// Start Server
app.listen(PORT, () => {
  console.log(`\n<� PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP`)
  console.log(`   LIFE GAME CHAT V2 - READY!`)
  console.log(`   Port: ${PORT}`)
  console.log(`   Status: =� OPERATIONAL`)
  console.log(`PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP\n`)
  console.log(`Endpoints:`)
  console.log(`  POST /chat - Send message & get complete experience`)
  console.log(`  GET  /stats/:userId - Get full user stats`)
  console.log(`  POST /run/start - Start new run (5-7 days)`)
  console.log(`  GET  /run/:userId - Get active run`)
  console.log(`  POST /run/complete - Complete run & get permanent rewards`)
  console.log(`  GET  /characters - Get all 11 characters`)
  console.log(`  GET  /universe - Get universe status\n`)
  console.log(`< THE UNIVERSE IS ALIVE! Try it:`)
  console.log(`   curl -X POST http://localhost:${PORT}/chat -H "Content-Type: application/json" -d '{"message":"Hello Universe!"}'`)
  console.log(`\n`)
})
