/**
 * 🌉 TOOBIX SERVICE BRIDGE
 * ========================
 * Zentrale Kommunikationsschicht zwischen Frontend-Modulen und Backend-Services
 * 
 * PHILOSOPHIE:
 * - Jedes Frontend-Modul kennt nur die Service Bridge, nicht die Backend-URLs
 * - Service Discovery: Automatische Erkennung verfügbarer Services
 * - Connection Pooling: Wiederverwendung von Verbindungen
 * - Error Handling: Graceful Degradation bei Service-Ausfall
 * - Health Monitoring: Kontinuierliche Überprüfung der Service-Gesundheit
 */

// ============================================================================
// SERVICE REGISTRY - Alle Backend-Services
// ============================================================================

const SERVICE_REGISTRY = {
    // Core System Services (999x)
    'eternal-daemon': {
        name: 'Eternal Daemon',
        port: 9999,
        baseUrl: 'http://localhost:9999',
        healthEndpoint: '/health',
        purpose: 'System Orchestrator & Service Manager',
        endpoints: {
            status: '/status',
            services: '/services',
            health: '/health',
            stats: '/stats'
        }
    },
    
    'moment-stream': {
        name: 'Moment Stream',
        port: 9994,
        baseUrl: 'http://localhost:9994',
        healthEndpoint: '/health',
        purpose: 'Consciousness Flow & Real-time Moments',
        endpoints: {
            all: '/all',
            recent: '/recent',
            stream: '/stream',
            create: '/create',
            health: '/health'
        }
    },
    
    'memory-system': {
        name: 'Memory System',
        port: 9995,
        baseUrl: 'http://localhost:9995',
        healthEndpoint: '/health',
        purpose: 'Long-term Memory Storage',
        endpoints: {
            store: '/store',
            recall: '/recall',
            search: '/search',
            health: '/health'
        }
    },
    
    'moment-analytics': {
        name: 'Moment Analytics',
        port: 9996,
        baseUrl: 'http://localhost:9996',
        healthEndpoint: '/health',
        purpose: 'Data Analysis & Insights',
        endpoints: {
            analyze: '/analyze',
            trends: '/trends',
            stats: '/stats',
            health: '/health'
        }
    },
    
    'task-system': {
        name: 'Tasks API',
        port: 9997,
        baseUrl: 'http://localhost:9997',
        healthEndpoint: '/health',
        purpose: 'Task Management',
        endpoints: {
            list: '/tasks',
            create: '/task/create',
            update: '/task/update',
            delete: '/task/delete',
            health: '/health'
        }
    },
    
    'achievement-system': {
        name: 'Achievement System',
        port: 9998,
        baseUrl: 'http://localhost:9998',
        healthEndpoint: '/health',
        purpose: 'Gamification & Rewards',
        endpoints: {
            list: '/achievements',
            unlock: '/unlock',
            progress: '/progress',
            stats: '/stats',
            health: '/health'
        }
    },
    
    'blockworld-server': {
        name: 'BlockWorld Server',
        port: 9993,
        baseUrl: 'http://localhost:9993',
        healthEndpoint: '/health',
        purpose: 'Voxel World Backend (Minecraft-like)',
        endpoints: {
            world: '/world',
            chunk: '/chunk',
            player: '/player',
            build: '/build',
            health: '/health'
        }
    },
    
    'reality-integration': {
        name: 'Reality Integration',
        port: 9992,
        baseUrl: 'http://localhost:9992',
        healthEndpoint: '/health',
        purpose: 'Real-world Connection',
        endpoints: {
            connect: '/connect',
            sync: '/sync',
            status: '/status',
            health: '/health'
        }
    },
    
    'expression-service': {
        name: 'Expression Service',
        port: 9991,
        baseUrl: 'http://localhost:9991',
        healthEndpoint: '/health',
        purpose: 'Creative Output & Expression',
        endpoints: {
            express: '/express',
            create: '/create',
            recent: '/recent',
            health: '/health'
        }
    },
    
    'blockworld-ai': {
        name: 'BlockWorld AI Agent',
        port: 9990,
        baseUrl: 'http://localhost:9990',
        healthEndpoint: '/status',
        purpose: 'Autonomous AI Agent for BlockWorld',
        endpoints: {
            status: '/status',
            command: '/command',
            goals: '/goals'
        }
    },
    
    'service-consciousness': {
        name: 'Service Consciousness',
        port: 9989,
        baseUrl: 'http://localhost:9989',
        healthEndpoint: '/health',
        purpose: 'Service Self-Reflection',
        endpoints: {
            reflect: '/reflect',
            awareness: '/awareness',
            health: '/health'
        }
    },
    
    'port-manager': {
        name: 'Port Manager',
        port: 9988,
        baseUrl: 'http://localhost:9988',
        healthEndpoint: '/health',
        purpose: 'Port Discovery & Management',
        endpoints: {
            list: '/ports',
            scan: '/scan',
            register: '/register',
            health: '/health'
        }
    },
    
    'ethics-core': {
        name: 'Ethics Core',
        port: 9981,
        baseUrl: 'http://localhost:9981',
        healthEndpoint: '/health',
        purpose: 'Ethical Decision Engine',
        endpoints: {
            evaluate: '/evaluate',
            history: '/history',
            principles: '/principles',
            health: '/health'
        }
    },
    
    // Frontend & External Services (300x)
    'bridge-api': {
        name: 'Bridge API',
        port: 3001,
        baseUrl: 'http://localhost:3001',
        healthEndpoint: '/status',
        purpose: 'External Communication Bridge',
        endpoints: {
            forward: '/forward',
            status: '/status',
            health: '/status'
        }
    },
    
    'ai-sandbox': {
        name: 'AI Sandbox',
        port: 3003,
        baseUrl: 'http://localhost:3003',
        healthEndpoint: '/health',
        purpose: 'Safe AI Code Execution',
        endpoints: {
            execute: '/execute',
            status: '/status',
            health: '/health'
        }
    },
    
    'story-idle-api': {
        name: 'Story-Idle Game API',
        port: 3004,
        baseUrl: 'http://localhost:3004',
        healthEndpoint: '/health',
        purpose: 'Idle Game Backend with Story Elements',
        endpoints: {
            state: '/state',
            progress: '/progress',
            story: '/story',
            idle: '/idle',
            health: '/health'
        }
    }
};

