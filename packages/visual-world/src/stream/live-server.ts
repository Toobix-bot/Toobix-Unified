#!/usr/bin/env bun
// Live Stream Server
// Real-time game state updates via WebSocket

import { WebSocketServer } from 'ws'
import { GameStateManager } from '@toobix/story-idle'
import type { Server } from 'bun'

interface Client {
  ws: any
  id: string
}

export class LiveStreamServer {
  private wss: WebSocketServer
  private clients: Set<Client> = new Set()
  private gameState: GameStateManager
  private updateInterval: Timer | null = null

  constructor(port: number = 3338) {
    this.gameState = new GameStateManager()

    // Create WebSocket server
    this.wss = new WebSocketServer({ port })

    this.wss.on('connection', (ws) => {
      const client: Client = {
        ws,
        id: Math.random().toString(36).substring(7)
      }

      this.clients.add(client)
      console.log(`🌐 Client connected: ${client.id} (Total: ${this.clients.size})`)

      // Send initial state
      this.sendStateToClient(client)

      ws.on('close', () => {
        this.clients.delete(client)
        console.log(`🌐 Client disconnected: ${client.id} (Total: ${this.clients.size})`)
      })

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString())
          this.handleClientMessage(client, message)
        } catch (e) {
          console.error('Invalid message from client:', e)
        }
      })
    })

    console.log(`🎮 Live Stream Server running on ws://localhost:${port}`)

    // Start broadcasting updates
    this.startBroadcasting()
  }

  private startBroadcasting(): void {
    // Broadcast state every 2 seconds
    this.updateInterval = setInterval(() => {
      this.broadcastState()
    }, 2000)
  }

  private sendStateToClient(client: Client): void {
    const state = this.gameState.getState()

    client.ws.send(JSON.stringify({
      type: 'state-update',
      data: state,
      timestamp: Date.now()
    }))
  }

  private broadcastState(): void {
    const state = this.gameState.getState()

    const message = JSON.stringify({
      type: 'state-update',
      data: state,
      timestamp: Date.now()
    })

    this.clients.forEach(client => {
      try {
        client.ws.send(message)
      } catch (e) {
        console.error(`Error sending to client ${client.id}:`, e)
      }
    })
  }

  private handleClientMessage(client: Client, message: any): void {
    switch (message.type) {
      case 'request-state':
        this.sendStateToClient(client)
        break

      case 'trigger-event':
        // Client can trigger events (e.g., from web UI)
        this.handleEvent(message.event, message.data)
        this.broadcastState()
        break

      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  private handleEvent(event: string, data: any): void {
    switch (event) {
      case 'add-xp':
        this.gameState.addXP(data.amount, data.reason)
        this.broadcast({
          type: 'event',
          event: 'xp-gained',
          data: { amount: data.amount }
        })
        break

      case 'add-stat':
        this.gameState.addStat(data.stat, data.amount)
        this.broadcast({
          type: 'event',
          event: 'stat-increased',
          data: { stat: data.stat, amount: data.amount }
        })
        break

      case 'luna-speaks':
        this.broadcast({
          type: 'luna-dialogue',
          data: { message: data.message }
        })
        break
    }
  }

  private broadcast(message: any): void {
    const data = JSON.stringify(message)

    this.clients.forEach(client => {
      try {
        client.ws.send(data)
      } catch (e) {
        console.error(`Error broadcasting to client ${client.id}:`, e)
      }
    })
  }

  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.wss.close()
    console.log('🌐 Live Stream Server stopped')
  }
}

// HTTP Server for game state API
export function createHTTPServer(port: number = 3337): Server {
  const gameState = new GameStateManager()

  return Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url)

      // CORS headers
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }

      if (req.method === 'OPTIONS') {
        return new Response(null, { headers })
      }

      // Routes
      if (url.pathname === '/game-state') {
        const state = gameState.getState()
        return new Response(JSON.stringify(state), { headers })
      }

      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ ok: true, service: 'visual-world' }), { headers })
      }

      if (url.pathname === '/open-world') {
        // Serve the 3D world HTML
        const html = await Bun.file('./packages/visual-world/src/canvas/world-3d.html').text()
        return new Response(html, {
          headers: { 'Content-Type': 'text/html' }
        })
      }

      return new Response('Not Found', { status: 404 })
    }
  })
}

// Start servers
if (import.meta.main) {
  // Start WebSocket server
  const wsServer = new LiveStreamServer(3338)

  // Start HTTP server
  const httpServer = createHTTPServer(3339)
  console.log(`🌐 HTTP API running on http://localhost:3339`)
  console.log(`✨ Open 3D World: http://localhost:3339/open-world`)

  // Cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...')
    wsServer.stop()
    httpServer.stop()
    process.exit(0)
  })
}
