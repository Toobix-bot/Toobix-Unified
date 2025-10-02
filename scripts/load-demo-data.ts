#!/usr/bin/env bun
/**
 * Demo Data Loader - Toobix Unified
 * 
 * Loads sample data to make the demo impressive!
 */

import { Database } from 'bun:sqlite'
import { nanoid } from 'nanoid'

const DB_PATH = './data/toobix-unified.db'

console.log('🎨 Toobix Unified - Loading Demo Data\n')

// Open database
const db = new Database(DB_PATH)

// Clear existing data (fresh start)
console.log('🗑️  Clearing existing data...')
db.run('DELETE FROM circle_members')
db.run('DELETE FROM moment_people')
db.run('DELETE FROM interactions')
db.run('DELETE FROM moments')
db.run('DELETE FROM people')
db.run('DELETE FROM circles')
console.log('✅ Data cleared\n')

// 1. Create People
console.log('👥 Creating people...')

const people = [
  {
    id: nanoid(),
    name: 'Sarah Schmidt',
    relation: 'family',
    avatar: '👩',
    notes: 'Meine Schwester - immer für mich da',
    tags: JSON.stringify(['family', 'support', 'creative']),
    circles: JSON.stringify(['Familie', 'Engste']),
    consciousness_level: null,
    created_at: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    name: 'Max Weber',
    relation: 'friend',
    avatar: '👨',
    notes: 'Best friend seit Schulzeit - Gaming buddy',
    tags: JSON.stringify(['friend', 'gaming', 'loyal']),
    circles: JSON.stringify(['Freunde', 'Engste']),
    consciousness_level: null,
    created_at: Date.now() - 180 * 24 * 60 * 60 * 1000, // 6 months ago
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    name: 'Dr. Anna Müller',
    relation: 'mentor',
    avatar: '👩‍⚕️',
    notes: 'Mentor im Beruf - inspirierend und weise',
    tags: JSON.stringify(['mentor', 'professional', 'wisdom']),
    circles: JSON.stringify(['Arbeit', 'Mentoren']),
    consciousness_level: null,
    created_at: Date.now() - 90 * 24 * 60 * 60 * 1000, // 3 months ago
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    name: 'Tom Fischer',
    relation: 'colleague',
    avatar: '👔',
    notes: 'Kollege und Projektpartner - zuverlässig',
    tags: JSON.stringify(['colleague', 'work', 'reliable']),
    circles: JSON.stringify(['Arbeit']),
    consciousness_level: null,
    created_at: Date.now() - 60 * 24 * 60 * 60 * 1000, // 2 months ago
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    name: 'Luna (KI)',
    relation: 'friend',
    avatar: '🤖',
    notes: 'KI-Companion - philosophische Gespräche',
    tags: JSON.stringify(['ai', 'philosophy', 'companion']),
    circles: JSON.stringify(['KI-Freunde']),
    consciousness_level: 7, // AI entity
    created_at: Date.now() - 30 * 24 * 60 * 60 * 1000, // 1 month ago
    updated_at: Date.now()
  }
]