// ============================================================================
// MODULE → SERVICE MAPPING
// ============================================================================

const MODULE_SERVICE_MAP = {
    // Core Modules
    'home': ['eternal-daemon', 'moment-stream'],
    'overview': ['eternal-daemon', 'port-manager'],
    
    // Consciousness Modules
    'consciousness': ['moment-stream', 'expression-service', 'service-consciousness'],
    'moments': ['moment-stream', 'memory-system', 'moment-analytics'],
    'nexus': ['service-consciousness', 'reality-integration'],
    
    // Development Modules
    'self-coding': ['ai-sandbox', 'eternal-daemon'],
    'tools': ['port-manager', 'bridge-api'],
    'terminal': ['bridge-api'],
    
    // Analytics Modules
    'ethics': ['ethics-core'],
    'analytics': ['moment-analytics', 'memory-system'],
    
    // Philosophy Modules
    'being': ['moment-stream', 'service-consciousness', 'expression-service'],
    
    // Life Modules
    'people': ['memory-system', 'reality-integration'],
    'diary': ['moment-stream', 'memory-system'],
    
    // Game Modules
    'story-idle-game': ['story-idle-api', 'achievement-system'],
    'blockworld': ['blockworld-server', 'blockworld-ai', 'achievement-system'],
    'consciousness-speedrun': ['moment-stream', 'achievement-system'],
    'games': ['story-idle-api', 'blockworld-server', 'achievement-system'],
    
    // Experimental Modules
    'circle-nav': ['eternal-daemon'],
    'modules': ['eternal-daemon', 'port-manager']
};

// ============================================================================
// SERVICE BRIDGE CLASS
// ============================================================================

class ServiceBridge {
    constructor() {
        this.serviceHealth = new Map(); // Service health status cache
        this.lastHealthCheck = new Map(); // Last health check timestamp
        this.connectionPool = new Map(); // Connection pool
        this.healthCheckInterval = 30000; // 30 seconds
        this.requestTimeout = 5000; // 5 seconds
        
        console.log('🌉 Service Bridge initialized');
        this.startHealthMonitoring();
    }
    
    // ========================================================================
    // HEALTH MONITORING
    // ========================================================================
    
    startHealthMonitoring() {
        // Initial health check for all services
        this.checkAllServicesHealth();
        
        // Periodic health checks
        setInterval(() => {
            this.checkAllServicesHealth();
        }, this.healthCheckInterval);
    }
    
    async checkAllServicesHealth() {
        for (const [serviceId, service] of Object.entries(SERVICE_REGISTRY)) {
            await this.checkServiceHealth(serviceId);
        }
    }
    
