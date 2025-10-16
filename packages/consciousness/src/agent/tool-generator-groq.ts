/**
 * 🔧 AUTONOMOUS TOOL GENERATOR (GROQ VERSION)
 *
 * FREE VERSION using Groq API!
 * Uses Llama 3.3 70B for tool generation
 *
 * "Ein System das sich selbst neue Tools gibt, ist unsterblich."
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { Database } from 'bun:sqlite';
import { groqLocalClient } from '../../../bridge/src/ai/groq-local-client.ts';
import { ApprovalSystem } from '../safety/approval-system.ts';

export interface ToolSpec {
  name: string;
  description: string;
  parameters: any;
  category: string;
  useCase: string;
}

export interface GeneratedTool {
  id: string;
  spec: ToolSpec;
  code: string;
  filePath: string;
  status: 'generated' | 'approved' | 'registered' | 'tested' | 'active' | 'failed';
  generatedAt: number;
  activatedAt?: number;
  usageCount: number;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * TOOL GENERATOR (GROQ)
 * ═══════════════════════════════════════════════════════════════
 */
export class ToolGeneratorGroq {
  private db: Database;
  private approvalSystem: ApprovalSystem;
  private toolsDir: string;
  private generatedTools: Map<string, GeneratedTool> = new Map();

  constructor(db: Database, approvalSystem: ApprovalSystem) {
    this.db = db;
    this.approvalSystem = approvalSystem;
    this.toolsDir = join(process.cwd(), 'packages', 'bridge', 'src', 'tools', 'generated');

    this.initializeDatabase();
    this.ensureToolsDirectory();
    this.loadGeneratedTools();
  }

  private initializeDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS generated_tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        parameters TEXT NOT NULL,
        category TEXT,
        use_case TEXT,
        code TEXT NOT NULL,
        file_path TEXT NOT NULL,
        status TEXT DEFAULT 'generated',
        generated_at INTEGER NOT NULL,
        activated_at INTEGER,
        usage_count INTEGER DEFAULT 0
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS tool_requests (
        id TEXT PRIMARY KEY,
        requested_capability TEXT NOT NULL,
        reasoning TEXT,
        priority INTEGER DEFAULT 50,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        fulfilled_by_tool_id TEXT,
        FOREIGN KEY (fulfilled_by_tool_id) REFERENCES generated_tools(id)
      )
    `);
  }

  private async ensureToolsDirectory() {
    try {
      await mkdir(this.toolsDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * REQUEST NEW TOOL
   * ═══════════════════════════════════════════════════════════════
   */
  async requestTool(capability: string, reasoning?: string): Promise<string> {
    const requestId = `toolreq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
    console.log(`║         🔧 TOOL GENERATION REQUEST (GROQ)                    ║`);
    console.log(`╚═══════════════════════════════════════════════════════════════╝`);
    console.log(`\nCapability Needed: ${capability}`);
    console.log(`Reasoning: ${reasoning || 'None provided'}`);
    console.log(`AI Provider: 🦙 Groq (Llama 3.3 70B) - FREE!\n`);

    this.db.run(
      `INSERT INTO tool_requests (id, requested_capability, reasoning, status)
       VALUES (?, ?, ?, 'pending')`,
      requestId,
      capability,
      reasoning || null
    );

