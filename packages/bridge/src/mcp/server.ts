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
                return new Response(JSON.stringify({
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
                }), { headers })
              }

              case 'tools/list': {
                const toolsList = Array.from(self.tools.values()).map(t => ({
                  name: t.name,
                  description: t.description,
                  inputSchema: t.inputSchema
                }))
                
                return new Response(JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  result: {
                    tools: toolsList
                  }
                }), { headers })
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
