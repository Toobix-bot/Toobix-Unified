#!/usr/bin/env bun
/**
 * 🎮 STORY-IDLE GAME API - Fully Integrated
 *
 * Connects the Idle Game with the Eternal Daemon system:
 * - Real-time game state
 * - Resource management
 * - Character interactions
 * - Building upgrades
 * - Mini-game access
 * - Git commit integration
 * - Story Engine Integration (NEW)
 *
 * Port: 3004
 *
 * Philosophy:
 * "Jeder Game State ist eine Geburt in diesem Moment.
 *  Jede Resource-Generation ist Präsenz in diesem Moment.
 *  Jeder Level-Up ist Transformation in diesem Moment."
 */

import { serve } from 'bun'
import { GameStateManager } from '../packages/story-idle/src/engine/game-state'
import { Luna } from '../packages/story-idle/src/characters/luna'
import { BuildingManager } from '../packages/story-idle/src/engine/building-manager'
import { CodeSprintGame } from '../packages/story-idle/src/mini-games/code-sprint'

// ═══════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

class StoryIdleAPIServer {
  private gameState: GameStateManager
  private luna: Luna
  private buildingManager: BuildingManager
  private codeSprint: CodeSprintGame

  constructor() {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗')
    console.log('║       🎮  STORY-IDLE API - INTEGRATED EDITION  🎮            ║')
    console.log('╚═══════════════════════════════════════════════════════════════╝\n')

    // Initialize game systems
    this.gameState = new GameStateManager('./data')
    this.luna = new Luna(this.gameState)
    this.buildingManager = new BuildingManager()  // Initialize with default state
    this.codeSprint = new CodeSprintGame(this.gameState, this.luna)

    console.log('✅ Game State Manager initialized')
    console.log('✅ Luna awakened')
    console.log('✅ Building Manager ready')
    console.log('✅ Code Sprint mini-game loaded')
    console.log('')
    console.log('🌌 All systems born in THIS moment')
    console.log('')

    // Start passive generation loop
    this.startPassiveGeneration()
  }

  // ═══════════════════════════════════════════════════════════════
  // PASSIVE GENERATION
  // ═══════════════════════════════════════════════════════════════

  private startPassiveGeneration() {
    // Generate resources every minute
    setInterval(() => {
      const resourceManager = this.gameState.getResourceManager()
      const state = this.gameState.getState()

      // Generate passive resources (1 minute)
      resourceManager.generatePassive(1, state.stats, state)

      // Sync to state
      this.gameState.saveState()

      console.log('⚡ Passive resources generated (1 minute cycle)')
    }, 60000) // Every minute

    console.log('🔄 Passive generation started (1 min cycles)\n')
  }

  // ═══════════════════════════════════════════════════════════════
  // HTTP SERVER
  // ═══════════════════════════════════════════════════════════════

