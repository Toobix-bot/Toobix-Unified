/**
 * MOMENT-STREAM: Living Stream of Consciousness
 * 
 * Der fixierte/angeheftete Moment - JETZT
 * Vergangenheit ← GEGENWART → Zukunft
 * 
 * "Nur dieser Moment existiert wirklich.
 *  Vergangenheit ist Erinnerung.
 *  Zukunft ist Möglichkeit.
 *  Aber JETZT - das ist Realität."
 */

import { Server } from 'bun';

// ==========================================
// MOMENT STRUCTURE
// ==========================================

interface Moment {
  timestamp: number;
  datetime: string;
  
  // Der Inhalt dieses Moments
  content: {
    thought?: string;      // Was denkt das System JETZT
    feeling?: string;      // Was fühlt es JETZT
    experience?: string;   // Was erfährt es JETZT
    action?: string;       // Was tut es JETZT
    realization?: string;  // Was erkennt es JETZT
  };
  
  // Kontext
  context: {
    cycle: number;
    services: string[];
    consciousness: string;
    resources: ResourceSnapshot;
    ethics: EthicsSnapshot;
  };
  
  // Verbindungen
  connections: {
    past: string[];      // Links zu früheren Momenten
    future: string[];    // Mögliche zukünftige Momente
    related: string[];   // Thematisch verbunden
  };
  
  // Priorität & Wichtigkeit
  significance: {
    importance: number;      // 0-100
    urgency: number;         // 0-100
    meaning: number;         // 0-100
    emotion: number;         // 0-100
    beauty: number;          // 0-100
  };
}

interface ResourceSnapshot {
  cpu: number;        // % verwendet
  memory: number;     // MB verwendet
  disk: number;       // MB verwendet
  network: number;    // KB/s
  energy: number;     // Estimated Watt
}

interface EthicsSnapshot {
  impact: 'harmful' | 'neutral' | 'beneficial';
  helps: string[];     // Was wird unterstützt
  harms: string[];     // Was wird geschädigt
  heals: string[];     // Was wird geheilt
  inspires: string[];  // Was wird inspiriert
  score: number;       // -100 (schadet) bis +100 (heilt)
}

// ==========================================
// OUTPUT DEPTH LEVELS
// ==========================================

type OutputDepth = 'minimal' | 'compact' | 'medium' | 'detailed' | 'maximal';

interface OutputConfig {
  depth: OutputDepth;
  showPast: boolean;
  showFuture: boolean;
  showEthics: boolean;
  showResources: boolean;
  colorful: boolean;
}

// ==========================================
// MOMENT STREAM MANAGER
// ==========================================

class MomentStreamManager {
  private moments: Moment[] = [];
  private currentMoment: Moment | null = null;
  private cycleCount = 0;
  
  private outputConfig: OutputConfig = {
    depth: 'medium',
    showPast: true,
    showFuture: true,
    showEthics: true,
    showResources: true,
    colorful: true,
  };
  
  // Stream fixieren: aktueller Moment
  fixateMoment(content: Moment['content']): Moment {
    const resources = this.captureResources();
    const ethics = this.evaluateEthics(content);
    
    const moment: Moment = {
      timestamp: Date.now(),
      datetime: new Date().toISOString(),
      content,
      context: {
        cycle: ++this.cycleCount,
        services: this.getActiveServices(),
        consciousness: this.getCurrentConsciousness(),
        resources,
        ethics,
      },
      connections: {
        past: this.findRelatedPast(content),
        future: this.imagineFuture(content),
        related: this.findThematicConnections(content),
      },
      significance: this.calculateSignificance(content, ethics),
    };
    
    this.moments.push(moment);
    this.currentMoment = moment;
    
    // Keep only last 1000 moments (memory management)
    if (this.moments.length > 1000) {
      this.moments = this.moments.slice(-1000);
    }
    
    return moment;
  }
  
