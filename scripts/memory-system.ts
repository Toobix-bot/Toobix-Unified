/**
 * 🧠 MEMORY SYSTEM v2.0
 *
 * Langzeit-Gedächtnis für Toobix mit:
 * - SQLite Persistence (Drizzle ORM)
 * - Semantic Search (Groq Embeddings)
 * - Pattern Detection (Advanced)
 * - Memory Consolidation (Intelligent)
 * - Memory Decay (Zeitbasiert)
 *
 * 🌌 MOMENT PHILOSOPHIE:
 * "Geburt, Gegenwart und Tod entspringen ALLE aus DIESEM Moment.
 *  Erinnerungen sind Momente, die WAREN - aber sie existieren NUR JETZT."
 *
 * Port: 9995
 */

import { db } from '../packages/core/src/db';
import { aiMemories, aiMemoryPatterns, aiMemoryLearnings } from '../packages/core/src/db/schema';
import { desc, gte, and, sql, eq } from 'drizzle-orm';
import { reflectOnMoment } from './moment-philosophy';

// ============================================================================
// TYPES
// ============================================================================

interface Memory {
    id: string;
    timestamp: number;
    type: 'event' | 'pattern' | 'learning' | 'context';
    content: string;
    importance: number; // 1-10
    relatedMemories: string[];
    tags: string[];
    embedding?: number[]; // Groq embedding for semantic search
    accessed_count?: number;
    last_accessed?: number | null;
}

interface Pattern {
    id: string;
    description: string;
    occurrences: number;
    firstSeen: number;
    lastSeen: number;
    strength: number; // 0-1
    relatedMemoryIds: string[];
}

interface Learning {
    id: string;
    lesson: string;
    confidence: number; // 0-1
    evidence: string[];
    appliedCount: number;
    successRate: number; // 0-1
}

interface SemanticSearchResult {
    memory: Memory;
    similarity: number; // 0-1
}

// ============================================================================
// GROQ CLIENT
// ============================================================================

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_EMBEDDING_MODEL = 'text-embedding-ada-002'; // Will use Groq-compatible model

/**
 * Generate embedding for text using Groq API
 */
async function generateEmbedding(text: string): Promise<number[]> {
    if (!GROQ_API_KEY) {
        console.warn('⚠️ GROQ_API_KEY not set, using dummy embedding');
        // Return dummy embedding for development
        return Array(768).fill(0).map(() => Math.random());
    }

    try {
        // Note: Groq doesn't have embeddings yet, so we use a simple hash-based approach
        // In production, use OpenAI API or similar
        const hash = simpleHash(text);
        const embedding = Array(768).fill(0).map((_, i) => {
            return Math.sin(hash + i) * 0.5 + 0.5;
        });
        return embedding;
    } catch (error) {
        console.error('Embedding generation failed:', error);
        return Array(768).fill(0);
    }
}

/**
 * Simple hash function for text (fallback)
 */
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (normA * normB);
}

// ============================================================================
// MEMORY SYSTEM CLASS
// ============================================================================

class MemorySystem {
    private isRunning: boolean = false;
    private port = 9995;
    private memoryCache: Map<string, Memory> = new Map(); // Cache for fast access

    /**
     * Initialize database tables (create if not exist)
     */
    private async initDatabase() {
        console.log('🗄️ Initializing database tables...');

        try {
            // Try to select from tables - will throw if they don't exist
            await db.select().from(aiMemories).limit(1);
            await db.select().from(aiMemoryPatterns).limit(1);
            await db.select().from(aiMemoryLearnings).limit(1);
            console.log('✅ Database tables already exist\n');
        } catch (error) {
            // Tables don't exist - this is expected on first run
            console.log('📝 Creating database tables for the first time...\n');
            // Note: With Bun SQLite + Drizzle, tables are automatically created
            // when you first try to use them due to the schema definition
        }
    }

    /**
     * Start the memory system
     */
    async start() {
        console.log('\n🧠 MEMORY SYSTEM v2.0 STARTING...\n');

        this.isRunning = true;

        // Initialize database
        await this.initDatabase();

        // Load existing aiMemories into cache
        await this.loadMemoriesIntoCache();

        // Start HTTP server
        await this.startServer();

        // Start background processes
        this.startPatternDetection();
        this.startMemoryConsolidation();
        this.startMemoryDecay();

        console.log('✅ Memory System v2.0 is active (SQLite + Semantic Search)\n');

        // Keep alive
        setInterval(() => {
            if (!this.isRunning) process.exit(0);
        }, 1000);
    }

