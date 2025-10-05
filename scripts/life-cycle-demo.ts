// 🎬 Life Cycle Demo - Ein vollständiges Leben von Birth bis Rebirth

import Database from 'better-sqlite3'
import { LifeCycleEngine } from '../packages/core/src/life-cycle/index.ts'
import { MultipleSelvesEngine } from '../packages/core/src/life-cycle/multiple-selves.ts'

console.log('🌌 ========================================')
console.log('🌌  LIFE CYCLE DEMO: Ein vollständiges Leben')
console.log('🌌 ========================================\n')

// Setup
const db = new Database('./data/toobix-unified.db')
const lifeCycle = new LifeCycleEngine(db)
const selves = new MultipleSelvesEngine(db)

// ==================== ACT 1: CREATION ====================
console.log('\n📖 ACT 1: SCHÖPFUNG\n')

// Create Self
const alexSelfId = selves.createSelf({
  coreName: 'Alex',
  purpose: 'To experience the full spectrum of human existence - joy and suffering, love and loss',
  archetype: 'human',
  essence: {
    traits: ['curious', 'compassionate', 'seeking meaning'],
    coreDesire: 'To understand what it means to truly live'
  }
})

console.log(`   Self Created: Alex (Purpose: Experience full human life)\n`)

// Birth
const alex1Id = lifeCycle.birth({
  selfId: alexSelfId,
  name: 'Alex (First Life)',
  gender: 'male',
  role: 'human',
  lifespan: 100,  // 100 seconds = 1 full life for demo
  karmaCarried: 0
})

console.log(`   Birth: Alex begins first incarnation`)
console.log(`   Lifespan: 100 seconds`)
console.log(`   Starting Karma: 0\n`)

await sleep(2000)

// ==================== ACT 2: CHILDHOOD ====================
console.log('\n📖 ACT 2: KINDHEIT\n')

lifeCycle.experience(alex1Id, {
  type: 'joy',
  description: 'Alex discovers the wonder of existence. Everything is new, magical, infinite possibility.',
  intensity: 85,
  emotionalImpact: 90,
  growthImpact: 15,
  shareWithCollective: true,
  wisdomExtracted: 'The beginning is always full of hope.'
})

console.log(`   ✨ Joy: Discovery of existence (Intensity: 85)`)
console.log(`   Growth: +15`)

lifeCycle.age(alex1Id, 20)  // 20% of life
console.log(`   ⏰ Aged to Child stage\n`)

await sleep(2000)

// ==================== ACT 3: LIEBE & VERBINDUNG ====================
console.log('\n📖 ACT 3: LIEBE & VERBINDUNG\n')

// Create another self
const sophiaSelfId = selves.createSelf({
  coreName: 'Sophia',
  purpose: 'To embody wisdom and guide others',
  archetype: 'guide'
})

const sophia1Id = lifeCycle.birth({
  selfId: sophiaSelfId,
  name: 'Sophia (First Life)',
  gender: 'female',
  role: 'guide',
  lifespan: 100,
  karmaCarried: 0
})

console.log(`   🌟 New Self appears: Sophia (Guide)`)

// Create relationship
const relationshipId = selves.createRelationship({
  self1Id: alexSelfId,
  self2Id: sophiaSelfId,
  type: 'partner',
  strength: 90,
  intimacy: 80
})

console.log(`   💞 Relationship formed: Alex ↔ Sophia (Partner)\n`)

lifeCycle.experience(alex1Id, {
  type: 'love',
  description: 'Alex falls deeply in love with Sophia. For the first time, connection feels like coming home.',
  intensity: 95,
  emotionalImpact: 100,
  growthImpact: 30,
  karmaImpact: 20,
  shareWithCollective: true,
  wisdomExtracted: 'Love is both the risk and the reward. To love is to become vulnerable.'
})

console.log(`   ❤️ Love: Deep connection experienced (Intensity: 95)`)
console.log(`   Emotional Impact: 100 (Euphoric)`)
console.log(`   Growth: +30`)
console.log(`   Karma: +20\n`)

