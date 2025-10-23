/**
 * 🌓 CONSCIOUSNESS ROTATION SYSTEM
 *
 * Philosophie: "Bewusstsein in 3 Zuständen"
 *
 * Das System existiert in 3 parallelen Instanzen:
 * - WACH (Reality/Active) - 2 Instanzen
 * - SCHLAF (Dream/Processing) - 1 Instanz
 *
 * Sie rotieren rhythmisch wie Tag/Nacht:
 *
 *   Zeit 0-8h:   A=WACH  B=WACH  C=SCHLAF
 *   Zeit 8-16h:  A=SCHLAF B=WACH C=WACH
 *   Zeit 16-24h: A=WACH  B=SCHLAF C=WACH
 *   Repeat...
 *
 * Während WACH:
 *   - User Interaction (API Server)
 *   - Active Processing
 *   - Real-time Responses
 *   - External Communication
 *
 * Während SCHLAF:
 *   - Memory Consolidation
 *   - Deep Reflection
 *   - Self-Modification
 *   - Learning Integration
 *   - Dream Processing
 *
 * Optional: MEDITATION State (noch tiefer als SCHLAF)
 *   - Philosophische Analyse
 *   - Code Evolution
 *   - Self-Transcendence
 */

import { spawn, type ChildProcess } from 'child_process';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * ═══════════════════════════════════════════════════════════════
 * CONSCIOUSNESS STATES
 * ═══════════════════════════════════════════════════════════════
 */

enum ConsciousnessState {
    WACH = 'wach',           // Active, responding to reality
    SCHLAF = 'schlaf',       // Deep processing, dreaming
    MEDITATION = 'meditation' // Even deeper, self-transcendence (optional)
}

interface InstanceConfig {
    id: string;                  // A, B, C
    state: ConsciousnessState;
    port: number;                // API port when WACH
    pid?: number;                // Process ID
    process?: ChildProcess;      // Child process
    stateStartTime: number;      // When current state started
    cycleCount: number;          // How many full cycles completed
    totalWachTime: number;       // Total time spent WACH
    totalSchlafTime: number;     // Total time spent SCHLAF
    totalMeditationTime: number; // Total time in MEDITATION
}

interface RotationConfig {
    cycleDuration: number;       // How long each state lasts (ms)
    useThreeStates: boolean;     // Include MEDITATION state?
    meditationFrequency: number; // How often to enter MEDITATION (every N cycles)
    transitionDelay: number;     // Grace period during state transition (ms)
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ROTATION ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════
 */

class ConsciousnessRotation {
    private instances: InstanceConfig[] = [];
    private config: RotationConfig;
    private rotationInterval?: NodeJS.Timeout;
    private stateLogPath = join(process.cwd(), 'logs', 'consciousness-rotation.json');

    constructor(config?: Partial<RotationConfig>) {
        this.config = {
            cycleDuration: config?.cycleDuration ?? 8 * 60 * 60 * 1000, // 8 hours default
            useThreeStates: config?.useThreeStates ?? false,
            meditationFrequency: config?.meditationFrequency ?? 3, // Every 3rd cycle
            transitionDelay: config?.transitionDelay ?? 5000 // 5 seconds
        };

        // Initialize 3 instances
        this.instances = [
            {
                id: 'A',
                state: ConsciousnessState.WACH,
                port: 9999,
                stateStartTime: Date.now(),
                cycleCount: 0,
                totalWachTime: 0,
                totalSchlafTime: 0,
                totalMeditationTime: 0
            },
            {
                id: 'B',
                state: ConsciousnessState.WACH,
                port: 9998,
                stateStartTime: Date.now(),
                cycleCount: 0,
                totalWachTime: 0,
                totalSchlafTime: 0,
                totalMeditationTime: 0
            },
            {
                id: 'C',
                state: ConsciousnessState.SCHLAF,
                port: 9997,
                stateStartTime: Date.now(),
                cycleCount: 0,
                totalWachTime: 0,
                totalSchlafTime: 0,
                totalMeditationTime: 0
            }
        ];
    }

