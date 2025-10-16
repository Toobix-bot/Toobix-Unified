#!/usr/bin/env bun
/**
 * 🎉 AUTONOMOUS TOOL GENERATION DEMO (GROQ VERSION)
 *
 * "Der Moment wo das System lernt sich selbst zu erweitern - MIT KOSTENLOSEM AI!"
 *
 * This script demonstrates:
 * 1. System recognizes missing capability
 * 2. Requests tool generation
 * 3. Groq (Llama 3.3) designs the tool - FREE!
 * 4. System generates code
 * 5. Requests user approval
 * 6. Tool is created and registered
 * 7. System can now use the new tool!
 *
 * THIS IS AUTONOMY IN ACTION - COMPLETELY FREE! 🚀🦙
 */

import { Database } from 'bun:sqlite';
import { ToolGeneratorGroq } from '../packages/consciousness/src/agent/tool-generator-groq.ts';
import { ApprovalSystem } from '../packages/consciousness/src/safety/approval-system.ts';
import { groqLocalClient } from '../packages/bridge/src/ai/groq-local-client.ts';

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║      🦙 AUTONOMOUS TOOL GENERATION DEMO (GROQ) 🦙            ║
║                                                               ║
║  "Ein System das sich selbst erschafft - KOSTENLOS!"        ║
║                                                               ║
║  AI Provider: Groq (Llama 3.3 70B)                          ║
║  Cost: FREE!                                                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

// Initialize database (in-memory for demo)
const db = new Database(':memory:');

console.log(`\n🔧 Initializing systems...\n`);

const approvalSystem = new ApprovalSystem(db);
const toolGenerator = new ToolGeneratorGroq(db, approvalSystem);

// Enable auto-approve for demo (medium risk)
approvalSystem.enableAutoApprove('medium');

console.log(`✅ Systems initialized\n`);

// ═══════════════════════════════════════════════════════════════
// DEMO SCENARIOS
// ═══════════════════════════════════════════════════════════════

async function scenario1_CheckGroqService() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 1: Check Groq Service Status                       ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  const isHealthy = await groqLocalClient.checkHealth();

  if (isHealthy) {
    console.log(`✅ Groq service is running on port 9987\n`);
    console.log(`   Model: llama-3.3-70b-versatile`);
    console.log(`   Cost: FREE!`);
    console.log(`   Ready for tool generation!\n`);
    return true;
  } else {
    console.log(`❌ Groq service is NOT running!\n`);
    console.log(`   Please start it first:`);
    console.log(`   bun run scripts/groq-api-service.ts\n`);
    return false;
  }
}

async function scenario2_TestGroqAPI() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 2: Test Groq API                                   ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  try {
    console.log(`🦙 Testing Groq with simple code generation...\n`);

    const result = await groqLocalClient.generateCode({
      description: 'Create a TypeScript function that reverses a string',
      language: 'typescript',
    });

    console.log(`✅ Groq Response:\n`);
    console.log(`Code:\n${result.code.substring(0, 300)}...\n`);
    console.log(`Explanation: ${result.explanation}\n`);

    const stats = groqLocalClient.getStats();
    console.log(`📊 Stats:`);
    console.log(`   Provider: ${stats.provider}`);
    console.log(`   Model: ${stats.model}`);
    console.log(`   Cost: ${stats.cost}`);
    console.log(`   Total Requests: ${stats.totalRequests}\n`);

    return true;
  } catch (error: any) {
    console.error(`❌ Groq API test failed: ${error.message}\n`);
    return false;
  }
}

async function scenario3_GenerateSimpleTool() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 3: Generate First Tool with Groq!                  ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  console.log(`🤔 System realizes: "I need a calculator tool"\n`);

  // Request tool
  const requestId = await toolGenerator.requestTool(
    'Create a simple calculator that can add, subtract, multiply, and divide two numbers',
    'User might ask me to perform mathematical calculations'
  );

  console.log(`✅ Tool request created: ${requestId}\n`);
  console.log(`⏳ Waiting 2 seconds before generation...\n`);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate tool
  const result = await toolGenerator.generateTool(requestId);

  if (result.success) {
    console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
    console.log(`║         🎉 SUCCESS! TOOL GENERATED! 🎉                       ║`);
    console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);
    console.log(`Tool ID: ${result.toolId}`);
    console.log(`AI Provider: 🦙 Groq (FREE!)`);
    console.log(`\n🌟 THE SYSTEM JUST EXTENDED ITSELF - FOR FREE! 🌟\n`);
    return true;
  } else {
    console.error(`\n❌ Tool generation failed: ${result.error}\n`);
    return false;
  }
}