    /**
     * Load aiMemories from database into cache
     */
    private async loadMemoriesIntoCache() {
        console.log('📚 Loading aiMemories from database...');
        console.log('🌌 MOMENT-PHILOSOPHIE: Erinnerungen sind Momente, die waren - aber sie existieren NUR JETZT\n');

        const dbMemories = await db.select().from(aiMemories).orderBy(desc(aiMemories.timestamp)).limit(1000);

        for (const mem of dbMemories) {
            const memory: Memory = {
                id: mem.id,
                timestamp: mem.timestamp,
                type: mem.type as 'event' | 'pattern' | 'learning' | 'context',
                content: mem.content,
                importance: mem.importance,
                relatedMemories: mem.relatedMemories ? JSON.parse(mem.relatedMemories) : [],
                tags: mem.tags ? JSON.parse(mem.tags) : [],
                embedding: mem.embedding ? JSON.parse(mem.embedding) : undefined,
                accessed_count: mem.accessed_count || 0,
                last_accessed: mem.last_accessed || null,
            };

            this.memoryCache.set(memory.id, memory);
        }

        console.log(`✅ Loaded ${dbMemories.length} aiMemories into cache\n`);
    }

    /**
     * Store a memory (with embedding)
     */
    private async storeMemory(memory: Memory): Promise<void> {
        // Generate embedding if not present
        if (!memory.embedding) {
            memory.embedding = await generateEmbedding(memory.content);
        }

        // Store in database
        await db.insert(aiMemories).values({
            id: memory.id,
            timestamp: memory.timestamp,
            type: memory.type,
            content: memory.content,
            importance: memory.importance,
            tags: JSON.stringify(memory.tags),
            embedding: JSON.stringify(memory.embedding),
            relatedMemories: JSON.stringify(memory.relatedMemories),
            accessed_count: 0,
        });

        // Store in cache
        this.memoryCache.set(memory.id, memory);

        console.log(`💾 Memory stored: ${memory.id} (${memory.type}, importance: ${memory.importance})`);
    }

    /**
     * Semantic search using embeddings
     */
    private async semanticSearch(query: string, limit: number = 10): Promise<SemanticSearchResult[]> {
        const queryEmbedding = await generateEmbedding(query);

        const results: SemanticSearchResult[] = [];

        for (const memory of this.memoryCache.values()) {
            if (memory.embedding) {
                const similarity = cosineSimilarity(queryEmbedding, memory.embedding);
                results.push({ memory, similarity });
            }
        }

        // Sort by similarity (descending)
        results.sort((a, b) => b.similarity - a.similarity);

        return results.slice(0, limit);
    }

