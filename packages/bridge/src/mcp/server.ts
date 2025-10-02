/**
 * MCP Server Implementation
 * Simplified Model Context Protocol server for Toobix Bridge
 */

import type { MCPTool, MCPServerConfig } from '../types'

export class MCPServer {
  private config: MCPServerConfig
  private tools: Map<string, MCPTool> = new Map()
  private routes: Map<string, Map<string, Function>> = new Map()
  private server: any

  constructor(config: MCPServerConfig) {
    this.config = config
  }

  registerTool(tool: MCPTool) {
    this.tools.set(tool.name, tool)
  }

  registerRoute(method: string, path: string, handler: Function) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map())
    }
    this.routes.get(method)!.set(path, handler)
  }

  getToolCount(): number {
    return this.tools.size
  }

  async start() {
    const self = this
    
    this.server = Bun.serve({
      port: this.config.port,
      
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

        // Route handling
        const routeMap = self.routes.get(req.method)
        if (routeMap?.has(url.pathname)) {
          try {
            const handler = routeMap.get(url.pathname)!
            const result = await handler(req)
            return new Response(JSON.stringify(result), { headers })
          } catch (error) {
            return new Response(JSON.stringify({ error: String(error) }), {
              status: 500,
              headers
            })
          }
        }

        // MCP tool execution
        if (url.pathname === '/tools/execute' && req.method === 'POST') {
          try {
            const body: any = await req.json()
            const tool = self.tools.get(body.tool)
            
            if (!tool) {
              return new Response(JSON.stringify({ 
                error: 'Tool not found',
                available: Array.from(self.tools.keys())
              }), {
                status: 404,
                headers
              })
            }

            const result = await tool.handler(body.args || {})
            return new Response(JSON.stringify({ result }), { headers })
          } catch (error) {
            return new Response(JSON.stringify({ error: String(error) }), {
              status: 500,
              headers
            })
          }
        }

        // List tools
        if (url.pathname === '/tools') {
          const toolsList = Array.from(self.tools.values()).map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema
          }))
          
          return new Response(JSON.stringify({ tools: toolsList }), { headers })
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers
        })
      }
    })
  }

  async stop() {
    if (this.server) {
      this.server.stop()
    }
  }
}
