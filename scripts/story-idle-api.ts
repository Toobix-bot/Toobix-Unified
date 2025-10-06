#!/usr/bin/env bun
/**
 * STORY-IDLE GAME API SERVER
 * 
 * Exposes Story-Idle Game State via REST API
 * Allows Dashboard to interact with game
 * 
 * Port: 3004
 */

import { serve } from 'bun'
import { GameStateManager } from '../packages/story-idle/src/engine/game-state'
import { Luna } from '../packages/story-idle/src/characters/luna'

class StoryIdleAPIServer {
  private game: GameStateManager
  private luna: Luna

  constructor() {
    this.game = new GameStateManager()
    this.luna = new Luna(this.game)
  }

  async start() {
    const server = serve({
      port: 3004,
      async fetch(req) {
        const url = new URL(req.url)
        const path = url.pathname

        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        }

        if (req.method === 'OPTIONS') {
          return new Response(null, { headers })
        }

        try {
          // GET /state - Get game state
          if (path === '/state' && req.method === 'GET') {
            const state = this.game.getState()
            return Response.json(state, { headers })
          }

          // GET /player - Get player info
          if (path === '/player' && req.method === 'GET') {
            const state = this.game.getState()
            return Response.json(state.player, { headers })
          }

          // GET /stats - Get stats
          if (path === '/stats' && req.method === 'GET') {
            const state = this.game.getState()
            return Response.json(state.stats, { headers })
          }

          // GET /story - Get story info
          if (path === '/story' && req.method === 'GET') {
            const state = this.game.getState()
            return Response.json(state.story, { headers })
          }

          // GET /achievements - Get achievements
          if (path === '/achievements' && req.method === 'GET') {
            const state = this.game.getState()
            return Response.json(state.achievements, { headers })
          }

          // POST /action - Perform action
          if (path === '/action' && req.method === 'POST') {
            const { action } = await req.json()
            const result = await this.handleAction(action)
            return Response.json(result, { headers })
          }

          // POST /xp - Add XP
          if (path === '/xp' && req.method === 'POST') {
            const { amount } = await req.json()
            this.game.addXP(amount)
            return Response.json({ success: true, newXP: this.game.getState().player.xp }, { headers })
          }

          // GET /luna - Talk to Luna
          if (path === '/luna' && req.method === 'GET') {
            const greeting = await this.luna.reactToEvent('greeting')
            return Response.json({ message: greeting }, { headers })
          }

          // GET /health
          if (path === '/health' && req.method === 'GET') {
            return Response.json({ 
              status: 'ok', 
              service: 'Story-Idle API',
              port: 3004 
            }, { headers })
          }

          return Response.json({ error: 'Not found' }, { status: 404, headers })

        } catch (error) {
          console.error('❌ Error:', error)
          return Response.json({ error: String(error) }, { status: 500, headers })
        }
      }.bind(this)
    })

    console.log('🎮 STORY-IDLE GAME API')
    console.log('━'.repeat(50))
    console.log(`🚀 Running on: http://localhost:${server.port}`)
    console.log(`📝 Endpoints:`)
    console.log(`   GET  /state        - Full game state`)
    console.log(`   GET  /player       - Player info`)
    console.log(`   GET  /stats        - Stats (love, peace, wisdom, etc)`)
    console.log(`   GET  /story        - Story progress`)
    console.log(`   GET  /achievements - Achievements`)
    console.log(`   POST /action       - Perform action`)
    console.log(`   POST /xp           - Add XP`)
    console.log(`   GET  /luna         - Talk to Luna`)
    console.log('━'.repeat(50))
  }

  private async handleAction(action: string): Promise<any> {
    // Simulate game actions
    const actions = ['explore', 'meditate', 'code', 'socialize', 'rest']
    
    if (!actions.includes(action)) {
      return { error: 'Invalid action', validActions: actions }
    }

    // Gain XP and stats based on action
    const rewards: Record<string, { xp: number, stat: string, amount: number }> = {
      explore: { xp: 25, stat: 'wisdom', amount: 2 },
      meditate: { xp: 20, stat: 'peace', amount: 3 },
      code: { xp: 30, stat: 'creativity', amount: 2 },
      socialize: { xp: 25, stat: 'love', amount: 3 },
      rest: { xp: 15, stat: 'stability', amount: 4 }
    }

    const reward = rewards[action]
    this.game.addXP(reward.xp)

    return {
      success: true,
      action,
      reward,
      newState: this.game.getState()
    }
  }
}

// Start server
const server = new StoryIdleAPIServer()
await server.start()
