/**
 * 🔍 CODE ANALYZER
 * Analyzes and understands own source code
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

export interface CodeFile {
  path: string
  relativePath: string
  content: string
  language: string
  size: number
  lines: number
}

export interface CodeFunction {
  name: string
  file: string
  lineStart: number
  lineEnd: number
  parameters: string[]
  returnType?: string
  description?: string
  complexity: number
}

export interface CodeModule {
  name: string
  path: string
  exports: string[]
  imports: string[]
  functions: CodeFunction[]
  classes: string[]
  interfaces: string[]
}

export interface CodebaseAnalysis {
  totalFiles: number
  totalLines: number
  totalFunctions: number
  modules: CodeModule[]
  dependencies: Record<string, string[]>
  structure: any
}

export class CodeAnalyzer {
  private baseDir: string
  private excludeDirs = ['node_modules', 'dist', 'build', '.git', 'migrations']
  
  constructor(baseDir: string) {
    this.baseDir = baseDir
  }
  
  /**
   * 📊 ANALYZE ENTIRE CODEBASE
   */
  async analyzeCodebase(targetDir: string = this.baseDir): Promise<CodebaseAnalysis> {
    console.log('🔍 Starting codebase analysis...')
    
    const files = this.findSourceFiles(targetDir)
    const modules: CodeModule[] = []
    let totalLines = 0
    let totalFunctions = 0
    
    for (const file of files) {
      const module = await this.analyzeFile(file)
      modules.push(module)
      
      const content = readFileSync(file.path, 'utf-8')
      totalLines += content.split('\n').length
      totalFunctions += module.functions.length
    }
    
    const dependencies = this.buildDependencyGraph(modules)
    const structure = this.buildStructure(modules)
    
    return {
      totalFiles: files.length,
      totalLines,
      totalFunctions,
      modules,
      dependencies,
      structure
    }
  }
  
  /**
   * 📁 FIND ALL SOURCE FILES
   */
  private findSourceFiles(dir: string, files: CodeFile[] = []): CodeFile[] {
    const entries = readdirSync(dir)
    
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        if (!this.excludeDirs.includes(entry)) {
          this.findSourceFiles(fullPath, files)
        }
      } else if (stat.isFile()) {
        const ext = entry.split('.').pop()
        if (ext === 'ts' || ext === 'js' || ext === 'tsx' || ext === 'jsx') {
          const content = readFileSync(fullPath, 'utf-8')
          files.push({
            path: fullPath,
            relativePath: relative(this.baseDir, fullPath),
            content,
            language: ext,
            size: stat.size,
            lines: content.split('\n').length
          })
        }
      }
    }
    
    return files
  }
  
  /**
   * 🔬 ANALYZE SINGLE FILE
   */
  private async analyzeFile(file: CodeFile): Promise<CodeModule> {
    const content = file.content
    const lines = content.split('\n')
    
    // Extract exports
    const exports = this.extractExports(content)
    
    // Extract imports
    const imports = this.extractImports(content)
    
    // Extract functions
    const functions = this.extractFunctions(content, file.path)
    
    // Extract classes
    const classes = this.extractClasses(content)
    
    // Extract interfaces
    const interfaces = this.extractInterfaces(content)
    
    return {
      name: file.relativePath.replace(/\.(ts|js|tsx|jsx)$/, ''),
      path: file.path,
      exports,
      imports,
      functions,
      classes,
      interfaces
    }
  }
  
  /**
   * 📤 EXTRACT EXPORTS
   */
  private extractExports(content: string): string[] {
    const exports: string[] = []
    
    // Export classes/functions/interfaces
    const exportRegex = /export\s+(class|function|interface|const|let|var|type|enum)\s+(\w+)/g
    let match
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[2])
    }
    
    // Export { ... }
    const namedExportRegex = /export\s*\{([^}]+)\}/g
    while ((match = namedExportRegex.exec(content)) !== null) {
      const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0])
      exports.push(...names)
    }
    
    return exports
  }
  
  /**
   * 📥 EXTRACT IMPORTS
   */
  private extractImports(content: string): string[] {
    const imports: string[] = []
    
    const importRegex = /import\s+.+\s+from\s+['"]([^'"]+)['"]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1])
    }
    
    return imports
  }
  
  /**
   * 🔧 EXTRACT FUNCTIONS
   */
  private extractFunctions(content: string, filePath: string): CodeFunction[] {
    const functions: CodeFunction[] = []
    const lines = content.split('\n')
    
    // Find function declarations
    const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?/g
    let match
    while ((match = functionRegex.exec(content)) !== null) {
      const name = match[1]
      const params = match[2].split(',').map(p => p.trim().split(':')[0].trim()).filter(p => p)
      const returnType = match[3]?.trim()
      
      const lineStart = content.substring(0, match.index).split('\n').length
      
      // Find end of function (simple heuristic)
      let braceCount = 0
      let lineEnd = lineStart
      let foundStart = false
      
      for (let i = lineStart - 1; i < lines.length; i++) {
        const line = lines[i]
        for (const char of line) {
          if (char === '{') {
            braceCount++
            foundStart = true
          }
          if (char === '}') braceCount--
        }
        if (foundStart && braceCount === 0) {
          lineEnd = i + 1
          break
        }
      }
      
      functions.push({
        name,
        file: filePath,
        lineStart,
        lineEnd,
        parameters: params,
        returnType,
        complexity: this.calculateComplexity(lines.slice(lineStart - 1, lineEnd).join('\n'))
      })
    }
    
    // Find method declarations in classes
    const methodRegex = /(?:async\s+)?(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{/g
    while ((match = methodRegex.exec(content)) !== null) {
      const name = match[1]
      if (name === 'if' || name === 'for' || name === 'while' || name === 'switch') continue
      
      const params = match[2].split(',').map(p => p.trim().split(':')[0].trim()).filter(p => p)
      const returnType = match[3]?.trim()
      
      const lineStart = content.substring(0, match.index).split('\n').length
      
      // Check if already added
      if (functions.some(f => f.name === name && f.lineStart === lineStart)) continue
      
      let braceCount = 0
      let lineEnd = lineStart
      let foundStart = false
      
      for (let i = lineStart - 1; i < lines.length; i++) {
        const line = lines[i]
        for (const char of line) {
          if (char === '{') {
            braceCount++
            foundStart = true
          }
          if (char === '}') braceCount--
        }
        if (foundStart && braceCount === 0) {
          lineEnd = i + 1
          break
        }
      }
      
      functions.push({
        name,
        file: filePath,
        lineStart,
        lineEnd,
        parameters: params,
        returnType,
        complexity: this.calculateComplexity(lines.slice(lineStart - 1, lineEnd).join('\n'))
      })
    }
    
    return functions
  }
  
  /**
   * 🏛️ EXTRACT CLASSES
   */
  private extractClasses(content: string): string[] {
    const classes: string[] = []
    
    const classRegex = /(?:export\s+)?class\s+(\w+)/g
    let match
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1])
    }
    
    return classes
  }
  
  /**
   * 📋 EXTRACT INTERFACES
   */
  private extractInterfaces(content: string): string[] {
    const interfaces: string[] = []
    
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/g
    let match
    while ((match = interfaceRegex.exec(content)) !== null) {
      interfaces.push(match[1])
    }
    
    return interfaces
  }
  
  /**
   * 📊 CALCULATE COMPLEXITY (Cyclomatic Complexity approximation)
   */
  private calculateComplexity(code: string): number {
    let complexity = 1 // Base complexity
    
    // Count decision points
    const decisions = [
      /\bif\b/g,
      /\belse\s+if\b/g,
      /\bfor\b/g,
      /\bwhile\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\&\&/g,
      /\|\|/g,
      /\?/g
    ]
    
    for (const pattern of decisions) {
      const matches = code.match(pattern)
      if (matches) complexity += matches.length
    }
    
    return complexity
  }
  
  /**
   * 🕸️ BUILD DEPENDENCY GRAPH
   */
  private buildDependencyGraph(modules: CodeModule[]): Record<string, string[]> {
    const graph: Record<string, string[]> = {}
    
    for (const module of modules) {
      graph[module.name] = module.imports.filter(imp => !imp.startsWith('.'))
    }
    
    return graph
  }
  
  /**
   * 🏗️ BUILD STRUCTURE
   */
  private buildStructure(modules: CodeModule[]): any {
    const structure: any = {}
    
    for (const module of modules) {
      const parts = module.name.split(/[/\\]/)
      let current = structure
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {}
        }
        current = current[parts[i]]
      }
      
      current[parts[parts.length - 1]] = {
        exports: module.exports.length,
        functions: module.functions.length,
        classes: module.classes.length,
        interfaces: module.interfaces.length
      }
    }
    
    return structure
  }
  
  /**
   * 🔎 FIND FUNCTION BY NAME
   */
  async findFunction(name: string): Promise<CodeFunction | null> {
    const analysis = await this.analyzeCodebase()
    
    for (const module of analysis.modules) {
      const func = module.functions.find(f => f.name === name)
      if (func) return func
    }
    
    return null
  }
  
  /**
   * 📖 READ FUNCTION CODE
   */
  async readFunctionCode(func: CodeFunction): Promise<string> {
    const content = readFileSync(func.file, 'utf-8')
    const lines = content.split('\n')
    return lines.slice(func.lineStart - 1, func.lineEnd).join('\n')
  }
}
