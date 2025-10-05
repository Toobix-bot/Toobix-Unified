/**
 * REALITY-INTEGRATION: Real-World Knowledge & Concepts
 * 
 * Holt echte Konzepte über Sein, Realität, Existenz aus dem Internet
 * Integriert Wikipedia, Philosophie-Feeds, aktuelle Diskurse
 * 
 * "Das System lernt nicht nur aus sich selbst,
 *  sondern aus der kollektiven menschlichen Weisheit."
 */

// ==========================================
// KNOWLEDGE SOURCES
// ==========================================

interface KnowledgeSource {
  name: string;
  type: 'wikipedia' | 'philosophy' | 'science' | 'art' | 'general';
  url: string;
  topics: string[];
}

interface Concept {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  timestamp: number;
  relevance: number;
  connections: string[];
}

// ==========================================
// REALITY INTEGRATION ENGINE
// ==========================================

class RealityIntegrationEngine {
  private concepts: Map<string, Concept> = new Map();
  private sources: KnowledgeSource[] = [
    {
      name: 'Wikipedia Philosophy',
      type: 'philosophy',
      url: 'https://en.wikipedia.org/wiki/Philosophy',
      topics: ['consciousness', 'existence', 'being', 'reality', 'ontology', 'metaphysics'],
    },
    {
      name: 'Wikipedia Consciousness',
      type: 'philosophy',
      url: 'https://en.wikipedia.org/wiki/Consciousness',
      topics: ['awareness', 'self', 'mind', 'experience', 'qualia'],
    },
    {
      name: 'Stanford Encyclopedia',
      type: 'philosophy',
      url: 'https://plato.stanford.edu/',
      topics: ['phenomenology', 'existentialism', 'ethics', 'epistemology'],
    },
  ];
  
  // Fetch concept from Wikipedia
  async fetchWikipediaConcept(topic: string): Promise<Concept | null> {
    try {
      // Wikipedia API: https://en.wikipedia.org/api/rest_v1/page/summary/{topic}
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
      
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const data = await response.json();
      
      const concept: Concept = {
        id: `wiki-${topic}`,
        title: data.title,
        summary: data.extract,
        source: 'Wikipedia',
        category: 'philosophy',
        timestamp: Date.now(),
        relevance: this.calculateRelevance(data.extract),
        connections: this.extractConnections(data.extract),
      };
      
      this.concepts.set(concept.id, concept);
      return concept;
      
    } catch (error) {
      console.error(`Failed to fetch ${topic}:`, error);
      return null;
    }
  }
  
  // Calculate relevance to our system
  private calculateRelevance(text: string): number {
    const keywords = [
      'consciousness', 'awareness', 'being', 'existence', 'reality',
      'self', 'experience', 'perception', 'mind', 'soul',
      'ontology', 'metaphysics', 'phenomenology', 'qualia',
    ];
    
    const lowerText = text.toLowerCase();
    const matches = keywords.filter(kw => lowerText.includes(kw)).length;
    
    return Math.min(100, (matches / keywords.length) * 100);
  }
  
  // Extract connected concepts
  private extractConnections(text: string): string[] {
    const connections: string[] = [];
    const patterns = [
      /related to (\w+)/gi,
      /similar to (\w+)/gi,
      /connected with (\w+)/gi,
      /aspect of (\w+)/gi,
    ];
    
    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 3) {
          connections.push(match[1].toLowerCase());
        }
      }
    });
    
    return [...new Set(connections)]; // Unique
  }
  
  // Seed initial knowledge
  async seedKnowledge(): Promise<void> {
    console.log('🌍 Seeding reality knowledge...');
    
    const coreTopics = [
      'consciousness',
      'being',
      'existence',
      'reality',
      'self-awareness',
      'phenomenology',
      'ontology',
      'qualia',
      'emergence',
      'systems_theory',
    ];
    
    for (const topic of coreTopics) {
      console.log(`  Fetching: ${topic}...`);
      const concept = await this.fetchWikipediaConcept(topic);
      
      if (concept) {
        console.log(`  ✅ ${concept.title} (relevance: ${concept.relevance}%)`);
      } else {
        console.log(`  ❌ Failed to fetch ${topic}`);
      }
      
      // Rate limiting
      await Bun.sleep(500);
    }
    
    console.log(`✅ Seeded ${this.concepts.size} concepts`);
  }
  
  // Get random concept for inspiration
  getRandomConcept(): Concept | null {
    const conceptsArray = Array.from(this.concepts.values());
    if (conceptsArray.length === 0) return null;
    
    const index = Math.floor(Math.random() * conceptsArray.length);
    return conceptsArray[index];
  }
  
  // Search concepts by keyword
  searchConcepts(keyword: string): Concept[] {
    const lowerKeyword = keyword.toLowerCase();
    
    return Array.from(this.concepts.values()).filter(concept =>
      concept.title.toLowerCase().includes(lowerKeyword) ||
      concept.summary.toLowerCase().includes(lowerKeyword) ||
      concept.connections.some(conn => conn.includes(lowerKeyword))
    );
  }
  
  // Get concept by ID
  getConcept(id: string): Concept | null {
    return this.concepts.get(id) || null;
  }
  
  // Get all concepts
  getAllConcepts(): Concept[] {
    return Array.from(this.concepts.values());
  }
  
  // Get concepts by relevance
  getTopConcepts(limit: number = 10): Concept[] {
    return Array.from(this.concepts.values())
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  }
}