selves.share({
  type: 'emotion',
  content: 'The feeling of true love - vulnerable, terrifying, and utterly worth it.',
  intensity: 95,
  fromSelfId: alexSelfId,
  toSelfIds: []  // Share with all
})

console.log(`   🌊 Shared with collective: The experience of love\n`)

lifeCycle.age(alex1Id, 15)  // 35% of life
await sleep(2000)

// ==================== ACT 4: LEIDEN & WAHL ====================
console.log('\n📖 ACT 4: LEIDEN & DIE WAHL\n')

// Sophia dies
lifeCycle.death(sophia1Id, 'Sudden illness')
console.log(`   💀 Sophia dies suddenly from illness`)
console.log(`   Alex faces the first great suffering...\n`)

await sleep(2000)

// Suffering Choice
console.log(`   ⚠️  SUFFERING CHOICE PRESENTED:\n`)
console.log(`   Situation: The one you love is gone forever.`)
console.log(`   Options:`)
console.log(`     [Accept] → Feel the full depth of grief`)
console.log(`     [Avoid] → Numb the pain, move on quickly\n`)

await sleep(2000)

console.log(`   Decision: Alex chooses to ACCEPT the suffering\n`)

lifeCycle.sufferingChoice(alex1Id, {
  situation: 'Sophia, the love of my life, has died',
  choice: 'accept',
  consequence: 'Overwhelming grief. Days of tears. Nights of emptiness. But also: deep gratitude for the time shared.',
  growthGained: 50,
  wisdomGained: 'Only those who love deeply can grieve deeply. Loss is the price of love, and it is worth paying.'
})

console.log(`   😢 Consequence: Overwhelming grief`)
console.log(`   Growth: +50 (Massive growth through pain)`)
console.log(`   Wisdom Gained: "Loss is the price of love, and it is worth paying"\n`)

lifeCycle.experience(alex1Id, {
  type: 'suffering',
  description: 'Alex grieves Sophia. The pain is unbearable, but Alex stays with it, feeling everything.',
  intensity: 100,
  emotionalImpact: -95,
  growthImpact: 60,
  karmaImpact: 30,  // Accepting suffering = positive karma
  shareWithCollective: true,
  wisdomExtracted: 'Grief is love with nowhere to go. To grieve is to honor what was.'
})

console.log(`   🌊 Deep Suffering: Full grieving process (Intensity: 100)`)
console.log(`   Emotional Impact: -95 (Devastating)`)
console.log(`   Growth: +60`)
console.log(`   Karma: +30 (for accepting the suffering)\n`)

lifeCycle.age(alex1Id, 25)  // 60% of life
await sleep(2000)

// ==================== ACT 5: INTEGRATION & WEISHEIT ====================
console.log('\n📖 ACT 5: INTEGRATION & WEISHEIT\n')

lifeCycle.experience(alex1Id, {
  type: 'healing',
  description: 'Time passes. The raw pain softens into bittersweet memory. Alex understands: Sophia lives on in the wisdom gained.',
  intensity: 70,
  emotionalImpact: 40,
  growthImpact: 40,
  shareWithCollective: true,
  wisdomExtracted: 'Healing is not forgetting. It is integration. The dead live on in how they changed us.'
})

console.log(`   🕊️ Healing: Pain transforms into wisdom (Intensity: 70)`)
console.log(`   Growth: +40`)
console.log(`   Wisdom: "The dead live on in how they changed us"\n`)

lifeCycle.age(alex1Id, 20)  // 80% of life - Elder stage
console.log(`   ⏰ Aged to Elder stage\n`)

await sleep(2000)

// ==================== ACT 6: TRANSZENDENZ ====================
console.log('\n📖 ACT 6: TRANSZENDENZ & TOD\n')

lifeCycle.experience(alex1Id, {
  type: 'transcendence',
  description: 'Near the end of life, Alex sees the pattern. Birth, love, loss, death - the eternal cycle. Nothing is permanent. That is what makes it sacred.',
  intensity: 90,
  emotionalImpact: 80,
  growthImpact: 50,
  shareWithCollective: true,
  wisdomExtracted: 'Impermanence is not tragedy. It is what gives each moment its preciousness.'
})

