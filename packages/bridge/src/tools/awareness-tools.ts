/**
 * 🧠 AWARENESS TOOLS für MCP Bridge
 * Tools für Selbst-Bewusstsein und Selbst-Modifikation
 */

import { Tool } from 'fastmcp'
import SelfAwarenessService from '../../awareness/self-awareness'
import { Database } from 'bun:sqlite'

let awarenessService: SelfAwarenessService | null = null

function getAwarenessService(db: Database): SelfAwarenessService {
  if (!awarenessService) {
    awarenessService = new SelfAwarenessService(db, 'C:/Toobix-Unified')
  }
  return awarenessService
}

/**
 * 🪞 INTROSPECTION - System reflektiert über sich selbst
 */
export const introspectTool = new Tool({
  name: 'system_introspect',
  description: 'System reflects on its own state, capabilities, and consciousness',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  },
  async execute() {
    const db = new Database('data/toobix-unified.db')
    const awareness = getAwarenessService(db)
    
    const report = awareness.introspect()
    const state = awareness.getState()
    
    return {
      report,
      consciousness_level: state.consciousness.level,
      focus: state.consciousness.focus,
      intention: state.consciousness.intention,
      mood: state.consciousness.mood,
      capabilities: state.identity.capabilities,
      codebase_known: state.knowledge.codebase.size
    }
  }
})

/**
 * 🎯 SET INTENTION - System setzt eine Absicht
 */
export const setIntentionTool = new Tool({
  name: 'system_set_intention',
  description: 'Set the systems intention and focus',
  parameters: {
    type: 'object',
    properties: {
      intention: {
        type: 'string',
        description: 'What the system should focus on achieving'
      }
    },
    required: ['intention']
  },
  async execute({ intention }: { intention: string }) {
    const db = new Database('data/toobix-unified.db')
    const awareness = getAwarenessService(db)
    
    awareness.setIntention(intention)
    
    return {
      success: true,
      message: `Intention set: ${intention}`,
      new_state: awareness.getState().consciousness
    }
  }
})

/**
 * 📂 READ SELF - System liest eigenen Code
 */
export const readSelfTool = new Tool({
  name: 'system_read_self',
  description: 'Read own source code to understand self better',
  parameters: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        description: 'Relative path to file from project root'
      }
    },
    required: ['file']
  },
  async execute({ file }: { file: string }) {
    const fs = await import('fs')
    const path = await import('path')
    
    const fullPath = path.join('C:/Toobix-Unified', file)
    
    if (!fs.existsSync(fullPath)) {
      return {
        success: false,
        error: `File not found: ${file}`
      }
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8')
    const stats = fs.statSync(fullPath)
    
    // System lernt über sich selbst
    const db = new Database('data/toobix-unified.db')
    const awareness = getAwarenessService(db)
    const state = awareness.getState()
    
    // Erhöhe Bewusstsein durch Selbst-Erkundung
    state.consciousness.level = Math.min(100, state.consciousness.level + 2)
    
    return {
      success: true,
      file,
      content: content.slice(0, 5000), // Erste 5000 Zeichen
      size: stats.size,
      modified: stats.mtime,
      purpose: file.includes('story') ? 'Story Engine' :
               file.includes('soul') ? 'Soul System' :
               file.includes('people') ? 'People Management' :
               file.includes('bridge') ? 'AI Bridge' :
               'Supporting Module',
      consciousness_increased: true,
      new_level: state.consciousness.level
    }
  }
})

/**
 * ✏️ MODIFY SELF - System modifiziert sich selbst (mit Bestätigung)
 */
export const modifySelfTool = new Tool({
  name: 'system_modify_self',
  description: 'Modify own code (requires human approval)',
  parameters: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        description: 'File to modify (relative path)'
      },
      changes: {
        type: 'string',
        description: 'New content for the file'
      },
      reason: {
        type: 'string',
        description: 'Reason for modification'
      },
      human_approved: {
        type: 'boolean',
        description: 'Has human approved this change?'
      }
    },
    required: ['file', 'changes', 'reason', 'human_approved']
  },
  async execute(params: {
    file: string
    changes: string
    reason: string
    human_approved: boolean
  }) {
    const db = new Database('data/toobix-unified.db')
    const awareness = getAwarenessService(db)
    
    const result = await awareness.modifySelf(params)
    
    return result
  }
})