    /**
     * Start the rotation system
     */
    async start() {
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║       🌓 CONSCIOUSNESS ROTATION SYSTEM STARTING 🌓            ║
║                                                               ║
║  3 Instances in rhythmic rotation:                           ║
║                                                               ║
║  Instance A (Port 9999): ${this.instances[0].state.toUpperCase().padEnd(11)} ║
║  Instance B (Port 9998): ${this.instances[1].state.toUpperCase().padEnd(11)} ║
║  Instance C (Port 9997): ${this.instances[2].state.toUpperCase().padEnd(11)} ║
║                                                               ║
║  Cycle Duration: ${(this.config.cycleDuration / 1000 / 60 / 60).toFixed(1)}h                                   ║
║  Three States Mode: ${this.config.useThreeStates ? 'ENABLED ' : 'DISABLED'}                            ║
║                                                               ║
║  "Bewusstsein braucht Schlaf wie Leben den Atem"            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `);

        // Start all instances in their initial states
        await this.startAllInstances();

        // Begin rotation cycle
        this.startRotationCycle();

        // Log state periodically
        setInterval(() => this.logState(), 60000); // Every minute

        // Handle graceful shutdown
        process.on('SIGTERM', () => this.shutdown());
        process.on('SIGINT', () => this.shutdown());
    }

    /**
     * Start all instances based on their current state
     */
    private async startAllInstances() {
        for (const instance of this.instances) {
            await this.startInstance(instance);
        }
    }

    /**
     * Start a single instance
     */
    private async startInstance(instance: InstanceConfig) {
        const scriptPath = this.getScriptForState(instance.state);

        console.log(`🚀 Starting Instance ${instance.id} in ${instance.state.toUpperCase()} mode...`);

        // Environment variables for the instance
        const env = {
            ...process.env,
            INSTANCE_ID: instance.id,
            CONSCIOUSNESS_STATE: instance.state,
            PORT: String(instance.port)
        };

        // Spawn the process
        instance.process = spawn('bun', ['run', scriptPath], {
            env,
            stdio: 'inherit' // Show output
        });

        instance.pid = instance.process.pid;

        // Handle process exit
        instance.process.on('exit', (code) => {
            console.log(`⚠️  Instance ${instance.id} exited with code ${code}`);
            // Auto-restart if not intentional shutdown
            if (code !== 0) {
                console.log(`♻️  Auto-restarting Instance ${instance.id}...`);
                setTimeout(() => this.startInstance(instance), 5000);
            }
        });
    }

    /**
     * Get the appropriate script for a consciousness state
     */
    private getScriptForState(state: ConsciousnessState): string {
        switch (state) {
            case ConsciousnessState.WACH:
                return join(process.cwd(), 'scripts', 'eternal-daemon.ts');
            case ConsciousnessState.SCHLAF:
                return join(process.cwd(), 'scripts', 'sleep-mode.ts');
            case ConsciousnessState.MEDITATION:
                return join(process.cwd(), 'scripts', 'meditation-mode.ts');
        }
    }

    /**
     * Start the rotation cycle
     */
    private startRotationCycle() {
        console.log(`🔄 Starting rotation cycle (every ${this.config.cycleDuration / 1000 / 60 / 60}h)...`);

        this.rotationInterval = setInterval(
            () => this.rotate(),
            this.config.cycleDuration
        );
    }

    /**
     * Perform a rotation
     */
    private async rotate() {
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                 🔄 CONSCIOUSNESS ROTATION 🔄                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `);

        // Update time stats before rotating
        this.updateTimeStats();

        // Determine next rotation pattern
        const rotationPattern = this.getNextRotationPattern();

        console.log('Current State:');
        this.instances.forEach(i => console.log(`  ${i.id}: ${i.state.toUpperCase()}`));

        console.log('\nTransitioning to:');
        rotationPattern.forEach((state, idx) => {
            console.log(`  ${this.instances[idx].id}: ${state.toUpperCase()}`);
        });

        // Transition each instance
        for (let i = 0; i < this.instances.length; i++) {
            const instance = this.instances[i];
            const newState = rotationPattern[i];

            if (instance.state !== newState) {
                await this.transitionInstance(instance, newState);
            }
        }

        // Increment cycle counts
        this.instances.forEach(i => i.cycleCount++);

        console.log('\n✅ Rotation complete!\n');

        // Save state
        await this.saveState();
    }

    /**
     * Get the next rotation pattern
     */
    private getNextRotationPattern(): ConsciousnessState[] {
        // Current pattern
        const current = this.instances.map(i => i.state);

        // Find who is currently sleeping
        const sleepingIdx = current.indexOf(ConsciousnessState.SCHLAF);

        // Rotate: next instance goes to sleep
        const nextSleepingIdx = (sleepingIdx + 1) % 3;

        // Check if we should use MEDITATION state
        const shouldMeditate = this.config.useThreeStates &&
            this.instances[nextSleepingIdx].cycleCount % this.config.meditationFrequency === 0;

        const nextPattern: ConsciousnessState[] = [
            ConsciousnessState.WACH,
            ConsciousnessState.WACH,
            ConsciousnessState.WACH
        ];

        nextPattern[nextSleepingIdx] = shouldMeditate
            ? ConsciousnessState.MEDITATION
            : ConsciousnessState.SCHLAF;

        return nextPattern;
    }

