// packages/chatty-client/index.ts
// Chatty AI Agent with MCP Integration

export * from "./ChattyMCPClient";

import { ChattyMCPClient } from "./ChattyMCPClient";

export class ChattyAgent {
  mcp: ChattyMCPClient;
  tools: string[] = [];

  constructor(mcpBaseUrl: string, jwtToken?: string) {
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    this.mcp = new ChattyMCPClient(mcpBaseUrl, headers);
  }

  /** Initialize agent - discover available tools */
  async initialize(): Promise<void> {
    try {
      const discovered = await this.mcp.discoverTools();
      this.tools = discovered.map(t => t.name);
      console.log(`[Chatty] Discovered ${this.tools.length} tools:`, this.tools);
    } catch (error) {
      console.error("[Chatty] Failed to discover tools:", error);
      throw error;
    }
  }

  /** Process user input and decide which tools to use */
  async handleUserInput(userInput: string): Promise<string> {
    // Memory search command
    if (userInput.startsWith("/mem ")) {
      const query = userInput.substring(5);
      const result = await this.mcp.callTool("memory_search", { query });
      return `🧠 Memory search results:\n${JSON.stringify(result, null, 2)}`;
    }

    // Story command
    if (userInput.startsWith("/story ")) {
      const action = userInput.substring(7);
      const result = await this.mcp.callTool("story_get_status", {});
      return `📖 Story status:\n${JSON.stringify(result, null, 2)}`;
    }

    // Consciousness command
    if (userInput.startsWith("/think ")) {
      const thought = userInput.substring(7);
      const result = await this.mcp.callTool("consciousness_think", { thought });
      return `🧠 Consciousness response:\n${JSON.stringify(result, null, 2)}`;
    }

    // Love/gratitude command
    if (userInput.startsWith("/gratitude ")) {
      const gratitude = userInput.substring(11);
      const result = await this.mcp.callTool("love_log_gratitude", { gratitude });
      return `💝 Gratitude logged:\n${JSON.stringify(result, null, 2)}`;
    }

    // List tools
    if (userInput === "/tools") {
      return `🛠️ Available tools (${this.tools.length}):\n${this.tools.join("\n")}`;
    }

    // Help
    if (userInput === "/help") {
      return `🤖 Chatty Commands:
/mem <query>        - Search memory
/story              - Get story status
/think <thought>    - Consciousness reflection
/gratitude <text>   - Log gratitude
/tools              - List all tools
/help               - Show this help

Or just talk to me naturally! 😊`;
    }

    // Default: conversational response
    return `You said: "${userInput}"\n\nI'm thinking... 🤔\n\n(Use /help to see commands)`;
  }

  /** Health check */
  async isHealthy(): Promise<boolean> {
    return await this.mcp.healthCheck();
  }
}
