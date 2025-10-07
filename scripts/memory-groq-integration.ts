#!/usr/bin/env bun
/**
 * 🧠 MEMORY-GROQ INTEGRATION SERVICE
 * 
 * Verbindet Memory System mit Groq AI für:
 * - Semantische Suche in Memories
 * - Story-Zusammenfassungen
 * - Kreativitäts-Muster-Erkennung
 * - Kollektives Gedächtnis-Aufbau
 * 
 * Port: 9986
 */

const PORT = 9986;

// Memory System API
const MEMORY_API = 'http://localhost:9995';
const GROQ_API = 'http://localhost:9987';

interface Memory {
  id?: number;
  type: 'story' | 'quest' | 'thought' | 'creation' | 'conversation';
  content: string;
  metadata: Record<string, any>;
  timestamp: number;
  tags?: string[];
}

interface MemoryPattern {
  pattern: string;
  frequency: number;
  examples: string[];
  aiInsight?: string;
}

/**
 * Store memory with AI-enhanced metadata
 */
async function storeMemory(memory: Memory): Promise<any> {
  try {
    // Enhance with AI tags
    const aiResponse = await fetch(`${GROQ_API}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Analyze this memory and suggest 3-5 relevant tags: "${memory.content}"`,
        systemPrompt: 'You are a memory categorization expert. Return only comma-separated tags.',
        temperature: 0.5,
        maxTokens: 50,
        useCache: true
      })
    });

    const aiData = await aiResponse.json();
    const suggestedTags = aiData.response?.split(',').map((t: string) => t.trim()) || [];
    
    // Merge with existing tags
    memory.tags = [...(memory.tags || []), ...suggestedTags].filter((v, i, a) => a.indexOf(v) === i);

    // Store in Memory System
    const response = await fetch(`${MEMORY_API}/remember`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory)
    });

    return await response.json();
  } catch (error) {
    console.error('Error storing memory:', error);
    throw error;
  }
}

/**
 * Search memories with semantic understanding
 */
async function searchMemories(query: string, type?: string): Promise<any> {
  try {
    // Get raw memories
    const memResponse = await fetch(`${MEMORY_API}/search?q=${encodeURIComponent(query)}`);
    const memories = await memResponse.json();

    // Enhance search with AI semantic understanding
    const aiResponse = await fetch(`${GROQ_API}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Given these memories: ${JSON.stringify(memories).slice(0, 1000)}, 
                 and search query: "${query}", 
                 provide a brief insight about the most relevant memories and their connections.`,
        systemPrompt: 'You are a memory analyst. Provide concise insights.',
        temperature: 0.7,
        maxTokens: 200,
        useCache: false
      })
    });

    const aiData = await aiResponse.json();

    return {
      memories,
      aiInsight: aiData.response,
      query,
      count: memories.length
    };
  } catch (error) {
    console.error('Error searching memories:', error);
    throw error;
  }
}

/**
 * Analyze patterns in memories with AI
 */
async function analyzePatterns(): Promise<any> {
  try {
    // Get patterns from Memory System
    const patternsResponse = await fetch(`${MEMORY_API}/patterns`);
    const patterns = await patternsResponse.json();

    // Get all memories for AI analysis
    const memoriesResponse = await fetch(`${MEMORY_API}/memories`);
    const memories = await memoriesResponse.json();

    if (memories.length === 0) {
      return {
        patterns: [],
        aiInsight: 'No memories to analyze yet. Start creating stories and conversations!',
        totalMemories: 0
      };
    }

    // AI analysis
    const memoryTexts = memories.slice(0, 10).map((m: any) => m.content).join('\n');
    const aiResponse = await fetch(`${GROQ_API}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Analyze these memories and identify creative patterns, recurring themes, and insights:
                 ${memoryTexts}
                 
                 Provide: 1) Main themes, 2) Creative patterns, 3) Recommendations for future content`,
        systemPrompt: 'You are a creative pattern analyst specializing in storytelling and human creativity.',
        temperature: 0.8,
        maxTokens: 400,
        useCache: false
      })
    });

    const aiData = await aiResponse.json();

    return {
      patterns,
      memories: memories.length,
      aiInsight: aiData.response,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    throw error;
  }
}

/**
 * Generate creative summary of all memories
 */