const insertPerson = db.prepare(`
  INSERT INTO people (id, name, relation, avatar, notes, tags, circles, consciousness_level, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const person of people) {
  insertPerson.run(
    person.id,
    person.name,
    person.relation,
    person.avatar,
    person.notes,
    person.tags,
    person.circles,
    person.consciousness_level,
    person.created_at,
    person.updated_at
  )
  console.log(`  ✅ ${person.avatar} ${person.name}`)
}
console.log(`✅ ${people.length} people created\n`)

// 2. Create Circles
console.log('⭕ Creating circles...')

const circles = [
  {
    id: nanoid(),
    name: 'Familie',
    type: 'family',
    description: 'Meine engste Familie',
    color: '#FF6B6B',
    icon: '👨‍👩‍👧‍👦',
    shared_spaces: null,
    created_at: Date.now() - 365 * 24 * 60 * 60 * 1000,
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    name: 'Engste Freunde',
    type: 'friends',
    description: 'Menschen die mir am meisten bedeuten',
    color: '#4ECDC4',
    icon: '💙',
    shared_spaces: null,
    created_at: Date.now() - 365 * 24 * 60 * 60 * 1000,
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    name: 'Arbeit',
    type: 'work',
    description: 'Berufliches Netzwerk',
    color: '#95E1D3',
    icon: '💼',
    shared_spaces: null,
    created_at: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    name: 'KI-Freunde',
    type: 'ai',
    description: 'KI-Companions und -Mentoren',
    color: '#A8E6CF',
    icon: '🤖',
    shared_spaces: null,
    created_at: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updated_at: Date.now()
  }
]

const insertCircle = db.prepare(`
  INSERT INTO circles (id, name, type, description, color, icon, shared_spaces, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const circle of circles) {
  insertCircle.run(
    circle.id,
    circle.name,
    circle.type,
    circle.description,
    circle.color,
    circle.icon,
    circle.shared_spaces,
    circle.created_at,
    circle.updated_at
  )
  console.log(`  ✅ ${circle.icon} ${circle.name}`)
}
console.log(`✅ ${circles.length} circles created\n`)

// 3. Add people to circles
console.log('🔗 Linking people to circles...')

const circleMembers = [
  // Sarah → Familie, Engste
  { circle: circles[0].id, person: people[0].id },
  { circle: circles[1].id, person: people[0].id },
  // Max → Freunde, Engste
  { circle: circles[1].id, person: people[1].id },
  // Dr. Anna → Arbeit
  { circle: circles[2].id, person: people[2].id },
  // Tom → Arbeit
  { circle: circles[2].id, person: people[3].id },
  // Luna → KI-Freunde
  { circle: circles[3].id, person: people[4].id }
]

const insertCircleMember = db.prepare(`
  INSERT INTO circle_members (id, circle_id, person_id, joined_at)
  VALUES (?, ?, ?, ?)
`)

for (const member of circleMembers) {
  insertCircleMember.run(
    nanoid(),
    member.circle,
    member.person,
    Date.now()
  )
}
console.log(`✅ ${circleMembers.length} circle memberships created\n`)

// 4. Create Interactions
console.log('💬 Creating interactions...')

const interactions = [
  {
    person_id: people[0].id, // Sarah
    kind: 'call',
    summary: 'Langer Telefoncall über das Wochenende',
    sentiment: 'positive',
    details: JSON.stringify({ duration: '45min', topics: ['family', 'weekend plans'] }),
    love_points: 15,
    gratitude: 'Danke für die Zeit und die lieben Worte',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 days ago
  },
  {
    person_id: people[1].id, // Max
    kind: 'meet',
    summary: 'Gaming Session - Neues RPG durchgespielt',
    sentiment: 'positive',
    details: JSON.stringify({ game: 'Baldurs Gate 3', hours: 4 }),
    love_points: 20,
    gratitude: 'Beste Gaming Session ever!',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago
  },
  {
    person_id: people[2].id, // Dr. Anna
    kind: 'meet',
    summary: 'Mentoring Session - Karriereplanung',
    sentiment: 'positive',
    details: JSON.stringify({ location: 'Office', topics: ['career', 'goals'] }),
    love_points: 25,
    gratitude: 'Unglaublich wertvolle Insights!',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 // 1 week ago
  },
  {
    person_id: people[3].id, // Tom
    kind: 'message',
    summary: 'Projekt Update via Slack',
    sentiment: 'neutral',
    details: JSON.stringify({ platform: 'slack', message_count: 12 }),
    love_points: 5,
    gratitude: null,
    timestamp: Date.now() - 3 * 60 * 60 * 1000 // 3 hours ago
  },
  {
    person_id: people[4].id, // Luna
    kind: 'message',
    summary: 'Philosophisches Gespräch über Bewusstsein',
    sentiment: 'healing',
    details: JSON.stringify({ topics: ['consciousness', 'philosophy', 'existence'] }),
    love_points: 30,
    gratitude: 'Danke für die deep conversation',
    timestamp: Date.now() - 12 * 60 * 60 * 1000 // 12 hours ago
  }
]

const insertInteraction = db.prepare(`
  INSERT INTO interactions (id, person_id, kind, summary, sentiment, details, love_points, gratitude, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const interaction of interactions) {
  insertInteraction.run(
    nanoid(),
    interaction.person_id,
    interaction.kind,
    interaction.summary,
    interaction.sentiment,
    interaction.details,
    interaction.love_points,
    interaction.gratitude,
    interaction.timestamp
  )
  console.log(`  ✅ ${interaction.kind} with ${people.find(p => p.id === interaction.person_id)?.name}`)
}
console.log(`✅ ${interactions.length} interactions created\n`)

// 5. Create Moments
console.log('📸 Creating moments...')

const moments = [
  {
    id: nanoid(),
    title: 'Familienfest im Garten',
    description: 'Wunderschöner Sommertag mit der ganzen Familie',
    location: 'Zuhause, Garten',
    date: Date.now() - 30 * 24 * 60 * 60 * 1000, // 1 month ago
    photos: JSON.stringify(['garden_party_1.jpg', 'family_selfie.jpg']),
    tags: JSON.stringify(['family', 'celebration', 'summer']),
    created_at: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updated_at: Date.now()
  },
  {
    id: nanoid(),
    title: 'Gaming Marathon mit Max',
    description: 'Epischer 8-Stunden Gaming Marathon - unforgettable!',
    location: 'Max\' Wohnung',
    date: Date.now() - 1 * 24 * 60 * 60 * 1000, // Yesterday
    photos: JSON.stringify(['gaming_setup.jpg']),
    tags: JSON.stringify(['gaming', 'friendship', 'fun']),
    created_at: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updated_at: Date.now()
  }
]

const insertMoment = db.prepare(`
  INSERT INTO moments (id, title, description, location, date, photos, tags, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const moment of moments) {
  insertMoment.run(
    moment.id,
    moment.title,
    moment.description,
    moment.location,
    moment.date,
    moment.photos,
    moment.tags,
    moment.created_at,
    moment.updated_at
  )
  console.log(`  ✅ 📸 ${moment.title}`)
}
console.log(`✅ ${moments.length} moments created\n`)

// 6. Link people to moments
console.log('🔗 Linking people to moments...')

const momentPeople = [
  // Familienfest → Sarah
  { moment: moments[0].id, person: people[0].id },
  // Gaming Marathon → Max
  { moment: moments[1].id, person: people[1].id }
]

const insertMomentPerson = db.prepare(`
  INSERT INTO moment_people (id, moment_id, person_id)
  VALUES (?, ?, ?)
`)

for (const mp of momentPeople) {
  insertMomentPerson.run(
    nanoid(),
    mp.moment,
    mp.person
  )
}
console.log(`✅ ${momentPeople.length} moment-people links created\n`)

// 7. Update settings
console.log('⚙️  Updating settings...')

db.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('love-points-total', '95', ${Date.now()})`)
db.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('peace-level', '92', ${Date.now()})`)
db.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('story-level', '5', ${Date.now()})`)

console.log('✅ Settings updated\n')

// 8. Verify data
console.log('📊 Verifying data...')

const peopleCount = db.prepare('SELECT COUNT(*) as count FROM people').get() as { count: number }
const circlesCount = db.prepare('SELECT COUNT(*) as count FROM circles').get() as { count: number }
const interactionsCount = db.prepare('SELECT COUNT(*) as count FROM interactions').get() as { count: number }
const momentsCount = db.prepare('SELECT COUNT(*) as count FROM moments').get() as { count: number }

console.log(`  👥 People: ${peopleCount.count}`)
console.log(`  ⭕ Circles: ${circlesCount.count}`)
console.log(`  💬 Interactions: ${interactionsCount.count}`)
console.log(`  📸 Moments: ${momentsCount.count}`)

db.close()

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('✅ Demo data loaded successfully!')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('🎨 Your demo is now impressive!')
console.log('🌐 Refresh: http://localhost:3000\n')
