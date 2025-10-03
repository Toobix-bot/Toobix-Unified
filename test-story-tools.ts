#!/usr/bin/env bun
/**
 * Test Script für Story Tools
 */

console.log('🧪 Testing Story Tools...\n')

const BRIDGE_URL = 'http://localhost:3337'

async function testTool(toolName: string, args: any = {}) {
  console.log(`Testing: ${toolName}`)
  
  try {
    const response = await fetch(`${BRIDGE_URL}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.log(`  ❌ FAILED: ${response.status} ${response.statusText}`)
      console.log(`  Response: ${text}\n`)
      return false
    }

    const result = await response.json()
    console.log(`  ✅ SUCCESS`)
    console.log(`  Result:`, JSON.stringify(result, null, 2).slice(0, 200), '...\n')
    return true
  } catch (error) {
    console.log(`  ❌ ERROR: ${error}\n`)
    return false
  }
}

async function main() {
  console.log('1️⃣ Testing story_state...')
  await testTool('story_state', {})

  console.log('2️⃣ Testing story_refresh...')
  await testTool('story_refresh', {})

  console.log('3️⃣ Testing story_events...')
  await testTool('story_events', { limit: 10 })

  console.log('\n✅ Test complete!')
}

main().catch(console.error)
