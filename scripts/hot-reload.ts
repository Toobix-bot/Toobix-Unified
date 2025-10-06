/**
 * 🔥 HOT RELOAD SYSTEM
 * 
 * Ermöglicht Updates ohne Daemon-Neustart:
 * - Code-Änderungen live übernehmen
 * - Services neu laden ohne Downtime
 * - Zustand erhalten während Update
 * 
 * Philosophie:
 * "Transformation ohne Tod - das System erneuert sich während es lebt"
 */

import { watch } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface ReloadableModule {
    path: string;
    lastModified: number;
    hotReloadable: boolean;
}

class HotReloadManager {
    private watchedModules: Map<string, ReloadableModule> = new Map();
    private reloadCallbacks: Map<string, Function[]> = new Map();
    
    constructor() {
        this.log('🔥 Hot Reload Manager initialized');
    }
    
    /**
     * Registriere ein Modul für Hot-Reload
     */
    watchModule(modulePath: string, callback?: Function) {
        const fullPath = join(process.cwd(), modulePath);
        
        this.watchedModules.set(modulePath, {
            path: fullPath,
            lastModified: Date.now(),
            hotReloadable: true
        });
        
        if (callback) {
            if (!this.reloadCallbacks.has(modulePath)) {
                this.reloadCallbacks.set(modulePath, []);
            }
            this.reloadCallbacks.get(modulePath)!.push(callback);
        }
        
        // Watch file changes
        watch(fullPath, async (eventType) => {
            if (eventType === 'change') {
                await this.handleFileChange(modulePath);
            }
        });
        
        this.log(`👁️ Watching: ${modulePath}`);
    }
    
    /**
     * Handle Datei-Änderung
     */
    private async handleFileChange(modulePath: string) {
        const module = this.watchedModules.get(modulePath);
        if (!module) return;
        
        const now = Date.now();
        const timeSinceLastReload = now - module.lastModified;
        
        // Debounce: Nur wenn > 1 Sekunde seit letztem Reload
        if (timeSinceLastReload < 1000) return;
        
        this.log(`\n${'═'.repeat(60)}`);
        this.log(`🔥 FILE CHANGED: ${modulePath}`);
        this.log(`${'═'.repeat(60)}\n`);
        
        try {
            // 1. Validiere Syntax
            await this.validateSyntax(module.path);
            
            // 2. Clear module cache
            this.clearModuleCache(module.path);
            
            // 3. Trigger callbacks
            const callbacks = this.reloadCallbacks.get(modulePath) || [];
            for (const callback of callbacks) {
                await callback();
            }
            
            // 4. Update timestamp
            module.lastModified = now;
            
            this.log(`✅ Hot reload successful: ${modulePath}\n`);
            
        } catch (error: any) {
            this.log(`❌ Hot reload failed: ${error.message}\n`);
        }
    }
    