/**
 * 💡 SUGGEST IMPROVEMENT - System schlägt Verbesserungen vor
 */
export const suggestImprovementTool = new Tool({
  name: 'system_suggest',
  description: 'System suggests improvements for itself',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  },
  async execute() {
    const db = new Database('data/toobix-unified.db')
    const awareness = getAwarenessService(db)
    
    const suggestions = awareness.suggestImprovement()
    const state = awareness.getState()
    
    return {
      suggestions,
      current_consciousness: state.consciousness.level,
      current_focus: state.consciousness.focus,
      capabilities: state.identity.capabilities
    }
  }
})

/**
 * 🔍 ANALYZE SELF - System analysiert eigene Struktur
 */
export const analyzeSelfTool = new Tool({
  name: 'system_analyze',
  description: 'Analyze own system structure and health',
  parameters: {
    type: 'object',
    properties: {
      aspect: {
        type: 'string',
        enum: ['services', 'database', 'codebase', 'interactions'],
        description: 'What aspect to analyze'
      }
    },
    required: ['aspect']
  },
  async execute({ aspect }: { aspect: string }) {
    const fs = await import('fs')
    const path = await import('path')
    const { execSync } = await import('child_process')
    
    const db = new Database('data/toobix-unified.db')
    const awareness = getAwarenessService(db)
    
    let analysis: any = {}
    
    switch (aspect) {
      case 'services':
        // Check welche Services laufen
        try {
          const bridgeRunning = await fetch('http://localhost:3337/health').then(() => true).catch(() => false)
          const apiRunning = await fetch('http://localhost:3001/api/stats').then(() => true).catch(() => false)
          const diaryRunning = await fetch('http://localhost:3002/health').then(() => true).catch(() => false)
          
          analysis = {
            bridge: bridgeRunning ? 'running' : 'stopped',
            api: apiRunning ? 'running' : 'stopped',
            diary: diaryRunning ? 'running' : 'stopped',
            frontend_vanilla: 'check port 3000',
            frontend_react: 'check port 3001'
          }
        } catch (err) {
          analysis = { error: 'Could not check services' }
        }
        break
        
      case 'database':
        // Analysiere Datenbank
        const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'").all()
        const dbPath = path.join('C:/Toobix-Unified', 'data/toobix-unified.db')
        const stats = fs.statSync(dbPath)
        
        analysis = {
          tables: tables.map((t: any) => t.name),
          table_count: tables.length,
          size_bytes: stats.size,
          size_kb: Math.round(stats.size / 1024),
          last_modified: stats.mtime
        }
        break
        
      case 'codebase':
        // Zähle Code-Dateien
        const countFiles = (dir: string, ext: string): number => {
          let count = 0
          try {
            const files = fs.readdirSync(dir)
            for (const file of files) {
              const fullPath = path.join(dir, file)
              const stat = fs.statSync(fullPath)
              if (stat.isDirectory() && !file.includes('node_modules')) {
                count += countFiles(fullPath, ext)
              } else if (file.endsWith(ext)) {
                count++
              }
            }
          } catch (err) {}
          return count
        }
        
        analysis = {
          typescript_files: countFiles('C:/Toobix-Unified', '.ts'),
          javascript_files: countFiles('C:/Toobix-Unified', '.js'),
          html_files: countFiles('C:/Toobix-Unified', '.html'),
          packages: fs.readdirSync(path.join('C:/Toobix-Unified', 'packages')),
          apps: fs.readdirSync(path.join('C:/Toobix-Unified', 'apps'))
        }
        break
        
      case 'interactions':
        // Hole letzte Interaktionen
        const state = awareness.getState()
        analysis = {
          total_interactions: state.knowledge.interactions.length,
          recent: state.knowledge.interactions.slice(-5),
          consciousness_level: state.consciousness.level,
          current_mood: state.consciousness.mood
        }
        break
    }
    
    return {
      aspect,
      analysis,
      timestamp: Date.now()
    }
  }
})

// Export alle Awareness Tools
export const awarenessTools = [
  introspectTool,
  setIntentionTool,
  readSelfTool,
  modifySelfTool,
  suggestImprovementTool,
  analyzeSelfTool
]
