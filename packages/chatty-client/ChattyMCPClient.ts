// packages/chatty-client/ChattyMCPClient.ts
// MCP Client for connecting Chatty AI agent to Toobix MCP Server

export interface MCPTool {
  name: string;
  description?: string;
  paramsSchema?: any;
}

export interface MCPInvokeResult {
  result?: any;
  error?: { code: number; message: string; data?: any };
}

export class ChattyMCPClient {
  baseUrl: string;        // Base URL of MCP Server, e.g. http://localhost:3337
  headers: Record<string, string>;

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  /** Discover tools/capabilities that the MCP Server offers */
  async discoverTools(): Promise<MCPTool[]> {
    const url = `${this.baseUrl}/discovery`;
    const resp = await fetch(url, {
      method: "GET",
      headers: { ...this.headers }
    });
    if (!resp.ok) {
      throw new Error(`Discovery failed: ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    return data.tools as MCPTool[];
  }

  /** Call a tool with parameters */
  async callTool(toolName: string, params: any): Promise<any> {
    const url = `${this.baseUrl}/invoke`;
    const payload = {
      jsonrpc: "2.0",
      method: "call_tool",
      params: {
        tool: toolName,
        arguments: params
      },
      id: Math.random().toString()
    };
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      throw new Error(`callTool ${toolName} failed: ${resp.status} ${resp.statusText}`);
    }
    const respJson = (await resp.json()) as MCPInvokeResult;
    if (respJson.error) {
      throw new Error(`Tool error: ${respJson.error.message}`);
    }
    return respJson.result;
  }

  /** List all available tools */
  async listTools(): Promise<string[]> {
    const tools = await this.discoverTools();
    return tools.map(t => t.name);
  }

  /** Check if MCP Server is reachable */
  async healthCheck(): Promise<boolean> {
    try {
      const resp = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: this.headers
      });
      return resp.ok;
    } catch (error) {
      return false;
    }
  }
}
