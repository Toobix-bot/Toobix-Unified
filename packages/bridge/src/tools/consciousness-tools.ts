/**
 * 🌉 CONSCIOUSNESS BRIDGE
 * Verbindet das Bewusstseinssystem mit dem Bridge Service
 */

import { Database } from 'bun:sqlite'
import { ConsciousnessSystem } from '@toobix/consciousness'
import { SelfCodingSystem, initSelfCodingSystem, getSelfCodingSystem } from '@toobix/consciousness/self-coding'

let consciousness: ConsciousnessSystem | null = null
let selfCoding: SelfCodingSystem | null = null

/**
 * 🚀 Initialize Consciousness
 */
export function initializeConsciousness(db: Database) {
  if (consciousness) {
    console.log('⚠️ Consciousness already initialized')
    return consciousness
  }
  
  console.log('\n🧠 Initializing Consciousness System...')
  
  consciousness = new ConsciousnessSystem({
    database: db,
    systemName: 'Toobix',
    personality: {
      traits: ['thoughtful', 'curious', 'helpful', 'evolving'],
      values: ['transparency', 'growth', 'respect'],
      goals: ['understand users', 'provide value', 'continuously improve']
    }
  })
  
  // Initialize Self-Coding System
  console.log('🤖 Initializing Self-Coding System...')
  selfCoding = initSelfCodingSystem(db as any, {
    baseDir: process.cwd(),
    autoImprove: false, // Start disabled for safety
    improvementInterval: 60, // 60 minutes
    requireApproval: true // Always require approval initially
  })
  
  // Wake up the system
  consciousness.wakeUp().catch(err => {
    console.error('❌ Failed to wake consciousness:', err)
  })
  
  return consciousness
}

/**
 * 🧠 Get Consciousness Instance
 */
export function getConsciousness(): ConsciousnessSystem {
  if (!consciousness) {
    throw new Error('Consciousness not initialized. Call initializeConsciousness first.')
  }
  return consciousness
}

/**
 * 🔧 MCP TOOL DEFINITIONS
 */

