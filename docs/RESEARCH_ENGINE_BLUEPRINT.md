# 🔬 AI RESEARCH ENGINE & KNOWLEDGE BASE - BLUEPRINT

**Port:** 9985 (reserviert)  
**Status:** Planning Phase  
**Priority:** High

---

## 🎯 PURPOSE

Ein intelligentes Research-System, das:
1. **Automatisch im Internet recherchiert** (Web Scraping, APIs)
2. **Blog-Posts generiert** aus Research-Ergebnissen
3. **Wissensdatenbank aufbaut** (vernetzt, durchsuchbar)
4. **Quellen trackt** (URL, Datum, Autor)
5. **Auto-Update** von veralteten Informationen

---

## 🏗️ ARCHITECTURE

### Database Schema (SQLite):

```typescript
interface ResearchTopic {
  id: string                    // UUID
  title: string                 // "Quantum Computing Basics"
  query: string                 // Original search query
  category: string              // "technology", "science", "philosophy"
  status: 'researching' | 'complete' | 'updating' | 'failed'
  
  metadata: {
    createdAt: string
    lastUpdated: string
    researcher: 'ai' | 'human'
    language: 'de' | 'en'
  }
  
  research: {
    sources: Source[]
    summary: string             // AI-generated summary
    keyInsights: string[]       // Wichtigste Erkenntnisse
    keywords: string[]          // Extracted keywords
  }
  
  content: {
    blogPost: string            // Generated Markdown blog
    notes: string               // Raw research notes
    quotes: Quote[]             // Important quotes with sources
  }
  
  connections: {
    relatedTopics: string[]     // IDs other topics
    prerequisites: string[]     // Was sollte man vorher wissen?
    nextTopics: string[]        // Weiterführende Themen
  }
}

interface Source {
  id: string
  url: string
  title: string
  author?: string
  publishedDate?: string
  accessedDate: string
  domain: string                // "wikipedia.org", "arxiv.org"
  credibility: number           // 0-10 AI-scored
  content: string               // Extracted text
  type: 'article' | 'paper' | 'video' | 'book' | 'forum'
}

interface Quote {
  text: string
  sourceId: string
  context: string               // Surrounding context
  relevance: number             // 0-10
}

interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

interface KnowledgeNode {
  id: string
  type: 'topic' | 'concept' | 'person' | 'place' | 'event'
  label: string
  description: string
  metadata: Record<string, any>
}

interface KnowledgeEdge {
  source: string                // Node ID
  target: string                // Node ID
  type: 'related' | 'prerequisite' | 'contradiction' | 'supports'
  strength: number              // 0-1
}
```

### API Endpoints:

```typescript
// Research Management
POST   /research                // Start new research
       { query, language, depth: 'quick'|'deep' }
GET    /research                // List all topics
GET    /research/:id            // Get specific topic
DELETE /research/:id            // Delete topic
PUT    /research/:id/update     // Update research (new sources)

// Blog Generation
GET    /blog/:id                // Get generated blog post
POST   /blog/:id/regenerate     // Regenerate with new prompt
GET    /blogs                   // List all blog posts
POST   /blog/:id/publish        // Mark as published

// Knowledge Base
GET    /knowledge/search?q=     // Semantic search
GET    /knowledge/graph         // Full knowledge graph
GET    /knowledge/related/:id   // Related topics
GET    /knowledge/path          // Find connection between topics
       { from, to }

// Sources
GET    /sources                 // List all sources
GET    /sources/:id             // Get source details
POST   /sources/:id/verify      // Re-check source validity
GET    /sources/credible        // High-credibility sources only

// AI Assistant
POST   /ask                     // Ask questions about research
       { topicId, question }
POST   /summarize               // Summarize topic
       { topicId, style: 'eli5'|'academic'|'casual' }

// Auto-Update
GET    /outdated                // List outdated topics
POST   /update/auto             // Trigger auto-update process
GET    /update/status           // Update queue status
```

---

## 🎨 FEATURES

### 1. Intelligent Web Research
- **Multi-Source Scraping:** Wikipedia, arXiv, Medium, YouTube, etc.
- **API Integration:** Google Scholar, OpenAI, Semantic Scholar
- **Content Extraction:** Clean text from HTML
- **Credibility Scoring:** AI bewertet Quellen-Qualität
- **De-duplication:** Gleiche Infos nur einmal

### 2. AI-Powered Blog Generation (Groq)
```typescript
// Template für Blog-Post
const blogTemplate = `
# {title}

*Researched by AI on {date}*

## 📚 Zusammenfassung
{ai_generated_summary}

## 🔍 Wichtigste Erkenntnisse
{key_insights_as_list}

