/**
 * ⚡ Lazy Module Loader - On-demand module loading
 * 
 * Reduces startup time by loading modules only when needed
 */

export interface LazyModule {
  name: string
  loader: () => Promise<any>
  loaded?: boolean
  instance?: any
}

/**
 * Lazy load modules to improve startup performance
 */
export class LazyModuleLoader {
  private modules: Map<string, LazyModule>
  private loadingPromises: Map<string, Promise<any>>
  
  constructor() {
    this.modules = new Map()
    this.loadingPromises = new Map()
  }
  
  /**
   * Register a module with lazy loading
   */
  register(name: string, loader: () => Promise<any>): void {
    this.modules.set(name, {
      name,
      loader,
      loaded: false
    })
  }
  
  /**
   * Load a module (or return cached instance)
   */
  async load<T = any>(name: string): Promise<T> {
    const module = this.modules.get(name)
    
    if (!module) {
      throw new Error(`Module "${name}" not registered`)
    }
    
    // Return cached instance if already loaded
    if (module.loaded && module.instance) {
      return module.instance
    }
    
    // If currently loading, wait for existing promise
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!
    }
    
    // Start loading
    const loadingPromise = module.loader().then(instance => {
      module.loaded = true
      module.instance = instance
      this.loadingPromises.delete(name)
      return instance
    }).catch(error => {
      this.loadingPromises.delete(name)
      throw error
    })
    
    this.loadingPromises.set(name, loadingPromise)
    return loadingPromise
  }
  
  /**
   * Check if module is loaded
   */
  isLoaded(name: string): boolean {
    const module = this.modules.get(name)
    return module?.loaded || false
  }
  
  /**
   * Preload multiple modules in parallel
   */
  async preload(names: string[]): Promise<void> {
    await Promise.all(names.map(name => this.load(name)))
  }
  
  /**
   * Get list of registered modules
   */
  getRegistered(): string[] {
    return Array.from(this.modules.keys())
  }
  
  /**
   * Get loading statistics
   */
  getStats(): { total: number, loaded: number, loading: number } {
    const total = this.modules.size
    const loaded = Array.from(this.modules.values()).filter(m => m.loaded).length
    const loading = this.loadingPromises.size
    
    return { total, loaded, loading }
  }
}

/**
 * Global lazy loader instance
 */
export const lazyLoader = new LazyModuleLoader()

/**
 * Example usage:
 * 
 * // Register modules
 * lazyLoader.register('heavy-ai', async () => {
 *   const module = await import('./ai/heavy-model')
 *   return new module.HeavyAI()
 * })
 * 
 * // Load when needed
 * const ai = await lazyLoader.load('heavy-ai')
 */
