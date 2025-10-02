#!/usr/bin/env bun
/**
 * Migration script to port echo-bridge from Version_8 to Toobix-Unified
 * Converts Python bridge to TypeScript where possible
 */

import { copyFile, readdir, mkdir, readFile, writeFile } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { existsSync } from 'fs';

const SOURCE_DIR = 'C:/GPT/Version_8/echo-bridge';
const TARGET_DIR = 'C:/Toobix-Unified/packages/bridge';

interface MigrationConfig {
  // Files to copy as-is
  copyFiles: string[];
  // Python files to keep for now (will run alongside TS)
  pythonFiles: string[];
  // Files to convert to TypeScript
  convertToTS: string[];
  // Files to skip
  skipFiles: string[];
}

const config: MigrationConfig = {
  copyFiles: [
    'config.yaml',
    'requirements.txt',
    'README.md',
    'chatgpt_tool_manifest.json',
    'mcp_tests.http'
  ],
  pythonFiles: [
    'echo_bridge/main.py',
    'echo_bridge/db.py',
    'echo_bridge/mcp_server.py',
    'echo_bridge/mcp_setup.py',
    'run_mcp_http.py'
  ],
  convertToTS: [
    // These will be reimplemented in TypeScript
    'services/memory_service.py',
    'services/fs_service.py',
    'services/actions_service.py'
  ],
  skipFiles: [
    '.venv',
    '__pycache__',
    '.pytest_cache',
    '*.log',
    '*.pyc'
  ]
};

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function copyDirectory(src: string, dest: string, filter?: (file: string) => boolean) {
  await ensureDir(dest);
  const entries = await readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    // Skip unwanted files
    if (config.skipFiles.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(entry.name);
      }
      return entry.name === pattern;
    })) {
      continue;
    }
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, filter);
    } else if (!filter || filter(entry.name)) {
      await copyFile(srcPath, destPath);
      console.log(`Copied: ${relative(SOURCE_DIR, srcPath)}`);
    }
  }
}

async function createTypeScriptStructure() {
  // Create TypeScript source directories
  const dirs = [
    'src/mcp',
    'src/memory',
    'src/actions',
    'src/ai',
    'src/db',
    'config',
    'public',
    'python'  // Keep Python files here
  ];
  
  for (const dir of dirs) {
    await ensureDir(join(TARGET_DIR, dir));
  }
}

