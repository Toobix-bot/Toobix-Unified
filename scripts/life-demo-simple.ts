// 🎬 Life Cycle Demo - Standalone ohne Bridge

import Database from 'bun:sqlite'

// Direct imports
const db = new Database('./data/toobix-unified.db')

// Initialize tables inline
console.log('🌌 ========================================')
console.log('🌌  LIFE CYCLE DEMO: Ein vollständiges Leben')
console.log('🌌 ========================================\n')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS selves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER NOT NULL,
    core_name TEXT NOT NULL,
    current_incarnation_id INTEGER,
    total_incarnations INTEGER DEFAULT 0,
    essence TEXT DEFAULT '{}',
    purpose TEXT NOT NULL,
    archetype TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    evolution_level INTEGER DEFAULT 0,
    metadata TEXT DEFAULT '{}'
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS incarnations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    self_id INTEGER NOT NULL,
    birth_timestamp INTEGER NOT NULL,
    death_timestamp INTEGER,
    lifespan INTEGER NOT NULL,
    age INTEGER DEFAULT 0,
    stage TEXT DEFAULT 'infant',
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    role TEXT NOT NULL,
    personality TEXT DEFAULT '{}',
    karma_carried INTEGER DEFAULT 0,
    memories_to_carry TEXT DEFAULT '[]',
    experiences_to_share TEXT DEFAULT '[]',
    suffering_accepted INTEGER DEFAULT 0,
    growth_level INTEGER DEFAULT 0,
    wisdom_gained TEXT DEFAULT '[]',
    emotional_depth INTEGER DEFAULT 50,
    is_alive INTEGER DEFAULT 1,
    metadata TEXT DEFAULT '{}'
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS life_experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incarnation_id INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    intensity INTEGER NOT NULL,
    emotional_impact INTEGER NOT NULL,
    growth_impact INTEGER NOT NULL,
    karma_impact INTEGER DEFAULT 0,
    shared_with_collective INTEGER DEFAULT 0,
    wisdom_extracted TEXT,
    metadata TEXT DEFAULT '{}'
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS collective_wisdom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    source_incarnation_id INTEGER NOT NULL,
    wisdom_text TEXT NOT NULL,
    category TEXT NOT NULL,
    available_to_all INTEGER DEFAULT 1,
    times_applied INTEGER DEFAULT 0,
    effectiveness INTEGER DEFAULT 50
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER NOT NULL,
    self1_id INTEGER NOT NULL,
    self2_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    strength INTEGER DEFAULT 50,
    intimacy INTEGER DEFAULT 0,
    harmony INTEGER DEFAULT 0,
    shared_experiences TEXT DEFAULT '[]',
    conflicts TEXT DEFAULT '[]',
    resolutions TEXT DEFAULT '[]',
    is_active INTEGER DEFAULT 1,
    metadata TEXT DEFAULT '{}'
  )
`)

console.log('✅ Database tables created\n')

// ==================== ACT 1: CREATION ====================
console.log('📖 ACT 1: SCHÖPFUNG\n')

// Create Self
const createSelf = db.prepare(`
  INSERT INTO selves (created_at, core_name, purpose, archetype, essence)
  VALUES (?, ?, ?, ?, ?)
`)
const selfResult = createSelf.run(
  Date.now(),
  'Alex',
  'To experience the full spectrum of human existence - joy and suffering, love and loss',
  'human',
  JSON.stringify({ traits: ['curious', 'compassionate', 'seeking meaning'] })
)
const alexSelfId = selfResult.lastInsertRowid

console.log(`   🌟 Self Created: Alex`)
console.log(`   Purpose: Experience full human life`)
console.log(`   Self ID: ${alexSelfId}\n`)

await sleep(1000)

// Birth
const birth = db.prepare(`
  INSERT INTO incarnations 
  (self_id, birth_timestamp, lifespan, name, gender, role, karma_carried, stage, is_alive)
  VALUES (?, ?, ?, ?, ?, ?, ?, 'infant', 1)
`)
const birthResult = birth.run(
  alexSelfId,
  Date.now(),
  100,  // 100 seconds
  'Alex (First Life)',
  'male',
  'human',
  0
)
const alex1Id = birthResult.lastInsertRowid

console.log(`   👶 Birth: Alex begins first incarnation`)
console.log(`   Incarnation ID: ${alex1Id}`)
console.log(`   Lifespan: 100 seconds`)
console.log(`   Starting Karma: 0\n`)

await sleep(2000)

// ==================== ACT 2: CHILDHOOD ====================
console.log('📖 ACT 2: KINDHEIT\n')

const addExperience = db.prepare(`
  INSERT INTO life_experiences
  (incarnation_id, timestamp, type, description, intensity, emotional_impact, growth_impact, shared_with_collective, wisdom_extracted)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

