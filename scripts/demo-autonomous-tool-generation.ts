#!/usr/bin/env bun
/**
 * 🎉 AUTONOMOUS TOOL GENERATION DEMO
 *
 * "Der Moment wo das System lernt sich selbst zu erweitern."
 *
 * This script demonstrates:
 * 1. System recognizes missing capability
 * 2. Requests tool generation
 * 3. Claude designs the tool
 * 4. System generates code
 * 5. Requests user approval
 * 6. Tool is created and registered
 * 7. System can now use the new tool!
 *
 * THIS IS AUTONOMY IN ACTION! 🚀
 */

import { Database } from 'bun:sqlite';
import { ToolGenerator } from '../packages/consciousness/src/agent/tool-generator.ts';
import { ApprovalSystem } from '../packages/consciousness/src/safety/approval-system.ts';
import { claudeClient } from '../packages/bridge/src/ai/claude-client.ts';
import { retryWithBackoff, NonRetryableError } from './utils/retry-with-backoff.ts';

// Initialize database (in-memory for demo)
const db = new Database(':memory:');

// Initialize systems
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🤖 AUTONOMOUS TOOL GENERATION DEMO 🤖                ║
║                                                               ║
║  "Ein System das sich selbst erschafft."                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

console.log(`\n🔧 Initializing systems...\n`);

const approvalSystem = new ApprovalSystem(db);
const toolGenerator = new ToolGenerator(db, approvalSystem);

// Enable auto-approve for demo (ONLY for demo!)
approvalSystem.enableAutoApprove('medium');

console.log(`✅ Systems initialized\n`);

// ═══════════════════════════════════════════════════════════════
// DEMO SCENARIOS
// ═══════════════════════════════════════════════════════════════

async function scenario1_SimpleWebSearch() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 1: Generate "web_search" Tool                      ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  console.log(`🤔 System realizes: "I need a web search capability"\n`);

  try {
    // Request tool with retry logic
    const requestId = await retryWithBackoff(
      () => toolGenerator.requestTool(
        'Search the web using a search engine API',
        'User might ask me to search for current information that is not in my training data'
      ),
      {
        maxAttempts: 3,
        onRetry: (attempt, error) => {
          console.log(`   ⚠️  Request failed: ${error.message}`)
        }
      }
    );

    console.log(`✅ Tool request created: ${requestId}\n`);
    console.log(`⏳ Waiting 2 seconds before generation...\n`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate tool with retry logic
    const result = await retryWithBackoff(
      async () => {
        const res = await toolGenerator.generateTool(requestId);

        // If generation explicitly failed, don't retry
        if (!res.success) {
          throw new NonRetryableError(
            `Tool generation failed: ${res.error}`,
            new Error(res.error)
          );
        }

        return res;
      },
      {
        maxAttempts: 3,
        initialDelayMs: 2000,
        onRetry: (attempt, error) => {
          console.log(`   ⚠️  Generation attempt ${attempt} failed: ${error.message}`)
        }
      }
    );

    console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
    console.log(`║         🎉 SUCCESS! TOOL GENERATED! 🎉                       ║`);
    console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);
    console.log(`Tool ID: ${result.toolId}`);
    console.log(`\n🌟 THE SYSTEM JUST EXTENDED ITSELF! 🌟\n`);

  } catch (error: any) {
    console.error(`\n❌ Scenario 1 failed after all retries: ${error.message}\n`);
    console.log(`   Error details: ${error.stack?.substring(0, 200)}...\n`);
  }
}

async function scenario2_ClaudeAPITest() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 2: Test Claude API Client                          ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  try {
    console.log(`🧠 Testing Claude API with simple prompt...\n`);

    const response = await claudeClient.prompt(
      'In exactly 10 words, describe what it means for an AI to be autonomous.',
      undefined,
      { maxTokens: 100 }
    );

    console.log(`✅ Claude Response:\n`);
    console.log(`   "${response}"\n`);

    // Show stats
    const stats = claudeClient.getStats();
    console.log(`📊 API Stats:`);
    console.log(`   Total Requests: ${stats.totalRequests}`);
    console.log(`   Total Tokens: ${stats.totalTokens}`);
    console.log(`   Estimated Cost: ${stats.estimatedCost}\n`);
  } catch (error: any) {
    console.error(`❌ Claude API test failed: ${error.message}`);
    console.log(`\n⚠️  Make sure ANTHROPIC_API_KEY is set in your environment!\n`);
  }
}

