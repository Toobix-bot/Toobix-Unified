#!/usr/bin/env bun
// Test Script for Idle Game System
// Tests all major components

import { ExtendedGameStateManager } from './src/engine/game-state-extended'
import { ResourceManager, RESOURCE_SYMBOLS } from './src/engine/resource-manager'
import { PassiveGenerator } from './src/engine/passive-generator'
import { BuildingManager } from './src/engine/building-manager'
import { Blaze } from './src/characters/blaze'
import { colors } from './src/ui/visual-effects'

console.log(`\n${colors.primary}╔═══════════════════════════════════════════════════╗${colors.reset}`)
console.log(`${colors.primary}║   🧪 IDLE GAME SYSTEM TEST SUITE 🧪            ║${colors.reset}`)
console.log(`${colors.primary}╚═══════════════════════════════════════════════════╝${colors.reset}\n`)

let testsRun = 0
let testsPassed = 0
let testsFailed = 0

function test(name: string, fn: () => boolean | Promise<boolean>) {
  return async () => {
    testsRun++
    process.stdout.write(`${colors.dim}[${testsRun}]${colors.reset} Testing: ${name}... `)

    try {
      const result = await fn()
      if (result) {
        testsPassed++
        console.log(`${colors.love}✅ PASS${colors.reset}`)
        return true
      } else {
        testsFailed++
        console.log(`${colors.reset}❌ FAIL${colors.reset}`)
        return false
      }
    } catch (error) {
      testsFailed++
      console.log(`${colors.reset}❌ ERROR: ${error}${colors.reset}`)
      return false
    }
  }
}

// ========== TEST SUITE ==========

async function runTests() {
  console.log(`${colors.accent}📦 Testing Resource Manager...${colors.reset}\n`)

  // Test 1: Resource Manager Creation
  await test('ResourceManager creation', () => {
    const rm = new ResourceManager()
    return rm.getResource('codeEnergy') === 100 // Default starting amount
  })()

  // Test 2: Add Resources
  await test('Add resources', () => {
    const rm = new ResourceManager()
    rm.addResource('codeEnergy', 50)
    return rm.getResource('codeEnergy') === 150
  })()

  // Test 3: Spend Resources
  await test('Spend resources', () => {
    const rm = new ResourceManager()
    const success = rm.spendResource('codeEnergy', 50)
    return success && rm.getResource('codeEnergy') === 50
  })()

  // Test 4: Resource Caps
  await test('Resource caps', () => {
    const rm = new ResourceManager()
    rm.addResource('codeEnergy', 10000) // Try to add way over cap
    return rm.getResource('codeEnergy') === 1000 // Should be capped at 1000
  })()

  // Test 5: Multiple Resources
  await test('Spend multiple resources', () => {
    const rm = new ResourceManager()
    rm.addResource('creativityPoints', 100)
    const success = rm.spendResources({
      codeEnergy: 50,
      creativityPoints: 50
    })
    return success && rm.getResource('codeEnergy') === 50 && rm.getResource('creativityPoints') === 50
  })()

  console.log(`\n${colors.accent}⚡ Testing Passive Generator...${colors.reset}\n`)

  // Test 6: Passive Generator Creation
  await test('PassiveGenerator creation', () => {
    const pg = new PassiveGenerator()
    return pg !== null
  })()

  // Test 7: Passive Generation
  await test('Passive generation', () => {
    const rm = new ResourceManager()
    const initialEnergy = rm.getResource('codeEnergy')
    const generated = rm.generatePassive(1) // 1 minute
    return generated.codeEnergy !== undefined && generated.codeEnergy > 0
  })()

  console.log(`\n${colors.accent}🏗️ Testing Building Manager...${colors.reset}\n`)

  // Test 8: Building Manager Creation
  await test('BuildingManager creation', () => {
    const bm = new BuildingManager()
    return bm !== null
  })()

  // Test 9: Get Building
  await test('Get building', () => {
    const bm = new BuildingManager()
    const building = bm.getBuilding('code-monastery')
    return building !== undefined && building.name === 'Code Monastery'
  })()

  // Test 10: Check Unlock Requirements
  await test('Check unlock requirements', () => {
    const gameState = new ExtendedGameStateManager('./test-data')
    const bm = new BuildingManager()
    const unlocked = bm.isUnlocked('code-monastery', gameState.getState())
    return unlocked === true // Always unlocked
  })()

  // Test 11: Purchase Building (should fail without resources)
  await test('Purchase building (insufficient funds)', () => {
    const gameState = new ExtendedGameStateManager('./test-data')
    const rm = new ResourceManager({ codeEnergy: 50 } as any) // Not enough
    const bm = new BuildingManager()
    const result = bm.upgradeBuilding('code-monastery', rm, gameState.getState())
    return result.success === false
  })()

  // Test 12: Purchase Building (success)
  await test('Purchase building (sufficient funds)', () => {
    const gameState = new ExtendedGameStateManager('./test-data')
    const rm = new ResourceManager({ codeEnergy: 200 } as any) // Enough
    const bm = new BuildingManager()
    const result = bm.upgradeBuilding('code-monastery', rm, gameState.getState())
    return result.success === true
  })()

  console.log(`\n${colors.accent}🔥 Testing Blaze Character...${colors.reset}\n`)

  // Test 13: Blaze Creation
  await test('Blaze character creation', () => {
    const gameState = new ExtendedGameStateManager('./test-data')
    const blaze = new Blaze(gameState)
    return blaze !== null && blaze.getName() === 'Blaze'
  })()

  // Test 14: Blaze Dialogue
  await test('Blaze has dialogues', () => {
    const gameState = new ExtendedGameStateManager('./test-data')
    const blaze = new Blaze(gameState)
    const state = blaze.getState()
    return state.mood !== undefined
  })()

  // Test 15: Blaze Unlock Check
  await test('Blaze unlock requirements', () => {
    const gameState = new ExtendedGameStateManager('./test-data')
    // Set creativity to 70
    gameState.addStat('creativity', 60) // Base is 10, so 10+60=70
    const canUnlock = Blaze.checkUnlock(gameState)
    return canUnlock === true
  })()

  console.log(`\n${colors.primary}╔═══════════════════════════════════════════════════╗${colors.reset}`)
  console.log(`${colors.primary}║              📊 TEST RESULTS 📊                  ║${colors.reset}`)
  console.log(`${colors.primary}╚═══════════════════════════════════════════════════╝${colors.reset}\n`)

  console.log(`${colors.accent}Total Tests:${colors.reset} ${testsRun}`)
  console.log(`${colors.love}✅ Passed:${colors.reset} ${testsPassed}`)
  console.log(`${colors.reset}❌ Failed:${colors.reset} ${testsFailed}`)

  const passRate = ((testsPassed / testsRun) * 100).toFixed(1)
  console.log(`${colors.wisdom}📈 Pass Rate:${colors.reset} ${passRate}%\n`)

  if (testsFailed === 0) {
    console.log(`${colors.love}🎉 ALL TESTS PASSED! System is ready! 🎉${colors.reset}\n`)
  } else {
    console.log(`${colors.reset}⚠️  Some tests failed. Check implementation.${colors.reset}\n`)
  }

  // Cleanup test data
  try {
    const fs = await import('fs')
    if (fs.existsSync('./test-data')) {
      fs.rmSync('./test-data', { recursive: true, force: true })
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

// Run tests
runTests().catch(console.error)
