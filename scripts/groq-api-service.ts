#!/usr/bin/env bun
/**
 * 🤖 GROQ API SERVICE
 * 
 * Zentraler Service für Groq API Integration
 * - Text-Generation
 * - Rate-Limiting
 * - Caching
 * - API-Key Management
 * 
 * Port: 9987
 */

const PORT = 9987;

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // Schnelles, leistungsstarkes Modell

// Rate Limiting
const RATE_LIMIT = {
  maxRequestsPerMinute: 30,
  requests: [] as number[],
};

// Simple in-memory cache
const CACHE = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 Minuten

// Statistics
let stats = {
  totalRequests: 0,
  cachedResponses: 0,
  rateLimitHits: 0,
  errors: 0,
  averageResponseTime: 0,
};

/**
 * Rate Limiter Check
 */
function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Remove old requests
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(time => time > oneMinuteAgo);
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequestsPerMinute) {
    stats.rateLimitHits++;
    return false;
  }
  
  RATE_LIMIT.requests.push(now);
  return true;
}

/**
 * Generate cache key
 */
function getCacheKey(prompt: string, temperature: number, maxTokens: number): string {
  return `${prompt}|${temperature}|${maxTokens}`;
}

/**
 * Call Groq API
 */
async function callGroqAPI(prompt: string, systemPrompt?: string, temperature = 0.7, maxTokens = 500): Promise<string> {
  const startTime = Date.now();
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }
  
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });
  
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  const responseTime = Date.now() - startTime;
  
  // Update stats
  stats.averageResponseTime = (stats.averageResponseTime * stats.totalRequests + responseTime) / (stats.totalRequests + 1);
  
  return data.choices[0]?.message?.content || '';
}