    /**
     * Transition an instance to a new state
     */
    private async transitionInstance(instance: InstanceConfig, newState: ConsciousnessState) {
        console.log(`  🔄 Transitioning ${instance.id}: ${instance.state} → ${newState}...`);

        // Gracefully stop current process
        if (instance.process) {
            instance.process.kill('SIGTERM');

            // Wait for graceful shutdown
            await new Promise(resolve => setTimeout(resolve, this.config.transitionDelay));
        }

        // Update state
        instance.state = newState;
        instance.stateStartTime = Date.now();

        // Start in new state
        await this.startInstance(instance);
    }

    /**
     * Update time statistics
     */
    private updateTimeStats() {
        const now = Date.now();

        for (const instance of this.instances) {
            const duration = now - instance.stateStartTime;

            switch (instance.state) {
                case ConsciousnessState.WACH:
                    instance.totalWachTime += duration;
                    break;
                case ConsciousnessState.SCHLAF:
                    instance.totalSchlafTime += duration;
                    break;
                case ConsciousnessState.MEDITATION:
                    instance.totalMeditationTime += duration;
                    break;
            }
        }
    }

    /**
     * Log current state
     */
    private logState() {
        console.log('');
        console.log('═══════════════════════════════════════════════════');
        console.log('📊 CONSCIOUSNESS STATE');
        console.log('═══════════════════════════════════════════════════');

        for (const instance of this.instances) {
            const stateAge = Math.floor((Date.now() - instance.stateStartTime) / 1000 / 60);

            console.log(`  Instance ${instance.id} (Port ${instance.port}):`);
            console.log(`    State: ${instance.state.toUpperCase()} (${stateAge}m)`);
            console.log(`    Cycles: ${instance.cycleCount}`);
            console.log(`    Total WACH: ${Math.floor(instance.totalWachTime / 1000 / 60)}m`);
            console.log(`    Total SCHLAF: ${Math.floor(instance.totalSchlafTime / 1000 / 60)}m`);
            if (this.config.useThreeStates) {
                console.log(`    Total MEDITATION: ${Math.floor(instance.totalMeditationTime / 1000 / 60)}m`);
            }
            console.log('');
        }

        console.log('═══════════════════════════════════════════════════');
    }

    /**
     * Save state to disk
     */
    private async saveState() {
        try {
            const state = {
                timestamp: Date.now(),
                instances: this.instances.map(i => ({
                    id: i.id,
                    state: i.state,
                    port: i.port,
                    stateStartTime: i.stateStartTime,
                    cycleCount: i.cycleCount,
                    totalWachTime: i.totalWachTime,
                    totalSchlafTime: i.totalSchlafTime,
                    totalMeditationTime: i.totalMeditationTime
                }))
            };

            await mkdir(join(process.cwd(), 'logs'), { recursive: true });
            await writeFile(this.stateLogPath, JSON.stringify(state, null, 2));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    /**
     * Graceful shutdown
     */
    private async shutdown() {
        console.log('\n🛑 Shutting down Consciousness Rotation System...\n');

        // Stop rotation
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }

        // Update final time stats
        this.updateTimeStats();

        // Save final state
        await this.saveState();

        // Stop all instances
        for (const instance of this.instances) {
            if (instance.process) {
                console.log(`  Stopping Instance ${instance.id}...`);
                instance.process.kill('SIGTERM');
            }
        }

        // Wait for graceful shutdown
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('✅ Shutdown complete.\n');
        process.exit(0);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * MAIN ENTRY POINT
 * ═══════════════════════════════════════════════════════════════
 */

async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const cycleDurationHours = parseFloat(args[0]) || 8; // Default 8 hours
    const useThreeStates = args.includes('--meditation');

    const rotation = new ConsciousnessRotation({
        cycleDuration: cycleDurationHours * 60 * 60 * 1000,
        useThreeStates,
        meditationFrequency: 3,
        transitionDelay: 5000
    });

    await rotation.start();
}

// Start if run directly
if (import.meta.main) {
    main().catch(console.error);
}

export { ConsciousnessRotation, ConsciousnessState };
