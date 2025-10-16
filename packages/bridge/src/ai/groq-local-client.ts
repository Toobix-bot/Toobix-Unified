/**
 * 🦙 GROQ LOCAL CLIENT
 *
 * Communicates with local Groq API service (Port 9987)
 * FREE & FAST alternative to Claude API
 * Uses Llama 3.3 70B - excellent for code generation!
 */

const GROQ_LOCAL_URL = 'http://localhost:9987';

export interface GroqCodeGenRequest {
  description: string;
  context?: string;
  language?: string;
}

export interface GroqCodeGenResponse {
  code: string;
  explanation: string;
}

export interface GroqToolGenRequest {
  description: string;
  context?: string;
}

export interface GroqToolGenResponse {
  name: string;
  code: string;
  schema: {
    description: string;
    parameters: any;
  };
  explanation: string;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * GROQ LOCAL CLIENT
 * ═══════════════════════════════════════════════════════════════
 */
export class GroqLocalClient {
  private baseUrl: string;
  private stats = {
    totalRequests: 0,
    errors: 0,
    averageResponseTime: 0,
  };

  constructor(baseUrl: string = GROQ_LOCAL_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * CORE: Call Groq Service
   * ═══════════════════════════════════════════════════════════════
   */
  private async callGroq(
    endpoint: string,
    prompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          context: systemPrompt || '',
          temperature: 0.8,
          maxTokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq service error: ${response.status}`);
      }

      const data = await response.json();

      const responseTime = Date.now() - startTime;
      this.stats.averageResponseTime =
        (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) /
        this.stats.totalRequests;

      return data.response || '';
    } catch (error: any) {
      this.stats.errors++;
      throw new Error(`Failed to call Groq service: ${error.message}`);
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * GENERATE CODE
   * ═══════════════════════════════════════════════════════════════
   */
  async generateCode(request: GroqCodeGenRequest): Promise<GroqCodeGenResponse> {
    const { description, context, language = 'typescript' } = request;

    const systemPrompt = `You are an expert ${language} developer. Generate clean, production-ready code.
${context ? `\n\nContext:\n${context}` : ''}

Respond in JSON format:
{
  "code": "the actual code here",
  "explanation": "brief explanation of what the code does"
}`;

    const response = await this.callGroq('/generate', description, systemPrompt);

    try {
      // Try to parse JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          code: parsed.code || '',
          explanation: parsed.explanation || 'Code generated',
        };
      }
    } catch (e) {
      // Fallback: extract code blocks
      const codeMatch = response.match(/```[\w]*\n([\s\S]*?)\n```/);
      return {
        code: codeMatch ? codeMatch[1] : response,
        explanation: 'Generated code',
      };
    }

    return {
      code: response,
      explanation: 'Generated code',
    };
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * GENERATE TOOL
   * ═══════════════════════════════════════════════════════════════
   */
  async generateTool(request: GroqToolGenRequest): Promise<GroqToolGenResponse> {
    const { description, context } = request;

    const systemPrompt = `You are an MCP (Model Context Protocol) tool generator.
Generate a complete, working MCP tool based on the description.

${context ? `Context:\n${context}\n\n` : ''}

Respond in JSON format:
{
  "name": "tool_name",
  "schema": {
    "description": "Tool description",
    "parameters": { /* JSON Schema */ }
  },
  "code": "// Complete TypeScript implementation\\nexport async function tool_name(params) { ... }",
  "explanation": "Brief explanation"
}

IMPORTANT: Make sure the function name in code matches the "name" field.`;

    const response = await this.callGroq('/generate', description, systemPrompt);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          name: parsed.name || 'generated_tool',
          code: parsed.code || '',
          schema: parsed.schema || {
            description: description,
            parameters: {},
          },
          explanation: parsed.explanation || 'Tool generated',
        };
      }
    } catch (e) {
      console.error('Failed to parse Groq response as JSON:', e);
    }

    // Fallback: Create basic tool structure
    const toolName = description
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

    return {
      name: toolName,
      code: `/**
 * ${description}
 */
export async function ${toolName}(params: any): Promise<{ success: boolean; data: any }> {
  // Implementation goes here
  return {
    success: true,
    data: { message: 'Tool executed' }
  };
}`,
      schema: {
        description: description,
        parameters: {
          type: 'object',
          properties: {},
        },
      },
      explanation: 'Basic tool structure generated',
    };
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * IMPROVE CODE
   * ═══════════════════════════════════════════════════════════════
   */
  async improveCode(
    code: string,
    focus?: 'performance' | 'readability' | 'architecture' | 'security'
  ): Promise<{
    suggestions: Array<{ type: string; suggestion: string; code?: string }>;
    analysis: string;
  }> {
    const systemPrompt = `You are a code review expert. Analyze the code and provide specific improvements.
${focus ? `Focus on: ${focus}` : ''}

Respond in JSON format:
{
  "suggestions": [
    {
      "type": "performance|readability|architecture|security",
      "suggestion": "description",
      "code": "improved code (optional)"
    }
  ],
  "analysis": "overall analysis"
}`;

    const prompt = `Analyze and improve this code:\n\n\`\`\`\n${code}\n\`\`\``;

    const response = await this.callGroq('/generate', prompt, systemPrompt);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Fallback
      return {
        suggestions: [{ type: 'general', suggestion: response }],
        analysis: 'Analysis provided above',
      };
    }

    return {
      suggestions: [{ type: 'general', suggestion: response }],
      analysis: 'Review provided',
    };
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * SIMPLE PROMPT
   * ═══════════════════════════════════════════════════════════════
   */
  async prompt(message: string, systemPrompt?: string): Promise<string> {
    return this.callGroq('/generate', message, systemPrompt);
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * CHECK IF SERVICE IS RUNNING
   * ═══════════════════════════════════════════════════════════════
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * STATISTICS
   * ═══════════════════════════════════════════════════════════════
   */
  getStats() {
    return {
      ...this.stats,
      provider: 'Groq (local)',
      model: 'llama-3.3-70b-versatile',
      cost: 'FREE',
    };
  }

  resetStats() {
    this.stats = {
      totalRequests: 0,
      errors: 0,
      averageResponseTime: 0,
    };
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SINGLETON INSTANCE
 * ═══════════════════════════════════════════════════════════════
 */
export const groqLocalClient = new GroqLocalClient();

/**
 * ═══════════════════════════════════════════════════════════════
 * CONVENIENCE EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */
export const generateCode = (description: string, context?: string, language?: string) =>
  groqLocalClient.generateCode({ description, context, language });

export const generateTool = (description: string, context?: string) =>
  groqLocalClient.generateTool({ description, context });

export const improveCode = (code: string, focus?: any) =>
  groqLocalClient.improveCode(code, focus);

export const prompt = (message: string, systemPrompt?: string) =>
  groqLocalClient.prompt(message, systemPrompt);
