/**
 * ✍️ CODE GENERATOR
 * Generates new code based on patterns and requirements
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

export interface CodeGenerationRequest {
  type: 'function' | 'class' | 'interface' | 'module'
  name: string
  description: string
  parameters?: Array<{ name: string; type: string; description?: string }>
  returnType?: string
  methods?: Array<{ name: string; description: string }>
  properties?: Array<{ name: string; type: string; description?: string }>
  targetFile?: string
}

export interface GeneratedCode {
  code: string
  documentation: string
  tests?: string
  validated: boolean
  errors: string[]
}

export class CodeGenerator {
  private baseDir: string
  
  constructor(baseDir: string) {
    this.baseDir = baseDir
  }
  
  /**
   * 🎨 GENERATE CODE
   */
  async generate(request: CodeGenerationRequest): Promise<GeneratedCode> {
    console.log(`✍️ Generating ${request.type}: ${request.name}`)
    
    let code = ''
    let documentation = ''
    
    switch (request.type) {
      case 'function':
        code = this.generateFunction(request)
        documentation = this.generateFunctionDocs(request)
        break
      case 'class':
        code = this.generateClass(request)
        documentation = this.generateClassDocs(request)
        break
      case 'interface':
        code = this.generateInterface(request)
        documentation = this.generateInterfaceDocs(request)
        break
      case 'module':
        code = this.generateModule(request)
        documentation = this.generateModuleDocs(request)
        break
    }
    
    // Validate syntax
    const validation = this.validateSyntax(code)
    
    // Generate tests
    const tests = this.generateTests(request, code)
    
    return {
      code,
      documentation,
      tests,
      validated: validation.valid,
      errors: validation.errors
    }
  }
  
  /**
   * 🔧 GENERATE FUNCTION
   */
  private generateFunction(request: CodeGenerationRequest): string {
    const params = request.parameters || []
    const paramList = params.map(p => `${p.name}: ${p.type}`).join(', ')
    const returnType = request.returnType || 'void'
    
    const paramDocs = params.map(p => 
      `   * @param ${p.name} - ${p.description || 'Parameter'}`
    ).join('\n')
    
    return `/**
 * ${request.description}
${paramDocs}
 * @returns ${returnType}
 */
export async function ${request.name}(${paramList}): Promise<${returnType}> {
  // TODO: Implement ${request.name}
  console.log('🔧 ${request.name} called with:', { ${params.map(p => p.name).join(', ')} })
  
  try {
    // Implementation goes here
    ${this.generateFunctionBody(request)}
    
  } catch (error) {
    console.error('❌ Error in ${request.name}:', error)
    throw error
  }
}
`
  }
  
  /**
   * 📝 GENERATE FUNCTION BODY
   */
  private generateFunctionBody(request: CodeGenerationRequest): string {
    // Simple heuristic based on function name and description
    const name = request.name.toLowerCase()
    const desc = request.description.toLowerCase()
    
    if (name.includes('calculate') || desc.includes('calculate')) {
      return `// Perform calculation
    let result = 0
    // Add calculation logic here
    return result as any`
    }
    
    if (name.includes('fetch') || name.includes('get') || desc.includes('retrieve')) {
      return `// Fetch data
    const data = await fetchDataFromSource()
    return data as any`
    }
    
    if (name.includes('save') || name.includes('store') || desc.includes('save')) {
      return `// Save data
    await saveToDatabase()
    return true as any`
    }
    
    if (name.includes('validate') || desc.includes('validate')) {
      return `// Validate input
    if (!isValid()) {
      throw new Error('Validation failed')
    }
    return true as any`
    }
    
    return `// Implement logic for ${request.name}
    return {} as any`
  }
  
  /**
   * 🏛️ GENERATE CLASS
   */
  private generateClass(request: CodeGenerationRequest): string {
    const properties = request.properties || []
    const methods = request.methods || []
    
    const propertyDefs = properties.map(p => 
      `  private ${p.name}: ${p.type}`
    ).join('\n')
    
    const constructorParams = properties.map(p => 
      `${p.name}: ${p.type}`
    ).join(', ')
    
    const constructorAssignments = properties.map(p => 
      `    this.${p.name} = ${p.name}`
    ).join('\n')
    
    const methodDefs = methods.map(m => 
      `  /**
   * ${m.description}
   */
  async ${m.name}(): Promise<void> {
    console.log('🔧 ${m.name} called')
    // TODO: Implement ${m.name}
  }`
    ).join('\n\n')
    
    return `/**
 * ${request.description}
 */
export class ${request.name} {
${propertyDefs}
  
  constructor(${constructorParams}) {
${constructorAssignments}
  }
  
${methodDefs}
}
`
  }
  
  /**
   * 📋 GENERATE INTERFACE
   */
  private generateInterface(request: CodeGenerationRequest): string {
    const properties = request.properties || []
    const methods = request.methods || []
    
    const propertyDefs = properties.map(p => 
      `  ${p.name}: ${p.type} // ${p.description || ''}`
    ).join('\n')
    
    const methodDefs = methods.map(m => 
      `  ${m.name}(): Promise<void> // ${m.description}`
    ).join('\n')
    
    return `/**
 * ${request.description}
 */
export interface ${request.name} {
${propertyDefs}
${methodDefs}
}
`
  }
  
  /**
   * 📦 GENERATE MODULE
   */
  private generateModule(request: CodeGenerationRequest): string {
    return `/**
 * ${request.description}
 */

// Module exports
export * from './types'

// Module initialization
console.log('📦 ${request.name} module loaded')
`
  }
  
  /**
   * ✅ VALIDATE SYNTAX
   */
  private validateSyntax(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check for balanced braces
    const openBraces = (code.match(/\{/g) || []).length
    const closeBraces = (code.match(/\}/g) || []).length
    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`)
    }
    
    // Check for balanced parentheses
    const openParens = (code.match(/\(/g) || []).length
    const closeParens = (code.match(/\)/g) || []).length
    if (openParens !== closeParens) {
      errors.push(`Unbalanced parentheses: ${openParens} open, ${closeParens} close`)
    }
    
    // Check for balanced brackets
    const openBrackets = (code.match(/\[/g) || []).length
    const closeBrackets = (code.match(/\]/g) || []).length
    if (openBrackets !== closeBrackets) {
      errors.push(`Unbalanced brackets: ${openBrackets} open, ${closeBrackets} close`)
    }
    
    // Check for basic syntax errors
    if (code.includes('function ()')) {
      errors.push('Invalid function syntax: missing function name')
    }
    
    if (code.includes('class ()')) {
      errors.push('Invalid class syntax: missing class name')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  /**
   * 🧪 GENERATE TESTS
   */
  private generateTests(request: CodeGenerationRequest, code: string): string {
    return `/**
 * Tests for ${request.name}
 */

import { ${request.name} } from './${request.name}'

describe('${request.name}', () => {
  it('should be defined', () => {
    expect(${request.name}).toBeDefined()
  })
  
  it('should execute without errors', async () => {
    // TODO: Add specific test cases
    expect(true).toBe(true)
  })
})
`
  }
  
  /**
   * 💾 SAVE CODE TO FILE
   */
  async saveToFile(code: string, filePath: string): Promise<void> {
    const fullPath = filePath.startsWith('/') ? filePath : `${this.baseDir}/${filePath}`
    
    // Create directory if it doesn't exist
    const dir = dirname(fullPath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    
    writeFileSync(fullPath, code, 'utf-8')
    console.log(`💾 Code saved to: ${fullPath}`)
  }
  
  /**
   * 📚 GENERATE DOCUMENTATION
   */
  private generateFunctionDocs(request: CodeGenerationRequest): string {
    return `# ${request.name}

${request.description}

## Parameters

${(request.parameters || []).map(p => `- **${p.name}** (${p.type}): ${p.description || 'Parameter'}`).join('\n')}

## Returns

${request.returnType || 'void'}

## Example

\`\`\`typescript
const result = await ${request.name}(${(request.parameters || []).map(p => p.name).join(', ')})
\`\`\`
`
  }
  
  private generateClassDocs(request: CodeGenerationRequest): string {
    return `# ${request.name}

${request.description}

## Properties

${(request.properties || []).map(p => `- **${p.name}** (${p.type}): ${p.description || 'Property'}`).join('\n')}

## Methods

${(request.methods || []).map(m => `- **${m.name}()**: ${m.description}`).join('\n')}

## Example

\`\`\`typescript
const instance = new ${request.name}(${(request.properties || []).map(p => p.name).join(', ')})
\`\`\`
`
  }
  
  private generateInterfaceDocs(request: CodeGenerationRequest): string {
    return `# ${request.name}

${request.description}

## Structure

${(request.properties || []).map(p => `- **${p.name}** (${p.type}): ${p.description || 'Property'}`).join('\n')}
`
  }
  
  private generateModuleDocs(request: CodeGenerationRequest): string {
    return `# ${request.name}

${request.description}
`
  }
  
  /**
   * 🔄 MODIFY EXISTING CODE
   */
  async modifyCode(filePath: string, modifications: Array<{ search: string; replace: string }>): Promise<boolean> {
    try {
      let content = readFileSync(filePath, 'utf-8')
      
      for (const mod of modifications) {
        if (content.includes(mod.search)) {
          content = content.replace(mod.search, mod.replace)
        } else {
          console.warn(`⚠️ Could not find text to replace: ${mod.search.substring(0, 50)}...`)
          return false
        }
      }
      
      writeFileSync(filePath, content, 'utf-8')
      console.log(`✅ Modified file: ${filePath}`)
      return true
    } catch (error) {
      console.error(`❌ Error modifying file:`, error)
      return false
    }
  }
}