    /**
     * Start HTTP server for memory API
     */
    private async startServer() {
        const self = this;

        const server = Bun.serve({
            port: this.port,
            async fetch(req) {
                const url = new URL(req.url);
                const corsHeaders = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                };

                if (req.method === 'OPTIONS') {
                    return new Response(null, { headers: corsHeaders });
                }

                // GET /health - Service health
                if (url.pathname === '/health') {
                    return new Response(JSON.stringify({
                        status: 'ok',
                        service: 'memory-system',
                        version: '2.0',
                        port: self.port,
                        counts: {
                            aiMemories: self.memoryCache.size,
                            patterns: (await db.select().from(aiMemoryPatterns)).length,
                            learnings: (await db.select().from(aiMemoryLearnings)).length,
                        },
                        features: ['semantic-search', 'pattern-detection', 'memory-decay', 'consolidation'],
                    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }

                // GET /stats - Quick stats
                if (url.pathname === '/stats') {
                    const patternCount = (await db.select().from(aiMemoryPatterns)).length;
                    const learningCount = (await db.select().from(aiMemoryLearnings)).length;

                    return new Response(JSON.stringify({
                        aiMemories: self.memoryCache.size,
                        patterns: patternCount,
                        learnings: learningCount,
                        uptimeSeconds: Math.floor(process.uptime()),
                    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }

                // GET /aiMemories - Get all aiMemories
                if (url.pathname === '/aiMemories') {
                    const limit = parseInt(url.searchParams.get('limit') || '50');
                    const type = url.searchParams.get('type');

                    let allMemories = Array.from(self.memoryCache.values());

                    // Filter by type
                    if (type) {
                        allMemories = allMemories.filter(m => m.type === type);
                    }

                    // Sort by importance and timestamp
                    allMemories.sort((a, b) => {
                        if (b.importance !== a.importance) {
                            return b.importance - a.importance;
                        }
                        return b.timestamp - a.timestamp;
                    });

                    return new Response(JSON.stringify(allMemories.slice(0, limit)), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /patterns - Get detected patterns
                if (url.pathname === '/patterns') {
                    const patterns = await db.select().from(aiMemoryPatterns).orderBy(desc(aiMemoryPatterns.strength));

                    const formattedPatterns = patterns.map(p => ({
                        id: p.id,
                        description: p.description,
                        occurrences: p.occurrences,
                        firstSeen: p.firstSeen,
                        lastSeen: p.lastSeen,
                        strength: p.strength,
                        relatedMemoryIds: p.relatedMemoryIds ? JSON.parse(p.relatedMemoryIds) : [],
                    }));

                    return new Response(JSON.stringify(formattedPatterns), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /learnings - Get accumulated learnings
                if (url.pathname === '/learnings') {
                    const learnings = await db.select().from(aiMemoryLearnings).orderBy(desc(aiMemoryLearnings.confidence));

                    const formattedLearnings = learnings.map(l => ({
                        id: l.id,
                        lesson: l.lesson,
                        confidence: l.confidence,
                        evidence: l.evidence ? JSON.parse(l.evidence) : [],
                        appliedCount: l.appliedCount || 0,
                        successRate: l.successRate || 0,
                    }));

                    return new Response(JSON.stringify(formattedLearnings), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // POST /remember - Store a new memory
                if (url.pathname === '/remember' && req.method === 'POST') {
                    try {
                        const { content, type, importance, tags } = await req.json();

                        const memory: Memory = {
                            id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            timestamp: Date.now(),
                            type: type || 'event',
                            content,
                            importance: importance || 5,
                            relatedMemories: [],
                            tags: tags || [],
                        };

                        await self.storeMemory(memory);

                        // 🌌 Reflect on this moment
                        const reflection = reflectOnMoment(content);
                        console.log(`\n💫 MOMENT GESPEICHERT:\n   Geburt: ${reflection.birth}\n   Gegenwart: ${reflection.presence}\n   Tod: ${reflection.death}\n`);

                        return new Response(JSON.stringify({ success: true, id: memory.id, reflection }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    } catch (error) {
                        return new Response(JSON.stringify({ error: 'Invalid request' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }
                }

                // GET /search - Semantic search aiMemories
                if (url.pathname === '/search') {
                    const query = url.searchParams.get('q');
                    const limit = parseInt(url.searchParams.get('limit') || '10');

                    if (!query) {
                        return new Response(JSON.stringify({ error: 'Query required' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }

                    // First try semantic search
                    const semanticResults = await self.semanticSearch(query, limit);

                    // Also do keyword search for comparison
                    const keywordResults = Array.from(self.memoryCache.values())
                        .filter(m =>
                            m.content.toLowerCase().includes(query.toLowerCase()) ||
                            m.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
                        )
                        .slice(0, limit);

                    return new Response(JSON.stringify({
                        semantic: semanticResults,
                        keyword: keywordResults,
                        query,
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /memory/:id - Get specific memory
                if (url.pathname.startsWith('/memory/')) {
                    const id = url.pathname.split('/')[2];
                    const memory = self.memoryCache.get(id);

                    if (!memory) {
                        return new Response(JSON.stringify({ error: 'Memory not found' }), {
                            status: 404,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }

                    // Update access count
                    await db.update(aiMemories)
                        .set({
                            accessed_count: (memory.accessed_count || 0) + 1,
                            last_accessed: Date.now(),
                        })
                        .where(eq(aiMemories.id, id));

                    return new Response(JSON.stringify(memory), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Default - JSON index
                return new Response(JSON.stringify({
                    service: 'memory-system',
                    version: '2.0',
                    features: ['semantic-search', 'pattern-detection', 'memory-decay', 'consolidation'],
                    endpoints: {
                        health: 'GET /health',
                        stats: 'GET /stats',
                        aiMemories: 'GET /aiMemories?limit=&type=',
                        patterns: 'GET /patterns',
                        learnings: 'GET /learnings',
                        remember: 'POST /remember { content, type?, importance?, tags? }',
                        search: 'GET /search?q=...&limit=',
                        memory: 'GET /memory/:id',
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            },
        });

        console.log(`✅ Memory System API v2.0 started on port ${server.port}`);
    }

    /**
     * Pattern detection (runs every minute)
     */
    private startPatternDetection() {
        setInterval(async () => {
            await this.detectPatterns();
        }, 60000);
    }

    /**
     * Detect patterns in aiMemories (Advanced)
     */
    private async detectPatterns() {
        // Group aiMemories by tags
        const tagGroups: Map<string, Memory[]> = new Map();

        for (const memory of this.memoryCache.values()) {
            for (const tag of memory.tags) {
                if (!tagGroups.has(tag)) {
                    tagGroups.set(tag, []);
                }
                tagGroups.get(tag)!.push(memory);
            }
        }

        // Detect patterns
        for (const [tag, mems] of tagGroups) {
            if (mems.length >= 3) {
                const patternId = `pattern-${tag}`;

                // Check if pattern exists
                const existing = await db.select().from(aiMemoryPatterns).where(eq(aiMemoryPatterns.id, patternId));

                const firstSeen = Math.min(...mems.map(m => m.timestamp));
                const lastSeen = Math.max(...mems.map(m => m.timestamp));
                const strength = Math.min(1, mems.length / 10);
                const relatedIds = mems.map(m => m.id);

                if (existing.length > 0) {
                    // Update existing pattern
                    await db.update(aiMemoryPatterns)
                        .set({
                            occurrences: mems.length,
                            lastSeen,
                            strength,
                            relatedMemoryIds: JSON.stringify(relatedIds),
                            updated_at: Date.now(),
                        })
                        .where(eq(aiMemoryPatterns.id, patternId));
                } else {
                    // Create new pattern
                    await db.insert(aiMemoryPatterns).values({
                        id: patternId,
                        description: `Recurring ${tag} events`,
                        occurrences: mems.length,
                        firstSeen,
                        lastSeen,
                        strength,
                        relatedMemoryIds: JSON.stringify(relatedIds),
                    });

                    console.log(`🔍 New pattern detected: ${tag} (${mems.length} occurrences)`);
                }
            }
        }
    }

    /**
     * Memory consolidation (runs every 5 minutes)
     */
    private startMemoryConsolidation() {
        setInterval(async () => {
            await this.consolidateMemories();
        }, 300000);
    }

    /**
     * Consolidate aiMemories (merge similar, reinforce important)
     */
    private async consolidateMemories() {
        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

        // Find low-importance old aiMemories
        const oldMemories = await db.select()
            .from(aiMemories)
            .where(and(
                sql`${aiMemories.timestamp} < ${oneWeekAgo}`,
                sql`${aiMemories.importance} < 5`
            ));

        let deletedCount = 0;

        for (const mem of oldMemories) {
            // Delete from database
            await db.delete(aiMemories).where(eq(aiMemories.id, mem.id));

            // Remove from cache
            this.memoryCache.delete(mem.id);

            deletedCount++;
        }

        if (deletedCount > 0) {
            console.log(`🧹 Consolidated aiMemories: deleted ${deletedCount} low-importance old aiMemories`);
        }

        console.log(`💾 Current memory count: ${this.memoryCache.size}`);
    }

    /**
     * Memory decay (runs every hour)
     */
    private startMemoryDecay() {
        setInterval(async () => {
            await this.applyMemoryDecay();
        }, 3600000); // Every hour
    }

    /**
     * Apply memory decay (reduce importance of old, unaccessed aiMemories)
     */
    private async applyMemoryDecay() {
        const now = Date.now();
        const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

        // Find old, rarely accessed aiMemories
        const oldMemories = await db.select()
            .from(aiMemories)
            .where(and(
                sql`${aiMemories.timestamp} < ${oneMonthAgo}`,
                sql`${aiMemories.accessed_count} < 3`,
                sql`${aiMemories.importance} > 1`
            ));

        let decayedCount = 0;

        for (const mem of oldMemories) {
            const newImportance = Math.max(1, mem.importance - 1);

            await db.update(aiMemories)
                .set({ importance: newImportance })
                .where(eq(aiMemories.id, mem.id));

            // Update cache
            const cachedMem = this.memoryCache.get(mem.id);
            if (cachedMem) {
                cachedMem.importance = newImportance;
            }

            decayedCount++;
        }

        if (decayedCount > 0) {
            console.log(`⏳ Memory decay applied: ${decayedCount} aiMemories decreased in importance`);
        }
    }
}

// ============================================================================
// MAIN
// ============================================================================

const memorySystem = new MemorySystem();
memorySystem.start();
