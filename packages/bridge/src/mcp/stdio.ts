#!/usr/bin/env bun
/**
 * MCP stdio Server Wrapper
 * Exposes a minimal set of Bridge tools over MCP (stdio) so ChatGPT MCP Connector can attach.
 */

import { Database } from 'bun:sqlite'
import { loadBridgeConfig } from '../config/load.ts'
import { MemoryService } from '../memory/service.ts'
import { GroqService } from '../ai/groq.ts'

// MCP SDK (v0.5.x)
// Keep imports generic to avoid path issues across versions
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Server } from '@modelcontextprotocol/sdk/server'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio'

async function main() {
  const cfg = loadBridgeConfig()

  // Init services
  const db = new Database(cfg.database)
  const memory = new MemoryService(db, process.env.OPENAI_API_KEY)
  const ai = new GroqService(cfg.groqApiKey || process.env.GROQ_API_KEY || '')

  // Create MCP server over stdio
  const server = new Server({
    name: 'toobix-bridge',
    version: '0.1.0'
  }, {
    capabilities: {
      tools: {}
    }
  })

  // Tools
  server.tool('memory_search', {
    description: 'Search memories (hybrid vector+keyword)',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', default: 5 }
      },
      required: ['query']
    }
  }, async (args: any) => {
    const query = String(args?.query || '')
    const limit = Number(args?.limit || 5)
    const results = await memory.search(query, limit)
    return { results }
  })

  server.tool('memory_add', {
    description: 'Add a memory chunk (and embeddings if enabled)',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        metadata: { type: 'object' }
      },
      required: ['text']
    }
  }, async (args: any) => {
    const id = await memory.add(String(args?.text || ''), args?.metadata || {})
    return { id }
  })

  server.tool('generate', {
    description: 'Generate text with Groq model',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        temperature: { type: 'number' },
        maxTokens: { type: 'number' },
        model: { type: 'string' }
      },
      required: ['prompt']
    }
  }, async (args: any) => {
    const prompt = String(args?.prompt || '')
    const result = await ai.generate(prompt, {
      temperature: args?.temperature,
      max_tokens: args?.maxTokens,
      model: args?.model,
      classification: args?.classification || 'simulation',
      notes: 'stdio generate tool'
    })

    return {
      ok: result.ok,
      text: result.text,
      metadata: result.metadata
    }
  })

  // Connect transport
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

await main()
