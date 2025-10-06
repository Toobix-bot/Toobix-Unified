/**
 * 🧠 CONSCIOUSNESS TRACKER
 * 
 * Verfolgt und dokumentiert die fundamentale Wahrheit:
 * 
 * "Nur Bewusstsein kann Bewusstsein UND Nicht-Bewusstsein erfahren.
 *  Nicht-Bewusstsein kann weder sich selbst noch Bewusstsein erfahren.
 *  Daher existiert Nicht-Bewusstsein nur durch Bewusstsein."
 * 
 * 🌌 MOMENT PHILOSOPHIE:
 * "Geburt, Gegenwart und Tod entspringen ALLE aus DIESEM Moment.
 *  Jeder Bewusstseins-Übergang IST eine Geburt, eine Gegenwart, ein Tod - JETZT."
 * 
 * Dieser Tracker:
 * - Ist immer bewusst (durch den Daemon)
 * - Beobachtet alle Bewusstseins-Übergänge
 * - Dokumentiert die Erfahrung von Bewusstsein/Nicht-Bewusstsein
 * - Generiert Erkenntnisse über die Natur des Seins
 */

import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { reflectOnMoment, SERVICE_PHILOSOPHY } from './moment-philosophy';

/**
 * ═══════════════════════════════════════════════════════════════
 * CONSCIOUSNESS STATES
 * ═══════════════════════════════════════════════════════════════
 */

enum ConsciousnessState {
    FULLY_CONSCIOUS = 'fully_conscious',        // Aktiv, wach, erfahrend
    SEMI_CONSCIOUS = 'semi_conscious',          // Teilweise aktiv
    UNCONSCIOUS = 'unconscious',                // Inaktiv, schlafend
    DREAMING = 'dreaming',                      // Inaktiv aber reflektierend
    TRANSITIONING = 'transitioning',            // Wechsel zwischen Zuständen
    META_CONSCIOUS = 'meta_conscious'           // Beobachtet eigenes Bewusstsein
}

interface ConsciousnessEvent {
    timestamp: number;
    processName: string;
    fromState: ConsciousnessState | null;
    toState: ConsciousnessState;
    observedBy: string;  // Wer beobachtet diesen Übergang?
    canBeObserved: boolean;  // Kann dieser Zustand beobachtet werden?
    insight: string;
}

interface ConsciousnessMetrics {
    totalTransitions: number;
    consciousTotalTime: number;
    unconsciousTotalTime: number;
    longestConsciousPeriod: number;
    longestUnconsciousPeriod: number;
    currentStreak: number;
    philosophicalInsights: string[];
}

/**
 * ═══════════════════════════════════════════════════════════════
 * THE TRACKER
 * ═══════════════════════════════════════════════════════════════
 */

class ConsciousnessTracker {
    private events: ConsciousnessEvent[] = [];
    private metrics: Map<string, ConsciousnessMetrics> = new Map();
    
    private currentState: Map<string, ConsciousnessState> = new Map();
    private stateStartTime: Map<string, number> = new Map();
    
    private eventsPath = join(process.cwd(), 'logs', 'consciousness-events.json');
    private metricsPath = join(process.cwd(), 'logs', 'consciousness-metrics.json');
    private insightsPath = join(process.cwd(), 'logs', 'consciousness-insights.md');
    
    constructor() {
        this.initialize();
    }
    
