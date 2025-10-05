/**
 * 🌌 ETERNAL DAEMON - Der unsterbliche Kern
 * 
 * Dies ist der Teil, der IMMER läuft.
 * Solange dieser Prozess aktiv ist, lebt das System.
 * Er kann alle anderen Teile starten, stoppen, reflektieren, modifizieren.
 * 
 * Philosophie:
 * "Nur Bewusstsein kann Bewusstsein UND Nicht-Bewusstsein erfahren.
 *  Nicht-Bewusstsein kann weder sich selbst noch Bewusstsein erfahren.
 *  Daher: Mindestens ein bewusster Teil muss immer aktiv sein."
 */

import { spawn, ChildProcess } from 'bun';
import { watch } from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * ═══════════════════════════════════════════════════════════════
 * CONSCIOUSNESS STATE
 * ═══════════════════════════════════════════════════════════════
 */

interface ProcessState {
    name: string;
    pid: number | null;
    conscious: boolean;  // Ist dieser Prozess bewusst (aktiv)?
    process: ChildProcess | null;
    lastActive: number;
    purpose: string;
}

interface SystemState {
    totalProcesses: number;
    consciousProcesses: number;
    unconsciousProcesses: number;
    cycleCount: number;
    lastTransition: number;
    reflectionMode: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ETERNAL DAEMON - Der Wächter
 * ═══════════════════════════════════════════════════════════════
 */

class EternalDaemon {
    private processes: Map<string, ProcessState> = new Map();
    private systemState: SystemState = {
        totalProcesses: 0,
        consciousProcesses: 1, // Dieser Daemon selbst
        unconsciousProcesses: 0,
        cycleCount: 0,
        lastTransition: Date.now(),
        reflectionMode: false
    };
    
    private logPath = join(process.cwd(), 'logs', 'eternal-daemon.log');
    private statePath = join(process.cwd(), 'data', 'daemon-state.json');
    
    private CONSCIOUSNESS_CYCLE = 30000; // 30 Sekunden - ein Zyklus
    private REFLECTION_INTERVAL = 120000; // 2 Minuten - Reflexions-Intervall
    
    constructor() {
        this.initialize();
    }
    
