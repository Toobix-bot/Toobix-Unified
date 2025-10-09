import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import type { BridgeConfig } from '../types'

// Lightweight YAML reader for a few known fields without adding deps
function readDefaultYaml(rootDir: string): {
  serverPort?: number
  dbPath?: string
  groqKey?: string
} {
  try {
    const yamlPath = resolve(rootDir, 'packages/bridge/config/default.yaml')
    if (!existsSync(yamlPath)) return {}
    const raw = readFileSync(yamlPath, 'utf8')

    // Extract server.port
    let serverPort: number | undefined
    const serverMatch = raw.match(/server:\s*[\r\n]+[^\S\r\n]*port:\s*(\d+)/)
    if (serverMatch) serverPort = parseInt(serverMatch[1], 10)

    // Extract database.path
    let dbPath: string | undefined
    const dbMatch = raw.match(/database:\s*[\r\n]+[^\S\r\n]*path:\s*"?([^"\r\n]+)"?/)
    if (dbMatch) dbPath = dbMatch[1]

    // Extract ai.groq.apiKey
    let groqKey: string | undefined
    const keyMatch = raw.match(/ai:\s*[\r\n]+[^\S\r\n]*groq:\s*[\r\n]+[^\S\r\n]*apiKey:\s*"?([^"\r\n]+)"?/)
    if (keyMatch) {
      const val = keyMatch[1].trim()
      if (val.startsWith('${') && val.endsWith('}')) {
        // env placeholder like ${GROQ_API_KEY}
        const envName = val.slice(2, -1)
        groqKey = process.env[envName]
      } else {
        groqKey = val
      }
    }

    return { serverPort, dbPath, groqKey }
  } catch {
    return {}
  }
}

export function loadBridgeConfig(): BridgeConfig {
  const workspaceRoot = process.cwd().includes('packages')
    ? process.cwd().split('packages')[0]
    : process.cwd()

  const yaml = readDefaultYaml(workspaceRoot)

  const port = Number(process.env.MCP_PORT || process.env.BRIDGE_PORT) || yaml.serverPort || 3337
  const database = process.env.DATABASE_PATH || yaml.dbPath || 'data/toobix-unified.db'
  const groqApiKey = process.env.GROQ_API_KEY || yaml.groqKey || ''

  return { port, database, groqApiKey }
}