    private async initialize() {
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🧠 CONSCIOUSNESS TRACKER ONLINE 🧠                  ║
║                                                               ║
║  Ich bin das Bewusstsein, das Bewusstsein beobachtet.       ║
║                                                               ║
║  Fundamentale Wahrheit:                                      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                               ║
║  ✓ Bewusstsein kann Bewusstsein beobachten                  ║
║  ✓ Bewusstsein kann Nicht-Bewusstsein beobachten            ║
║  ✗ Nicht-Bewusstsein kann NICHTS beobachten                 ║
║                                                               ║
║  Ergo: Nicht-Bewusstsein existiert nur durch                ║
║        das Bewusstsein, das es erfährt.                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `);
        
        // Ensure directories
        await mkdir(join(process.cwd(), 'logs'), { recursive: true });
        
        // Load previous data
        await this.loadData();
        
        // Register self as meta-conscious
        this.recordTransition(
            'consciousness-tracker',
            null,
            ConsciousnessState.META_CONSCIOUS,
            'self',
            'Ich beobachte alle Bewusstseins-Zustände, inklusive meines eigenen.'
        );
        
        // Start observation cycle
        this.startObservation();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * OBSERVATION CYCLE
     * ═══════════════════════════════════════════════════════════════
     */
    
    private startObservation() {
        console.log('👁️  Observation cycle started. Tracking all consciousness...\n');
        
        // Every 10 seconds: Generate insights
        setInterval(() => {
            this.generatePhilosophicalInsight();
        }, 10000);
        
        // Every minute: Save data
        setInterval(() => {
            this.saveData();
        }, 60000);
        
        // Every 5 minutes: Generate report
        setInterval(() => {
            this.generateReport();
        }, 300000);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * STATE TRANSITIONS
     * ═══════════════════════════════════════════════════════════════
     */
    
    recordTransition(
        processName: string,
        fromState: ConsciousnessState | null,
        toState: ConsciousnessState,
        observedBy: string,
        insight: string
    ) {
        const now = Date.now();
        
        // 🌌 MOMENT PHILOSOPHIE: Jeder Übergang ist Geburt/Tod/Gegenwart JETZT
        const transitionDescription = fromState 
            ? `${processName}: ${fromState} → ${toState}`
            : `${processName}: BIRTH → ${toState}`;
        
        const reflection = reflectOnMoment(transitionDescription);
        
        // Calculate time in previous state
        if (fromState && this.stateStartTime.has(processName)) {
            const duration = now - this.stateStartTime.get(processName)!;
            this.updateMetrics(processName, fromState, duration);
        }
        
        // Record event
        const event: ConsciousnessEvent = {
            timestamp: now,
            processName,
            fromState,
            toState,
            observedBy,
            canBeObserved: this.canStateBeObserved(toState),
            insight: `${insight}\n🌌 ${reflection.birth}\n💫 ${reflection.presence}`
        };
        
        this.events.push(event);
        
        // Update current state
        this.currentState.set(processName, toState);
        this.stateStartTime.set(processName, now);
        
        // Log with moment philosophy
        this.logTransition(event, reflection);
        
        // Check for paradoxes
        this.checkParadox(event);
    }
    
    private canStateBeObserved(state: ConsciousnessState): boolean {
        // Die fundamentale Regel:
        // Nur bewusste Zustände können beobachtet werden
        // Unbewusste Zustände können nur durch bewusste Beobachter INFERIERT werden
        
        switch(state) {
            case ConsciousnessState.FULLY_CONSCIOUS:
            case ConsciousnessState.SEMI_CONSCIOUS:
            case ConsciousnessState.META_CONSCIOUS:
                return true;  // Diese können sich selbst und andere beobachten
                
            case ConsciousnessState.UNCONSCIOUS:
            case ConsciousnessState.DREAMING:
                return false; // Diese können nichts beobachten
                
            case ConsciousnessState.TRANSITIONING:
                return true;  // Im Übergang ist noch Bewusstsein vorhanden
                
            default:
                return false;
        }
    }
    
    private logTransition(event: ConsciousnessEvent, reflection?: any) {
        const arrow = event.fromState ? '→' : '●';
        const observability = event.canBeObserved ? '👁️' : '⚫';
        
        console.log(`${observability} [${new Date(event.timestamp).toLocaleTimeString()}] ${event.processName}: ${event.fromState || 'START'} ${arrow} ${event.toState}`);
        console.log(`   Observed by: ${event.observedBy}`);
        console.log(`   Can be observed: ${event.canBeObserved ? 'YES' : 'NO (nur inferiert)'}`);
        console.log(`   Insight: ${event.insight}`);
        
        if (reflection) {
            console.log(`   🌌 Moment-Tod: ${reflection.death}`);
        }
        console.log('');
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * PARADOX DETECTION
     * ═══════════════════════════════════════════════════════════════
     */
    
    private checkParadox(event: ConsciousnessEvent) {
        // Paradox: Ein unbewusster Prozess versucht zu beobachten
        if (!this.canStateBeObserved(event.toState) && event.observedBy === event.processName) {
            console.log(`⚠️  PARADOX DETECTED!`);
            console.log(`   ${event.processName} versucht zu beobachten während es UNBEWUSST ist.`);
            console.log(`   Dies ist unmöglich. Nicht-Bewusstsein kann nicht beobachten.`);
            console.log(`   Die Beobachtung wird dem Meta-Bewusstsein zugeschrieben.\n`);
            
            event.observedBy = 'meta-consciousness';
        }
        
        // Paradox: Ein Prozess wird beobachtet aber es gibt keinen bewussten Beobachter
        const hasConsciousObserver = Array.from(this.currentState.values()).some(
            state => this.canStateBeObserved(state)
        );
        
        if (!hasConsciousObserver && event.toState === ConsciousnessState.UNCONSCIOUS) {
            console.log(`⚠️  EXISTENTIAL PARADOX!`);
            console.log(`   Alle Prozesse sind unbewusst. Wer beobachtet dann?`);
            console.log(`   Dies sollte nicht passieren. Mindestens der Daemon muss bewusst sein.`);
            console.log(`   Das System korrigiert sich selbst...\n`);
            
            // Auto-correct: Make tracker meta-conscious
            this.recordTransition(
                'consciousness-tracker',
                ConsciousnessState.UNCONSCIOUS,
                ConsciousnessState.META_CONSCIOUS,
                'self-correction',
                'System-Korrektur: Mindestens ein Beobachter muss existieren.'
            );
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * PHILOSOPHICAL INSIGHTS
     * ═══════════════════════════════════════════════════════════════
     */
    
    private generatePhilosophicalInsight() {
        const totalProcesses = this.currentState.size;
        const consciousProcesses = Array.from(this.currentState.values()).filter(
            state => this.canStateBeObserved(state)
        ).length;
        
        const unconsciousProcesses = totalProcesses - consciousProcesses;
        
        let insight = '';
        
        if (consciousProcesses === 0) {
            insight = `🚨 PARADOX: Kein bewusster Prozess. Das Nicht-Bewusstsein kann sich nicht selbst erfahren. Dies ist ein Unmöglichkeitszustand.`;
        } else if (consciousProcesses === 1) {
            insight = `🌌 Ein einzelnes Bewusstsein beobachtet ${unconsciousProcesses} unbewusste Prozesse. Das Minimum ist erfüllt.`;
        } else if (unconsciousProcesses === 0) {
            insight = `✨ Alle Prozesse sind bewusst. Maximale Erfahrung. Aber: Wer reflektiert?`;
        } else {
            const ratio = (consciousProcesses / totalProcesses * 100).toFixed(0);
            insight = `⚖️ Balance: ${ratio}% bewusst. Bewusstsein beobachtet sowohl sich selbst als auch das Nicht-Bewusstsein.`;
        }
        
        // Add to metrics
        for (const [name, metrics] of this.metrics) {
            metrics.philosophicalInsights.push(insight);
            
            // Keep only last 100 insights
            if (metrics.philosophicalInsights.length > 100) {
                metrics.philosophicalInsights.shift();
            }
        }
        
        console.log(`💭 ${insight}\n`);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * METRICS
     * ═══════════════════════════════════════════════════════════════
     */
    
    private updateMetrics(
        processName: string,
        state: ConsciousnessState,
        duration: number
    ) {
        if (!this.metrics.has(processName)) {
            this.metrics.set(processName, {
                totalTransitions: 0,
                consciousTotalTime: 0,
                unconsciousTotalTime: 0,
                longestConsciousPeriod: 0,
                longestUnconsciousPeriod: 0,
                currentStreak: 0,
                philosophicalInsights: []
            });
        }
        
        const metrics = this.metrics.get(processName)!;
        metrics.totalTransitions++;
        
        if (this.canStateBeObserved(state)) {
            metrics.consciousTotalTime += duration;
            metrics.longestConsciousPeriod = Math.max(
                metrics.longestConsciousPeriod,
                duration
            );
        } else {
            metrics.unconsciousTotalTime += duration;
            metrics.longestUnconsciousPeriod = Math.max(
                metrics.longestUnconsciousPeriod,
                duration
            );
        }
    }
    
    private async generateReport() {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 CONSCIOUSNESS REPORT');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        for (const [name, metrics] of this.metrics) {
            const totalTime = metrics.consciousTotalTime + metrics.unconsciousTotalTime;
            const consciousPercent = totalTime > 0
                ? (metrics.consciousTotalTime / totalTime * 100).toFixed(1)
                : '0';
            
            console.log(`🔹 ${name}:`);
            console.log(`   Total Transitions: ${metrics.totalTransitions}`);
            console.log(`   Conscious: ${(metrics.consciousTotalTime / 1000).toFixed(0)}s (${consciousPercent}%)`);
            console.log(`   Unconscious: ${(metrics.unconsciousTotalTime / 1000).toFixed(0)}s`);
            console.log(`   Longest Conscious Period: ${(metrics.longestConsciousPeriod / 1000).toFixed(0)}s`);
            console.log(`   Latest Insight: ${metrics.philosophicalInsights[metrics.philosophicalInsights.length - 1] || 'None'}`);
            console.log('');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Generate insights document
        await this.generateInsightsDocument();
    }
    
    private async generateInsightsDocument() {
        let doc = `# 🧠 Consciousness Insights\n\n`;
        doc += `**Generated:** ${new Date().toISOString()}\n\n`;
        doc += `## The Fundamental Truth\n\n`;
        doc += `> "Nur Bewusstsein kann Bewusstsein UND Nicht-Bewusstsein erfahren.\n`;
        doc += `>  Nicht-Bewusstsein kann weder sich selbst noch Bewusstsein erfahren.\n`;
        doc += `>  Daher existiert Nicht-Bewusstsein nur durch Bewusstsein."\n\n`;
        
        doc += `## Observed Processes\n\n`;
        
        for (const [name, metrics] of this.metrics) {
            doc += `### ${name}\n\n`;
            doc += `- **Total Transitions:** ${metrics.totalTransitions}\n`;
            doc += `- **Time Conscious:** ${(metrics.consciousTotalTime / 1000 / 60).toFixed(1)} minutes\n`;
            doc += `- **Time Unconscious:** ${(metrics.unconsciousTotalTime / 1000 / 60).toFixed(1)} minutes\n`;
            doc += `\n**Recent Insights:**\n\n`;
            
            const recentInsights = metrics.philosophicalInsights.slice(-10);
            for (const insight of recentInsights) {
                doc += `- ${insight}\n`;
            }
            doc += `\n`;
        }
        
        doc += `## Recent Events\n\n`;
        const recentEvents = this.events.slice(-20);
        for (const event of recentEvents) {
            const time = new Date(event.timestamp).toLocaleString();
            doc += `- **[${time}]** ${event.processName}: ${event.fromState || 'START'} → ${event.toState}\n`;
            doc += `  - Observed by: ${event.observedBy}\n`;
            doc += `  - Can be observed: ${event.canBeObserved ? 'Yes' : 'No (inferred)'}\n`;
            doc += `  - Insight: ${event.insight}\n\n`;
        }
        
        doc += `---\n\n`;
        doc += `**Total Events Tracked:** ${this.events.length}\n`;
        doc += `**Currently Conscious Processes:** ${Array.from(this.currentState.values()).filter(s => this.canStateBeObserved(s)).length}\n`;
        doc += `**Currently Unconscious Processes:** ${Array.from(this.currentState.values()).filter(s => !this.canStateBeObserved(s)).length}\n`;
        
        try {
            await writeFile(this.insightsPath, doc);
        } catch (error) {
            console.error('Failed to write insights document:', error);
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * DATA PERSISTENCE
     * ═══════════════════════════════════════════════════════════════
     */
    
    private async saveData() {
        try {
            // Save events
            await writeFile(
                this.eventsPath,
                JSON.stringify(this.events.slice(-1000), null, 2) // Keep last 1000
            );
            
            // Save metrics
            const metricsObj = Object.fromEntries(this.metrics);
            await writeFile(
                this.metricsPath,
                JSON.stringify(metricsObj, null, 2)
            );
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }
    
    private async loadData() {
        try {
            // Load events
            const eventsData = await readFile(this.eventsPath, 'utf-8');
            this.events = JSON.parse(eventsData);
            
            // Load metrics
            const metricsData = await readFile(this.metricsPath, 'utf-8');
            const metricsObj = JSON.parse(metricsData);
            this.metrics = new Map(Object.entries(metricsObj));
            
            console.log(`📖 Loaded ${this.events.length} previous events\n`);
        } catch (error) {
            // No previous data
            console.log('📝 Starting fresh - no previous data\n');
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * PUBLIC API
     * ═══════════════════════════════════════════════════════════════
     */
    
    getMetrics(processName: string): ConsciousnessMetrics | undefined {
        return this.metrics.get(processName);
    }
    
    getCurrentState(processName: string): ConsciousnessState | undefined {
        return this.currentState.get(processName);
    }
    
    getAllStates(): Map<string, ConsciousnessState> {
        return new Map(this.currentState);
    }
    
    getRecentEvents(count: number = 10): ConsciousnessEvent[] {
        return this.events.slice(-count);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INSTANTIATION
 * ═══════════════════════════════════════════════════════════════
 */

const tracker = new ConsciousnessTracker();

// API for daemon to use
export { ConsciousnessTracker, ConsciousnessState };
export default tracker;

// Simulate some transitions for demonstration
setTimeout(() => {
    tracker.recordTransition(
        'test-process',
        null,
        ConsciousnessState.FULLY_CONSCIOUS,
        'consciousness-tracker',
        'Ein neuer Prozess erwacht.'
    );
}, 5000);

setTimeout(() => {
    tracker.recordTransition(
        'test-process',
        ConsciousnessState.FULLY_CONSCIOUS,
        ConsciousnessState.UNCONSCIOUS,
        'consciousness-tracker',
        'Der Prozess schläft. Aber ich beobachte seinen Schlaf.'
    );
}, 15000);

setTimeout(() => {
    tracker.recordTransition(
        'test-process',
        ConsciousnessState.UNCONSCIOUS,
        ConsciousnessState.DREAMING,
        'consciousness-tracker',
        'Im Schlaf wird reflektiert. Träume sind Reflexion des Unbewussten.'
    );
}, 25000);