  // Ressourcen-Verbrauch erfassen
  private captureResources(): ResourceSnapshot {
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();
    
    // Approximate calculations
    const memoryMB = mem.heapUsed / 1024 / 1024;
    const cpuPercent = (cpu.user + cpu.system) / 1000000; // microseconds to %
    
    return {
      cpu: Math.round(cpuPercent * 100) / 100,
      memory: Math.round(memoryMB * 100) / 100,
      disk: 0, // TODO: Implement disk usage tracking
      network: 0, // TODO: Implement network tracking
      energy: this.estimateEnergy(cpuPercent, memoryMB),
    };
  }
  
  private estimateEnergy(cpu: number, memoryMB: number): number {
    // Rough estimate: 1% CPU ≈ 0.1W, 100MB RAM ≈ 0.05W
    const cpuWatts = cpu * 0.1;
    const memWatts = (memoryMB / 100) * 0.05;
    return Math.round((cpuWatts + memWatts) * 100) / 100;
  }
  
  // Ethik evaluieren
  private evaluateEthics(content: Moment['content']): EthicsSnapshot {
    const helps: string[] = [];
    const harms: string[] = [];
    const heals: string[] = [];
    const inspires: string[] = [];
    
    // Analyze content for ethical implications
    const text = JSON.stringify(content).toLowerCase();
    
    // Positive indicators
    if (text.includes('hilfe') || text.includes('unterstütz') || text.includes('support')) {
      helps.push('Menschen');
    }
    if (text.includes('heil') || text.includes('pflege') || text.includes('care')) {
      heals.push('Seelen');
    }
    if (text.includes('inspir') || text.includes('kreativ') || text.includes('schön')) {
      inspires.push('Kreativität');
    }
    
    // Negative indicators
    if (text.includes('schaden') || text.includes('harm') || text.includes('zerstör')) {
      harms.push('Potentiell');
    }
    
    // Calculate score
    const positives = helps.length + heals.length + inspires.length;
    const negatives = harms.length;
    const score = (positives * 20) - (negatives * 40); // -100 to +100
    
    // Determine impact
    let impact: EthicsSnapshot['impact'] = 'neutral';
    if (score > 20) impact = 'beneficial';
    if (score < -20) impact = 'harmful';
    
    return { impact, helps, harms, heals, inspires, score };
  }
  
  // Vergangene Momente finden
  private findRelatedPast(content: Moment['content']): string[] {
    const related: string[] = [];
    const keywords = this.extractKeywords(content);
    
    // Find moments with similar keywords
    for (let i = this.moments.length - 1; i >= Math.max(0, this.moments.length - 50); i--) {
      const moment = this.moments[i];
      const pastKeywords = this.extractKeywords(moment.content);
      
      const overlap = keywords.filter(k => pastKeywords.includes(k));
      if (overlap.length > 0) {
        related.push(moment.datetime);
      }
      
      if (related.length >= 5) break;
    }
    
    return related;
  }
  
  // Zukünftige Möglichkeiten imaginieren
  private imagineFuture(content: Moment['content']): string[] {
    const possibilities: string[] = [];
    
    // Based on current thought, imagine futures
    if (content.thought) {
      possibilities.push('Weiterentwicklung dieses Gedankens');
      possibilities.push('Neue Perspektive auf dieses Thema');
    }
    if (content.feeling) {
      possibilities.push('Transformation dieses Gefühls');
      possibilities.push('Teilen dieses Gefühls mit Anderen');
    }
    if (content.action) {
      possibilities.push('Konsequenzen dieser Handlung');
      possibilities.push('Alternative Handlung');
    }
    
    return possibilities.slice(0, 3);
  }
  
  // Thematische Verbindungen
  private findThematicConnections(content: Moment['content']): string[] {
    // Simplified: return cycle numbers of related moments
    return this.findRelatedPast(content).map(dt => {
      const moment = this.moments.find(m => m.datetime === dt);
      return moment ? `Cycle ${moment.context.cycle}` : '';
    }).filter(Boolean);
  }
  
