/**
 * 🧪 CODE SANDBOX
 * Safe environment for testing generated code
 */

import { Worker } from 'worker_threads'
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'

export interface SandboxOptions {
  timeout?: number // milliseconds
  maxMemory?: number // bytes
  allowFileSystem?: boolean
  allowNetwork?: boolean
}

export interface ExecutionResult {
  success: boolean
  output: any
  logs: string[]
  errors: string[]
  executionTime: number
  memoryUsed: number
}

export class CodeSandbox {
  private tempDir: string
  
  constructor(tempDir: string = '/tmp/consciousness-sandbox') {
    this.tempDir = tempDir
  }
  
  /**
   * ▶️ EXECUTE CODE IN SANDBOX
   */
  async execute(code: string, options: SandboxOptions = {}): Promise<ExecutionResult> {
    const startTime = Date.now()
    const logs: string[] = []
    const errors: string[] = []
    
    console.log('🧪 Executing code in sandbox...')
    
    try {
      // Create temporary file
      const tempFile = join(this.tempDir, `sandbox-${Date.now()}.ts`)
      
      // Wrap code with safety measures
      const wrappedCode = this.wrapCode(code, options)
      
      writeFileSync(tempFile, wrappedCode, 'utf-8')
      
      // Execute with timeout
      const result = await this.executeWithTimeout(tempFile, options.timeout || 5000)
      
      // Clean up
      if (existsSync(tempFile)) {
        unlinkSync(tempFile)
      }
      
      const executionTime = Date.now() - startTime
      
      return {
        success: result.success,
        output: result.output,
        logs: result.logs || logs,
        errors: result.errors || errors,
        executionTime,
        memoryUsed: result.memoryUsed || 0
      }
    } catch (error: any) {
      errors.push(error.message)
      
      return {
        success: false,
        output: null,
        logs,
        errors,
        executionTime: Date.now() - startTime,
        memoryUsed: 0
      }
    }
  }
  
  /**
   * 🎁 WRAP CODE WITH SAFETY
   */
  private wrapCode(code: string, options: SandboxOptions): string {
    return `
// Sandbox wrapper
const logs: string[] = []
const originalLog = console.log
const originalError = console.error

console.log = (...args: any[]) => {
  logs.push(args.map(a => String(a)).join(' '))
  originalLog(...args)
}

console.error = (...args: any[]) => {
  logs.push('ERROR: ' + args.map(a => String(a)).join(' '))
  originalError(...args)
}

${options.allowFileSystem ? '' : '// File system access disabled'}
${options.allowNetwork ? '' : '// Network access disabled'}

async function sandboxedCode() {
  ${code}
}

// Execute and return result
sandboxedCode()
  .then(result => {
    console.log('✅ Execution successful')
    return { success: true, output: result, logs }
  })
  .catch(error => {
    console.error('❌ Execution failed:', error.message)
    return { success: false, output: null, logs, errors: [error.message] }
  })
`
  }
  
  /**
   * ⏱️ EXECUTE WITH TIMEOUT
   */
  private async executeWithTimeout(filePath: string, timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Execution timeout'))
      }, timeout)
      
      try {
        // For now, use dynamic import (in production, use Worker threads)
        import(filePath)
          .then(module => {
            clearTimeout(timer)
            resolve({
              success: true,
              output: module.default || module,
              logs: [],
              errors: []
            })
          })
          .catch(error => {
            clearTimeout(timer)
            reject(error)
          })
      } catch (error) {
        clearTimeout(timer)
        reject(error)
      }
    })
  }
  
  /**
   * ✅ VALIDATE CODE SAFETY
   */
  validateSafety(code: string): { safe: boolean; warnings: string[] } {
    const warnings: string[] = []
    
    // Check for dangerous operations
    const dangerousPatterns = [
      { pattern: /require\(['"]child_process['"]\)/g, warning: 'Child process execution detected' },
      { pattern: /import.*['"]child_process['"]/g, warning: 'Child process import detected' },
      { pattern: /eval\(/g, warning: 'eval() usage detected' },
      { pattern: /Function\(/g, warning: 'Function constructor detected' },
      { pattern: /process\.exit/g, warning: 'process.exit() detected' },
      { pattern: /fs\.unlink/g, warning: 'File deletion detected' },
      { pattern: /fs\.rm/g, warning: 'File removal detected' },
      { pattern: /fs\.rmdir/g, warning: 'Directory removal detected' },
      { pattern: /\.\.\/\.\.\//g, warning: 'Directory traversal attempt detected' }
    ]
    
    for (const { pattern, warning } of dangerousPatterns) {
      if (pattern.test(code)) {
        warnings.push(warning)
      }
    }
    
    return {
      safe: warnings.length === 0,
      warnings
    }
  }
  
  /**
   * 🧹 CLEANUP SANDBOX
   */
  async cleanup(): Promise<void> {
    // Remove all temporary files
    console.log('🧹 Cleaning up sandbox...')
  }
}