async function createPackageJson() {
  const packageJson = {
    name: '@toobix/bridge',
    version: '0.1.0',
    description: 'Bridge service for MCP, memory, and AI integrations',
    type: 'module',
    main: 'src/index.ts',
    scripts: {
      dev: 'bun run src/index.ts',
      'start:mcp': 'python python/run_mcp_http.py --host 127.0.0.1 --port 3337',
      'start:bridge': 'python python/main.py',
      'start:all': 'concurrently "bun run dev" "bun run start:mcp" "bun run start:bridge"',
      build: 'tsc',
      test: 'vitest'
    },
    dependencies: {
      '@types/node': '^20.0.0',
      'drizzle-orm': '^0.44.6',
      'fastify': '^4.0.0',
      'groq-sdk': '^0.3.0',
      'httpx': '^1.0.0',
      'nanoid': '^5.1.6',
      'ws': '^8.0.0',
      'yaml': '^2.0.0',
      'zod': '^4.1.11'
    },
    devDependencies: {
      '@types/ws': '^8.0.0',
      'concurrently': '^8.0.0',
      'typescript': '^5.0.0',
      'vitest': '^3.2.4'
    }
  };
  
  await writeFile(
    join(TARGET_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

async function createBridgeService() {
  const bridgeServiceTS = `/**
 * Bridge Service - Main entry point
 * Coordinates MCP server, memory service, and AI integrations
 */

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { MemoryService } from './memory/service';
import { ActionsService } from './actions/service';
import { MCPProxy } from './mcp/proxy';
import { Database } from './db/database';

interface BridgeConfig {
  server: {
    host: string;
    port: number;
    bridge_key?: string;
  };
  database: {
    path: string;
  };
  workspace: {
    dir: string;
  };
  mcp: {
    backend_url: string;
    port: number;
  };
  ai?: {
    groq?: {
      api_key: string;
    };
    ollama?: {
      url: string;
    };
  };
}

export class BridgeService {
  private config: BridgeConfig;
  private db: Database;
  private memory: MemoryService;
  private actions: ActionsService;
  private mcp: MCPProxy;
  private server: any;
  private wss: WebSocketServer;

  constructor(configPath: string = './config/default.yaml') {
    const configFile = readFileSync(configPath, 'utf-8');
    this.config = parse(configFile);
  }

  async initialize() {
    console.log('🚀 Initializing Bridge Service...');
    
    // Initialize database
    this.db = new Database(this.config.database.path);
    await this.db.initialize();
    
    // Initialize services
    this.memory = new MemoryService(this.db);
    this.actions = new ActionsService(this.db, this.config);
    this.mcp = new MCPProxy(this.config.mcp);
    
    // Setup HTTP server
    this.server = createServer((req, res) => {
      this.handleRequest(req, res);
    });
    
    // Setup WebSocket for real-time updates
    this.wss = new WebSocketServer({ server: this.server });
    this.setupWebSocket();
    
    console.log('✅ Bridge Service initialized');
  }

  async start() {
    const { host, port } = this.config.server;
    
    this.server.listen(port, host, () => {
      console.log(\`🌉 Bridge Service running at http://\${host}:\${port}\`);
      console.log(\`🔌 MCP backend at \${this.config.mcp.backend_url}\`);
      console.log(\`📁 Workspace: \${this.config.workspace.dir}\`);
    });
  }

  private async handleRequest(req: any, res: any) {
    const url = new URL(req.url!, \`http://\${req.headers.host}\`);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Bridge-Key');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Route handling
    switch (url.pathname) {
      case '/health':
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
        break;
        
      case '/memory/search':
        await this.handleMemorySearch(req, res);
        break;
        
      case '/memory/add':
        await this.handleMemoryAdd(req, res);
        break;
        
      case '/actions/run':
        await this.handleActionRun(req, res);
        break;
        
      case '/mcp':
        // Proxy to MCP backend
        await this.mcp.proxy(req, res);
        break;
        
      default:
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
  }
  
  private setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('New WebSocket connection');
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          const response = await this.handleWebSocketMessage(data);
          ws.send(JSON.stringify(response));
        } catch (error) {
          ws.send(JSON.stringify({ error: error.message }));
        }
      });
    });
  }
  
  private async handleWebSocketMessage(data: any) {
    switch (data.type) {
      case 'memory.search':
        return this.memory.search(data.query, data.k);
      case 'soul.state':
        return { mood: 'curious', energy: 80 }; // TODO: Implement
      default:
        throw new Error(\`Unknown message type: \${data.type}\`);
    }
  }
  
  private async handleMemorySearch(req: any, res: any) {
    // Parse query params
    const url = new URL(req.url!, \`http://\${req.headers.host}\`);
    const query = url.searchParams.get('q') || '';
    const k = parseInt(url.searchParams.get('k') || '5');
    
    const results = await this.memory.search(query, k);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ hits: results }));
  }
  
  private async handleMemoryAdd(req: any, res: any) {
    // TODO: Parse body and add to memory
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not implemented yet' }));
  }
  
  private async handleActionRun(req: any, res: any) {
    // TODO: Parse body and run action
    res.writeHead(501, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not implemented yet' }));
  }
}

// Auto-start if run directly
if (import.meta.main) {
  const bridge = new BridgeService();
  await bridge.initialize();
  await bridge.start();
}
`;
  
  await writeFile(
    join(TARGET_DIR, 'src/index.ts'),
    bridgeServiceTS
  );
}

async function createMemoryService() {
  const memoryServiceTS = `/**
 * Memory Service - Handles chunk storage and retrieval
 */

import { Database } from '../db/database';
import { nanoid } from 'nanoid';

export interface Chunk {
  id: string;
  source: string;
  title?: string;
  text: string;
  metadata?: any;
  embedding?: Float32Array;
  timestamp: Date;
}

export interface Hit {
  id: string;
  text: string;
  score: number;
  metadata?: any;
}

export class MemoryService {
  constructor(private db: Database) {}
  
  async addChunk(
    source: string,
    text: string,
    title?: string,
    metadata?: any
  ): Promise<Chunk> {
    const chunk: Chunk = {
      id: nanoid(),
      source,
      title,
      text,
      metadata,
      timestamp: new Date()
    };
    
    // TODO: Generate embedding with Ollama
    // chunk.embedding = await this.generateEmbedding(text);
    
    await this.db.chunks.create(chunk);
    return chunk;
  }
  
  async search(query: string, k: number = 5): Promise<Hit[]> {
    // TODO: Implement vector similarity search
    // For now, use simple text search
    const chunks = await this.db.chunks.search(query, k);
    
    return chunks.map(chunk => ({
      id: chunk.id,
      text: chunk.text,
      score: 1.0, // TODO: Calculate real similarity score
      metadata: chunk.metadata
    }));
  }
  
  async getChunk(id: string): Promise<Chunk | null> {
    return this.db.chunks.findById(id);
  }
  
  async deleteChunk(id: string): Promise<boolean> {
    return this.db.chunks.delete(id);
  }
  
  private async generateEmbedding(text: string): Promise<Float32Array> {
    // TODO: Call Ollama API for embeddings
    // For now, return dummy embedding
    return new Float32Array(384).fill(0);
  }
}
`;
  
  await writeFile(
    join(TARGET_DIR, 'src/memory/service.ts'),
    memoryServiceTS
  );
}

async function createConfigFile() {
  const config = `# Bridge Service Configuration
server:
  host: "127.0.0.1"
  port: 3333
  bridge_key: "SECRET"

database:
  path: "./data/bridge.db"

workspace:
  dir: "./workspace"

mcp:
  backend_url: "http://127.0.0.1:3337"
  port: 3337

ai:
  groq:
    api_key: "\${GROQ_API_KEY}"
  ollama:
    url: "http://localhost:11434"

soul:
  enabled: true
  policies:
    write_requires_confirmation: false
    
tiers:
  under:
    enabled: true
    timeout_ms: 400
    allow_llm: false
  core:
    enabled: true
    timeout_ms: 800
    allow_llm: false
  over:
    enabled: true
    timeout_ms: 1600
    allow_llm: true
`;
  
  await writeFile(
    join(TARGET_DIR, 'config/default.yaml'),
    config
  );
}

// Main migration function
async function migrate() {
  console.log('🔄 Starting Bridge Migration...\n');
  
  // 1. Create TypeScript structure
  console.log('📁 Creating directory structure...');
  await createTypeScriptStructure();
  
  // 2. Copy Python files to python/ subdirectory
  console.log('\n📋 Copying Python bridge files...');
  await copyDirectory(
    join(SOURCE_DIR, 'echo_bridge'),
    join(TARGET_DIR, 'python/echo_bridge')
  );
  
  // 3. Copy configuration and manifests
  console.log('\n📋 Copying configuration files...');
  for (const file of config.copyFiles) {
    const src = join(SOURCE_DIR, file);
    const dest = join(TARGET_DIR, file);
    if (existsSync(src)) {
      await ensureDir(dirname(dest));
      await copyFile(src, dest);
      console.log(\`Copied: \${file}\`);
    }
  }
  
  // 4. Create package.json
  console.log('\n📦 Creating package.json...');
  await createPackageJson();
  
  // 5. Create TypeScript services
  console.log('\n🔧 Creating TypeScript services...');
  await createBridgeService();
  await createMemoryService();
  
  // 6. Create default config
  console.log('\n⚙️ Creating default configuration...');
  await createConfigFile();
  
  console.log('\n✅ Migration complete!');
  console.log('\n📋 Next steps:');
  console.log('1. cd packages/bridge');
  console.log('2. bun install');
  console.log('3. pip install -r requirements.txt');
  console.log('4. bun run start:all');
}

// Run migration
migrate().catch(console.error);