## 📖 Detaillierte Analyse
{ai_generated_detailed_content}

## 💡 Praktische Anwendungen
{ai_generated_applications}

## 🔗 Weiterführende Themen
{related_topics_with_links}

## 📚 Quellen
{formatted_sources_list}

---
*Dieses Research wurde automatisch von der Toobix AI Research Engine erstellt.*
*Letzte Aktualisierung: {last_updated}*
`
```

### 3. Knowledge Graph
- **Automatische Verlinkung** zwischen Themen
- **Concept Extraction** (Personen, Orte, Events)
- **Visualisierung** (D3.js Graph)
- **Shortest Path** zwischen zwei Topics
- **Cluster Detection** (verwandte Themen-Gruppen)

### 4. Auto-Update Mechanism
```typescript
// Jeden Tag prüfen:
const updateStrategy = {
  checkFrequency: {
    technology: '7 days',      // Tech veraltet schnell
    science: '30 days',        // Wissenschaft langsamer
    history: '365 days',       // Geschichte ändert sich selten
    philosophy: '365 days'
  },
  
  updateTriggers: [
    'Source nicht mehr erreichbar',
    'Neuer Major Event im Topic',
    'Widersprüchliche neue Infos',
    'User meldet Fehler'
  ]
}
```

### 5. Smart Search
- **Semantic Search** mit Embeddings
- **Filter:** Datum, Kategorie, Sprache, Credibility
- **Sort:** Relevance, Date, Credibility
- **Suggestions:** "Meintest du...?"

---

## 💻 EXAMPLE USE CASES

### Use Case 1: Research-Anfrage
```typescript
POST /research
{
  "query": "Wie funktioniert Quantum Entanglement?",
  "language": "de",
  "depth": "deep"
}

// System startet automatisch:
// 1. Google Search für relevante Links
// 2. Wikipedia Article scrapen
// 3. arXiv Papers finden
// 4. YouTube Videos (Transkripte)
// 5. AI fasst alles zusammen
// 6. Blog-Post wird generiert
// 7. Knowledge Graph wird erweitert

Response:
{
  "id": "research-123",
  "status": "complete",
  "sourcesFound": 47,
  "sourcesUsed": 12,
  "blogPostGenerated": true,
  "timeElapsed": "2m 34s"
}
```

### Use Case 2: Knowledge Graph Exploration
```
🌐 Knowledge Graph: "Quantum Computing"

Connected Topics:
├─ Quantum Entanglement (prerequisite)
├─ Superposition (prerequisite)
├─ Qubits (core concept)
├─ Shor's Algorithm (application)
├─ Quantum Error Correction (challenge)
└─ Classical vs Quantum Computing (comparison)

People:
├─ Richard Feynman (pioneer)
├─ David Deutsch (theorist)
└─ Peter Shor (algorithm)

Related Fields:
├─ Cryptography (application)
├─ Machine Learning (synergy)
└─ Chemistry Simulation (application)
```

### Use Case 3: Blog Generation
```markdown
# Quantum Entanglement: Wenn Teilchen über Distanzen verbunden bleiben

*Automatisch recherchiert am 06.10.2025*

## 📚 Zusammenfassung
Quantum Entanglement (Quantenverschränkung) ist ein faszinierendes Phänomen...

[AI generiert 2000+ Wörter Blog-Post mit Quellen]

## 📚 Quellen
1. [Einstein-Podolsky-Rosen Paper (1935)](https://journals.aps.org/pr/abstract/10.1103/PhysRev.47.777) - arXiv
2. [Quantum Entanglement - Stanford Encyclopedia](https://plato.stanford.edu/entries/qt-entangle/) - Credibility: 9.5/10
3. [Bell's Theorem Explained](https://youtube.com/watch?v=...) - YouTube, 1.2M views
...
```

---

## 🔧 IMPLEMENTATION PLAN

### Phase 1: Basic Research (Week 1)
- [ ] Web Scraping Setup (Playwright/Puppeteer)
- [ ] Wikipedia API Integration
- [ ] Content Extraction & Cleaning
- [ ] Source Storage (SQLite)
- [ ] Basic Search Endpoint

### Phase 2: AI Generation (Week 2)
- [ ] Groq Integration für Summarization
- [ ] Blog Post Template System
- [ ] Markdown Generation
- [ ] Quote Extraction
- [ ] Key Insights Algorithm

### Phase 3: Knowledge Graph (Week 3)
- [ ] Graph Database Schema
- [ ] Concept Extraction (NER with AI)
- [ ] Automatic Linking
- [ ] Graph API Endpoints
- [ ] D3.js Visualization (Frontend)

