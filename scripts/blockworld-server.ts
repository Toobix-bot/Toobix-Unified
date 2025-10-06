/**
 * 🎮 BLOCKWORLD SERVER
 * 
 * Minecraft-inspired voxel game backend
 * - World generation & management
 * - Block updates
 * - Player state
 * - AI Agent coordination
 * - Achievement tracking
 */

import { Database } from 'bun:sqlite'

// ============ BLOCK TYPES ============
enum BlockType {
  AIR = 0,
  GRASS = 1,
  DIRT = 2,
  STONE = 3,
  WOOD = 4,
  LEAVES = 5,
  SAND = 6,
  WATER = 7,
  COBBLESTONE = 8,
  PLANKS = 9
}

const BLOCK_INFO = {
  [BlockType.AIR]: { name: 'Air', color: 'transparent', solid: false },
  [BlockType.GRASS]: { name: 'Grass', color: '#7cbd56', solid: true },
  [BlockType.DIRT]: { name: 'Dirt', color: '#9b7653', solid: true },
  [BlockType.STONE]: { name: 'Stone', color: '#888888', solid: true },
  [BlockType.WOOD]: { name: 'Wood', color: '#8b6f47', solid: true },
  [BlockType.LEAVES]: { name: 'Leaves', color: '#4a7c3a', solid: true },
  [BlockType.SAND]: { name: 'Sand', color: '#edd9a3', solid: true },
  [BlockType.WATER]: { name: 'Water', color: '#4a90e2', solid: false },
  [BlockType.COBBLESTONE]: { name: 'Cobblestone', color: '#666666', solid: true },
  [BlockType.PLANKS]: { name: 'Planks', color: '#b8956a', solid: true }
}

// ============ WORLD CONFIGURATION ============
const CHUNK_SIZE = 16
const CHUNK_HEIGHT = 64
const WORLD_SIZE = 4 // 4x4 chunks = 64x64 blocks
const SEA_LEVEL = 32

// ============ PERLIN NOISE (Simple) ============
class PerlinNoise {
  private permutation: number[] = []
  
  constructor(seed: number = 12345) {
    // Initialize permutation table
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i
    }
    
    // Shuffle with seed
    let random = seed
    for (let i = 255; i > 0; i--) {
      random = (random * 16807) % 2147483647
      const j = random % (i + 1)
      ;[this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]]
    }
    
    // Duplicate permutation
    for (let i = 0; i < 256; i++) {
      this.permutation[256 + i] = this.permutation[i]
    }
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  
  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a)
  }
  
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }
  
  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    
    x -= Math.floor(x)
    y -= Math.floor(y)
    
    const u = this.fade(x)
    const v = this.fade(y)
    
    const a = this.permutation[X] + Y
    const b = this.permutation[X + 1] + Y
    
    return this.lerp(v,
      this.lerp(u, this.grad(this.permutation[a], x, y), this.grad(this.permutation[b], x - 1, y)),
      this.lerp(u, this.grad(this.permutation[a + 1], x, y - 1), this.grad(this.permutation[b + 1], x - 1, y - 1))
    )
  }
  
  octaveNoise(x: number, y: number, octaves: number, persistence: number): number {
    let total = 0
    let frequency = 1
    let amplitude = 1
    let maxValue = 0
    
    for (let i = 0; i < octaves; i++) {
      total += this.noise(x * frequency, y * frequency) * amplitude
      maxValue += amplitude
      amplitude *= persistence
      frequency *= 2
    }
    
    return total / maxValue
  }
}

// ============ WORLD GENERATOR ============
class WorldGenerator {
  private noise: PerlinNoise
  
  constructor(seed: number = Date.now()) {
    this.noise = new PerlinNoise(seed)
  }
  
  generateChunk(chunkX: number, chunkZ: number): Uint8Array {
    const blocks = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE * CHUNK_HEIGHT)
    
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const worldX = chunkX * CHUNK_SIZE + x
        const worldZ = chunkZ * CHUNK_SIZE + z
        
        // Generate height map
        const heightNoise = this.noise.octaveNoise(worldX * 0.01, worldZ * 0.01, 4, 0.5)
        const height = Math.floor(SEA_LEVEL + heightNoise * 20)
        