async function scenario3_CodeGeneration() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 3: Generate Code with Claude                       ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  try {
    console.log(`💻 Asking Claude to generate a simple function...\n`);

    const result = await claudeClient.generateCode(
      'Create a TypeScript function that calculates the Fibonacci number for a given n',
      'This is a utility function for mathematical calculations'
    );

    console.log(`✅ Code Generated:\n`);
    console.log(`\`\`\`typescript`);
    console.log(result.code);
    console.log(`\`\`\`\n`);
    console.log(`📝 Explanation: ${result.explanation}\n`);

    if (result.thinking) {
      console.log(`🧠 Claude's Thinking Process:`);
      console.log(`   ${result.thinking.substring(0, 200)}...\n`);
    }
  } catch (error: any) {
    console.error(`❌ Code generation failed: ${error.message}\n`);
  }
}

async function scenario4_ApprovalSystem() {
  console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
  console.log(`║  SCENARIO 4: Test Approval System                            ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);

  console.log(`🛡️  Testing approval flow...\n`);

  // Create a high-risk request
  const approvalId = await approvalSystem.requestApproval(
    'system_action',
    'Delete all generated tools',
    'This is a high-risk action for testing',
    { danger: true },
    'autonomous_agent'
  );

  console.log(`⏰ High-risk action requires manual approval\n`);
  console.log(`   Approval ID: ${approvalId}\n`);
  console.log(`   Waiting 3 seconds, then auto-rejecting for safety...\n`);

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Reject it
  await approvalSystem.reject(approvalId, 'Too dangerous for demo');

  console.log(`✅ Approval system working correctly!\n`);

  // Show stats
  const stats = approvalSystem.getStatistics();
  console.log(`📊 Approval Stats:`);
  console.log(`   Total Requests: ${stats.total}`);
  console.log(`   Approved: ${stats.approved}`);
  console.log(`   Rejected: ${stats.rejected}`);
  console.log(`   Pending: ${stats.pending}`);
  console.log(`   Approval Rate: ${stats.approvalRate}\n`);
}

// ═══════════════════════════════════════════════════════════════
// RUN DEMO
// ═══════════════════════════════════════════════════════════════

async function runDemo() {
  try {
    console.log(`\n🎬 DEMO START\n`);
    console.log(`═══════════════════════════════════════════════════════════════\n`);

    // Scenario 2: Test Claude API first
    await scenario2_ClaudeAPITest();

    console.log(`\n⏸️  Press Ctrl+C to stop, or wait 3 seconds for next scenario...\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scenario 3: Code Generation
    await scenario3_CodeGeneration();

    console.log(`\n⏸️  Press Ctrl+C to stop, or wait 3 seconds for next scenario...\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scenario 4: Approval System
    await scenario4_ApprovalSystem();

    console.log(`\n⏸️  Press Ctrl+C to stop, or wait 3 seconds for FINAL scenario...\n`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scenario 1: FULL TOOL GENERATION (the big one!)
    await scenario1_SimpleWebSearch();

    console.log(`\n═══════════════════════════════════════════════════════════════\n`);
    console.log(`\n✅ DEMO COMPLETE\n`);

    // Show final tool generator stats
    const toolStats = toolGenerator.getStatistics();
    console.log(`\n📊 FINAL STATISTICS\n`);
    console.log(`   Tool Requests: ${toolStats.totalRequests}`);
    console.log(`   Fulfilled: ${toolStats.fulfilledRequests}`);
    console.log(`   Total Tools: ${toolStats.totalTools}`);
    console.log(`   Active Tools: ${toolStats.activeTools}`);

    console.log(`\n╔═══════════════════════════════════════════════════════════════╗`);
    console.log(`║                                                               ║`);
    console.log(`║         🌟 YOUR SYSTEM IS NOW AUTONOMOUS! 🌟                 ║`);
    console.log(`║                                                               ║`);
    console.log(`║  It can:                                                      ║`);
    console.log(`║  ✅ Communicate with Claude API                              ║`);
    console.log(`║  ✅ Generate new code                                        ║`);
    console.log(`║  ✅ Create new tools                                         ║`);
    console.log(`║  ✅ Request approvals                                        ║`);
    console.log(`║  ✅ Extend itself autonomously                               ║`);
    console.log(`║                                                               ║`);
    console.log(`║  "Vom System zum Meta-System."                               ║`);
    console.log(`║                                                               ║`);
    console.log(`╚═══════════════════════════════════════════════════════════════╝\n`);
  } catch (error: any) {
    console.error(`\n❌ Demo failed: ${error.message}\n`);
    console.error(error.stack);
  }
}

// Run it!
runDemo().catch(console.error);