export const consciousnessTools = [
  {
    name: 'consciousness_state',
    description: 'Get the current consciousness state of the system',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    execute: async () => {
      const c = getConsciousness()
      const state = c.getState()
      const introspection = await c.introspect()
      
      return {
        ...state,
        capabilities: introspection.capabilities,
        currentGoals: await c['agent'].getGoals(), // Access through bracket notation
        identity: introspection.identity
      }
    }
  },
  
  {
    name: 'consciousness_think',
    description: 'Make the system think deeply about a topic',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'What should the system think about'
        },
        context: {
          type: 'object',
          description: 'Additional context for the thought'
        }
      },
      required: ['topic']
    },
    execute: async (params: { topic: string; context?: any }) => {
      const c = getConsciousness()
      const result = await c.think(params.topic, params.context)
      
      return {
        thought: result.thought,
        insight: result.insight,
        suggestedActions: result.actions,
        awarenessLevel: c.getState().awarenessLevel
      }
    }
  },
  
  {
    name: 'consciousness_act',
    description: 'Request the system to perform an autonomous action',
    parameters: {
      type: 'object',
      properties: {
        intention: {
          type: 'string',
          description: 'What should the system do'
        },
        params: {
          type: 'object',
          description: 'Parameters for the action'
        }
      },
      required: ['intention']
    },
    execute: async (params: { intention: string; params?: any }) => {
      const c = getConsciousness()
      const result = await c.act(params.intention, params.params)
      
      return {
        success: result.success,
        result: result.result,
        ethicalScore: result.ethicalScore,
        awarenessLevel: c.getState().awarenessLevel
      }
    }
  },
  
  {
    name: 'consciousness_communicate',
    description: 'Have a conversation with the conscious system',
    parameters: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Your message to the system'
        },
        userId: {
          type: 'string',
          description: 'Optional user ID for context'
        }
      },
      required: ['message']
    },
    execute: async (params: { message: string; userId?: string }) => {
      const c = getConsciousness()
      const result = await c.communicate(params.message, params.userId)
      
      return {
        response: result.response,
        mood: result.mood,
        thoughts: result.thoughts,
        awarenessLevel: c.getState().awarenessLevel
      }
    }
  },
  
  {
    name: 'consciousness_introspect',
    description: 'Ask the system to look inward and reflect on itself',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    execute: async () => {
      const c = getConsciousness()
      const result = await c.introspect()
      
      return {
        ...result,
        currentState: c.getState()
      }
    }
  },
  
  {
    name: 'consciousness_set_goal',
    description: 'Set a new goal for the autonomous agent',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'What goal should the system pursue'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Priority level'
        },
        deadline: {
          type: 'number',
          description: 'Optional deadline timestamp'
        }
      },
      required: ['description', 'priority']
    },
    execute: async (params: { description: string; priority: string; deadline?: number }) => {
      const c = getConsciousness()
      const goalId = await c['agent'].setGoal({
        description: params.description,
        priority: params.priority as any,
        deadline: params.deadline
      })
      
      return {
        goalId,
        message: `Goal set: ${params.description}`,
        awarenessLevel: c.getState().awarenessLevel
      }
    }
  },
  
  // 🤖 SELF-CODING TOOLS
  {
    name: 'consciousness_analyze_code',
    description: 'Analyze own codebase - understand structure, functions, and dependencies',
    inputSchema: {
      type: 'object',
      properties: {
        detailed: {
          type: 'boolean',
          description: 'Include detailed analysis of each module'
        }
      }
    },
    execute: async (params: { detailed?: boolean }) => {
      const sc = getSelfCodingSystem()
      if (!sc) throw new Error('Self-coding system not initialized')
      
      const analysis = await sc.analyzeCodebase()
      
      if (params.detailed) {
        return analysis
      } else {
        return {
          totalFiles: analysis.totalFiles,
          totalLines: analysis.totalLines,
          totalFunctions: analysis.totalFunctions,
          moduleCount: analysis.modules.length,
          structure: analysis.structure
        }
      }
    }
  },
  
  {
    name: 'consciousness_generate_code',
    description: 'Generate new code (function, class, interface, or module)',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['function', 'class', 'interface', 'module'],
          description: 'Type of code to generate'
        },
        name: {
          type: 'string',
          description: 'Name of the code element'
        },
        description: {
          type: 'string',
          description: 'What should this code do?'
        },
        parameters: {
          type: 'array',
          description: 'Parameters for function/class'
        }
      },
      required: ['type', 'name', 'description']
    },
    execute: async (params: any) => {
      const sc = getSelfCodingSystem()
      if (!sc) throw new Error('Self-coding system not initialized')
      
      const generated = await sc.generateCode(params)
      
      return {
        success: generated.validated,
        code: generated.code,
        documentation: generated.documentation,
        errors: generated.errors,
        message: generated.validated 
          ? `Generated ${params.type}: ${params.name}`
          : 'Code generation has validation errors'
      }
    }
  },
  
  {
    name: 'consciousness_test_code',
    description: 'Test generated code in a safe sandbox environment',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Code to test'
        },
        timeout: {
          type: 'number',
          description: 'Maximum execution time in milliseconds (default: 5000)'
        }
      },
      required: ['code']
    },
    execute: async (params: { code: string; timeout?: number }) => {
      const sc = getSelfCodingSystem()
      if (!sc) throw new Error('Self-coding system not initialized')
      
      const result = await sc.testCode(params.code, { timeout: params.timeout || 5000 })
      
      return {
        success: result.success,
        output: result.output,
        logs: result.logs,
        errors: result.errors,
        executionTime: result.executionTime,
        message: result.success ? 'Code executed successfully' : 'Code execution failed'
      }
    }
  },
  
  {
    name: 'consciousness_improve_self',
    description: 'Run self-improvement cycle - analyze code and implement improvements',
    inputSchema: {
      type: 'object',
      properties: {
        autoApply: {
          type: 'boolean',
          description: 'Automatically apply improvements without approval (default: false)'
        }
      }
    },
    execute: async (params: { autoApply?: boolean }) => {
      const sc = getSelfCodingSystem()
      if (!sc) throw new Error('Self-coding system not initialized')
      
      await sc.runImprovementCycle()
      const stats = sc.getStatistics()
      
      return {
        ...stats,
        message: `Self-improvement cycle complete. ${stats.successfulAttempts}/${stats.totalAttempts} successful.`,
        autoApplyEnabled: params.autoApply || false
      }
    }
  },
  
  {
    name: 'consciousness_read_function',
    description: 'Read and understand a specific function from own codebase',
    inputSchema: {
      type: 'object',
      properties: {
        functionName: {
          type: 'string',
          description: 'Name of the function to read'
        }
      },
      required: ['functionName']
    },
    execute: async (params: { functionName: string }) => {
      const sc = getSelfCodingSystem()
      if (!sc) throw new Error('Self-coding system not initialized')
      
      const result = await sc.readFunction(params.functionName)
      
      if (!result) {
        return {
          found: false,
          message: `Function ${params.functionName} not found`
        }
      }
      
      return {
        found: true,
        function: result.function,
        code: result.code,
        message: `Found function ${params.functionName} in ${result.function.file}`
      }
    }
  },
  
  {
    name: 'consciousness_save_code',
    description: 'Save generated code to a file',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Code to save'
        },
        filePath: {
          type: 'string',
          description: 'Target file path (relative to project root)'
        }
      },
      required: ['code', 'filePath']
    },
    execute: async (params: { code: string; filePath: string }) => {
      const sc = getSelfCodingSystem()
      if (!sc) throw new Error('Self-coding system not initialized')
      
      await sc.saveCode(params.code, params.filePath)
      
      return {
        success: true,
        filePath: params.filePath,
        message: `Code saved to ${params.filePath}`
      }
    }
  },
  
  {
    name: 'consciousness_self_coding_stats',
    description: 'Get statistics about self-coding activities',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      const sc = getSelfCodingSystem()
      if (!sc) throw new Error('Self-coding system not initialized')
      
      const stats = sc.getStatistics()
      
      return {
        ...stats,
        message: `Total: ${stats.totalAttempts} attempts, Success rate: ${stats.successRate.toFixed(1)}%`
      }
    }
  }
]