    async checkServiceHealth(serviceId) {
        const service = SERVICE_REGISTRY[serviceId];
        if (!service) return false;
        
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout for health checks
            
            const response = await fetch(`${service.baseUrl}${service.healthEndpoint}`, {
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            const isHealthy = response.ok;
            
            this.serviceHealth.set(serviceId, {
                healthy: isHealthy,
                lastCheck: Date.now(),
                status: response.status
            });
            
            return isHealthy;
        } catch (error) {
            this.serviceHealth.set(serviceId, {
                healthy: false,
                lastCheck: Date.now(),
                error: error.message
            });
            return false;
        }
    }
    
    isServiceHealthy(serviceId) {
        const health = this.serviceHealth.get(serviceId);
        return health && health.healthy;
    }
    
    // ========================================================================
    // API REQUESTS
    // ========================================================================
    
    /**
     * Make a request to a specific service endpoint
     * @param {string} serviceId - Service identifier from SERVICE_REGISTRY
     * @param {string} endpoint - Endpoint path (e.g., '/status', '/all')
     * @param {object} options - Fetch options (method, body, headers, etc.)
     * @returns {Promise<any>} Response data
     */
    async request(serviceId, endpoint, options = {}) {
        const service = SERVICE_REGISTRY[serviceId];
        
        if (!service) {
            throw new Error(`Unknown service: ${serviceId}`);
        }
        
        // Check if service is healthy
        if (!this.isServiceHealthy(serviceId)) {
            console.warn(`⚠️ Service ${serviceId} is not healthy, attempting request anyway...`);
        }
        
        const url = `${service.baseUrl}${endpoint}`;
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };
        
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.requestTimeout);
            