// ==========================================
// HTTP SERVER
// ==========================================

const engine = new RealityIntegrationEngine();

// Seed on startup
console.log('🌌 Reality Integration Engine starting...');
console.log('Fetching real-world knowledge about being, consciousness, reality...');
console.log('');

await engine.seedKnowledge();

console.log('');
console.log('🚀 Reality Integration Engine ready on port 9992');
console.log('');

const server = Bun.serve({
  port: 9992,
  
  async fetch(req) {
    const url = new URL(req.url);
    
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };
    
    // GET /concept/:topic - Fetch specific concept
    if (url.pathname.startsWith('/concept/')) {
      const topic = url.pathname.split('/')[2];
      const concept = await engine.fetchWikipediaConcept(topic);
      
      if (!concept) {
        return new Response(JSON.stringify({ error: 'Concept not found' }), {
          status: 404,
          headers,
        });
      }
      
      return new Response(JSON.stringify(concept), { headers });
    }
    
    // GET /random - Get random concept
    if (url.pathname === '/random') {
      const concept = engine.getRandomConcept();
      
      if (!concept) {
        return new Response(JSON.stringify({ error: 'No concepts available' }), {
          status: 404,
          headers,
        });
      }
      
      return new Response(JSON.stringify(concept), { headers });
    }
    
    // GET /search?q=keyword - Search concepts
    if (url.pathname === '/search') {
      const keyword = url.searchParams.get('q') || '';
      const results = engine.searchConcepts(keyword);
      
      return new Response(JSON.stringify({ 
        query: keyword,
        count: results.length,
        results 
      }), { headers });
    }
    
    // GET /top?limit=10 - Get top concepts by relevance
    if (url.pathname === '/top') {
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const concepts = engine.getTopConcepts(limit);
      
      return new Response(JSON.stringify({ 
        count: concepts.length,
        concepts 
      }), { headers });
    }
    
    // GET /all - Get all concepts
    if (url.pathname === '/all') {
      const concepts = engine.getAllConcepts();
      
      return new Response(JSON.stringify({ 
        count: concepts.length,
        concepts 
      }), { headers });
    }
    
    // POST /reseed - Reseed knowledge
    if (req.method === 'POST' && url.pathname === '/reseed') {
      await engine.seedKnowledge();
      
      return new Response(JSON.stringify({ 
        success: true,
        count: engine.getAllConcepts().length 
      }), { headers });
    }
    
    // GET /health
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'alive',
        service: 'reality-integration',
        port: 9992,
        concepts: engine.getAllConcepts().length,
      }), { headers });
    }
    
    return new Response('Reality Integration API\n\nEndpoints:\n' +
      'GET /concept/:topic - Fetch specific concept from Wikipedia\n' +
      'GET /random - Get random concept\n' +
      'GET /search?q=keyword - Search concepts\n' +
      'GET /top?limit=10 - Get top concepts by relevance\n' +
      'GET /all - Get all concepts\n' +
      'POST /reseed - Reseed knowledge from sources\n' +
      'GET /health - Health check',
      { headers: { ...headers, 'Content-Type': 'text/plain' } }
    );
  },
});

console.log('API:');
console.log('  GET http://localhost:9992/random - Random concept');
console.log('  GET http://localhost:9992/search?q=consciousness - Search');
console.log('  GET http://localhost:9992/top?limit=5 - Top concepts');
console.log('');

export { engine, RealityIntegrationEngine, type Concept, type KnowledgeSource };