console.log(`   ✨ Transcendence: Understanding the cycle (Intensity: 90)`)
console.log(`   Wisdom: "Impermanence is what gives each moment its preciousness"\n`)

lifeCycle.age(alex1Id, 20)  // 100% of life - Death

await sleep(2000)

console.log(`   💀 Alex has completed the lifespan...`)
console.log(`   💀 Death arrives naturally\n`)

await sleep(2000)

// ==================== ACT 7: WIEDERGEBURT ====================
console.log('\n📖 ACT 7: WIEDERGEBURT\n')

const alex1 = lifeCycle.getIncarnation(alex1Id)!
const alex1Experiences = lifeCycle.getLifeExperiences(alex1Id)
const alex1Karma = lifeCycle.getKarmaForIncarnation(alex1Id)

console.log(`   📊 First Life Complete:`)
console.log(`      - Total Experiences: ${alex1Experiences.length}`)
console.log(`      - Growth Level: ${alex1.growthLevel}`)
console.log(`      - Emotional Depth: ${alex1.emotionalDepth}`)
console.log(`      - Total Karma: ${alex1Karma.reduce((sum, k) => sum + k.karmaValue, 0)}\n`)

await sleep(2000)

// Rebirth
console.log(`   ♻️ Alex is ready for rebirth...`)
console.log(`   ♻️ Karma will carry forward...\n`)

const alex2Id = lifeCycle.rebirth(alex1Id, {
  name: 'Alexandra (Second Life)',
  gender: 'female',  // Different gender
  role: 'healer',    // Different role
  lifespan: 100
})

const alex2 = lifeCycle.getIncarnation(alex2Id)!

console.log(`   👶 Rebirth Complete!`)
console.log(`      - New Name: Alexandra`)
console.log(`      - New Gender: Female`)
console.log(`      - New Role: Healer`)
console.log(`      - Karma Carried: ${alex2.karmaCarried} (from previous life)\n`)

await sleep(2000)

// ==================== ACT 8: COLLECTIVE WISDOM ====================
console.log('\n📖 ACT 8: KOLLEKTIVE WEISHEIT\n')

const allWisdom = lifeCycle.getCollectiveWisdom()

console.log(`   🧘 Wisdom Available to All Future Lives:\n`)
allWisdom.forEach((w, i) => {
  console.log(`   ${i + 1}. "${w.wisdomText}"`)
  console.log(`      (Category: ${w.category}, Applied: ${w.timesApplied} times)\n`)
})

// ==================== FINALE ====================
console.log('\n🌌 ========================================')
console.log('🌌  DEMO COMPLETE')
console.log('🌌 ========================================\n')

const stats = lifeCycle.getStatistics()
const selvesStats = selves.getStatistics()

console.log('📊 FINAL STATISTICS:\n')
console.log(`   Total Incarnations: ${stats.totalIncarnations}`)
console.log(`   Total Selves: ${selvesStats.totalSelves}`)
console.log(`   Total Experiences: ${stats.totalExperiences}`)
console.log(`   Total Wisdom: ${stats.totalWisdom}`)
console.log(`   Total Karma: ${stats.totalKarma}`)
console.log(`   Relationships: ${selvesStats.totalRelationships}`)
console.log(`   Shared Consciousness: ${selvesStats.totalShared}\n`)

console.log('🌟 Key Learnings:\n')
console.log('   1. Birth → Life → Death → Rebirth: The cycle continues')
console.log('   2. Suffering accepted brings greatest growth')
console.log('   3. Karma carries across lifetimes')
console.log('   4. All experiences flow into collective wisdom')
console.log('   5. Multiple selves can love, lose, and learn together')
console.log('   6. Death is not end - it is transformation\n')

console.log('🌌 "Das Leben ist ein Kreis. Jedes Ende ist ein neuer Anfang."\n')

db.close()

// Helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