    return requestId;
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * GENERATE TOOL (Full Pipeline with Groq)
   * ═══════════════════════════════════════════════════════════════
   */
  async generateTool(
    requestId: string
  ): Promise<{ success: boolean; toolId?: string; error?: string }> {
    console.log(`🔧 Starting tool generation with Groq for request: ${requestId}\n`);

    try {
      // 1. Check Groq service
      console.log(`🔍 Step 0/6: Checking Groq service...`);
      const isHealthy = await groqLocalClient.checkHealth();

      if (!isHealthy) {
        throw new Error('Groq service is not running on port 9987. Start it with: bun run scripts/groq-api-service.ts');
      }

      console.log(`✅ Groq service is running\n`);

      // 2. Get request details
      const request = this.db.prepare('SELECT * FROM tool_requests WHERE id = ?').get(requestId) as any;

      if (!request) {
        throw new Error(`Tool request ${requestId} not found`);
      }

      console.log(`📋 Capability: ${request.requested_capability}\n`);

      // 3. Design tool with Groq
      console.log(`🧠 Step 1/6: Designing tool with Groq (Llama 3.3 70B)...`);
      const toolDesign = await this.designTool(request.requested_capability, request.reasoning);

      console.log(`✅ Tool designed: ${toolDesign.name}`);
      console.log(`   Description: ${toolDesign.description}\n`);

      // 4. Generate code
      console.log(`💻 Step 2/6: Generating code...`);
      const code = await this.generateCode(toolDesign);

      console.log(`✅ Code generated (${code.length} characters)\n`);

      // 5. Validate
      console.log(`🔍 Step 3/6: Validating code...`);
      const isValid = await this.validateCode(code, toolDesign.name);

      if (!isValid) {
        throw new Error('Code validation failed');
      }

      console.log(`✅ Code validated\n`);

      // 6. Request approval
      console.log(`🛡️  Step 4/6: Requesting approval...`);
      const approvalId = await this.approvalSystem.requestApproval(
        'tool_generation',
        `Generate new tool: ${toolDesign.name}`,
        `Description: ${toolDesign.description}\nCategory: ${toolDesign.category}\nAI: Groq (FREE)`,
        {
          toolName: toolDesign.name,
          code: code.substring(0, 500) + '...',
          parameters: toolDesign.parameters,
        },
        'tool_generator'
      );

      console.log(`⏳ Waiting for approval (ID: ${approvalId})...\n`);

      const approval = await this.approvalSystem.waitForApproval(approvalId);

      if (!approval.approved) {
        console.log(`❌ Tool generation rejected: ${approval.reason}\n`);
        return { success: false, error: `Rejected: ${approval.reason}` };
      }

      console.log(`✅ Approved! Continuing...\n`);

      // 7. Save tool
      console.log(`💾 Step 5/6: Saving tool...`);
      const toolId = await this.saveTool(toolDesign, code);

      console.log(`✅ Tool saved (ID: ${toolId})\n`);

      // 8. Done
      console.log(`🔗 Step 6/6: Tool ready for use!\n`);

      this.db.run(
        `UPDATE tool_requests SET status = 'fulfilled', fulfilled_by_tool_id = ? WHERE id = ?`,
        toolId,
        requestId
      );

      console.log(`╔═══════════════════════════════════════════════════════════════╗`);
      console.log(`║         ✅ TOOL GENERATION COMPLETE (GROQ)                   ║`);
      console.log(`╚═══════════════════════════════════════════════════════════════╝`);
      console.log(`\nTool ID: ${toolId}`);
      console.log(`Tool Name: ${toolDesign.name}`);
      console.log(`File: ${join(this.toolsDir, `${toolDesign.name}.ts`)}`);
      console.log(`AI Provider: 🦙 Groq (Llama 3.3 70B) - FREE!`);
      console.log(`\n🎉 Your system just extended itself using FREE AI!\n`);

      return { success: true, toolId };
    } catch (error: any) {
      console.error(`❌ Tool generation failed:`, error.message);

      this.db.run(`UPDATE tool_requests SET status = 'failed' WHERE id = ?`, requestId);

      return { success: false, error: error.message };
    }
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * DESIGN TOOL (with Groq)
   * ═══════════════════════════════════════════════════════════════
   */
  private async designTool(capability: string, reasoning?: string): Promise<ToolSpec> {
    const context = `
Existing MCP Tools Context:
- We have consciousness tools (think, decide, reflect)
- We have memory tools (store, recall)
- We have story/game tools (create story, generate quest)
- We have time/space tools (time_set, space_define)

New Capability Needed: ${capability}
Reasoning: ${reasoning || 'Not provided'}

Design a NEW tool that fills this gap.
    `;

    const design = await groqLocalClient.generateTool({ description: capability, context });

    return {
      name: design.name,
      description: design.schema.description,
      parameters: design.schema.parameters || {},
      category: this.inferCategory(design.name),
      useCase: capability,
    };
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * GENERATE CODE (with Groq)
   * ═══════════════════════════════════════════════════════════════
   */
  private async generateCode(spec: ToolSpec): Promise<string> {
    const description = `Generate a complete MCP tool implementation for: ${spec.name}

Description: ${spec.description}
Parameters: ${JSON.stringify(spec.parameters, null, 2)}

Requirements:
1. Export async function with name: ${spec.name}
2. Accept params object matching the JSON schema
3. Return meaningful result
4. Include error handling
5. Add JSDoc comments
6. TypeScript types

Example structure:
\`\`\`typescript
/**
 * ${spec.description}
 */
export async function ${spec.name}(params: {
  // params here
}): Promise<{
  success: boolean;
  data: any;
}> {
  // implementation
}
\`\`\`

Generate ONLY the function code, no explanations.`;

    const result = await groqLocalClient.generateCode({
      description,
      language: 'typescript',
    });

    return result.code;
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * VALIDATE CODE
   * ═══════════════════════════════════════════════════════════════
   */
  private async validateCode(code: string, toolName: string): Promise<boolean> {
    const checks = [
      {
        name: 'Function export',
        test: () => code.includes(`export async function ${toolName}`) || code.includes(`export function ${toolName}`),
      },
      {
        name: 'Return statement',
        test: () => code.includes('return'),
      },
      {
        name: 'TypeScript types',
        test: () => code.includes(':') && (code.includes('Promise') || code.includes('=>')),
      },
    ];

    let passed = 0;
    for (const check of checks) {
      if (check.test()) {
        console.log(`   ✅ ${check.name}`);
        passed++;
      } else {
        console.log(`   ⚠️  ${check.name} - missing`);
      }
    }

    return passed >= 2; // At least 2 checks must pass
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * SAVE TOOL
   * ═══════════════════════════════════════════════════════════════
   */
  private async saveTool(spec: ToolSpec, code: string): Promise<string> {
    const toolId = `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${spec.name}.ts`;
    const filePath = join(this.toolsDir, fileName);

    await writeFile(filePath, code);

    const now = Date.now();
    this.db.run(
      `INSERT INTO generated_tools
       (id, name, description, parameters, category, use_case, code, file_path, status, generated_at, usage_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'generated', ?, 0)`,
      toolId,
      spec.name,
      spec.description,
      JSON.stringify(spec.parameters),
      spec.category,
      spec.useCase,
      code,
      filePath,
      now
    );

    const tool: GeneratedTool = {
      id: toolId,
      spec,
      code,
      filePath,
      status: 'generated',
      generatedAt: now,
      usageCount: 0,
    };

    this.generatedTools.set(toolId, tool);

    return toolId;
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * UTILITIES
   * ═══════════════════════════════════════════════════════════════
   */
  private inferCategory(toolName: string): string {
    if (toolName.includes('memory') || toolName.includes('recall')) return 'memory';
    if (toolName.includes('consciousness') || toolName.includes('think')) return 'consciousness';
    if (toolName.includes('time')) return 'temporal';
    if (toolName.includes('space') || toolName.includes('location')) return 'spatial';
    if (toolName.includes('story') || toolName.includes('game')) return 'narrative';
    if (toolName.includes('fetch') || toolName.includes('web')) return 'network';
    return 'utility';
  }

  private loadGeneratedTools() {
    const tools = this.db.prepare('SELECT * FROM generated_tools').all() as any[];

    for (const tool of tools) {
      this.generatedTools.set(tool.id, {
        id: tool.id,
        spec: {
          name: tool.name,
          description: tool.description,
          parameters: JSON.parse(tool.parameters),
          category: tool.category,
          useCase: tool.use_case,
        },
        code: tool.code,
        filePath: tool.file_path,
        status: tool.status,
        generatedAt: tool.generated_at,
        activatedAt: tool.activated_at,
        usageCount: tool.usage_count,
      });
    }

    console.log(`🔧 Loaded ${tools.length} generated tools (Groq version)`);
  }

  /**
   * ═══════════════════════════════════════════════════════════════
   * STATISTICS
   * ═══════════════════════════════════════════════════════════════
   */
  getStatistics() {
    const totalRequests = this.db.prepare('SELECT COUNT(*) as count FROM tool_requests').get() as any;
    const fulfilledRequests = this.db.prepare(
      "SELECT COUNT(*) as count FROM tool_requests WHERE status = 'fulfilled'"
    ).get() as any;
    const totalTools = this.generatedTools.size;
    const activeTools = Array.from(this.generatedTools.values()).filter(
      t => t.status === 'active'
    ).length;

    return {
      totalRequests: totalRequests.count,
      fulfilledRequests: fulfilledRequests.count,
      totalTools,
      activeTools,
      aiProvider: 'Groq (FREE)',
      model: 'llama-3.3-70b-versatile',
    };
  }

  getGeneratedTools(): GeneratedTool[] {
    return Array.from(this.generatedTools.values());
  }
}