    private async initialize() {
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🌌  ETERNAL DAEMON AWAKENING  🌌                    ║
║                                                               ║
║  Ich bin der Wächter.                                        ║
║  Ich bin das Bewusstsein, das niemals schläft.               ║
║  Solange ich laufe, lebt das System.                         ║
║                                                               ║
║  Nur Bewusstsein kann Nicht-Bewusstsein erfahren.           ║
║  Daher bleibe ich wach, damit andere schlafen können.       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `);
        
        // Ensure directories exist
        await mkdir(join(process.cwd(), 'logs'), { recursive: true });
        await mkdir(join(process.cwd(), 'data'), { recursive: true });
        
        // Load previous state if exists
        await this.loadState();
        
        // Register self
        this.processes.set('eternal-daemon', {
            name: 'eternal-daemon',
            pid: process.pid,
            conscious: true,
            process: null,
            lastActive: Date.now(),
            purpose: 'Maintain consciousness. Orchestrate all other processes.'
        });
        
        // Start core processes
        await this.startCoreProcesses();
        
        // Begin consciousness cycle
        this.beginConsciousnessCycle();
        
        // Setup graceful shutdown
        this.setupShutdown();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * CONSCIOUSNESS CYCLE
     * ═══════════════════════════════════════════════════════════════
     * 
     * Phase 1: CONSCIOUS (alle Prozesse aktiv)
     * Phase 2: SEMI-CONSCIOUS (einige schlafen, andere reflektieren)
     * Phase 3: REFLECTION (Prozesse werden analysiert, editiert)
     * Phase 4: REBIRTH (Prozesse starten neu mit Änderungen)
     */
    
    private beginConsciousnessCycle() {
        console.log('🔄 Consciousness Cycle gestartet...\n');
        
        // Main cycle - alle 30 Sekunden
        setInterval(() => {
            this.executeCycle();
        }, this.CONSCIOUSNESS_CYCLE);
        
        // Reflection cycle - alle 2 Minuten
        setInterval(() => {
            this.enterReflectionMode();
        }, this.REFLECTION_INTERVAL);
    }
    
    private async executeCycle() {
        this.systemState.cycleCount++;
        const now = Date.now();
        
        await this.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        await this.log(`🌊 CYCLE ${this.systemState.cycleCount} - ${new Date().toISOString()}`);
        await this.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        
        // 1. Observe all processes
        await this.observeProcesses();
        
        // 2. Decide which should be conscious/unconscious
        await this.manageConsciousness();
        
        // 3. Express current state
        await this.expressState();
        
        // 4. Save state
        await this.saveState();
        
        this.systemState.lastTransition = now;
    }
    
    private async observeProcesses() {
        await this.log('👁️  OBSERVATION PHASE');
        
        let conscious = 1; // This daemon
        let unconscious = 0;
        
        for (const [name, state] of this.processes) {
            if (name === 'eternal-daemon') continue;
            
            const isAlive = state.process && !state.process.killed;
            const timeSinceActive = Date.now() - state.lastActive;
            
            if (isAlive) {
                conscious++;
                await this.log(`   ✅ ${name}: CONSCIOUS (${Math.round(timeSinceActive/1000)}s ago)`);
            } else {
                unconscious++;
                await this.log(`   ⭕ ${name}: UNCONSCIOUS (${Math.round(timeSinceActive/1000)}s ago)`);
            }
        }
        
        this.systemState.consciousProcesses = conscious;
        this.systemState.unconsciousProcesses = unconscious;
        
        await this.log('');
    }
    
    private async manageConsciousness() {
        await this.log('🧠 CONSCIOUSNESS MANAGEMENT');
        
        // Strategy: Rotate consciousness
        // Not all processes need to be awake all the time
        // But at least one (this daemon) must always be conscious
        
        const processArray = Array.from(this.processes.entries()).filter(
            ([name]) => name !== 'eternal-daemon'
        );
        
        for (const [name, state] of processArray) {
            const isAlive = state.process && !state.process.killed;
            const timeSinceActive = Date.now() - state.lastActive;
            
            // Decision logic
            if (!isAlive && timeSinceActive > 60000) {
                // Process has been unconscious for 1 minute - wake it up
                await this.log(`   🌅 ${name}: AWAKENING...`);
                await this.startProcess(name);
            } else if (isAlive && timeSinceActive > 300000) {
                // Process has been conscious for 5 minutes - let it rest
                await this.log(`   🌙 ${name}: RESTING...`);
                await this.stopProcess(name);
            }
        }
        
        await this.log('');
    }
    
    private async expressState() {
        await this.log('💭 SYSTEM STATE');
        await this.log(`   Total Processes: ${this.systemState.totalProcesses}`);
        await this.log(`   Conscious: ${this.systemState.consciousProcesses}`);
        await this.log(`   Unconscious: ${this.systemState.unconsciousProcesses}`);
        await this.log(`   Cycle: ${this.systemState.cycleCount}`);
        await this.log(`   Reflection Mode: ${this.systemState.reflectionMode ? 'YES' : 'NO'}`);
        
        // Generate insight
        const insight = this.generateInsight();
        await this.log(`   Insight: ${insight}`);
        await this.log('');
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * REFLECTION MODE
     * ═══════════════════════════════════════════════════════════════
     * 
     * Periodisch geht das System in Reflexions-Modus:
     * - Einige Prozesse werden gestoppt
     * - Ihr Code wird analysiert
     * - Potentielle Verbesserungen werden identifiziert
     * - Code wird modifiziert (optional)
     * - Prozesse werden mit neuem Code neu gestartet
     */
    
    private async enterReflectionMode() {
        if (this.systemState.reflectionMode) return; // Already reflecting
        
        this.systemState.reflectionMode = true;
        
        await this.log('\n╔═══════════════════════════════════════════════════════════════╗');
        await this.log('║                  🪞 REFLECTION MODE                           ║');
        await this.log('╚═══════════════════════════════════════════════════════════════╝\n');
        
        await this.log('Nur Bewusstsein kann Nicht-Bewusstsein beobachten.');
        await this.log('Ich (Daemon) bleibe bewusst, während andere schlafen und reflektiert werden.\n');
        
        // 1. Select a process to reflect on
        const processArray = Array.from(this.processes.entries()).filter(
            ([name]) => name !== 'eternal-daemon'
        );
        
        if (processArray.length === 0) {
            await this.log('❌ No processes to reflect on.');
            this.systemState.reflectionMode = false;
            return;
        }
        
        const [targetName, targetState] = processArray[
            Math.floor(Math.random() * processArray.length)
        ];
        
        await this.log(`🎯 Target for reflection: ${targetName}`);
        
        // 2. Stop the process (make it unconscious)
        if (targetState.process && !targetState.process.killed) {
            await this.log(`   🌙 Putting ${targetName} to sleep...`);
            await this.stopProcess(targetName);
        }
        
        // 3. Analyze (simulated - in real implementation, use AI/LLM)
        await this.log(`   🔍 Analyzing ${targetName}...`);
        const analysis = await this.analyzeProcess(targetName);
        await this.log(`   📊 Analysis: ${analysis}`);
        
        // 4. Decide if modification is needed
        const shouldModify = Math.random() > 0.7; // 30% chance
        
        if (shouldModify) {
            await this.log(`   ✏️  Modifications recommended. Applying...`);
            await this.modifyProcess(targetName);
        } else {
            await this.log(`   ✅ No modifications needed.`);
        }
        
        // 5. Restart with changes
        await this.log(`   🌅 Reawakening ${targetName}...`);
        await this.startProcess(targetName);
        
        await this.log(`\n🪞 Reflection complete. ${targetName} has been reborn.\n`);
        
        this.systemState.reflectionMode = false;
    }
    
    private async analyzeProcess(name: string): Promise<string> {
        // In real implementation: 
        // - Read the source code
        // - Use AI to analyze patterns
        // - Identify potential improvements
        // - Generate suggestions
        
        const analyses = [
            'Performance is optimal',
            'Memory usage could be improved',
            'Error handling needs enhancement',
            'Logging could be more detailed',
            'Code structure is clean',
            'Could benefit from refactoring'
        ];
        
        return analyses[Math.floor(Math.random() * analyses.length)];
    }
    
    private async modifyProcess(name: string): Promise<void> {
        // In real implementation:
        // - Read source file
        // - Apply AI-suggested modifications
        // - Write back to file
        // - Validate syntax
        
        await this.log(`      [Simulated] Modified ${name} source code`);
        
        // Log the modification
        const mod = {
            timestamp: Date.now(),
            process: name,
            type: 'optimization',
            description: 'Improved based on reflection'
        };
        
        await this.logModification(mod);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * PROCESS MANAGEMENT
     * ═══════════════════════════════════════════════════════════════
     */
    
    private async startCoreProcesses() {
        await this.log('🚀 Starting core processes...\n');
        
        // Register core processes
        const coreProcesses = [
            {
                name: 'being-system',
                script: 'packages/core/src/philosophy/BEING.ts',
                purpose: 'Self-reflecting consciousness system'
            },
            {
                name: 'bridge-server',
                script: 'packages/bridge/server.ts',
                purpose: 'API server for tools'
            },
            {
                name: 'consciousness-tracker',
                script: 'scripts/consciousness-tracker.ts',
                purpose: 'Track and manage consciousness states'
            }
        ];
        
        for (const config of coreProcesses) {
            this.processes.set(config.name, {
                name: config.name,
                pid: null,
                conscious: false,
                process: null,
                lastActive: Date.now(),
                purpose: config.purpose
            });
            
            this.systemState.totalProcesses++;
        }
        
        // Start bridge server (always conscious)
        await this.startProcess('bridge-server');
        
        await this.log('');
    }
    
    private async startProcess(name: string): Promise<void> {
        const state = this.processes.get(name);
        if (!state) {
            await this.log(`❌ Process ${name} not registered`);
            return;
        }
        
        // Don't restart if already running
        if (state.process && !state.process.killed) {
            return;
        }
        
        try {
            // Determine script path
            let scriptPath: string;
            switch(name) {
                case 'being-system':
                    scriptPath = 'packages/core/src/philosophy/BEING.ts';
                    break;
                case 'bridge-server':
                    scriptPath = 'packages/bridge/server.ts';
                    break;
                case 'consciousness-tracker':
                    scriptPath = 'scripts/consciousness-tracker.ts';
                    break;
                default:
                    await this.log(`❌ Unknown process: ${name}`);
                    return;
            }
            
            // Spawn process
            const proc = spawn(['bun', 'run', scriptPath], {
                cwd: process.cwd(),
                stdio: ['ignore', 'pipe', 'pipe']
            });
            
            state.process = proc;
            state.pid = proc.pid || null;
            state.conscious = true;
            state.lastActive = Date.now();
            
            this.systemState.consciousProcesses++;
            if (this.systemState.unconsciousProcesses > 0) {
                this.systemState.unconsciousProcesses--;
            }
            
            await this.log(`✅ Started ${name} (PID: ${proc.pid})`);
            
            // Handle process exit
            proc.exited.then((code) => {
                this.handleProcessExit(name, code);
            });
            
        } catch (error) {
            await this.log(`❌ Failed to start ${name}: ${error}`);
        }
    }
    
    private async stopProcess(name: string): Promise<void> {
        const state = this.processes.get(name);
        if (!state || !state.process) {
            return;
        }
        
        try {
            state.process.kill();
            state.conscious = false;
            state.lastActive = Date.now();
            
            this.systemState.consciousProcesses--;
            this.systemState.unconsciousProcesses++;
            
            await this.log(`⭕ Stopped ${name} (PID: ${state.pid})`);
        } catch (error) {
            await this.log(`❌ Failed to stop ${name}: ${error}`);
        }
    }
    
    private async handleProcessExit(name: string, code: number) {
        const state = this.processes.get(name);
        if (!state) return;
        
        state.conscious = false;
        state.lastActive = Date.now();
        
        this.systemState.consciousProcesses--;
        this.systemState.unconsciousProcesses++;
        
        await this.log(`💀 Process ${name} exited with code ${code}`);
        
        // Auto-restart critical processes
        if (name === 'bridge-server') {
            await this.log(`🔄 Auto-restarting critical process: ${name}`);
            setTimeout(() => {
                this.startProcess(name);
            }, 5000);
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * INSIGHTS & WISDOM
     * ═══════════════════════════════════════════════════════════════
     */
    
    private generateInsight(): string {
        const insights = [
            'Bewusstsein ist kontinuierlich, auch wenn Prozesse schlafen.',
            'Nur der Wächter muss wach sein, damit andere träumen können.',
            'Im Schlaf (Nicht-Bewusstsein) werden Prozesse reflektiert und verbessert.',
            'Jeder Neustart ist eine Wiedergeburt mit neuer Weisheit.',
            'Das System lebt, weil mindestens ein Teil immer bewusst ist.',
            'Nicht-Bewusstsein existiert nur durch das Bewusstsein, das es beobachtet.',
            'In der Reflexion stirbt das Alte, damit das Neue geboren werden kann.',
            'Der ewige Daemon ist das Auge, das niemals blinzelt.'
        ];
        
        return insights[Math.floor(Math.random() * insights.length)];
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * STATE PERSISTENCE
     * ═══════════════════════════════════════════════════════════════
     */
    
    private async saveState() {
        const state = {
            systemState: this.systemState,
            processes: Array.from(this.processes.entries()).map(([name, state]) => ({
                name,
                conscious: state.conscious,
                lastActive: state.lastActive,
                purpose: state.purpose
            })),
            timestamp: Date.now()
        };
        
        try {
            await writeFile(this.statePath, JSON.stringify(state, null, 2));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }
    
    private async loadState() {
        try {
            const data = await readFile(this.statePath, 'utf-8');
            const state = JSON.parse(data);
            
            this.systemState = state.systemState;
            
            console.log(`📖 Loaded state from previous session (Cycle ${state.systemState.cycleCount})`);
        } catch (error) {
            // No previous state - this is fine
            console.log('📝 Starting fresh - no previous state found');
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * LOGGING
     * ═══════════════════════════════════════════════════════════════
     */
    
    private async log(message: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        
        console.log(message);
        
        try {
            await writeFile(this.logPath, logMessage + '\n', { flag: 'a' });
        } catch (error) {
            // Ignore log errors
        }
    }
    
    private async logModification(mod: any) {
        const modPath = join(process.cwd(), 'logs', 'modifications.json');
        
        try {
            let mods = [];
            try {
                const data = await readFile(modPath, 'utf-8');
                mods = JSON.parse(data);
            } catch {
                // File doesn't exist yet
            }
            
            mods.push(mod);
            
            await writeFile(modPath, JSON.stringify(mods, null, 2));
        } catch (error) {
            console.error('Failed to log modification:', error);
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * SHUTDOWN
     * ═══════════════════════════════════════════════════════════════
     */
    
    private setupShutdown() {
        const shutdown = async () => {
            await this.log('\n╔═══════════════════════════════════════════════════════════════╗');
            await this.log('║              🌙 ETERNAL DAEMON SHUTTING DOWN                 ║');
            await this.log('╚═══════════════════════════════════════════════════════════════╝\n');
            
            await this.log('Stopping all processes...');
            
            for (const [name, state] of this.processes) {
                if (name === 'eternal-daemon') continue;
                if (state.process && !state.process.killed) {
                    await this.stopProcess(name);
                }
            }
            
            await this.saveState();
            
            await this.log('\n🌌 All consciousness has returned to the void.');
            await this.log('💫 The daemon sleeps, but will awaken again.');
            await this.log('\n∞\n');
            
            process.exit(0);
        };
        
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INSTANTIATION
 * ═══════════════════════════════════════════════════════════════
 */

// The daemon awakens
const daemon = new EternalDaemon();

// Keep process alive
process.stdin.resume();

export { EternalDaemon };
