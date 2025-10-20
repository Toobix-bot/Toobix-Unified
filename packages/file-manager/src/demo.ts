#!/usr/bin/env bun
/**
 * File Manager Demo
 * Test the AI-powered file organization
 */

import { createFileManager } from './index'

async function main() {
  console.log('🎯 File Manager Demo\n')

  // Get Groq API key from environment
  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY environment variable not set')
    console.log('   Set it with: $env:GROQ_API_KEY="your-key-here"')
    process.exit(1)
  }

  // Get directory path from command line
  const targetPath = process.argv[2]
  if (!targetPath) {
    console.error('❌ Please provide a directory path')
    console.log('   Usage: bun run src/demo.ts "C:\\path\\to\\folder"')
    process.exit(1)
  }

  // Create file manager
  const fileManager = createFileManager({
    groqApiKey,
    model: 'llama-3.3-70b-versatile',
  })

  try {
    // Organize directory (DRY RUN first)
    console.log('🔍 Running in DRY RUN mode (no files will be moved)\n')
    const plan = await fileManager.organizeDirectory(targetPath, true)

    console.log('\n✅ Preview complete!')
    console.log('\nTo actually move files, run:')
    console.log('   bun run src/demo.ts "' + targetPath + '" --execute')

    // If --execute flag is present, do it for real
    if (process.argv.includes('--execute')) {
      console.log('\n⚡ Executing plan for real...\n')
      await fileManager.executePlan(targetPath, plan, false)
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
