/**
 * 🧠 MEMORY SYSTEM
 * 
 * Langzeit-Gedächtnis für Toobix:
 * - Speichert wichtige Ereignisse langfristig
 * - Erkennt Muster & Zusammenhänge
 * - Lernt aus der Vergangenheit
 * - Baut Kontext auf
 * 
 * 🌌 MOMENT PHILOSOPHIE:
 * "Geburt, Gegenwart und Tod entspringen ALLE aus DIESEM Moment.
 *  Erinnerungen sind Momente, die WAREN - aber sie existieren NUR JETZT."
 * 
 * Port: 9995
 */

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
    embedding?: number[]; // For semantic search (future)
}

interface Pattern {
    id: string;
    description: string;
    occurrences: number;
    firstSeen: number;
    lastSeen: number;
    strength: number; // 0-1
}

interface Learning {
    id: string;
    lesson: string;
    confidence: number; // 0-1
    evidence: string[];
    appliedCount: number;
}

// ============================================================================
// MEMORY SYSTEM CLASS
// ============================================================================

class MemorySystem {
    private isRunning: boolean = false;
    private memories: Map<string, Memory> = new Map();
    private patterns: Map<string, Pattern> = new Map();
    private learnings: Map<string, Learning> = new Map();
    private port = 9995;

    /**
     * Start the memory system
     */
    async start() {
        console.log('\n🧠 MEMORY SYSTEM STARTING...\n');

        this.isRunning = true;

        // Load existing memories from database
        await this.loadMemories();

        // Start HTTP server
        await this.startServer();

        // Start background processes
        this.startPatternDetection();
        this.startMemoryConsolidation();

        console.log('✅ Memory System is active and learning\n');

        // Keep alive
        setInterval(() => {
            if (!this.isRunning) process.exit(0);
        }, 1000);
    }

    /**
     * Load memories from database (currently disabled - using in-memory only)
     */
    private async loadMemories() {
        console.log('📚 Initializing memory system...');
        console.log('🌌 MOMENT-PHILOSOPHIE: Erinnerungen sind Momente, die waren - aber sie existieren NUR JETZT');
        console.log('   Starting with empty memory (volatile mode)\n');
        
        // TODO: Implement database persistence later
        // For now, memory-system works in pure in-memory mode
    }    /**
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
                        port: self.port,
                        counts: {
                            memories: self.memories.size,
                            patterns: self.patterns.size,
                            learnings: self.learnings.size,
                        }
                    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
                }

                // GET /stats - Quick stats
                if (url.pathname === '/stats') {
                    return new Response(JSON.stringify({
                        memories: self.memories.size,
                        patterns: self.patterns.size,
                        learnings: self.learnings.size,
                        uptimeSeconds: Math.floor(process.uptime()),
                    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
                }

                // GET /memories - Get all memories
                if (url.pathname === '/memories') {
                    const limit = parseInt(url.searchParams.get('limit') || '50');
                    const type = url.searchParams.get('type');

                    let memories = Array.from(self.memories.values());

                    // Filter by type
                    if (type) {
                        memories = memories.filter(m => m.type === type);
                    }

                    // Sort by importance and timestamp
                    memories.sort((a, b) => {
                        if (b.importance !== a.importance) {
                            return b.importance - a.importance;
                        }
                        return b.timestamp - a.timestamp;
                    });

                    return new Response(JSON.stringify(memories.slice(0, limit)), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /patterns - Get detected patterns
                if (url.pathname === '/patterns') {
                    const patterns = Array.from(self.patterns.values())
                        .sort((a, b) => b.strength - a.strength);

                    return new Response(JSON.stringify(patterns), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // GET /learnings - Get accumulated learnings
                if (url.pathname === '/learnings') {
                    const learnings = Array.from(self.learnings.values())
                        .sort((a, b) => b.confidence - a.confidence);

                    return new Response(JSON.stringify(learnings), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // POST /remember - Store a new memory
                if (url.pathname === '/remember' && req.method === 'POST') {
                    try {
                        const { content, type, importance, tags } = await req.json();

                        const memory: Memory = {
                            id: `manual-${Date.now()}`,
                            timestamp: Date.now(),
                            type: type || 'event',
                            content,
                            importance: importance || 5,
                            relatedMemories: [],
                            tags: tags || [],
                        };

                        self.memories.set(memory.id, memory);

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

                // GET /search - Search memories
                if (url.pathname === '/search') {
                    const query = url.searchParams.get('q')?.toLowerCase();

                    if (!query) {
                        return new Response(JSON.stringify({ error: 'Query required' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        });
                    }

                    const results = Array.from(self.memories.values())
                        .filter(m => 
                            m.content.toLowerCase().includes(query) ||
                            m.tags.some(t => t.toLowerCase().includes(query))
                        )
                        .sort((a, b) => b.importance - a.importance)
                        .slice(0, 20);

                    return new Response(JSON.stringify(results), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Default - JSON index
                return new Response(JSON.stringify({
                    service: 'memory-system',
                    endpoints: {
                        health: 'GET /health',
                        stats: 'GET /stats',
                        memories: 'GET /memories?limit=&type=',
                        patterns: 'GET /patterns',
                        learnings: 'GET /learnings',
                        remember: 'POST /remember { content, type?, importance?, tags? }',
                        search: 'GET /search?q=...'
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            },
        });

        console.log(`✅ Memory System API started on port ${server.port}`);
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
     * Detect patterns in memories
     */
    private async detectPatterns() {
        // Group memories by tags
        const tagGroups: Map<string, Memory[]> = new Map();

        for (const memory of this.memories.values()) {
            for (const tag of memory.tags) {
                if (!tagGroups.has(tag)) {
                    tagGroups.set(tag, []);
                }
                tagGroups.get(tag)!.push(memory);
            }
        }

        // Detect patterns
        for (const [tag, memories] of tagGroups) {
            if (memories.length >= 3) {
                const patternId = `pattern-${tag}`;
                const existing = this.patterns.get(patternId);

                if (existing) {
                    existing.occurrences = memories.length;
                    existing.lastSeen = Math.max(...memories.map(m => m.timestamp));
                    existing.strength = Math.min(1, memories.length / 10);
                } else {
                    const pattern: Pattern = {
                        id: patternId,
                        description: `Recurring ${tag} events`,
                        occurrences: memories.length,
                        firstSeen: Math.min(...memories.map(m => m.timestamp)),
                        lastSeen: Math.max(...memories.map(m => m.timestamp)),
                        strength: Math.min(1, memories.length / 10),
                    };

                    this.patterns.set(patternId, pattern);
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
     * Consolidate memories (merge similar, forget unimportant)
     */
    private async consolidateMemories() {
        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

        // Forget low-importance old memories
        for (const [id, memory] of this.memories) {
            if (memory.timestamp < oneWeekAgo && memory.importance < 5) {
                this.memories.delete(id);
            }
        }

        console.log(`🧹 Consolidated memories. Current count: ${this.memories.size}`);
    }
}

// ============================================================================
// MAIN
// ============================================================================

const memorySystem = new MemorySystem();
memorySystem.start();