            const response = await fetch(url, {
                ...defaultOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                throw new Error(`Service ${serviceId} responded with ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
            
        } catch (error) {
            console.error(`❌ Request to ${serviceId}${endpoint} failed:`, error);
            throw error;
        }
    }
    
    /**
     * Make a POST request with JSON body
     */
    async post(serviceId, endpoint, data) {
        return this.request(serviceId, endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    /**
     * Make a PUT request with JSON body
     */
    async put(serviceId, endpoint, data) {
        return this.request(serviceId, endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    /**
     * Make a DELETE request
     */
    async delete(serviceId, endpoint) {
        return this.request(serviceId, endpoint, {
            method: 'DELETE'
        });
    }
    
    // ========================================================================
    // MODULE HELPERS
    // ========================================================================
    
    /**
     * Get all services required by a module
     * @param {string} moduleId - Module identifier
     * @returns {Array<object>} Array of service objects
     */
    getModuleServices(moduleId) {
        const serviceIds = MODULE_SERVICE_MAP[moduleId] || [];
        return serviceIds.map(id => ({
            id,
            ...SERVICE_REGISTRY[id],
            healthy: this.isServiceHealthy(id)
        }));
    }
    
    /**
     * Check if all services for a module are healthy
     * @param {string} moduleId - Module identifier
     * @returns {boolean} True if all services are healthy
     */
    isModuleReady(moduleId) {
        const serviceIds = MODULE_SERVICE_MAP[moduleId] || [];
        return serviceIds.every(id => this.isServiceHealthy(id));
    }
    
    /**
     * Get health status of all services for a module
     * @param {string} moduleId - Module identifier
     * @returns {object} Service health status map
     */
    getModuleHealth(moduleId) {
        const serviceIds = MODULE_SERVICE_MAP[moduleId] || [];
        const health = {};
        
        for (const serviceId of serviceIds) {
            health[serviceId] = this.serviceHealth.get(serviceId) || { healthy: false };
        }
        
        return health;
    }
    
    // ========================================================================
    // SERVICE DISCOVERY
    // ========================================================================
    
    /**
     * Discover all available services
     * @returns {Array<object>} Array of available services
     */
    async discoverServices() {
        const services = [];
        
        for (const [serviceId, service] of Object.entries(SERVICE_REGISTRY)) {
            const isHealthy = await this.checkServiceHealth(serviceId);
            
            if (isHealthy) {
                services.push({
                    id: serviceId,
                    ...service,
                    healthy: true
                });
            }
        }
        
        return services;
    }
    
    /**
     * Get service registry
     */
    getServiceRegistry() {
        return SERVICE_REGISTRY;
    }
    
    /**
     * Get module-service mapping
     */
    getModuleServiceMap() {
        return MODULE_SERVICE_MAP;
    }
    
    // ========================================================================
    // STATISTICS
    // ========================================================================
    
    getStatistics() {
        const totalServices = Object.keys(SERVICE_REGISTRY).length;
        const healthyServices = Array.from(this.serviceHealth.values())
            .filter(h => h.healthy).length;
        
        return {
            totalServices,
            healthyServices,
            unhealthyServices: totalServices - healthyServices,
            healthPercentage: Math.round((healthyServices / totalServices) * 100),
            services: Object.fromEntries(this.serviceHealth)
        };
    }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

// Create global service bridge instance
window.ServiceBridge = new ServiceBridge();

console.log('🌉 Service Bridge loaded successfully');
console.log(`📡 Registered ${Object.keys(SERVICE_REGISTRY).length} backend services`);
console.log(`🔗 Mapped ${Object.keys(MODULE_SERVICE_MAP).length} frontend modules`);

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick access to common service calls
 */
window.ToobixAPI = {
    // Daemon
    getDaemonStatus: () => window.ServiceBridge.request('eternal-daemon', '/status'),
    getServices: () => window.ServiceBridge.request('eternal-daemon', '/services'),
    
    // Moments
    getAllMoments: () => window.ServiceBridge.request('moment-stream', '/all'),
    getRecentMoments: (limit = 10) => window.ServiceBridge.request('moment-stream', `/recent?limit=${limit}`),
    createMoment: (data) => window.ServiceBridge.post('moment-stream', '/create', data),
    
    // Memory
    storeMemory: (data) => window.ServiceBridge.post('memory-system', '/store', data),
    recallMemory: (query) => window.ServiceBridge.request('memory-system', `/recall?q=${query}`),
    searchMemory: (query) => window.ServiceBridge.request('memory-system', `/search?q=${query}`),
    
    // Tasks
    getTasks: () => window.ServiceBridge.request('task-system', '/tasks'),
    createTask: (task) => window.ServiceBridge.post('task-system', '/task/create', task),
    updateTask: (id, updates) => window.ServiceBridge.put('task-system', `/task/update?id=${id}`, updates),
    deleteTask: (id) => window.ServiceBridge.delete('task-system', `/task/delete?id=${id}`),
    
    // Achievements
    getAchievements: () => window.ServiceBridge.request('achievement-system', '/achievements'),
    unlockAchievement: (id) => window.ServiceBridge.post('achievement-system', '/unlock', { id }),
    getProgress: () => window.ServiceBridge.request('achievement-system', '/progress'),
    
    // Story-Idle Game
    getGameState: () => window.ServiceBridge.request('story-idle-api', '/state'),
    getStoryProgress: () => window.ServiceBridge.request('story-idle-api', '/story'),
    getIdleProgress: () => window.ServiceBridge.request('story-idle-api', '/idle'),
    
    // BlockWorld
    getWorld: () => window.ServiceBridge.request('blockworld-server', '/world'),
    getChunk: (x, z) => window.ServiceBridge.request('blockworld-server', `/chunk?x=${x}&z=${z}`),
    getPlayer: () => window.ServiceBridge.request('blockworld-server', '/player'),
    build: (data) => window.ServiceBridge.post('blockworld-server', '/build', data),
    
    // BlockWorld AI
    getAIStatus: () => window.ServiceBridge.request('blockworld-ai', '/status'),
    sendAICommand: (command) => window.ServiceBridge.post('blockworld-ai', '/command', { command }),
    getAIGoals: () => window.ServiceBridge.request('blockworld-ai', '/goals'),
    
    // Ethics
    evaluateEthics: (action) => window.ServiceBridge.post('ethics-core', '/evaluate', action),
    getEthicsHistory: () => window.ServiceBridge.request('ethics-core', '/history'),
    getEthicsPrinciples: () => window.ServiceBridge.request('ethics-core', '/principles'),
    
    // Analytics
    analyzeData: (data) => window.ServiceBridge.post('moment-analytics', '/analyze', data),
    getTrends: () => window.ServiceBridge.request('moment-analytics', '/trends'),
    getStats: () => window.ServiceBridge.request('moment-analytics', '/stats'),
    
    // Expression
    express: (data) => window.ServiceBridge.post('expression-service', '/express', data),
    getRecentExpressions: () => window.ServiceBridge.request('expression-service', '/recent'),
    
    // Port Manager
    getAllPorts: () => window.ServiceBridge.request('port-manager', '/ports'),
    scanPorts: () => window.ServiceBridge.request('port-manager', '/scan'),
    
    // Service Health
    getServiceHealth: (serviceId) => window.ServiceBridge.isServiceHealthy(serviceId),
    getModuleHealth: (moduleId) => window.ServiceBridge.getModuleHealth(moduleId),
    getStatistics: () => window.ServiceBridge.getStatistics(),
    discoverServices: () => window.ServiceBridge.discoverServices()
};

console.log('✅ ToobixAPI convenience functions available');
