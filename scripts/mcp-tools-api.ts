#!/usr/bin/env bun
// Demo API Server with Chatty Integration

import { ChattyAgent } from '../packages/chatty-client/index.ts'

const PORT = 4000
const MCP_URL = 'http://localhost:3337'

// Initialize Chatty Agent
const agent = new ChattyAgent(MCP_URL)
console.log('🤖 Initializing Chatty Agent...')
await agent.initialize()
console.log(`✅ Chatty ready with ${agent.tools.length} tools\n`)

// Create HTTP server
const server = Bun.serve({
  port: PORT,
  
  async fetch(req: Request) {
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

    // POST /chat - Chat with Chatty
    if (url.pathname === '/chat' && req.method === 'POST') {
      try {
        const { userInput } = await req.json() as { userInput: string }
        
        if (!userInput) {
          return new Response(JSON.stringify({ 
            error: 'userInput is required' 
          }), { status: 400, headers })
        }

        console.log(`[Chat] User: ${userInput}`)
        const reply = await agent.handleUserInput(userInput)
        console.log(`[Chat] Chatty: ${reply.substring(0, 100)}...`)

        return new Response(JSON.stringify({ reply }), { headers })
      } catch (error: any) {
        console.error('[Chat] Error:', error.message)
        return new Response(JSON.stringify({ 
          error: error.message 
        }), { status: 500, headers })
      }
    }

    // GET /health - Health check
    if (url.pathname === '/health' && req.method === 'GET') {
      const healthy = await agent.isHealthy()
      return new Response(JSON.stringify({ 
        status: healthy ? 'healthy' : 'unhealthy',
        toolCount: agent.tools.length,
        mcpUrl: MCP_URL
      }), { headers })
    }

    // GET /tools - List available tools
    if (url.pathname === '/tools' && req.method === 'GET') {
      return new Response(JSON.stringify({ 
        tools: agent.tools,
        count: agent.tools.length
      }), { headers })
    }

    // GET / - API info
    if (url.pathname === '/' && req.method === 'GET') {
      return new Response(JSON.stringify({
        name: 'Chatty Demo API',
        version: '0.1.0',
        endpoints: {
          'POST /chat': 'Chat with Chatty (body: { userInput: string })',
          'GET /health': 'Health check',
          'GET /tools': 'List available MCP tools',
          'GET /': 'This info'
        },
        examples: [
          { 
            endpoint: 'POST /chat', 
            body: { userInput: '/help' },
            description: 'Show help'
          },
          { 
            endpoint: 'POST /chat', 
            body: { userInput: '/mem what did I learn?' },
            description: 'Search memory'
          },
          { 
            endpoint: 'POST /chat', 
            body: { userInput: '/story' },
            description: 'Get story status'
          }
        ]
      }), { headers })
    }

    return new Response(JSON.stringify({ 
      error: 'Not found' 
    }), { status: 404, headers })
  }
})

console.log(`🚀 Chatty Demo API running on http://localhost:${PORT}`)
console.log(`\n📚 Endpoints:`)
console.log(`   POST http://localhost:${PORT}/chat`)
console.log(`   GET  http://localhost:${PORT}/health`)
console.log(`   GET  http://localhost:${PORT}/tools`)
console.log(`\n💬 Example:`)
console.log(`   curl -X POST http://localhost:${PORT}/chat \\`)
console.log(`     -H "Content-Type: application/json" \\`)
console.log(`     -d '{"userInput": "/help"}'`)
console.log(`\n✨ Try these commands:`)
console.log(`   /help               - Show help`)
console.log(`   /tools              - List all tools`)
console.log(`   /mem <query>        - Search memory`)
console.log(`   /story              - Story status`)
console.log(`   /think <thought>    - Consciousness`)
console.log(`   /gratitude <text>   - Log gratitude`)
console.log(`\n💡 Press Ctrl+C to stop\n`)
