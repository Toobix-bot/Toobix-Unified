/**
 * 🧠 CLAUDE API CLIENT
 *
 * Direct communication with Anthropic's Claude API
 * Enables the system to:
 * - Generate code
 * - Reason about problems
 * - Create new tools
 * - Improve itself
 *
 * "Ein System das mit Claude sprechen kann, kann sich selbst erschaffen."
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5-20250929'; // Latest model

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequest {
  model?: string;
  messages: ClaudeMessage[];
  system?: string;
  max_tokens?: number;
  temperature?: number;
  thinking?: {
    type: 'enabled';
    budget_tokens?: number;
  };
}

export interface ClaudeResponse {
  id: string;
  content: Array<{
    type: 'text' | 'thinking';
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeClientConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  enableThinking?: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * CLAUDE API CLIENT
 * ═══════════════════════════════════════════════════════════════
 */
export class ClaudeClient {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private enableThinking: boolean;

  // Statistics
  private stats = {
    totalRequests: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    errors: 0,
    averageResponseTime: 0,
  };

  constructor(config: ClaudeClientConfig = {}) {
    this.apiKey = config.apiKey || ANTHROPIC_API_KEY;
    this.model = config.model || MODEL;
    this.maxTokens = config.maxTokens || 4096;
    this.temperature = config.temperature || 0.7;
    this.enableThinking = config.enableThinking ?? false;

    if (!this.apiKey) {
      console.warn('⚠️  ANTHROPIC_API_KEY not set. Claude client will not work!');
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * MAIN API CALL
   * ═══════════════════════════════════════════════════════════════
   */
  async chat(
    messages: ClaudeMessage[],
    systemPrompt?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      enableThinking?: boolean;
    }
  ): Promise<ClaudeResponse> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const requestBody: any = {
      model: this.model,
      messages,
      max_tokens: options?.maxTokens || this.maxTokens,
      temperature: options?.temperature ?? this.temperature,
    };

    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    if (options?.enableThinking ?? this.enableThinking) {
      requestBody.thinking = {
        type: 'enabled',
        budget_tokens: 2000,
      };
    }

    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${error}`);
      }

      const data: ClaudeResponse = await response.json();

      // Update stats
      const responseTime = Date.now() - startTime;
      this.stats.averageResponseTime =
        (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) /
        this.stats.totalRequests;

      this.stats.totalInputTokens += data.usage.input_tokens;
      this.stats.totalOutputTokens += data.usage.output_tokens;

      return data;
    } catch (error) {
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * CONVENIENCE METHODS
   * ═══════════════════════════════════════════════════════════════
   */

  /**
   * Simple text prompt (single message)
   */
  async prompt(
    userMessage: string,
    systemPrompt?: string,
    options?: { maxTokens?: number; temperature?: number; enableThinking?: boolean }
  ): Promise<string> {
    const response = await this.chat(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      options
    );

    // Extract text content (ignore thinking blocks for simple usage)
    return response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');
  }

  /**
   * Code generation with reasoning
   */
  async generateCode(
    description: string,
    context?: string,
    options?: { language?: string; enableThinking?: boolean }
  ): Promise<{ code: string; explanation: string; thinking?: string }> {
    const language = options?.language || 'typescript';

    const systemPrompt = `You are an expert ${language} developer. Generate clean, production-ready code.
${context ? `\n\nContext:\n${context}` : ''}

Respond in JSON format:
{
  "code": "the actual code here",
  "explanation": "brief explanation of what the code does"
}`;

    const response = await this.chat(
      [{ role: 'user', content: description }],
      systemPrompt,
      { ...options, enableThinking: options?.enableThinking ?? true }
    );

    // Extract thinking (if enabled)
    const thinking = response.content
      .filter(block => block.type === 'thinking')
      .map(block => block.text)
      .join('\n');

    // Extract text response
    const textResponse = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    try {
      // Try to parse JSON response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          code: parsed.code,
          explanation: parsed.explanation,
          thinking: thinking || undefined,
        };
      }
    } catch (e) {
      // Fallback: extract code blocks
      const codeMatch = textResponse.match(/```[\w]*\n([\s\S]*?)\n```/);
      return {
        code: codeMatch ? codeMatch[1] : textResponse,
        explanation: 'Code generated',
        thinking: thinking || undefined,
      };
    }

    return {
      code: textResponse,
      explanation: 'Generated code',
      thinking: thinking || undefined,
    };
  }

  /**
   * Tool generation (MCP Tool)
   */
  async generateTool(description: string, context?: string): Promise<{
    name: string;
    code: string;
    schema: any;
    explanation: string;
  }> {
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
}`;

    const response = await this.prompt(description, systemPrompt, {
      maxTokens: 4096,
      enableThinking: true,
    });

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          name: parsed.name,
          code: parsed.code,
          schema: parsed.schema,
          explanation: parsed.explanation,
        };
      }
    } catch (e) {
      throw new Error('Failed to parse tool generation response');
    }

    throw new Error('Invalid response format from Claude');
  }

  /**
   * Code improvement suggestions
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

    const response = await this.prompt(
      `Analyze and improve this code:\n\n\`\`\`\n${code}\n\`\`\``,
      systemPrompt,
      { enableThinking: true }
    );

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

    throw new Error('Failed to parse improvement suggestions');
  }

  /**
   * Reasoning / Planning
   */
  async reason(
    problem: string,
    context?: string
  ): Promise<{
    thinking: string;
    plan: string[];
    reasoning: string;
  }> {
    const systemPrompt = `You are a reasoning engine. Think deeply about the problem and create a plan.
${context ? `\n\nContext:\n${context}` : ''}

Respond in JSON format:
{
  "plan": ["step 1", "step 2", ...],
  "reasoning": "your reasoning process"
}`;

    const response = await this.chat(
      [{ role: 'user', content: problem }],
      systemPrompt,
      { enableThinking: true }
    );

    const thinking = response.content
      .filter(block => block.type === 'thinking')
      .map(block => block.text)
      .join('\n');

    const textResponse = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          thinking,
          plan: parsed.plan,
          reasoning: parsed.reasoning,
        };
      }
    } catch (e) {
      // Fallback
      return {
        thinking,
        plan: ['Analyze the problem', 'Create solution', 'Implement'],
        reasoning: textResponse,
      };
    }

    throw new Error('Failed to parse reasoning response');
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * STATISTICS
   * ═══════════════════════════════════════════════════════════════
   */
  getStats() {
    return {
      ...this.stats,
      totalTokens: this.stats.totalInputTokens + this.stats.totalOutputTokens,
      estimatedCost: this.calculateCost(),
    };
  }

  private calculateCost(): string {
    // Claude Sonnet 4.5 pricing (as of Oct 2025)
    // Input: $3 per million tokens
    // Output: $15 per million tokens
    const inputCost = (this.stats.totalInputTokens / 1_000_000) * 3;
    const outputCost = (this.stats.totalOutputTokens / 1_000_000) * 15;
    const total = inputCost + outputCost;
    return `$${total.toFixed(4)}`;
  }

  resetStats() {
    this.stats = {
      totalRequests: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
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
export const claudeClient = new ClaudeClient();

/**
 * ═══════════════════════════════════════════════════════════════
 * CONVENIENCE EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */
export const generateCode = (description: string, context?: string, options?: any) =>
  claudeClient.generateCode(description, context, options);

export const generateTool = (description: string, context?: string) =>
  claudeClient.generateTool(description, context);

export const improveCode = (code: string, focus?: any) =>
  claudeClient.improveCode(code, focus);

export const reason = (problem: string, context?: string) =>
  claudeClient.reason(problem, context);

export const prompt = (message: string, systemPrompt?: string, options?: any) =>
  claudeClient.prompt(message, systemPrompt, options);