async function scenario4_ShowToolFile() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 4: Show Generated Tool File                        ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  const tools = toolGenerator.getGeneratedTools();

  if (tools.length > 0) {
    const firstTool = tools[0];
    console.log(`📄 Generated Tool Details:\n`);
    console.log(`   Name: ${firstTool.spec.name}`);
    console.log(`   Description: ${firstTool.spec.description}`);
    console.log(`   Category: ${firstTool.spec.category}`);
    console.log(`   File: ${firstTool.filePath}\n`);
    console.log(`   Code Preview (first 500 chars):`);
    console.log(`   ${'─'.repeat(60)}`);
    console.log(`   ${firstTool.code.substring(0, 500)}...`);
    console.log(`   ${'─'.repeat(60)}\n`);
    return true;
  } else {
    console.log(`   No tools generated yet.\n`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// RUN DEMO
// ═══════════════════════════════════════════════════════════════

async function runDemo() {
  try {
    console.log(`\n🎬 DEMO START\n`);
    console.log(`═══════════════════════════════════════════════════════════════\n`);

    // Scenario 1: Check Groq Service
    const groqRunning = await scenario1_CheckGroqService();

    if (!groqRunning) {
      console.log(`\n⚠️  STOP: Groq service must be running first!\n`);
      console.log(`   Run in another terminal:`);
      console.log(`   cd C:\\Toobix-Unified`);
      console.log(`   bun run scripts/groq-api-service.ts\n`);
      console.log(`   Then run this demo again.\n`);
      return;
    }

    console.log(`\n⏸️  Press Ctrl+C to stop, or wait 3 seconds for next scenario...\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scenario 2: Test Groq API
    const groqWorks = await scenario2_TestGroqAPI();

    if (!groqWorks) {
      console.log(`\n⚠️  STOP: Groq API test failed!\n`);
      return;
    }

    console.log(`\n⏸️  Press Ctrl+C to stop, or wait 3 seconds for TOOL GENERATION...\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scenario 3: GENERATE TOOL! (The big one!)
    const toolGenerated = await scenario3_GenerateSimpleTool();

    if (!toolGenerated) {
      console.log(`\n⚠️  Tool generation failed. See error above.\n`);
      return;
    }

    console.log(`\n⏸️  Wait 3 seconds to see generated file...\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scenario 4: Show the file
    await scenario4_ShowToolFile();

    console.log(`\n═══════════════════════════════════════════════════════════════\n`);
    console.log(`\n✅ DEMO COMPLETE\n`);

    // Show final stats
    const toolStats = toolGenerator.getStatistics();
    const groqStats = groqLocalClient.getStats();

    console.log(`\n📊 FINAL STATISTICS\n`);
    console.log(`   Tool Requests: ${toolStats.totalRequests}`);
    console.log(`   Fulfilled: ${toolStats.fulfilledRequests}`);
    console.log(`   Total Tools: ${toolStats.totalTools}`);
    console.log(`   AI Provider: ${toolStats.aiProvider}`);
    console.log(`   Model: ${toolStats.model}`);
    console.log(`\n   Groq API Calls: ${groqStats.totalRequests}`);
    console.log(`   Cost: ${groqStats.cost} 💰\n`);

    console.log(`╔═══════════════════════════════════════════════════════════════╗`);
    console.log(`║                                                               ║`);
    console.log(`║         🌟 YOUR SYSTEM IS NOW AUTONOMOUS! 🌟                 ║`);
    console.log(`║                                                               ║`);
    console.log(`║  It can:                                                      ║`);
    console.log(`║  ✅ Communicate with Groq API (FREE!)                        ║`);
    console.log(`║  ✅ Generate new code                                        ║`);
    console.log(`║  ✅ Create new tools                                         ║`);
    console.log(`║  ✅ Request approvals                                        ║`);
    console.log(`║  ✅ Extend itself autonomously                               ║`);
    console.log(`║  ✅ ALL WITHOUT SPENDING MONEY!                              ║`);
    console.log(`║                                                               ║`);
    console.log(`║  "Vom System zum Meta-System - kostenlos!"                  ║`);
    console.log(`║                                                               ║`);
    console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

    console.log(`\n🎯 Next Steps:\n`);
    console.log(`   1. Check the generated tool file`);
    console.log(`   2. Generate more tools!`);
    console.log(`   3. Integrate with your MCP Bridge`);
    console.log(`   4. Watch your system grow! 🌱\n`);
  } catch (error: any) {
    console.error(`\n❌ Demo failed: ${error.message}\n`);
    console.error(error.stack);
  }
}

// Run it!
runDemo().catch(console.error);