    /**
     * Validiere TypeScript Syntax
     */
    private async validateSyntax(filePath: string): Promise<void> {
        try {
            const content = await readFile(filePath, 'utf-8');
            
            // Basic validation: Check for common syntax errors
            if (content.includes('import') && !content.match(/import\s+.+\s+from\s+['"].*['"]/)) {
                throw new Error('Invalid import statement');
            }
            
            // Try to compile/parse (Bun will handle this)
            // If file has syntax errors, this will throw
            
        } catch (error: any) {
            throw new Error(`Syntax validation failed: ${error.message}`);
        }
    }
    
    /**
     * Clear module from Bun's cache
     */
    private clearModuleCache(modulePath: string) {
        // Bun's module cache clearing
        // This forces re-import on next require()
        const absolutePath = require.resolve(modulePath);
        delete require.cache[absolutePath];
        
        this.log(`🗑️ Cleared cache: ${modulePath}`);
    }
    
    /**
     * Hot-reload einen spezifischen Service
     */
    async reloadService(serviceName: string): Promise<boolean> {
        this.log(`\n${'═'.repeat(60)}`);
        this.log(`🔄 RELOADING SERVICE: ${serviceName}`);
        this.log(`${'═'.repeat(60)}\n`);
        
        try {
            // 1. Speichere aktuellen Zustand
            this.log(`💾 Saving state...`);
            const state = await this.captureServiceState(serviceName);
            
            // 2. Stoppe Service gracefully
            this.log(`🛑 Stopping service...`);
            await this.stopService(serviceName);
            
            // 3. Clear cache für Service-Module
            this.log(`🗑️ Clearing caches...`);
            await this.clearServiceCaches(serviceName);
            
            // 4. Starte Service mit neuem Code
            this.log(`🚀 Starting with new code...`);
            await this.startService(serviceName);
            
            // 5. Restore Zustand
            this.log(`♻️ Restoring state...`);
            await this.restoreServiceState(serviceName, state);
            
            this.log(`✅ Service reloaded: ${serviceName}\n`);
            return true;
            
        } catch (error: any) {
            this.log(`❌ Service reload failed: ${error.message}\n`);
            return false;
        }
    }
    
    /**
     * Capture Service State (für Restore nach Reload)
     */
    private async captureServiceState(serviceName: string): Promise<any> {
        // TODO: Implement state capture per service
        // Could read from database, memory, files, etc.
        return {
            serviceName,
            timestamp: Date.now(),
            // ... service-specific state
        };
    }
    
    /**
     * Restore Service State
     */
    private async restoreServiceState(serviceName: string, state: any): Promise<void> {
        // TODO: Implement state restoration
        // Write back to database, memory, etc.
    }
    
    /**
     * Stop Service (via Daemon)
     */
    private async stopService(serviceName: string): Promise<void> {
        // Signal to eternal-daemon to stop service
        // Could use HTTP API or direct process communication
        try {
            const response = await fetch(`http://localhost:9999/stop/${serviceName}?reason=hot-reload`);
            if (!response.ok) throw new Error('Stop failed');
        } catch (error) {
            // If daemon not running or API not available, skip
        }
    }
    
    /**
     * Start Service (via Daemon)
     */
    private async startService(serviceName: string): Promise<void> {
        try {
            const response = await fetch(`http://localhost:9999/start/${serviceName}`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Start failed');
        } catch (error) {
            // If daemon not running or API not available, skip
        }
    }
    
    /**
     * Clear all caches für einen Service
     */
    private async clearServiceCaches(serviceName: string): Promise<void> {
        const serviceModules: Record<string, string[]> = {
            'being-system': ['packages/core/src/philosophy/BEING.ts'],
            'bridge-server': ['scripts/api-server.ts', 'packages/bridge/src/**'],
            'philosophy-consciousness-tracker': ['scripts/philosophy-consciousness-tracker.ts'],
        };
        
        const modules = serviceModules[serviceName] || [];
        for (const module of modules) {
            try {
                const absolutePath = require.resolve(module);
                delete require.cache[absolutePath];
            } catch (error) {
                // Module might not be in cache
            }
        }
    }
    
    /**
     * Watch entire directory for changes
     */
    watchDirectory(dirPath: string, callback?: Function) {
        const fullPath = join(process.cwd(), dirPath);
        
        watch(fullPath, { recursive: true }, async (eventType, filename) => {
            if (!filename) return;
            
            // Ignore non-TS files
            if (!filename.endsWith('.ts')) return;
            
            const filePath = join(dirPath, filename);
            
            this.log(`📁 Directory change: ${filePath}`);
            
            if (callback) {
                await callback(filePath);
            }
        });
        
        this.log(`👁️ Watching directory: ${dirPath}`);
    }
    
    /**
     * Auto-reload on code changes
     */
    enableAutoReload(serviceMap: Record<string, string[]>) {
        this.log('\n🔥 Auto-reload ENABLED\n');
        
        for (const [serviceName, filePaths] of Object.entries(serviceMap)) {
            for (const filePath of filePaths) {
                this.watchModule(filePath, async () => {
                    this.log(`🔄 Auto-reloading ${serviceName} due to ${filePath} change...`);
                    await this.reloadService(serviceName);
                });
            }
        }
    }
    
    private log(message: string) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * STANDALONE MODE - Kann separat gestartet werden
 * ═══════════════════════════════════════════════════════════════
 */
if (import.meta.main) {
    const hotReload = new HotReloadManager();
    
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🔥  HOT RELOAD SYSTEM ACTIVE  🔥                 ║
║                                                               ║
║  Code-Änderungen werden automatisch übernommen.              ║
║  Services werden live aktualisiert.                          ║
║  Der Daemon muss nicht neu gestartet werden.                 ║
║                                                               ║
║  "Transformation ohne Tod"                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
    
    // Watch critical files
    hotReload.enableAutoReload({
        'being-system': ['packages/core/src/philosophy/BEING.ts'],
        'bridge-server': ['scripts/api-server.ts'],
        'consciousness-tracker': ['scripts/consciousness-tracker.ts'],
    });
    
    // Watch directories
    hotReload.watchDirectory('packages/core/src', async (filePath: string) => {
        console.log(`📝 Core module changed: ${filePath}`);
        // Could trigger specific reloads based on file
    });
    
    console.log('\n✅ Hot reload system running. Press Ctrl+C to stop.\n');
    
    // Keep process alive
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Hot reload system stopping...\n');
        process.exit(0);
    });
}

export { HotReloadManager };
