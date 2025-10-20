#!/usr/bin/env bun
/**
 * Master File Manager Demo
 * Showcases ALL advanced features
 */

import { createMasterFileManager } from './master'

async function main() {
  console.log('🚀 MASTER FILE MANAGER DEMO\n')
  console.log('This demo showcases ALL advanced features:\n')
  console.log('  1. ✅ Smart Content-based Organization')
  console.log('  2. 🤖 Autonomous Agent & Learning')
  console.log('  3. 📋 Clipboard History & Management')
  console.log('  4. 🧠 Context Awareness & Suggestions')
  console.log('  5. ⏰ Task Scheduler (Auto-maintenance)')
  console.log('')

  // Get Groq API key
  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY not set')
    console.log('   Set it with: $env:GROQ_API_KEY="your-key"')
    process.exit(1)
  }

  // Get target path
  const targetPath = process.argv[2]
  if (!targetPath) {
    console.error('❌ Please provide a directory path')
    console.log('   Usage: bun run src/demo-master.ts "C:\\path\\to\\folder"')
    process.exit(1)
  }

  console.log('🔧 Initializing Master File Manager...\n')

  // Create master file manager with all features
  const master = createMasterFileManager({
    groqApiKey,
    autonomousEnabled: false, // Start disabled (will enable in demo)
    autoOrganize: false,
    learningMode: true,
    watchClipboard: false, // Start disabled
    watchContext: false, // Start disabled
    scheduler: false, // Start disabled
  })

  console.log('✅ Master File Manager ready!\n')

  // === DEMO 1: Smart Organization ===
  console.log('═══════════════════════════════════════════════════════')
  console.log('📊 DEMO 1: Smart Content-Based Organization')
  console.log('═══════════════════════════════════════════════════════\n')

  try {
    console.log('🧠 Analyzing files with content-based categorization...\n')
    const plan = await master.smartOrganize(targetPath, true)

    console.log('\n📊 Organization Plan:')
    console.log(`   Files: ${plan.files.length}`)
    console.log(`   Categories: ${Object.keys(plan.structure).length}`)
    console.log('\n   Structure:')
    for (const [category, files] of Object.entries(plan.structure)) {
      console.log(`   📁 ${category}: ${files.length} files`)
    }

    console.log('\n✅ Content-based organization complete!')
  } catch (error) {
    console.error('❌ Error:', (error as Error).message)
  }

  console.log('\n')
  await sleep(2000)

  // === DEMO 2: Autonomous Agent ===
  console.log('═══════════════════════════════════════════════════════')
  console.log('🤖 DEMO 2: Autonomous Agent & Decision Making')
  console.log('═══════════════════════════════════════════════════════\n')

  master.enableFeature('autonomous')

  try {
    console.log('🔍 Running proactive scan...\n')
    const decisions = await master.autonomous.proactiveScan()

    console.log(`✅ Found ${decisions.length} actionable items\n`)

    if (decisions.length > 0) {
      const firstDecision = decisions[0]
      console.log('📋 Example Decision:')
      console.log(`   Situation: ${firstDecision.situation}`)
      console.log(`   Chosen Action: ${firstDecision.chosen.action}`)
      console.log(`   Reasoning: ${firstDecision.reasoning}`)
      console.log(`   Confidence: ${(firstDecision.confidence * 100).toFixed(0)}%`)
    }

    console.log('\n📊 Autonomous Agent Stats:')
    const stats = master.autonomous.getStats()
    console.log(`   Total Decisions: ${stats.totalDecisions}`)
    console.log(`   Executed: ${stats.executed}`)
    console.log(`   Approval Rate: ${stats.approvalRate.toFixed(1)}%`)
    console.log(`   Learnings: ${stats.learnings}`)
  } catch (error) {
    console.error('❌ Error:', (error as Error).message)
  }

  console.log('\n')
  await sleep(2000)

  // === DEMO 3: Clipboard Manager ===
  console.log('═══════════════════════════════════════════════════════')
  console.log('📋 DEMO 3: Clipboard History & Management')
  console.log('═══════════════════════════════════════════════════════\n')

  master.enableFeature('clipboard')

  console.log('👀 Watching clipboard for 10 seconds...')
  console.log('   (Copy something to clipboard now!)\n')

  await sleep(10000)

  const clipboardStats = master.clipboard.getStats()
  console.log('📊 Clipboard Stats:')
  console.log(`   Total Entries: ${clipboardStats.totalEntries}`)
  console.log(`   Text: ${clipboardStats.byType.text}`)
  console.log(`   Files: ${clipboardStats.byType.file}`)

  const recentClipboard = master.clipboard.getRecent(3)
  if (recentClipboard.length > 0) {
    console.log('\n   Recent clipboard entries:')
    recentClipboard.forEach((entry, i) => {
      console.log(`   ${i + 1}. [${entry.type}] ${entry.content.substring(0, 50)}...`)
    })
  }

  master.disableFeature('clipboard')

  console.log('\n')
  await sleep(2000)

  // === DEMO 4: Context Awareness ===
  console.log('═══════════════════════════════════════════════════════')
  console.log('🧠 DEMO 4: Context Awareness & Proactive Suggestions')
  console.log('═══════════════════════════════════════════════════════\n')

  master.enableFeature('context')

  console.log('🔍 Analyzing user context...\n')
  await sleep(3000) // Wait for context capture

  const currentContext = master.context.getCurrentContext()
  if (currentContext) {
    console.log('📊 Current Context:')
    console.log(`   Activity: ${currentContext.currentActivity}`)
    console.log(`   Active App: ${currentContext.activeProcess}`)
    console.log(`   Mood: ${currentContext.mood}`)
    console.log(`   Open Apps: ${currentContext.openApplications.length}`)

    if (currentContext.suggestions.length > 0) {
      console.log('\n💡 AI Suggestions:')
      currentContext.suggestions.forEach((suggestion, i) => {
        console.log(`   ${i + 1}. ${suggestion}`)
      })
    }
  }

  console.log('\n📊 Context Stats:')
  const contextStats = master.context.getStats()
  console.log(`   Total Captures: ${contextStats.totalCaptures}`)
  console.log(`   Most Common Activity: ${contextStats.mostCommonActivity}`)
  console.log(`   Most Common Mood: ${contextStats.mostCommonMood}`)

  master.disableFeature('context')

  console.log('\n')
  await sleep(2000)

  // === DEMO 5: Task Scheduler ===
  console.log('═══════════════════════════════════════════════════════')
  console.log('⏰ DEMO 5: Automated Task Scheduler')
  console.log('═══════════════════════════════════════════════════════\n')

  console.log('📋 Available Scheduled Tasks:')
  const tasks = master.scheduler.getTasks()
  tasks.forEach((task, i) => {
    console.log(`   ${i + 1}. ${task.name} (${task.schedule})`)
    console.log(`      ${task.description}`)
    console.log(`      Status: ${task.enabled ? '✅ Enabled' : '❌ Disabled'}`)
  })

  console.log('\n📊 Scheduler Stats:')
  const schedulerStats = master.scheduler.getStats()
  console.log(`   Total Tasks: ${schedulerStats.totalTasks}`)
  console.log(`   Enabled Tasks: ${schedulerStats.enabledTasks}`)
  console.log(`   Total Runs: ${schedulerStats.totalRuns}`)
  console.log(`   Success Rate: ${schedulerStats.successRate.toFixed(1)}%`)

  console.log('\n')
  await sleep(2000)

  // === COMPLETE STATUS ===
  console.log('═══════════════════════════════════════════════════════')
  console.log('📊 COMPLETE SYSTEM STATUS')
  console.log('═══════════════════════════════════════════════════════\n')

  const status = master.getStatus()

  console.log('🚀 File Manager: ✅ Active')
  console.log(`🤖 Autonomous Agent: ${status.autonomous.enabled ? '✅ Enabled' : '❌ Disabled'}`)
  console.log(`   - Decisions: ${status.autonomous.stats.totalDecisions}`)
  console.log(`   - Learnings: ${status.autonomous.stats.learnings}`)

  console.log(`📋 Clipboard: ${status.clipboard.watching ? '👀 Watching' : '❌ Off'}`)
  console.log(`   - Entries: ${status.clipboard.stats.totalEntries}`)

  console.log(`🧠 Context: ${status.context.watching ? '👀 Watching' : '❌ Off'}`)
  console.log(`   - Captures: ${status.context.stats.totalCaptures}`)

  console.log(`⏰ Scheduler: ${status.scheduler.running ? '✅ Running' : '❌ Off'}`)
  console.log(`   - Enabled Tasks: ${status.scheduler.stats.enabledTasks}/${status.scheduler.stats.totalTasks}`)

  console.log('\n')

  // === PROACTIVE MODE DEMO ===
  console.log('═══════════════════════════════════════════════════════')
  console.log('🔥 DEMO 6: Full Proactive Assistant Mode')
  console.log('═══════════════════════════════════════════════════════\n')

  console.log('🚀 Starting proactive mode (all features enabled)...\n')

  const proactiveDecisions = await master.startProactiveMode()

  console.log(`✅ Proactive mode ACTIVE!`)
  console.log(`   Found ${proactiveDecisions.length} immediate actionable items`)
  console.log('\n💡 The system is now:')
  console.log('   - 🤖 Making autonomous decisions')
  console.log('   - 📋 Watching your clipboard')
  console.log('   - 🧠 Tracking your context')
  console.log('   - ⏰ Running scheduled tasks')
  console.log('   - 📚 Learning from your preferences\n')

  console.log('💡 Try these commands:')
  console.log('   - Copy something (clipboard will track it)')
  console.log('   - Open/close apps (context will notice)')
  console.log('   - Wait for scheduled tasks to run')

  console.log('\n⚠️  Press Ctrl+C to stop\n')

  // Keep running
  await new Promise(() => {}) // Infinite wait
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

main().catch(console.error)