        // Generate terrain
        for (let y = 0; y < CHUNK_HEIGHT; y++) {
          const index = x + z * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE
          
          if (y > height) {
            // Air or water
            blocks[index] = y < SEA_LEVEL ? BlockType.WATER : BlockType.AIR
          } else if (y === height) {
            // Top layer
            blocks[index] = y < SEA_LEVEL - 2 ? BlockType.SAND : BlockType.GRASS
          } else if (y > height - 4) {
            // Dirt layer
            blocks[index] = BlockType.DIRT
          } else {
            // Stone
            blocks[index] = BlockType.STONE
          }
        }
        
        // Generate trees (5% chance)
        if (height >= SEA_LEVEL && Math.random() < 0.05) {
          this.generateTree(blocks, x, z, height + 1)
        }
      }
    }
    
    return blocks
  }
  
  private generateTree(blocks: Uint8Array, x: number, z: number, y: number) {
    const treeHeight = 5 + Math.floor(Math.random() * 3)
    
    // Trunk
    for (let dy = 0; dy < treeHeight; dy++) {
      if (y + dy < CHUNK_HEIGHT) {
        const index = x + z * CHUNK_SIZE + (y + dy) * CHUNK_SIZE * CHUNK_SIZE
        blocks[index] = BlockType.WOOD
      }
    }
    
    // Leaves (simple sphere)
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        for (let dy = 0; dy < 3; dy++) {
          if (dx * dx + dz * dz + dy * dy <= 8) {
            const lx = x + dx
            const lz = z + dz
            const ly = y + treeHeight + dy - 1
            
            if (lx >= 0 && lx < CHUNK_SIZE && lz >= 0 && lz < CHUNK_SIZE && ly < CHUNK_HEIGHT) {
              const index = lx + lz * CHUNK_SIZE + ly * CHUNK_SIZE * CHUNK_SIZE
              if (blocks[index] === BlockType.AIR) {
                blocks[index] = BlockType.LEAVES
              }
            }
          }
        }
      }
    }
  }
}

// ============ DATABASE ============
class BlockWorldDatabase {
  private db: Database
  
  constructor(filename: string = 'data/blockworld.db') {
    this.db = new Database(filename, { create: true })
    this.init()
  }
  
