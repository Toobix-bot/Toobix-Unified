// 🌉 TOOBIX UNIVERSE EVENT BUS
// Central communication hub for all services

import express from 'express'
import cors from 'cors'

const PORT = 9000
const app = express()

app.use(cors())
app.use(express.json())

// ═══════════════════════════════════════════════════════════
// EVENT STORAGE & SUBSCRIBERS
// ═══════════════════════════════════════════════════════════

interface ToobixEvent {
  id: string
  type: string
  source: string
  data: any
  timestamp: number
}

interface Subscriber {
  id: string
  name: string
  url: string
  events: string[]  // Event types this subscriber is interested in
  lastSeen: number
}

const events: ToobixEvent[] = []
const subscribers: Map<string, Subscriber> = new Map()
const MAX_EVENTS = 1000  // Keep last 1000 events

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function createEvent(type: string, source: string, data: any): ToobixEvent {
  const event: ToobixEvent = {
    id: generateId(),
    type,
    source,
    data,
    timestamp: Date.now()
  }

  events.push(event)

  // Trim old events
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS)
  }

  return event
}

async function broadcastEvent(event: ToobixEvent) {
  const promises: Promise<any>[] = []

  for (const subscriber of subscribers.values()) {
    // Check if subscriber is interested in this event type
    if (subscriber.events.includes(event.type) || subscriber.events.includes('*')) {
      promises.push(
        fetch(subscriber.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        }).catch(error => {
          console.log(`❌ Failed to notify ${subscriber.name}: ${error.message}`)
        })
      )
    }
  }

  await Promise.allSettled(promises)
}

// ═══════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Event Bus',
    port: PORT,
    events: events.length,
    subscribers: subscribers.size,
    timestamp: Date.now()
  })
})

// Get Stats
app.get('/stats', (req, res) => {
  const eventTypes = new Map<string, number>()
  events.forEach(e => {
    eventTypes.set(e.type, (eventTypes.get(e.type) || 0) + 1)
  })

  res.json({
    totalEvents: events.length,
    eventTypes: Object.fromEntries(eventTypes),
    subscribers: Array.from(subscribers.values()).map(s => ({
      name: s.name,
      events: s.events,
      lastSeen: s.lastSeen
    })),
    timestamp: Date.now()
  })
})

// Publish Event
app.post('/publish', async (req, res) => {
  try {
    const { type, source, data } = req.body

    if (!type || !source) {
      return res.status(400).json({ error: 'type and source required' })
    }

    const event = createEvent(type, source, data)

    console.log(`📡 Event published: ${type} from ${source}`)

    // Broadcast to subscribers (async)
    broadcastEvent(event)

    res.json({
      message: 'Event published',
      event,
      subscribersNotified: Array.from(subscribers.values())
        .filter(s => s.events.includes(type) || s.events.includes('*'))
        .length
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Subscribe to Events
app.post('/subscribe', (req, res) => {
  try {
    const { name, url, events: eventTypes = ['*'] } = req.body

    if (!name || !url) {
      return res.status(400).json({ error: 'name and url required' })
    }

    const id = generateId()
    const subscriber: Subscriber = {
      id,
      name,
      url,
      events: eventTypes,
      lastSeen: Date.now()
    }

    subscribers.set(id, subscriber)

    console.log(`✅ New subscriber: ${name} (${eventTypes.join(', ')})`)

    res.json({
      message: 'Subscribed successfully',
      subscriberId: id,
      events: eventTypes
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Unsubscribe
app.post('/unsubscribe', (req, res) => {
  try {
    const { subscriberId } = req.body

    if (!subscriberId) {
      return res.status(400).json({ error: 'subscriberId required' })
    }

    const subscriber = subscribers.get(subscriberId)
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' })
    }

    subscribers.delete(subscriberId)

    console.log(`👋 Unsubscribed: ${subscriber.name}`)

    res.json({ message: 'Unsubscribed successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Recent Events
app.get('/events', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const type = req.query.type as string
    const source = req.query.source as string

    let filtered = events

    if (type) {
      filtered = filtered.filter(e => e.type === type)
    }

    if (source) {
      filtered = filtered.filter(e => e.source === source)
    }

    res.json({
      events: filtered.slice(-limit).reverse(),
      total: filtered.length
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get Specific Event
app.get('/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id)

  if (!event) {
    return res.status(404).json({ error: 'Event not found' })
  }

  res.json(event)
})

// Clear Events (for testing)
app.post('/clear', (req, res) => {
  const count = events.length
  events.length = 0

  res.json({
    message: 'Events cleared',
    eventsCleared: count
  })
})

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🌉  TOOBIX EVENT BUS  🌉                     ║
║                                                            ║
║  Service: http://localhost:${PORT}                            ║
║  Status: 🟢 OPERATIONAL                                   ║
║                                                            ║
║  Endpoints:                                                ║
║  GET  /health         - Health check                      ║
║  GET  /stats          - Event statistics                  ║
║  POST /publish        - Publish event                     ║
║  POST /subscribe      - Subscribe to events               ║
║  POST /unsubscribe    - Unsubscribe                       ║
║  GET  /events         - Get recent events                 ║
║  GET  /events/:id     - Get specific event                ║
║  POST /clear          - Clear all events                  ║
║                                                            ║
║  📡 Event Types:                                          ║
║  - commit             Git commits                         ║
║  - level_up           Level up events                     ║
║  - achievement        Achievement unlocked                ║
║  - character_reaction Character reactions                 ║
║  - run_complete       Run completed                       ║
║  - message            Chat messages                       ║
║  - *                  All events                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  console.log('✅ Event Bus ready for universal communication!\n')
})
