// packages/bridge/src/routes/mcp.ts
// MCP Protocol Endpoints for Chatty Integration

import type { Server } from 'bun'

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
}

export interface MCPToolRegistry {
  [name: string]: {
    tool: MCPTool
    handler: (args: any) => Promise<any>
  }
}

/**
 * Setup MCP HTTP endpoints for external clients (like Chatty)
 * 
 * GET /discovery - List all available tools
 * POST /invoke - Call a specific tool
 * GET /health - Health check
 */
export function setupMCPRoutes(
  server: Server,
  toolRegistry: MCPToolRegistry
) {
  // GET /discovery - List all available tools
  const discoveryHandler = async (req: Request) => {
    const tools = Object.entries(toolRegistry).map(([name, entry]) => ({
      name: entry.tool.name,
      description: entry.tool.description,
      paramsSchema: entry.tool.inputSchema
    }))

    return new Response(JSON.stringify({ tools }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // POST /invoke - Call a tool
  const invokeHandler = async (req: Request) => {
    try {
      const body = await req.json() as {
        jsonrpc: string
        method: string
        params: {
          tool: string
          arguments: any
        }
        id: string
      }

      // Validate JSON-RPC format
      if (body.jsonrpc !== '2.0') {
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32600, message: 'Invalid JSON-RPC version' },
          id: body.id
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (body.method !== 'call_tool') {
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32601, message: `Method not found: ${body.method}` },
          id: body.id
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const toolName = body.params?.tool
      const args = body.params?.arguments || {}

      // Find tool
      const toolEntry = toolRegistry[toolName]
      if (!toolEntry) {
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          error: { 
            code: -32602, 
            message: `Tool not found: ${toolName}`,
            data: { availableTools: Object.keys(toolRegistry) }
          },
          id: body.id
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Execute tool
      console.log(`[MCP] Calling tool: ${toolName}`, args)
      const result = await toolEntry.handler(args)

      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        result,
        id: body.id
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

    } catch (error: any) {
      console.error('[MCP] Tool execution error:', error)
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: { 
          code: -32603, 
          message: 'Internal error',
          data: { error: error.message }
        },
        id: (await req.json()).id
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  // GET /health - Health check
  const healthHandler = async (req: Request) => {
    return new Response(JSON.stringify({ 
      status: 'healthy',
      toolCount: Object.keys(toolRegistry).length,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return {
    discoveryHandler,
    invokeHandler,
    healthHandler
  }
}