  private init() {
    // Chunks table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS chunks (
        x INTEGER NOT NULL,
        z INTEGER NOT NULL,
        data BLOB NOT NULL,
        modified_at INTEGER DEFAULT (strftime('%s', 'now')),
        PRIMARY KEY (x, z)
      )
    `)
    
    // Players table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        x REAL DEFAULT 0,
        y REAL DEFAULT 40,
        z REAL DEFAULT 0,
        health INTEGER DEFAULT 100,
        inventory TEXT DEFAULT '{}',
        is_ai INTEGER DEFAULT 0,
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)
    
    // Block updates log
    this.db.run(`
      CREATE TABLE IF NOT EXISTS block_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        z INTEGER NOT NULL,
        old_type INTEGER NOT NULL,
        new_type INTEGER NOT NULL,
        player_id TEXT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)
    
    console.log('✅ BlockWorld database initialized')
  }
  
  saveChunk(x: number, z: number, data: Uint8Array) {
    this.db.run(`
      INSERT OR REPLACE INTO chunks (x, z, data, modified_at)
      VALUES (?, ?, ?, ?)
    `, [x, z, data, Date.now()])
  }
  
  loadChunk(x: number, z: number): Uint8Array | null {
    const result = this.db.query(`
      SELECT data FROM chunks WHERE x = ? AND z = ?
    `).get(x, z) as any
    
    return result ? new Uint8Array(result.data) : null
  }
  
  savePlayer(player: any) {
    this.db.run(`
      INSERT OR REPLACE INTO players (id, name, x, y, z, health, inventory, is_ai, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      player.id,
      player.name,
      player.x,
      player.y,
      player.z,
      player.health,
      JSON.stringify(player.inventory),
      player.isAI ? 1 : 0,
      Date.now()
    ])
  }
  
  getPlayer(id: string) {
    return this.db.query(`
      SELECT * FROM players WHERE id = ?
    `).get(id) as any
  }
  
  getAllPlayers() {
    return this.db.query(`SELECT * FROM players`).all()
  }
  
  logBlockUpdate(x: number, y: number, z: number, oldType: number, newType: number, playerId?: string) {
    this.db.run(`
      INSERT INTO block_updates (x, y, z, old_type, new_type, player_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [x, y, z, oldType, newType, playerId || null])
  }
  
  getRecentUpdates(limit: number = 50) {
    return this.db.query(`
      SELECT * FROM block_updates 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(limit)
  }
}

// ============ WORLD MANAGER ============
class WorldManager {
  private generator: WorldGenerator
  private db: BlockWorldDatabase
  private chunks = new Map<string, Uint8Array>()
  
  constructor() {
    this.generator = new WorldGenerator()
    this.db = new BlockWorldDatabase()
  }
  
  private getChunkKey(x: number, z: number): string {
    return `${x},${z}`
  }
  
  getChunk(chunkX: number, chunkZ: number): Uint8Array {
    const key = this.getChunkKey(chunkX, chunkZ)
    
    // Check memory cache
    if (this.chunks.has(key)) {
      return this.chunks.get(key)!
    }
    
    // Try load from database
    let chunk = this.db.loadChunk(chunkX, chunkZ)
    
    // Generate if doesn't exist
    if (!chunk) {
      console.log(`🌍 Generating chunk (${chunkX}, ${chunkZ})`)
      chunk = this.generator.generateChunk(chunkX, chunkZ)
      this.db.saveChunk(chunkX, chunkZ, chunk)
    }
    
    this.chunks.set(key, chunk)
    return chunk
  }
  
  getBlock(x: number, y: number, z: number): BlockType {
    if (y < 0 || y >= CHUNK_HEIGHT) return BlockType.AIR
    
    const chunkX = Math.floor(x / CHUNK_SIZE)
    const chunkZ = Math.floor(z / CHUNK_SIZE)
    const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
    const localZ = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
    
    const chunk = this.getChunk(chunkX, chunkZ)
    const index = localX + localZ * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE
    
    return chunk[index] as BlockType
  }
  
  setBlock(x: number, y: number, z: number, type: BlockType, playerId?: string): boolean {
    if (y < 0 || y >= CHUNK_HEIGHT) return false
    
    const chunkX = Math.floor(x / CHUNK_SIZE)
    const chunkZ = Math.floor(z / CHUNK_SIZE)
    const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
    const localZ = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE
    
    const chunk = this.getChunk(chunkX, chunkZ)
    const index = localX + localZ * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE
    
    const oldType = chunk[index]
    chunk[index] = type
    
    // Save to database
    this.db.saveChunk(chunkX, chunkZ, chunk)
    this.db.logBlockUpdate(x, y, z, oldType, type, playerId)
    
    return true
  }
  
  getWorldSnapshot() {
    const snapshot: any = {
      chunks: [],
      size: { x: WORLD_SIZE * CHUNK_SIZE, z: WORLD_SIZE * CHUNK_SIZE, y: CHUNK_HEIGHT },
      seaLevel: SEA_LEVEL
    }
    
    for (let cx = 0; cx < WORLD_SIZE; cx++) {
      for (let cz = 0; cz < WORLD_SIZE; cz++) {
        const chunk = this.getChunk(cx, cz)
        snapshot.chunks.push({
          x: cx,
          z: cz,
          data: Array.from(chunk)
        })
      }
    }
    
    return snapshot
  }
}

// ============ HTTP SERVER ============
const PORT = 9993
const world = new WorldManager()
const db = new BlockWorldDatabase()

// Initialize AI player
db.savePlayer({
  id: 'ai-agent',
  name: 'BlockBot',
  x: 32,
  y: 40,
  z: 32,
  health: 100,
  inventory: {},
  isAI: true
})

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname
    
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    }
    
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }
    
    try {
      // GET /world - Full world snapshot
      if (path === '/world' && req.method === 'GET') {
        const snapshot = world.getWorldSnapshot()
        return Response.json(snapshot, { headers })
      }
      
      // GET /chunk/:x/:z - Single chunk
      if (path.startsWith('/chunk/') && req.method === 'GET') {
        const parts = path.split('/')
        const x = parseInt(parts[2])
        const z = parseInt(parts[3])
        
        if (isNaN(x) || isNaN(z)) {
          return Response.json({ error: 'Invalid coordinates' }, { status: 400, headers })
        }
        
        const chunk = world.getChunk(x, z)
        return Response.json({
          x, z,
          data: Array.from(chunk)
        }, { headers })
      }
      
      // GET /block/:x/:y/:z - Get single block
      if (path.startsWith('/block/') && req.method === 'GET') {
        const parts = path.split('/')
        const x = parseInt(parts[2])
        const y = parseInt(parts[3])
        const z = parseInt(parts[4])
        
        const type = world.getBlock(x, y, z)
        return Response.json({
          x, y, z,
          type,
          info: BLOCK_INFO[type]
        }, { headers })
      }
      
      // POST /block - Set block
      if (path === '/block' && req.method === 'POST') {
        const body = await req.json() as any
        const { x, y, z, type, playerId } = body
        
        if (x === undefined || y === undefined || z === undefined || type === undefined) {
          return Response.json({ error: 'Missing coordinates or type' }, { status: 400, headers })
        }
        
        const success = world.setBlock(x, y, z, type, playerId)
        
        // Track achievement if player broke/placed block
        if (success && playerId) {
          try {
            await fetch('http://localhost:9998/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: type === BlockType.AIR ? 'blocks_broken' : 'blocks_placed',
                value: 1
              })
            })
          } catch (e) {
            // Achievement system not running
          }
        }
        
        return Response.json({ success }, { headers })
      }
      
      // GET /players - All players
      if (path === '/players' && req.method === 'GET') {
        const players = db.getAllPlayers()
        return Response.json(players, { headers })
      }
      
      // GET /player/:id - Single player
      if (path.startsWith('/player/') && req.method === 'GET') {
        const id = path.split('/')[2]
        const player = db.getPlayer(id)
        
        if (!player) {
          return Response.json({ error: 'Player not found' }, { status: 404, headers })
        }
        
        return Response.json(player, { headers })
      }
      
      // POST /player - Update player
      if (path === '/player' && req.method === 'POST') {
        const player = await req.json()
        db.savePlayer(player)
        return Response.json({ success: true }, { headers })
      }
      
      // GET /updates - Recent block updates
      if (path === '/updates' && req.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '50')
        const updates = db.getRecentUpdates(limit)
        return Response.json(updates, { headers })
      }
      
      // GET /blocks - Block type info
      if (path === '/blocks' && req.method === 'GET') {
        return Response.json(BLOCK_INFO, { headers })
      }
      
      // Health check
      if (path === '/health' && req.method === 'GET') {
        return Response.json({
          status: 'ok',
          service: 'BlockWorld Server',
          port: PORT,
          worldSize: `${WORLD_SIZE * CHUNK_SIZE}x${CHUNK_HEIGHT}x${WORLD_SIZE * CHUNK_SIZE}`
        }, { headers })
      }
      
      return Response.json({ error: 'Not found' }, { status: 404, headers })
      
    } catch (error) {
      console.error('❌ Server error:', error)
      return Response.json({
        error: String(error)
      }, {
        status: 500,
        headers
      })
    }
  }
})

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 BLOCKWORLD SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Running on: http://localhost:${PORT}
🌍 World Size: ${WORLD_SIZE * CHUNK_SIZE}x${CHUNK_HEIGHT}x${WORLD_SIZE * CHUNK_SIZE}
📦 Block Types: ${Object.keys(BLOCK_INFO).length}
📝 API Endpoints:
   GET  /world - Full world snapshot
   GET  /chunk/:x/:z - Single chunk
   GET  /block/:x/:y/:z - Get block
   POST /block - Set block
   GET  /players - All players
   GET  /player/:id - Get player
   POST /player - Update player
   GET  /updates - Recent updates
   GET  /blocks - Block type info
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛏️ Ready to build!
`)