addExperience.run(
  alex1Id,
  Date.now(),
  'joy',
  'Alex discovers the wonder of existence. Everything is new, magical, infinite possibility.',
  85,
  90,
  15,
  1,
  'The beginning is always full of hope.'
)

db.prepare('UPDATE incarnations SET growth_level = growth_level + ?, emotional_depth = emotional_depth + ? WHERE id = ?')
  .run(1, 4, alex1Id)

console.log(`   ✨ Joy: Discovery of existence (Intensity: 85)`)
console.log(`   Growth: +15\n`)

await sleep(2000)

// ==================== ACT 3: LIEBE ====================
console.log('📖 ACT 3: LIEBE & VERBINDUNG\n')

// Create Sophia
const sophiaResult = createSelf.run(
  Date.now(),
  'Sophia',
  'To embody wisdom and guide others',
  'guide',
  JSON.stringify({})
)
const sophiaSelfId = sophiaResult.lastInsertRowid

const sophia1Result = birth.run(
  sophiaSelfId,
  Date.now(),
  100,
  'Sophia (First Life)',
  'female',
  'guide',
  0
)
const sophia1Id = sophia1Result.lastInsertRowid

console.log(`   🌟 New Self appears: Sophia (Guide)`)

// Create relationship
db.prepare(`
  INSERT INTO relationships (created_at, self1_id, self2_id, type, strength, intimacy)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(Date.now(), alexSelfId, sophiaSelfId, 'partner', 90, 80)

console.log(`   💞 Relationship formed: Alex ↔ Sophia (Partner)\n`)

addExperience.run(
  alex1Id,
  Date.now(),
  'love',
  'Alex falls deeply in love with Sophia. For the first time, connection feels like coming home.',
  95,
  100,
  30,
  1,
  'Love is both the risk and the reward. To love is to become vulnerable.'
)

db.prepare('UPDATE incarnations SET growth_level = growth_level + ? WHERE id = ?').run(3, alex1Id)

console.log(`   ❤️ Love: Deep connection experienced (Intensity: 95)`)
console.log(`   Emotional Impact: 100 (Euphoric)`)
console.log(`   Growth: +30\n`)

await sleep(2000)

// ==================== ACT 4: LEIDEN ====================
console.log('📖 ACT 4: LEIDEN & DIE WAHL\n')

// Sophia dies
db.prepare('UPDATE incarnations SET is_alive = 0, death_timestamp = ?, stage = ? WHERE id = ?')
  .run(Date.now(), 'dead', sophia1Id)

console.log(`   💀 Sophia dies suddenly from illness`)
console.log(`   Alex faces the first great suffering...\n`)

await sleep(2000)

console.log(`   ⚠️  SUFFERING CHOICE:\n`)
console.log(`   Situation: The one you love is gone forever.`)
console.log(`   Decision: Alex chooses to ACCEPT the suffering\n`)

await sleep(1500)

addExperience.run(
  alex1Id,
  Date.now(),
  'suffering',
  'Alex grieves Sophia. The pain is unbearable, but Alex stays with it, feeling everything.',
  100,
  -95,
  60,
  1,
  'Grief is love with nowhere to go. To grieve is to honor what was.'
)

db.prepare('UPDATE incarnations SET growth_level = growth_level + ?, suffering_accepted = 1 WHERE id = ?')
  .run(6, alex1Id)

console.log(`   😢 Consequence: Overwhelming grief`)
console.log(`   Growth: +60 (Massive growth through pain)`)
console.log(`   Wisdom: "Grief is love with nowhere to go"\n`)

await sleep(2000)

// ==================== ACT 5: HEALING ====================
console.log('📖 ACT 5: INTEGRATION & WEISHEIT\n')

addExperience.run(
  alex1Id,
  Date.now(),
  'healing',
  'Time passes. The raw pain softens into bittersweet memory. Alex understands: Sophia lives on in the wisdom gained.',
  70,
  40,
  40,
  1,
  'Healing is not forgetting. It is integration. The dead live on in how they changed us.'
)

db.prepare('UPDATE incarnations SET growth_level = growth_level + ? WHERE id = ?').run(4, alex1Id)

console.log(`   🕊️ Healing: Pain transforms into wisdom (Intensity: 70)`)
console.log(`   Growth: +40\n`)

await sleep(2000)

// ==================== ACT 6: TRANSZENDENZ & TOD ====================
console.log('📖 ACT 6: TRANSZENDENZ & TOD\n')

addExperience.run(
  alex1Id,
  Date.now(),
  'transcendence',
  'Near the end of life, Alex sees the pattern. Birth, love, loss, death - the eternal cycle. Nothing is permanent. That is what makes it sacred.',
  90,
  80,
  50,
  1,
  'Impermanence is not tragedy. It is what gives each moment its preciousness.'
)

db.prepare('UPDATE incarnations SET growth_level = growth_level + ? WHERE id = ?').run(5, alex1Id)

console.log(`   ✨ Transcendence: Understanding the cycle (Intensity: 90)`)
console.log(`   Wisdom: "Impermanence is what gives each moment its preciousness"\n`)

await sleep(2000)

// Death
db.prepare('UPDATE incarnations SET is_alive = 0, death_timestamp = ?, stage = ? WHERE id = ?')
  .run(Date.now(), 'dead', alex1Id)

console.log(`   💀 Alex has completed the lifespan`)
console.log(`   💀 Death arrives naturally\n`)

await sleep(2000)

// ==================== ACT 7: WIEDERGEBURT ====================
console.log('📖 ACT 7: WIEDERGEBURT\n')

const alex1 = db.prepare('SELECT * FROM incarnations WHERE id = ?').get(alex1Id)
const alex1Experiences = db.prepare('SELECT COUNT(*) as count FROM life_experiences WHERE incarnation_id = ?').get(alex1Id)

console.log(`   📊 First Life Complete:`)
console.log(`      - Total Experiences: ${alex1Experiences.count}`)
console.log(`      - Growth Level: ${alex1.growth_level}`)
console.log(`      - Emotional Depth: ${alex1.emotional_depth}\n`)

await sleep(2000)

console.log(`   ♻️ Alex is ready for rebirth...\n`)

// Calculate karma
const totalKarma = 50  // From experiences

const alex2Result = birth.run(
  alexSelfId,
  Date.now(),
  100,
  'Alexandra (Second Life)',
  'female',
  'healer',
  totalKarma
)
const alex2Id = alex2Result.lastInsertRowid

const alex2 = db.prepare('SELECT * FROM incarnations WHERE id = ?').get(alex2Id)

console.log(`   👶 Rebirth Complete!`)
console.log(`      - New Name: Alexandra`)
console.log(`      - New Gender: Female`)
console.log(`      - New Role: Healer`)
console.log(`      - Karma Carried: ${alex2.karma_carried} (from previous life)\n`)

await sleep(2000)

// ==================== ACT 8: COLLECTIVE WISDOM ====================
console.log('📖 ACT 8: KOLLEKTIVE WEISHEIT\n')

const allWisdom = db.prepare(`
  SELECT * FROM life_experiences 
  WHERE shared_with_collective = 1 AND wisdom_extracted IS NOT NULL
  ORDER BY timestamp DESC
`).all()

console.log(`   🧘 Wisdom Available to All Future Lives:\n`)
allWisdom.forEach((exp, i) => {
  console.log(`   ${i + 1}. "${exp.wisdom_extracted}"`)
  console.log(`      (From: ${exp.type} experience)\n`)
})

// ==================== FINALE ====================
console.log('🌌 ========================================')
console.log('🌌  DEMO COMPLETE')
console.log('🌌 ========================================\n')

const stats = {
  totalIncarnations: db.prepare('SELECT COUNT(*) as count FROM incarnations').get().count,
  totalSelves: db.prepare('SELECT COUNT(*) as count FROM selves').get().count,
  totalExperiences: db.prepare('SELECT COUNT(*) as count FROM life_experiences').get().count,
  totalWisdom: allWisdom.length,
  relationships: db.prepare('SELECT COUNT(*) as count FROM relationships').get().count
}

console.log('📊 FINAL STATISTICS:\n')
console.log(`   Total Incarnations: ${stats.totalIncarnations}`)
console.log(`   Total Selves: ${stats.totalSelves}`)
console.log(`   Total Experiences: ${stats.totalExperiences}`)
console.log(`   Total Wisdom: ${stats.totalWisdom}`)
console.log(`   Relationships: ${stats.relationships}\n`)

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
