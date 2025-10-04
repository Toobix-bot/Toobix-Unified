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
          'Content-Type': 'application/json; charset=utf-8',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
        
        if (req.method === 'OPTIONS') {
          return new Response(null, { headers })
        }

        // Root route - MCP Discovery (for MCP clients)
        if (url.pathname === '/' && req.method === 'GET') {
          const discovery = {
            protocol: 'mcp',
            version: '1.0.0',
            server: {
              name: 'toobix-bridge',
              version: '0.1.0'
            },
            capabilities: {
              tools: true,
              prompts: false,
              resources: false
            },
            endpoints: {
              mcp: '/mcp',
              tools: '/tools',
              execute: '/tools/execute',
              health: '/health',
              stats: '/stats'
            },
            tools: Array.from(self.tools.keys())
          }
          return new Response(JSON.stringify(discovery), { headers })
        }

        // JSON-RPC 2.0 MCP endpoint (für Chatty & andere MCP clients)
        if (url.pathname === '/mcp' && req.method === 'POST') {
          try {
            const jsonrpcRequest: any = await req.json()
            
            // JSON-RPC 2.0 Format validieren
            if (!jsonrpcRequest.jsonrpc || jsonrpcRequest.jsonrpc !== '2.0') {
              return new Response(JSON.stringify({
                jsonrpc: '2.0',
                id: jsonrpcRequest.id || null,
                error: {
                  code: -32600,
                  message: 'Invalid Request: jsonrpc must be "2.0"'
                }
              }), { status: 400, headers })
            }

            const { method, params, id } = jsonrpcRequest

            // MCP Protocol Methods
            switch (method) {
              case 'initialize': {
                const responseBody = JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  result: {
                    protocolVersion: '1.0.0',
                    serverInfo: {
                      name: 'toobix-bridge',
                      version: '0.1.0'
                    },
                    capabilities: {
                      tools: {}
                    }
                  }
                })
                
                return new Response(responseBody, {
                  headers: {
                    ...headers,
                    'Content-Length': String(responseBody.length)
                  }
                })
              }

              case 'tools/list': {
                // Simplified mode: omit property descriptions to reduce response size
                // 4646 bytes → ~2000 bytes (prevents Chatty TaskGroup crash)
                const toolsList = Array.from(self.tools.values()).map(t => {
                  const simplifySchema = (schema: any): any => {
                    if (!schema || typeof schema !== 'object') return schema
                    const simplified = { ...schema }
                    if (simplified.properties) {
                      simplified.properties = Object.fromEntries(
                        Object.entries(simplified.properties).map(([key, val]: [string, any]) => [
                          key,
                          { type: val.type, ...(val.enum && { enum: val.enum }), ...(val.default !== undefined && { default: val.default }), ...(val.items && { items: val.items }) }
                        ])
                      )
                    }
                    return simplified
                  }
                  
                  return {
                    name: t.name,
                    description: t.description,
                    inputSchema: simplifySchema(t.inputSchema)
                  }
                })
                
                const responseBody = JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  result: {
                    tools: toolsList
                  }
                })
                
                return new Response(responseBody, {
                  headers: {
                    ...headers,
                    'Content-Length': String(responseBody.length)
                  }
                })
              }

              case 'tools/call': {
                const { name, arguments: args } = params || {}
                
                if (!name) {
                  return new Response(JSON.stringify({
                    jsonrpc: '2.0',
                    id,
                    error: {
                      code: -32602,
                      message: 'Invalid params: name is required'
                    }
                  }), { status: 400, headers })
                }

                const tool = self.tools.get(name)
                if (!tool) {
                  return new Response(JSON.stringify({
                    jsonrpc: '2.0',
                    id,
                    error: {
                      code: -32601,
                      message: `Tool not found: ${name}`,
                      data: {
                        available: Array.from(self.tools.keys())
                      }
                    }
                  }), { status: 404, headers })
                }

                try {
                  const result = await tool.handler(args || {})
                  
                  // Minimize response size for ngrok Free compatibility
                  const responseText = typeof result === 'string' 
                    ? result 
                    : JSON.stringify(result)  // No pretty-print (removes null, 2)
                  
                  const response = {
                    jsonrpc: '2.0',
                    id,
                    result: {
                      content: [
                        {
                          type: 'text',
                          text: responseText
                        }
                      ]
                    }
                  }
                  
                  // Compact JSON response (no whitespace)
                  const body = JSON.stringify(response)
                  
                  return new Response(body, { 
                    headers: {
                      ...headers,
                      'Content-Length': String(body.length)
                    }
                  })
                } catch (toolError) {
                  return new Response(JSON.stringify({
                    jsonrpc: '2.0',
                    id,
                    error: {
                      code: -32603,
                      message: 'Tool execution failed',
                      data: {
                        error: String(toolError)
                      }
                    }
                  }), { status: 500, headers })
                }
              }

              default: {
                return new Response(JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  error: {
                    code: -32601,
                    message: `Method not found: ${method}`,
                    data: {
                      available: ['initialize', 'tools/list', 'tools/call']
                    }
                  }
                }), { status: 404, headers })
              }
            }
          } catch (error) {
            return new Response(JSON.stringify({
              jsonrpc: '2.0',
              id: null,
              error: {
                code: -32700,
                message: 'Parse error',
                data: {
                  error: String(error)
                }
              }
            }), { status: 400, headers })
          }
        }

        // Chatty Integration - GET /discovery (list tools)
        if (url.pathname === '/discovery' && req.method === 'GET') {
          const tools = Array.from(self.tools.values()).map(t => ({
            name: t.name,
            description: t.description,
            paramsSchema: t.inputSchema
          }))
          return new Response(JSON.stringify({ tools }), { headers })
        }

        // Chatty Integration - POST /invoke (call tool)
        if (url.pathname === '/invoke' && req.method === 'POST') {
          try {
            const body = await req.json() as {
              jsonrpc: string
              method: string
              params: { tool: string; arguments: any }
              id: string
            }

            // Validate JSON-RPC 2.0
            if (body.jsonrpc !== '2.0') {
              return new Response(JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32600, message: 'Invalid JSON-RPC version' },
                id: body.id
              }), { status: 400, headers })
            }

            if (body.method !== 'call_tool') {
              return new Response(JSON.stringify({
                jsonrpc: '2.0',
                error: { code: -32601, message: `Method not found: ${body.method}` },
                id: body.id
              }), { status: 400, headers })
            }

            const toolName = body.params?.tool
            const args = body.params?.arguments || {}

            const tool = self.tools.get(toolName)
            if (!tool) {
              return new Response(JSON.stringify({
                jsonrpc: '2.0',
                error: { 
                  code: -32602, 
                  message: `Tool not found: ${toolName}`,
                  data: { availableTools: Array.from(self.tools.keys()) }
                },
                id: body.id
              }), { status: 404, headers })
            }

            // Execute tool
            console.log(`[Chatty] Calling tool: ${toolName}`, args)
            const result = await tool.handler(args)

            return new Response(JSON.stringify({
              jsonrpc: '2.0',
              result,
              id: body.id
            }), { headers })

          } catch (error: any) {
            console.error('[Chatty] Tool execution error:', error)
            return new Response(JSON.stringify({
              jsonrpc: '2.0',
              error: { 
                code: -32603, 
                message: 'Internal error',
                data: { error: error.message }
              },
              id: null
            }), { status: 500, headers })
          }
        }

        // GET /health - Health check for Chatty
        if (url.pathname === '/health' && req.method === 'GET') {
          return new Response(JSON.stringify({ 
            status: 'healthy',
            toolCount: self.tools.size,
            timestamp: Date.now()
          }), { headers })
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

        // MCP tool execution (REST fallback for legacy/simple clients)
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
            const responseBody = JSON.stringify({ result })
            return new Response(responseBody, { 
              headers: {
                ...headers,
                'Content-Length': String(responseBody.length)
              }
            })
          } catch (error) {
            return new Response(JSON.stringify({ error: String(error) }), {
              status: 500,
              headers
            })
          }
        }

        // Direct tool routes (REST endpoints for quick testing)
        // e.g., POST /rpc/ping, POST /rpc/soul_state
        if (url.pathname.startsWith('/rpc/') && req.method === 'POST') {
          const toolName = url.pathname.slice(5) // Remove '/rpc/'
          const tool = self.tools.get(toolName)
          
          if (!tool) {
            return new Response(JSON.stringify({
              error: `Tool '${toolName}' not found`,
              available: Array.from(self.tools.keys()),
              hint: 'Use POST /rpc/{toolName} with JSON body containing arguments'
            }), {
              status: 404,
              headers
            })
          }

          try {
            const body: any = await req.json().catch(() => ({}))
            const result = await tool.handler(body || {})
            const responseBody = JSON.stringify(result)
            return new Response(responseBody, {
              headers: {
                ...headers,
                'Content-Length': String(responseBody.length)
              }
            })
          } catch (error) {
            return new Response(JSON.stringify({ 
              error: String(error),
              tool: toolName 
            }), {
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