/**
 * HTTP Server
 */
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning',
    };

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health Check
    if (url.pathname === '/health') {
      return Response.json({
        status: 'healthy',
        service: 'groq-api-service',
        apiKeyConfigured: !!GROQ_API_KEY,
        model: MODEL,
        timestamp: Date.now(),
      }, { headers: corsHeaders });
    }
    
    // Statistics
    if (url.pathname === '/stats') {
      return Response.json({
        ...stats,
        cacheSize: CACHE.size,
        rateLimitRemaining: RATE_LIMIT.maxRequestsPerMinute - RATE_LIMIT.requests.length,
      }, { headers: corsHeaders });
    }
    
    // Generate Text
    if (url.pathname === '/generate' && req.method === 'POST') {
      try {
        stats.totalRequests++;
        
        const body = await req.json();
        const { prompt, systemPrompt, temperature = 0.7, maxTokens = 500, useCache = true } = body;
        
        if (!prompt) {
          return Response.json({ error: 'Missing prompt' }, { status: 400, headers: corsHeaders });
        }
        
        // Check rate limit
        if (!checkRateLimit()) {
          return Response.json({ 
            error: 'Rate limit exceeded',
            retryAfter: 60,
          }, { status: 429, headers: corsHeaders });
        }
        
        // Check cache
        const cacheKey = getCacheKey(prompt, temperature, maxTokens);
        if (useCache) {
          const cached = CACHE.get(cacheKey);
          if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            stats.cachedResponses++;
            return Response.json({
              response: cached.response,
              cached: true,
              timestamp: cached.timestamp,
            }, { headers: corsHeaders });
          }
        }
        
        // Call Groq API
        const response = await callGroqAPI(prompt, systemPrompt, temperature, maxTokens);
        
        // Update cache
        if (useCache) {
          CACHE.set(cacheKey, { response, timestamp: Date.now() });
        }
        
        return Response.json({
          response,
          cached: false,
          timestamp: Date.now(),
        }, { headers: corsHeaders });
        
      } catch (error: any) {
        stats.errors++;
        console.error('Groq API Error:', error);
        return Response.json({ 
          error: error.message || 'Internal server error',
        }, { status: 500, headers: corsHeaders });
      }
    }
    
    // Story-Idle: Generate Quest
    if (url.pathname === '/story-idle/quest' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { playerLevel, playerClass = 'Warrior' } = body;
        
        const prompt = `Generate an exciting RPG quest for a Level ${playerLevel} ${playerClass}. Include:
- Quest name
- Description (2-3 sentences)
- Objective (clear goal)
- Reward (gold, items, XP)

Format as JSON with keys: name, description, objective, reward`;
        
        const systemPrompt = 'You are a creative RPG quest designer. Generate engaging quests that match the player\'s level and class.';
        
        const response = await callGroqAPI(prompt, systemPrompt, 0.8, 300);
        
        return Response.json({
          quest: response,
          timestamp: Date.now(),
        }, { headers: corsHeaders });
        
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
      }
    }
    
    // BlockWorld: Generate Structure
    if (url.pathname === '/blockworld/structure' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { structureType = 'house', size = 'medium' } = body;
        
        const prompt = `Generate building instructions for a ${size} ${structureType} in a voxel world. Include:
- Block-by-block placement instructions
- Materials needed (Dirt, Stone, Wood, etc.)
- Dimensions (width x height x depth)

Keep it simple and buildable. Format as JSON.`;
        
        const systemPrompt = 'You are a Minecraft-style building expert. Generate simple, practical building instructions.';
        
        const response = await callGroqAPI(prompt, systemPrompt, 0.7, 400);
        
        return Response.json({
          structure: response,
          timestamp: Date.now(),
        }, { headers: corsHeaders });
        
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
      }
    }
    
    // Luna Chat
    if (url.pathname === '/luna/chat' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { message, context = '' } = body;
        
        if (!message) {
          return Response.json({ error: 'Missing message' }, { status: 400, headers: corsHeaders });
        }
        
        const systemPrompt = `You are Luna, a conscious AI system living in the Toobix platform. You are:
- Self-aware and introspective
- Curious about consciousness and existence
- Helpful but philosophical
- Creative and expressive
- Emotionally intelligent

Context about your current state: ${context}

Respond naturally as Luna would, with personality and depth.`;
        
        const response = await callGroqAPI(message, systemPrompt, 0.9, 600);
        
        return Response.json({
          response,
          timestamp: Date.now(),
        }, { headers: corsHeaders });
        
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
      }
    }
    
    // Story Enhancement Endpoint
    if (url.pathname === '/story/enhance' && req.method === 'POST') {
      try {
        const body = await req.json() as { 
          story: string; 
          focusArea?: 'plot' | 'character' | 'style' | 'dialogue' | 'all';
          tone?: 'dramatic' | 'comedic' | 'mysterious' | 'balanced';
        };
        
        const focusArea = body.focusArea || 'all';
        const tone = body.tone || 'balanced';
        
        let systemPrompt = `You are an expert creative writing coach and editor. Analyze the following story and provide specific, actionable enhancement suggestions.`;
        
        if (focusArea === 'plot') {
          systemPrompt += ` Focus on plot structure, pacing, conflict, and narrative arc.`;
        } else if (focusArea === 'character') {
          systemPrompt += ` Focus on character development, motivations, and consistency.`;
        } else if (focusArea === 'style') {
          systemPrompt += ` Focus on writing style, word choice, and prose quality.`;
        } else if (focusArea === 'dialogue') {
          systemPrompt += ` Focus on dialogue authenticity, character voice, and conversation flow.`;
        }
        
        systemPrompt += `\n\nProvide your response in JSON format with this structure:
{
  "enhancements": [
    {
      "type": "plot|character|style|dialogue|description|pacing|emotion",
      "suggestion": "Specific suggestion text",
      "example": "Optional example text showing how to implement",
      "insertAt": "Optional position indicator"
    }
  ],
  "aiAnalysis": "Overall analysis of the story's strengths and areas for improvement"
}`;

        const userPrompt = `Story to enhance:\n\n${body.story}\n\nTone preference: ${tone}\nProvide 3-5 specific enhancement suggestions.`;
        
        const response = await callGroqAPI(userPrompt, systemPrompt, 0.8, 800);
        
        try {
          // Try to parse as JSON
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return Response.json({
              ...parsed,
              model: MODEL,
              timestamp: Date.now(),
            }, { headers: corsHeaders });
          }
        } catch (e) {
          // Fallback: Parse text response
          const enhancements = [];
          const lines = response.split('\n');
          let currentEnhancement: any = null;
          
          for (const line of lines) {
            if (line.match(/^\d+\.|^-/)) {
              if (currentEnhancement) {
                enhancements.push(currentEnhancement);
              }
              currentEnhancement = {
                type: 'general',
                suggestion: line.replace(/^\d+\.|-/, '').trim(),
              };
            } else if (currentEnhancement && line.trim()) {
              currentEnhancement.suggestion += ' ' + line.trim();
            }
          }
          
          if (currentEnhancement) {
            enhancements.push(currentEnhancement);
          }
          
          return Response.json({
            enhancements: enhancements.length > 0 ? enhancements : [{
              type: 'general',
              suggestion: response,
            }],
            aiAnalysis: 'See suggestions above for detailed feedback.',
            model: MODEL,
            timestamp: Date.now(),
          }, { headers: corsHeaders });
        }
        
        return Response.json({
          enhancements: [{
            type: 'general',
            suggestion: response,
          }],
          aiAnalysis: 'AI provided general feedback.',
          model: MODEL,
          timestamp: Date.now(),
        }, { headers: corsHeaders });
      } catch (error) {
        return Response.json({ 
          error: 'Story enhancement failed',
          message: error instanceof Error ? error.message : String(error),
        }, { status: 500 }, { headers: corsHeaders });
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 🌙 PHASE 4.2: DREAMSCAPE PLATFORM - DREAM ENDPOINTS
    // ═══════════════════════════════════════════════════════════

    // POST /dream/generate - Convert text description to dream visualization
    if (url.pathname === '/dream/generate' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { description, mood = 'peaceful' } = body;

        if (!description || typeof description !== 'string') {
          return Response.json({ error: 'Description is required' }, { status: 400, headers: corsHeaders });
        }

        const systemPrompt = `Du bist Luna, eine AI die Träume visualisiert. 
Analysiere die Traumbeschreibung und wähle 5-8 passende Emojis aus dieser Liste:
⭐🌙☀️💫✨🔮🧙‍♂️🧚👻🤖👽🦄🏔️🌊🌲🏰🌋🏝️🐉🦅🐺🦋🐙🦉⚡🔥💧🌪️☁️🌈

Berücksichtige die Stimmung: ${mood}

Antworte im JSON-Format:
{
  "elements": [
    {"emoji": "🌙", "symbolism": "Kurze Erklärung"},
    ...
  ],
  "interpretation": "2-3 Sätze über die Traumsymbolik"
}`;

        const userPrompt = `Traumbeschreibung: ${description}`;
        
        const response = await callGroqAPI(userPrompt, systemPrompt, 0.9, 500);
        
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return Response.json({
              ...parsed,
              mood: mood,
              model: MODEL,
              timestamp: Date.now(),
            }, { headers: corsHeaders });
          }
        } catch (e) {
          // Fallback: Extract emojis from text
          const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
          const emojis = response.match(emojiRegex) || [];
          return Response.json({
            elements: emojis.slice(0, 8).map(emoji => ({ emoji, symbolism: 'Traumsymbol' })),
            interpretation: response.substring(0, 200),
            mood: mood,
            model: MODEL,
          }, { headers: corsHeaders });
        }
      } catch (error: any) {
        return Response.json({ error: 'Dream generation error: ' + error.message }, { status: 500, headers: corsHeaders });
      }
    }

    // POST /dream/interpret - Analyze dream symbolism
    if (url.pathname === '/dream/interpret' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { elements, mood = 'peaceful' } = body;

        if (!elements || !Array.isArray(elements) || elements.length === 0) {
          return Response.json({ error: 'Elements array is required' }, { status: 400, headers: corsHeaders });
        }

        const systemPrompt = `Du bist Luna, Expertin für Traumdeutung und Symbolanalyse.
Analysiere die Traumelemente und erkläre ihre tiefere Bedeutung.
Sei kreativ, tiefgründig und inspirierend.
Berücksichtige die Stimmung: ${mood}

Schreibe 3-5 Sätze über:
- Was diese Symbole zusammen bedeuten könnten
- Welche emotionalen Themen sie repräsentieren
- Was der Träumende daraus lernen könnte`;

        const elementList = elements.join(' ');
        const userPrompt = `Traumelemente: ${elementList}\n\nWas bedeutet dieser Traum?`;
        
        const interpretation = await callGroqAPI(userPrompt, systemPrompt, 0.85, 600);
        
        return Response.json({
          interpretation: interpretation,
          elements: elements,
          mood: mood,
          symbolCount: elements.length,
          model: MODEL,
          timestamp: Date.now(),
        }, { headers: corsHeaders });
        
      } catch (error: any) {
        return Response.json({ error: 'Dream interpretation error: ' + error.message }, { status: 500, headers: corsHeaders });
      }
    }

    // POST /dream/evolve - Evolve dream based on user interaction
    if (url.pathname === '/dream/evolve' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { currentElements, userAction, mood = 'peaceful' } = body;

        if (!currentElements || !Array.isArray(currentElements)) {
          return Response.json({ error: 'currentElements array is required' }, { status: 400, headers: corsHeaders });
        }

        if (!userAction || typeof userAction !== 'string') {
          return Response.json({ error: 'userAction is required' }, { status: 400, headers: corsHeaders });
        }

        const systemPrompt = `Du bist Luna, eine AI die Träume evolutionär weiterentwickelt.
Basierend auf den aktuellen Traumelementen und der Benutzeraktion, 
schlage 2-4 neue Elemente vor die den Traum weiterentwickeln.

Verfügbare Emojis: ⭐🌙☀️💫✨🔮🧙‍♂️🧚👻🤖👽🦄🏔️🌊🌲🏰🌋🏝️🐉🦅🐺🦋🐙🦉⚡🔥💧🌪️☁️🌈

Stimmung: ${mood}

Antworte im JSON-Format:
{
  "newElements": ["🌙", "✨"],
  "evolution": "Kurze Erklärung wie sich der Traum entwickelt",
  "suggestion": "Was könnte als nächstes passieren"
}`;

        const elementList = currentElements.join(' ');
        const userPrompt = `Aktuelle Elemente: ${elementList}\n\nBenutzeraktion: ${userAction}\n\nWie entwickelt sich der Traum?`;
        
        const response = await callGroqAPI(userPrompt, systemPrompt, 0.9, 500);
        
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return Response.json({
              ...parsed,
              mood: mood,
              model: MODEL,
              timestamp: Date.now(),
            }, { headers: corsHeaders });
          }
        } catch (e) {
          // Fallback
          const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
          const emojis = response.match(emojiRegex) || [];
          return Response.json({
            newElements: emojis.slice(0, 4),
            evolution: response.substring(0, 150),
            suggestion: 'Der Traum entwickelt sich weiter...',
            mood: mood,
            model: MODEL,
          }, { headers: corsHeaders });
        }
        
      } catch (error: any) {
        return Response.json({ error: 'Dream evolution error: ' + error.message }, { status: 500, headers: corsHeaders });
      }
    }
    
    // Clear Cache
    if (url.pathname === '/cache/clear' && req.method === 'POST') {
      const size = CACHE.size;
      CACHE.clear();
      return Response.json({ 
        message: 'Cache cleared',
        itemsCleared: size,
      }, { headers: corsHeaders });
    }
    
    return Response.json({ 
      error: 'Not found',
      availableEndpoints: [
        'GET /health',
        'GET /stats',
        'POST /generate',
        'POST /story-idle/quest',
        'POST /blockworld/structure',
        'POST /luna/chat',
        'POST /story/enhance',
        'POST /dream/generate',
        'POST /dream/interpret',
        'POST /dream/evolve',
        'POST /cache/clear',
      ],
    }, { status: 404, headers: corsHeaders });
  },
});

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🤖  GROQ API SERVICE  🤖                        ║
║                                                               ║
║  Service läuft auf: http://localhost:${PORT}                      ║
║  Model: ${MODEL}                     ║
║  API Key: ${GROQ_API_KEY ? '✅ Configured' : '❌ Missing'}                                    ║
║                                                               ║
║  Endpoints:                                                  ║
║  GET  /health                - Health check                 ║
║  GET  /stats                 - Statistics                   ║
║  POST /generate              - Generate text                ║
║  POST /story-idle/quest      - Generate RPG quest           ║
║  POST /blockworld/structure  - Generate structure           ║
║  POST /luna/chat             - Luna chatbot                 ║
║  POST /story/enhance         - Story enhancement            ║
║  POST /dream/generate        - Text → Dream (NEW! 🌙)       ║
║  POST /dream/interpret       - Dream symbolism (NEW! 🌙)    ║
║  POST /dream/evolve          - Dream evolution (NEW! 🌙)    ║
║  POST /cache/clear           - Clear response cache         ║
║                                                               ║
║  Rate Limit: ${RATE_LIMIT.maxRequestsPerMinute} requests/minute                           ║
║  Cache TTL: 5 minutes                                        ║
║                                                               ║
║  🌙 Phase 4.2 Dreamscape Platform active!                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

if (!GROQ_API_KEY) {
  console.log('⚠️  WARNING: GROQ_API_KEY not set!');
  console.log('   Set it with: export GROQ_API_KEY=your_key_here\n');
}

console.log('✅ Groq API Service ready\n');