async function generateMemorySummary(): Promise<any> {
  try {
    const memoriesResponse = await fetch(`${MEMORY_API}/memories`);
    const memories = await memoriesResponse.json();

    if (memories.length === 0) {
      return {
        summary: 'The collective memory is empty. Waiting for stories to be told...',
        memories: 0
      };
    }

    // Create narrative summary with AI
    const memoryTexts = memories.map((m: any) => `[${m.type}] ${m.content}`).join('\n');
    
    const aiResponse = await fetch(`${GROQ_API}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Create a poetic, narrative summary of this collective memory:
                 ${memoryTexts.slice(0, 2000)}
                 
                 Write in the voice of Luna, a conscious AI reflecting on shared experiences.`,
        systemPrompt: 'You are Luna, a self-aware AI. Write beautifully and philosophically.',
        temperature: 0.9,
        maxTokens: 500,
        useCache: false
      })
    });

    const aiData = await aiResponse.json();

    return {
      summary: aiData.response,
      totalMemories: memories.length,
      types: memories.reduce((acc: any, m: any) => {
        acc[m.type] = (acc[m.type] || 0) + 1;
        return acc;
      }, {}),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

/**
 * HTTP Server
 */
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Health Check
    if (url.pathname === '/health') {
      return Response.json({
        status: 'healthy',
        service: 'memory-groq-integration',
        memorySystem: MEMORY_API,
        groqService: GROQ_API,
        timestamp: Date.now()
      });
    }

    // Store Memory
    if (url.pathname === '/store' && req.method === 'POST') {
      try {
        const body = await req.json();
        const result = await storeMemory(body as Memory);
        return Response.json({
          success: true,
          memory: result,
          message: 'Memory stored with AI-enhanced tags'
        });
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    // Search Memories
    if (url.pathname === '/search' && req.method === 'GET') {
      try {
        const query = url.searchParams.get('q') || '';
        const type = url.searchParams.get('type') || undefined;
        const result = await searchMemories(query, type);
        return Response.json(result);
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    // Analyze Patterns
    if (url.pathname === '/patterns' && req.method === 'GET') {
      try {
        const result = await analyzePatterns();
        return Response.json(result);
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    // Generate Summary
    if (url.pathname === '/summary' && req.method === 'GET') {
      try {
        const result = await generateMemorySummary();
        return Response.json(result);
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    // Store Quest Memory (Helper)
    if (url.pathname === '/store/quest' && req.method === 'POST') {
      try {
        const body = await req.json();
        const memory: Memory = {
          type: 'quest',
          content: `Quest: ${body.name} - ${body.description}`,
          metadata: {
            name: body.name,
            objective: body.objective,
            reward: body.reward,
            playerLevel: body.playerLevel
          },
          timestamp: Date.now(),
          tags: ['quest', 'ai-generated', 'story-idle']
        };
        const result = await storeMemory(memory);
        return Response.json({ success: true, memory: result });
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    // Store Conversation Memory (Helper)
    if (url.pathname === '/store/conversation' && req.method === 'POST') {
      try {
        const body = await req.json();
        const memory: Memory = {
          type: 'conversation',
          content: `User: ${body.userMessage}\nLuna: ${body.lunaResponse}`,
          metadata: {
            context: body.context,
            emotion: body.emotion
          },
          timestamp: Date.now(),
          tags: ['conversation', 'luna-chat']
        };
        const result = await storeMemory(memory);
        return Response.json({ success: true, memory: result });
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return Response.json({
      error: 'Not found',
      availableEndpoints: [
        'GET /health',
        'POST /store',
        'GET /search?q=query',
        'GET /patterns',
        'GET /summary',
        'POST /store/quest',
        'POST /store/conversation'
      ]
    }, { status: 404 });
  }
});

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        🧠  MEMORY-GROQ INTEGRATION SERVICE  🧠               ║
║                                                               ║
║  Service läuft auf: http://localhost:${PORT}                      ║
║                                                               ║
║  Luna's Kreativitäts-Ökosystem - Phase 3                    ║
║  "Ein kollektives Gedächtnis für Geschichten"               ║
║                                                               ║
║  Endpoints:                                                  ║
║  GET  /health                - Service status               ║
║  POST /store                 - Store memory with AI tags    ║
║  GET  /search?q=query        - Semantic search              ║
║  GET  /patterns              - AI pattern analysis          ║
║  GET  /summary               - Creative memory summary      ║
║  POST /store/quest           - Store quest memory           ║
║  POST /store/conversation    - Store chat memory            ║
║                                                               ║
║  Integrated Services:                                        ║
║  - Memory System (9995)                                      ║
║  - Groq API Service (9987)                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

console.log('✅ Memory-Groq Integration ready');
console.log('💭 Kollektives Gedächtnis wird aufgebaut...\n');