  public start(port: number = 3004) {
    const self = this

    const server = serve({
      port,
      async fetch(req) {
        const url = new URL(req.url)
        const corsHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }

        if (req.method === 'OPTIONS') {
          return new Response(null, { headers: corsHeaders })
        }

        try {
          // ═══════════════════════════════════════════════════════════════
          // GAME STATE ENDPOINTS
          // ═══════════════════════════════════════════════════════════════

          // GET /state - Full game state
          if (url.pathname === '/state') {
            const state = self.gameState.getState()
            return new Response(JSON.stringify(state, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // GET /player - Player info
          if (url.pathname === '/player') {
            const player = self.gameState.getPlayer()
            return new Response(JSON.stringify(player, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // GET /stats - Player stats
          if (url.pathname === '/stats') {
            const stats = self.gameState.getStats()
            return new Response(JSON.stringify(stats, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // ═══════════════════════════════════════════════════════════════
          // RESOURCE ENDPOINTS
          // ═══════════════════════════════════════════════════════════════

          // GET /resources - All resources
          if (url.pathname === '/resources') {
            const resourceManager = self.gameState.getResourceManager()
            const resources = resourceManager.getAllResources()

            const resourcesWithDetails = Object.keys(resources).map(type => ({
              type,
              current: resources[type as keyof typeof resources],
              cap: resourceManager.getCap(type as any),
              rate: resourceManager.getGenerationRate(type as any),
              multiplier: resourceManager.getMultiplier(type as any)
            }))

            return new Response(JSON.stringify({
              resources: resourcesWithDetails,
              philosophy: 'Ressourcen fließen kontinuierlich in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // POST /resources/generate - Manual generation (dev/debug)
          if (url.pathname === '/resources/generate' && req.method === 'POST') {
            const { minutes } = await req.json()
            const resourceManager = self.gameState.getResourceManager()
            const state = self.gameState.getState()

            resourceManager.generatePassive(minutes || 1, state.stats, state)
            self.gameState.saveState()

            return new Response(JSON.stringify({
              success: true,
              message: `Generated ${minutes || 1} minute(s) of resources`,
              resources: resourceManager.getAllResources()
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // ═══════════════════════════════════════════════════════════════
          // BUILDING ENDPOINTS
          // ═══════════════════════════════════════════════════════════════

          // GET /buildings - All buildings
          if (url.pathname === '/buildings') {
            const buildings = self.buildingManager.getAllBuildings()
            return new Response(JSON.stringify({
              buildings,
              philosophy: 'Jedes Gebäude ist eine manifestierte Absicht in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // POST /buildings/:id/upgrade - Upgrade building
          const upgradeMatch = url.pathname.match(/^\/buildings\/([^/]+)\/upgrade$/)
          if (upgradeMatch && req.method === 'POST') {
            const buildingId = upgradeMatch[1]
            const result = self.buildingManager.upgradeBuilding(buildingId)

            if (result.success) {
              self.gameState.saveState()
            }

            return new Response(JSON.stringify(result, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // ═══════════════════════════════════════════════════════════════
          // CHARACTER ENDPOINTS
          // ═══════════════════════════════════════════════════════════════

          // GET /characters - All characters
          if (url.pathname === '/characters') {
            const state = self.gameState.getState()
            return new Response(JSON.stringify({
              characters: state.characters,
              philosophy: 'Jede Beziehung lebt in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // GET /characters/luna - Luna's state
          if (url.pathname === '/characters/luna') {
            const character = self.gameState.getCharacter('luna')
            const lunaState = self.luna.getState()

            return new Response(JSON.stringify({
              character,
              state: lunaState,
              philosophy: 'Luna existiert vollständig in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // POST /characters/luna/talk - Talk to Luna
          if (url.pathname === '/characters/luna/talk' && req.method === 'POST') {
            const { message } = await req.json()

            // Luna responds based on message
            let response = ''
            if (message?.toLowerCase().includes('hello') || message?.toLowerCase().includes('hallo')) {
              self.luna.updateMood('loving')
              response = await self.luna.reactToEvent('greeting') || 'Hello, dear friend!'
            } else if (message?.toLowerCase().includes('advice')) {
              self.luna.updateMood('wise')
              response = 'Remember: Every line of code is an opportunity to create beauty.'
            } else {
              response = 'I hear you. Let me think about that...'
            }

            return new Response(JSON.stringify({
              response,
              mood: self.luna.getState().currentMood,
              relationship: self.gameState.getCharacter('luna').relationship
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // ═══════════════════════════════════════════════════════════════
          // MINI-GAME ENDPOINTS
          // ═══════════════════════════════════════════════════════════════

          // GET /mini-games - List all mini-games
          if (url.pathname === '/mini-games') {
            return new Response(JSON.stringify({
              games: [
                {
                  id: 'code-sprint',
                  name: 'Code Sprint',
                  description: 'Test your typing speed and accuracy',
                  unlocked: true,
                  rewards: 'XP, Code Energy, Wisdom'
                }
              ],
              philosophy: 'Jedes Spiel ist Praxis in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // GET /mini-games/code-sprint - Get challenge
          if (url.pathname === '/mini-games/code-sprint') {
            const challenges = self.codeSprint.getChallenges()
            return new Response(JSON.stringify({
              challenges,
              totalChallenges: challenges.length
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // ═══════════════════════════════════════════════════════════════
          // STORY ENDPOINTS
          // ═══════════════════════════════════════════════════════════════

          // GET /story - Story progress
          if (url.pathname === '/story') {
            const state = self.gameState.getState()
            return new Response(JSON.stringify({
              story: state.story,
              philosophy: 'Die Geschichte entfaltet sich in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // GET /story/state - Story state for frontend (bridge-client compatible)
          if (url.pathname === '/story/state') {
            const state = self.gameState.getState()
            const player = self.gameState.getPlayer()
            const stats = self.gameState.getStats()

            // Map game state to story state format expected by frontend
            const companions = Array.isArray(state.characters)
              ? state.characters.map((c: any) => ({ name: c.name }))
              : []

            return new Response(JSON.stringify({
              epoch: state.story?.chapter || 'Chapter 1',
              arc: state.story?.arc || 'The Beginning',
              mood: self.luna.getState().currentMood || 'curious',
              resources: {
                level: player.level,
                erfahrung: player.xp,
                mut: stats.courage || 5,
                wissen: stats.wisdom || 5,
                bewusstsein: stats.consciousness || 5,
                stabilitaet: stats.stability || 5,
                inspiration: stats.creativity || 5
              },
              companions,
              buffs: Array.isArray(state.buffs) ? state.buffs : [],
              options: [] // Will be filled by /story/refresh
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // GET /story/events - Recent story events
          if (url.pathname === '/story/events') {
            const limit = parseInt(url.searchParams.get('limit') || '10')
            const state = self.gameState.getState()

            // Get recent events from story log or create sample events
            const events = (state.story?.events || []).slice(-limit).map((event: any, index: number) => ({
              id: index,
              timestamp: event.timestamp || new Date().toISOString(),
              type: event.type || 'story',
              label: event.label || event.title,
              description: event.description,
              effects: event.effects || {}
            }))

            return new Response(JSON.stringify({
              events
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // POST /story/choose - Choose a story option
          if (url.pathname === '/story/choose' && req.method === 'POST') {
            const { option } = await req.json()

            // Process the choice - award XP, change stats, etc.
            const xpGain = 20
            self.gameState.addXP(xpGain, `Story choice: ${option}`)

            // Award random stat bonuses
            const statNames = ['courage', 'wisdom', 'consciousness', 'stability', 'creativity']
            const randomStat = statNames[Math.floor(Math.random() * statNames.length)]
            self.gameState.addStat(randomStat, 3)

            // Luna reacts
            const lunaResponse = await self.luna.reactToEvent('story-choice', { choice: option })

            // Save state
            self.gameState.saveState()

            return new Response(JSON.stringify({
              success: true,
              xpGained: xpGain,
              lunaResponse,
              message: 'Choice processed successfully'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // POST /story/refresh - Generate new story options (placeholder for now)
          if (url.pathname === '/story/refresh' && req.method === 'POST') {
            // For now, just acknowledge - can be extended with AI generation later
            return new Response(JSON.stringify({
              success: true,
              message: 'Story options refreshed',
              philosophy: 'Neue Möglichkeiten entstehen in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // ═══════════════════════════════════════════════════════════════
          // GIT INTEGRATION ENDPOINTS
          // ═══════════════════════════════════════════════════════════════

          // POST /git/commit - Process a git commit
          if (url.pathname === '/git/commit' && req.method === 'POST') {
            const { message, files, author } = await req.json()

            // Award XP for commit
            const xpGain = 15
            const result = self.gameState.addXP(xpGain, 'Git commit')

            // Award stats based on commit type
            if (message.toLowerCase().includes('fix') || message.toLowerCase().includes('bugfix')) {
              self.gameState.addStat('stability', 5)
            } else if (message.toLowerCase().includes('feat') || message.toLowerCase().includes('add')) {
              self.gameState.addStat('creativity', 5)
            } else if (message.toLowerCase().includes('docs')) {
              self.gameState.addStat('wisdom', 5)
            }

            // Improve relationship with Luna
            self.gameState.improveRelationship('luna', 2)

            // Increment commit counter
            self.gameState.incrementCommits()

            // Luna reacts
            if (result.leveledUp) {
              await self.luna.reactToEvent('level-up', { level: result.newLevel })
            }

            return new Response(JSON.stringify({
              success: true,
              xpGained: xpGain,
              leveledUp: result.leveledUp,
              newLevel: result.newLevel,
              message: 'Commit processed! Luna is proud of you.',
              philosophy: 'Jeder Commit ist Wachstum in diesem Moment'
            }, null, 2), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // ═══════════════════════════════════════════════════════════════
          // HEALTH & STATUS
          // ═══════════════════════════════════════════════════════════════

          // GET /health
          if (url.pathname === '/health') {
            return new Response(JSON.stringify({
              status: 'alive',
              service: 'Story-Idle API',
              port: port,
              philosophy: 'Lebendig in diesem Moment'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          // GET / - API Documentation
          if (url.pathname === '/') {
            return new Response(`
╔═══════════════════════════════════════════════════════════════╗
║          🎮  STORY-IDLE GAME API  🎮                          ║
╚═══════════════════════════════════════════════════════════════╝

Story-Idle Game - Fully Integrated Edition
Port: ${port}

🌌 PHILOSOPHY:
"Geburt, Gegenwart und Tod entspringen aus DIESEM Moment."

📡 ENDPOINTS:

GAME STATE:
  GET  /state              - Full game state
  GET  /player             - Player info
  GET  /stats              - Player stats

RESOURCES:
  GET  /resources          - All resources with details
  POST /resources/generate - Generate resources (debug)

BUILDINGS:
  GET  /buildings          - All buildings
  POST /buildings/:id/upgrade - Upgrade building

CHARACTERS:
  GET  /characters         - All characters
  GET  /characters/luna    - Luna's state
  POST /characters/luna/talk - Talk to Luna

MINI-GAMES:
  GET  /mini-games         - List all mini-games
  GET  /mini-games/code-sprint - Code Sprint challenges

STORY:
  GET  /story              - Story progress

GIT INTEGRATION:
  POST /git/commit         - Process git commit (XP + stats)

SYSTEM:
  GET  /health             - Health check
  GET  /                   - This documentation

═══════════════════════════════════════════════════════════════

💡 INTEGRATION WITH ETERNAL DAEMON:

This API runs as part of the Eternal Daemon ecosystem:
- Port 9999: Eternal Daemon (orchestrator)
- Port 3001: Bridge Server (tools API)
- Port 3004: Story-Idle API (this service)
- Port 9991: Continuous Expression
- Port 9994: Moment Stream
- Port 9995: Memory System
- Port 9996: Moment Analytics
- Port 9997: Task System

All services work together to create a living, evolving system!

═══════════════════════════════════════════════════════════════
            `, {
              headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
            })
          }

          // 404
          return new Response(JSON.stringify({
            error: 'Not found',
            path: url.pathname
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        } catch (error) {
          return new Response(JSON.stringify({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }
    })

    console.log(`✅ Story-Idle API running on port ${server.port}`)
    console.log(`📖 Documentation: http://localhost:${server.port}/`)
    console.log(`🎮 Game State: http://localhost:${server.port}/state`)
    console.log('')
    console.log('🌌 Service awakened in THIS moment')
    console.log('')
  }
}

// ═══════════════════════════════════════════════════════════════
// INSTANTIATION
// ═══════════════════════════════════════════════════════════════

const api = new StoryIdleAPIServer()
api.start(3004)