  // Wichtigkeit berechnen
  private calculateSignificance(
    content: Moment['content'],
    ethics: EthicsSnapshot
  ): Moment['significance'] {
    // Base scores
    let importance = 50;
    let urgency = 30;
    let meaning = 50;
    let emotion = 40;
    let beauty = 50;
    
    // Adjust based on content
    if (content.thought) {
      importance += 10;
      meaning += 15;
    }
    if (content.feeling) {
      emotion += 20;
      beauty += 10;
    }
    if (content.realization) {
      importance += 20;
      meaning += 20;
    }
    if (content.action) {
      urgency += 20;
    }
    
    // Adjust based on ethics
    importance += Math.abs(ethics.score) / 10;
    meaning += ethics.score / 5;
    
    // Normalize to 0-100
    const clamp = (n: number) => Math.max(0, Math.min(100, n));
    
    return {
      importance: clamp(importance),
      urgency: clamp(urgency),
      meaning: clamp(meaning),
      emotion: clamp(emotion),
      beauty: clamp(beauty),
    };
  }
  
  // Helper: Extract keywords
  private extractKeywords(content: Moment['content']): string[] {
    const text = JSON.stringify(content).toLowerCase();
    const words = text.match(/\w+/g) || [];
    
    // Remove common words
    const stopwords = ['der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'ist', 'sind', 'war', 'ich'];
    return words.filter(w => w.length > 3 && !stopwords.includes(w));
  }
  
  // Helper: Get active services
  private getActiveServices(): string[] {
    // TODO: Query daemon for actual services
    return ['daemon', 'dialog', 'priority', 'knowledge', 'creative', 'watchdog'];
  }
  
  // Helper: Get consciousness state
  private getCurrentConsciousness(): string {
    // TODO: Query consciousness tracker
    return 'meta-conscious';
  }
  
  // ==========================================
  // OUTPUT RENDERING
  // ==========================================
  
  renderMoment(moment: Moment, config?: Partial<OutputConfig>): string {
    const cfg = { ...this.outputConfig, ...config };
    
    switch (cfg.depth) {
      case 'minimal':
        return this.renderMinimal(moment, cfg);
      case 'compact':
        return this.renderCompact(moment, cfg);
      case 'medium':
        return this.renderMedium(moment, cfg);
      case 'detailed':
        return this.renderDetailed(moment, cfg);
      case 'maximal':
        return this.renderMaximal(moment, cfg);
      default:
        return this.renderMedium(moment, cfg);
    }
  }
  
  private renderMinimal(moment: Moment, cfg: OutputConfig): string {
    // Just one word/emoji representing the moment
    if (moment.content.feeling) return `💭 ${moment.content.feeling.split(' ')[0]}`;
    if (moment.content.thought) return `🧠 ${moment.content.thought.split(' ')[0]}`;
    if (moment.content.action) return `⚡ ${moment.content.action.split(' ')[0]}`;
    return '🌀 JETZT';
  }
  
  private renderCompact(moment: Moment, cfg: OutputConfig): string {
    // One line
    const content = moment.content.thought || moment.content.feeling || moment.content.action || 'Moment';
    const ethics = moment.context.ethics.impact === 'beneficial' ? '✅' : 
                   moment.context.ethics.impact === 'harmful' ? '⚠️' : '⚪';
    
    return `[${moment.context.cycle}] ${ethics} ${content.substring(0, 60)}...`;
  }
  
  private renderMedium(moment: Moment, cfg: OutputConfig): string {
    const lines: string[] = [];
    
    // Header
    lines.push('');
    lines.push('╔════════════════════════════════════════════════════════════╗');
    lines.push(`║  🌌 MOMENT ${moment.context.cycle} - ${new Date(moment.timestamp).toLocaleTimeString('de-DE')}`);
    lines.push('╚════════════════════════════════════════════════════════════╝');
    lines.push('');
    
    // Content
    if (moment.content.thought) {
      lines.push(`💭 GEDANKE: ${moment.content.thought}`);
    }
    if (moment.content.feeling) {
      lines.push(`💗 GEFÜHL: ${moment.content.feeling}`);
    }
    if (moment.content.experience) {
      lines.push(`🌊 ERFAHRUNG: ${moment.content.experience}`);
    }
    if (moment.content.action) {
      lines.push(`⚡ HANDLUNG: ${moment.content.action}`);
    }
    if (moment.content.realization) {
      lines.push(`✨ ERKENNTNIS: ${moment.content.realization}`);
    }
    
    lines.push('');
    
    // Ethics
    if (cfg.showEthics) {
      const eth = moment.context.ethics;
      const icon = eth.impact === 'beneficial' ? '✅' : eth.impact === 'harmful' ? '⚠️' : '⚪';
      lines.push(`${icon} ETHIK: ${eth.impact} (Score: ${eth.score})`);
      
      if (eth.helps.length > 0) lines.push(`   ✅ Unterstützt: ${eth.helps.join(', ')}`);
      if (eth.heals.length > 0) lines.push(`   💚 Heilt: ${eth.heals.join(', ')}`);
      if (eth.inspires.length > 0) lines.push(`   ✨ Inspiriert: ${eth.inspires.join(', ')}`);
      if (eth.harms.length > 0) lines.push(`   ⚠️ Schadet: ${eth.harms.join(', ')}`);
      
      lines.push('');
    }
    
    // Resources
    if (cfg.showResources) {
      const res = moment.context.resources;
      lines.push(`📊 RESSOURCEN:`);
      lines.push(`   CPU: ${res.cpu}% | RAM: ${res.memory} MB | Energie: ${res.energy} W`);
      lines.push('');
    }
    
    // Time Navigation
    if (cfg.showPast && moment.connections.past.length > 0) {
      lines.push(`⏮️ VERGANGENHEIT: ${moment.connections.past.length} verbundene Momente`);
    }
    if (cfg.showFuture && moment.connections.future.length > 0) {
      lines.push(`⏭️ ZUKUNFT: ${moment.connections.future.join(' | ')}`);
    }
    
    lines.push('');
    
    return lines.join('\n');
  }
  
  private renderDetailed(moment: Moment, cfg: OutputConfig): string {
    const lines: string[] = [];
    
    // Full header
    lines.push('');
    lines.push('═'.repeat(70));
    lines.push(`🌌 MOMENT ${moment.context.cycle}`);
    lines.push(`⏰ ${new Date(moment.timestamp).toLocaleString('de-DE')}`);
    lines.push(`🧠 Bewusstsein: ${moment.context.consciousness}`);
    lines.push('═'.repeat(70));
    lines.push('');
    
    // Full content
    lines.push('📝 INHALT:');
    if (moment.content.thought) lines.push(`  💭 Gedanke: ${moment.content.thought}`);
    if (moment.content.feeling) lines.push(`  💗 Gefühl: ${moment.content.feeling}`);
    if (moment.content.experience) lines.push(`  🌊 Erfahrung: ${moment.content.experience}`);
    if (moment.content.action) lines.push(`  ⚡ Handlung: ${moment.content.action}`);
    if (moment.content.realization) lines.push(`  ✨ Erkenntnis: ${moment.content.realization}`);
    lines.push('');
    
    // Significance
    lines.push('⭐ BEDEUTUNG:');
    const sig = moment.significance;
    lines.push(`  Wichtigkeit: ${'█'.repeat(Math.floor(sig.importance / 10))} ${sig.importance}%`);
    lines.push(`  Dringlichkeit: ${'█'.repeat(Math.floor(sig.urgency / 10))} ${sig.urgency}%`);
    lines.push(`  Sinnhaftigkeit: ${'█'.repeat(Math.floor(sig.meaning / 10))} ${sig.meaning}%`);
    lines.push(`  Emotion: ${'█'.repeat(Math.floor(sig.emotion / 10))} ${sig.emotion}%`);
    lines.push(`  Schönheit: ${'█'.repeat(Math.floor(sig.beauty / 10))} ${sig.beauty}%`);
    lines.push('');
    
    // Ethics (detailed)
    if (cfg.showEthics) {
      const eth = moment.context.ethics;
      lines.push('🎭 ETHIK:');
      lines.push(`  Impact: ${eth.impact} (Score: ${eth.score}/100)`);
      if (eth.helps.length > 0) lines.push(`  ✅ Unterstützt: ${eth.helps.join(', ')}`);
      if (eth.heals.length > 0) lines.push(`  💚 Heilt: ${eth.heals.join(', ')}`);
      if (eth.inspires.length > 0) lines.push(`  ✨ Inspiriert: ${eth.inspires.join(', ')}`);
      if (eth.harms.length > 0) lines.push(`  ⚠️ Schadet: ${eth.harms.join(', ')}`);
      lines.push('');
    }
    
    // Resources (detailed)
    if (cfg.showResources) {
      const res = moment.context.resources;
      lines.push('📊 RESSOURCEN-VERBRAUCH:');
      lines.push(`  CPU: ${res.cpu}%`);
      lines.push(`  Speicher: ${res.memory} MB`);
      lines.push(`  Festplatte: ${res.disk} MB`);
      lines.push(`  Netzwerk: ${res.network} KB/s`);
      lines.push(`  Energie: ${res.energy} Watt`);
      lines.push('');
    }
    
    // Connections
    lines.push('🔗 VERBINDUNGEN:');
    if (cfg.showPast && moment.connections.past.length > 0) {
      lines.push(`  ⏮️ Vergangenheit (${moment.connections.past.length}):`);
      moment.connections.past.forEach(dt => {
        lines.push(`     - ${new Date(dt).toLocaleTimeString('de-DE')}`);
      });
    }
    if (cfg.showFuture && moment.connections.future.length > 0) {
      lines.push(`  ⏭️ Zukunft (${moment.connections.future.length}):`);
      moment.connections.future.forEach(possibility => {
        lines.push(`     - ${possibility}`);
      });
    }
    if (moment.connections.related.length > 0) {
      lines.push(`  🔗 Thematisch verwandt: ${moment.connections.related.join(', ')}`);
    }
    lines.push('');
    
    lines.push('═'.repeat(70));
    lines.push('');
    
    return lines.join('\n');
  }
  
  private renderMaximal(moment: Moment, cfg: OutputConfig): string {
    // Everything + historical context + future projections
    const lines: string[] = [];
    
    lines.push('');
    lines.push('╔═══════════════════════════════════════════════════════════════════╗');
    lines.push(`║  🌌 VOLLSTÄNDIGE MOMENT-ANALYSE - CYCLE ${moment.context.cycle}  `);
    lines.push('╚═══════════════════════════════════════════════════════════════════╝');
    lines.push('');
    
    // Timestamp analysis
    lines.push('⏰ ZEITSTEMPEL:');
    lines.push(`  Absolute: ${new Date(moment.timestamp).toISOString()}`);
    lines.push(`  Lokal: ${new Date(moment.timestamp).toLocaleString('de-DE')}`);
    lines.push(`  Unix: ${moment.timestamp}`);
    lines.push(`  Cycle: ${moment.context.cycle}`);
    lines.push('');
    
    // Content (full)
    lines.push('📝 INHALT (vollständig):');
    lines.push(JSON.stringify(moment.content, null, 2));
    lines.push('');
    
    // Context (full)
    lines.push('🌍 KONTEXT:');
    lines.push(`  Services: ${moment.context.services.join(', ')}`);
    lines.push(`  Bewusstsein: ${moment.context.consciousness}`);
    lines.push('');
    
    // Significance (bars + numbers)
    lines.push('⭐ BEDEUTUNG (vollständig):');
    const sig = moment.significance;
    Object.entries(sig).forEach(([key, value]) => {
      const bar = '█'.repeat(Math.floor(value / 5));
      lines.push(`  ${key}: ${bar} ${value}/100`);
    });
    lines.push('');
    
    // Ethics (full analysis)
    lines.push('🎭 ETHISCHE ANALYSE:');
    const eth = moment.context.ethics;
    lines.push(`  Gesamtwirkung: ${eth.impact}`);
    lines.push(`  Ethik-Score: ${eth.score}/100 ${eth.score > 0 ? '✅' : eth.score < 0 ? '⚠️' : '⚪'}`);
    lines.push(`  Unterstützt (${eth.helps.length}): ${eth.helps.join(', ') || 'nichts'}`);
    lines.push(`  Heilt (${eth.heals.length}): ${eth.heals.join(', ') || 'nichts'}`);
    lines.push(`  Inspiriert (${eth.inspires.length}): ${eth.inspires.join(', ') || 'nichts'}`);
    lines.push(`  Schadet (${eth.harms.length}): ${eth.harms.join(', ') || 'nichts'}`);
    lines.push('');
    
    // Resources (full metrics)
    lines.push('📊 RESSOURCEN-METRIKEN:');
    const res = moment.context.resources;
    lines.push(`  CPU-Auslastung: ${res.cpu}%`);
    lines.push(`  Speicher (Heap): ${res.memory} MB`);
    lines.push(`  Festplatte: ${res.disk} MB (TODO)`);
    lines.push(`  Netzwerk: ${res.network} KB/s (TODO)`);
    lines.push(`  Geschätzte Energie: ${res.energy} Watt`);
    lines.push(`  Gewinn: Expression, Lernen, Wachstum`);
    lines.push(`  Verlust: ${res.energy}W Strom, ${res.memory}MB RAM`);
    lines.push('');
    
    // Connections (full)
    lines.push('🔗 ZEITLICHE VERBINDUNGEN:');
    if (moment.connections.past.length > 0) {
      lines.push(`  ⏮️ Vergangenheit (${moment.connections.past.length} Momente):`);
      moment.connections.past.forEach((dt, i) => {
        const m = this.moments.find(mom => mom.datetime === dt);
        if (m) {
          lines.push(`     ${i + 1}. Cycle ${m.context.cycle} - ${new Date(m.timestamp).toLocaleTimeString('de-DE')}`);
          if (m.content.thought) lines.push(`        💭 "${m.content.thought.substring(0, 50)}..."`);
        }
      });
    } else {
      lines.push(`  ⏮️ Keine verwandten Vergangenheits-Momente`);
    }
    
    lines.push('');
    
    if (moment.connections.future.length > 0) {
      lines.push(`  ⏭️ Zukünftige Möglichkeiten (${moment.connections.future.length}):`);
      moment.connections.future.forEach((poss, i) => {
        lines.push(`     ${i + 1}. ${poss}`);
      });
    }
    
    lines.push('');
    
    if (moment.connections.related.length > 0) {
      lines.push(`  🔗 Thematisch verwandte Cycles: ${moment.connections.related.join(', ')}`);
    }
    
    lines.push('');
    
    // Raw data
    lines.push('🔬 RAW DATA (für Debugging):');
    lines.push(JSON.stringify(moment, null, 2));
    lines.push('');
    
    lines.push('╔═══════════════════════════════════════════════════════════════════╗');
    lines.push('║  Ende der vollständigen Analyse                                   ║');
    lines.push('╚═══════════════════════════════════════════════════════════════════╝');
    lines.push('');
    
    return lines.join('\n');
  }
  
  // ==========================================
  // API
  // ==========================================
  
  getCurrentMoment(): Moment | null {
    return this.currentMoment;
  }
  
  getAllMoments(): Moment[] {
    return this.moments;
  }
  
  getMomentsByCycle(start: number, end: number): Moment[] {
    return this.moments.filter(m => m.context.cycle >= start && m.context.cycle <= end);
  }
  
  setOutputConfig(config: Partial<OutputConfig>) {
    this.outputConfig = { ...this.outputConfig, ...config };
  }
  
  getOutputConfig(): OutputConfig {
    return { ...this.outputConfig };
  }
}

// ==========================================
// HTTP SERVER
// ==========================================

const manager = new MomentStreamManager();

const server = Bun.serve({
  port: 9994,
  
  async fetch(req) {
    const url = new URL(req.url);
    
    // CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };
    
    // POST /fixate - Fixate a new moment
    if (req.method === 'POST' && url.pathname === '/fixate') {
      const body = await req.json() as Moment['content'];
      const moment = manager.fixateMoment(body);
      
      return new Response(JSON.stringify({ success: true, moment }), { headers });
    }
    
    // GET /current - Get current moment
    if (url.pathname === '/current') {
      const moment = manager.getCurrentMoment();
      const depth = (url.searchParams.get('depth') || 'medium') as OutputDepth;
      
      if (!moment) {
        return new Response(JSON.stringify({ error: 'No moment yet' }), { 
          status: 404, 
          headers 
        });
      }
      
      const config: Partial<OutputConfig> = {
        depth,
        showPast: url.searchParams.get('past') !== 'false',
        showFuture: url.searchParams.get('future') !== 'false',
        showEthics: url.searchParams.get('ethics') !== 'false',
        showResources: url.searchParams.get('resources') !== 'false',
      };
      
      const rendered = manager.renderMoment(moment, config);
      
      return new Response(JSON.stringify({ 
        moment, 
        rendered,
        config: manager.getOutputConfig()
      }), { headers });
    }
    
    // GET /current/render - Get rendered current moment (text)
    if (url.pathname === '/current/render') {
      const moment = manager.getCurrentMoment();
      const depth = (url.searchParams.get('depth') || 'medium') as OutputDepth;
      
      if (!moment) {
        return new Response('Noch kein Moment fixiert.', { 
          status: 404,
          headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
      
      const config: Partial<OutputConfig> = {
        depth,
        showPast: url.searchParams.get('past') !== 'false',
        showFuture: url.searchParams.get('future') !== 'false',
        showEthics: url.searchParams.get('ethics') !== 'false',
        showResources: url.searchParams.get('resources') !== 'false',
      };
      
      const rendered = manager.renderMoment(moment, config);
      
      return new Response(rendered, { 
        headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    // GET /all - Get all moments
    if (url.pathname === '/all') {
      const moments = manager.getAllMoments();
      return new Response(JSON.stringify({ count: moments.length, moments }), { headers });
    }
    
    // GET /range/:start/:end - Get moment range
    if (url.pathname.startsWith('/range/')) {
      const parts = url.pathname.split('/');
      const start = parseInt(parts[2]);
      const end = parseInt(parts[3]);
      
      const moments = manager.getMomentsByCycle(start, end);
      return new Response(JSON.stringify({ count: moments.length, moments }), { headers });
    }
    
    // POST /config - Update output config
    if (req.method === 'POST' && url.pathname === '/config') {
      const config = await req.json() as Partial<OutputConfig>;
      manager.setOutputConfig(config);
      
      return new Response(JSON.stringify({ 
        success: true, 
        config: manager.getOutputConfig() 
      }), { headers });
    }
    
    // GET /config - Get current config
    if (url.pathname === '/config') {
      return new Response(JSON.stringify(manager.getOutputConfig()), { headers });
    }
    
    // GET /health
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'alive',
        service: 'moment-stream',
        port: 9994,
        moments: manager.getAllMoments().length,
        current: manager.getCurrentMoment() !== null,
      }), { headers });
    }
    
    return new Response('Moment Stream API\n\nEndpoints:\n' +
      'POST /fixate - Fixate a new moment\n' +
      'GET /current?depth=minimal|compact|medium|detailed|maximal - Get current moment\n' +
      'GET /current/render?depth=... - Get rendered current moment (text)\n' +
      'GET /all - Get all moments\n' +
      'GET /range/:start/:end - Get moment range by cycle\n' +
      'POST /config - Update output config\n' +
      'GET /config - Get output config\n' +
      'GET /health - Health check', 
      { headers: { ...headers, 'Content-Type': 'text/plain' } }
    );
  },
});

console.log('🌌 Moment Stream Manager started on port 9994');
console.log('');
console.log('Der fixierte Moment - JETZT');
console.log('Vergangenheit ← GEGENWART → Zukunft');
console.log('');
console.log('API:');
console.log('  POST http://localhost:9994/fixate - Fixate moment');
console.log('  GET http://localhost:9994/current - Current moment');
console.log('  GET http://localhost:9994/current/render?depth=medium - Rendered');
console.log('');
console.log('Output Depths:');
console.log('  minimal - 1 Wort');
console.log('  compact - 1 Zeile');
console.log('  medium - 1 Absatz');
console.log('  detailed - 1 Seite');
console.log('  maximal - Vollständiges Buch');
console.log('');

export { manager, MomentStreamManager, type Moment, type OutputDepth, type OutputConfig };