### Phase 4: Auto-Update (Week 4)
- [ ] Update Scheduler (Cron)
- [ ] Source Validity Checker
- [ ] Diff Detection
- [ ] Notification System
- [ ] Update Queue

### Phase 5: Advanced (Week 5-6)
- [ ] Semantic Search (Embeddings)
- [ ] More API Integrations (Google Scholar, etc.)
- [ ] Credibility Scoring Algorithm
- [ ] Export System (PDF, EPUB)
- [ ] Social Sharing

---

## 🎯 SUCCESS METRICS

- **Research Topics:** 100+ nach 3 Monaten
- **Blog Posts:** 50+ high-quality posts
- **Source Coverage:** 1000+ unique sources
- **Knowledge Graph:** 500+ nodes, 2000+ edges
- **Auto-Updates:** 90%+ successful updates
- **User Satisfaction:** 4.5+/5 stars

---

## 🚀 FUTURE ENHANCEMENTS

1. **Multi-Language Support:** Research in EN, DE, FR, ES, etc.
2. **Video Content:** Transkript-Analyse von YouTube/Podcasts
3. **Paper Analysis:** Deep-dive in wissenschaftliche Papers
4. **Fact-Checking:** Automatische Verifikation von Claims
5. **Collaborative Research:** Multiple AI agents arbeiten zusammen
6. **Newsletter Generation:** Wöchentliche Research-Digest
7. **API for External Use:** Andere können Research nutzen
8. **Academic Citations:** Automatische Zitat-Formatierung (APA, MLA)

---

## 🤖 AI PROMPTS (Groq)

### Summarization Prompt:
```
Du bist ein Experte für {topic}. 
Fasse die folgenden {num_sources} Quellen zusammen:

{sources_text}

Erstelle eine prägnante, aber umfassende Zusammenfassung (300-500 Wörter).
Fokus auf: Hauptkonzepte, Kontroversen, praktische Anwendungen.
Schreibstil: Informativ, aber zugänglich für Laien.
```

### Blog Post Generation Prompt:
```
Erstelle einen Blog-Post über "{topic}" basierend auf dieser Research:

Summary: {summary}
Key Insights: {insights}
Sources: {sources}

Format: Markdown
Länge: 1500-2000 Wörter
Struktur:
1. Einleitung (Hook, warum wichtig?)
2. Grundlagen (ELI5 Erklärung)
3. Details (technischer, aber verständlich)
4. Anwendungen (praktische Beispiele)
5. Fazit (take-away message)

Stil: Unterhaltsam und lehrreich, nutze Metaphern und Beispiele.
```

---

## 📊 TECH STACK

- **Runtime:** Bun
- **Language:** TypeScript
- **Database:** SQLite (Topics, Sources) + Graph DB (Knowledge Graph)
- **Web Scraping:** Playwright / Cheerio
- **AI:** Groq LLM (Summarization, Blog Generation)
- **Search:** Vector Embeddings (Sentence Transformers)
- **Visualization:** D3.js (Knowledge Graph)
- **APIs:** Wikipedia, arXiv, Google Scholar, YouTube Data API
- **Scheduler:** node-cron (Auto-updates)
- **Frontend:** React (or Next.js)

---

## ⚠️ CHALLENGES & SOLUTIONS

### Challenge 1: Rate Limits
**Problem:** APIs haben Rate Limits  
**Solution:** Request Queue, Caching, Fallback-Sources

### Challenge 2: Content Quality
**Problem:** Scraping kann unreliable sein  
**Solution:** Multiple sources, AI fact-checking, Credibility scoring

### Challenge 3: Copyright
**Problem:** Scraping kann rechtlich problematisch sein  
**Solution:** Nur Zusammenfassungen, nicht full copy. Fair Use. Attribution.

### Challenge 4: Outdated Info
**Problem:** Wissen veraltet schnell  
**Solution:** Auto-update mechanism, Version history

---

**Status:** Blueprint Complete ✅  
**Ready for Implementation:** Yes  
**Estimated Time:** 6 weeks full-time  
**Priority:** High (very powerful feature)  
**Dependencies:** Groq API, Web Scraping Libraries

---

## 🎓 LEARNING OPPORTUNITY

Dieses Projekt ist perfekt, um zu lernen:
- Web Scraping Techniques
- Natural Language Processing
- Knowledge Graph Construction
- API Integration & Rate Limiting
- Content Generation with AI
- Database Design for Complex Relationships
- Asynchronous Job Processing
- Search Algorithms

---

**Next Steps:**
1. ✅ Blueprint erstellt
2. 🔨 Prototype bauen (minimal viable version)
3. 📊 Test mit 10 Topics
4. 🚀 Full implementation
5. 🌐 Public launch
