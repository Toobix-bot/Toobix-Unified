/**
 * @toobix/file-manager
 * AI-powered file organization with Groq integration
 */

import Groq from 'groq-sdk'
import glob from 'fast-glob'
import chokidar from 'chokidar'
import { existsSync, statSync, mkdirSync, renameSync } from 'fs'
import { join, basename, dirname, extname } from 'path'
import { nanoid } from 'nanoid'

// Types
export interface FileInfo {
  path: string
  name: string
  extension: string
  size: number
  created: Date
  modified: Date
  category?: string
  subcategory?: string
  confidence?: number
}

export interface OrganizationPlan {
  id: string
  files: FileInfo[]
  structure: Record<string, string[]> // category -> file paths
  reasoning: string
  created: Date
}

export interface FileManagerConfig {
  groqApiKey: string
  model?: string
  autoOrganize?: boolean
  watchMode?: boolean
}

/**
 * AI File Manager powered by Groq
 */
export class AIFileManager {
  private groq: Groq
  private config: FileManagerConfig
  private watcher?: chokidar.FSWatcher
  private model: string

  constructor(config: FileManagerConfig) {
    this.config = config
    this.model = config.model || 'llama-3.3-70b-versatile'
    this.groq = new Groq({
      apiKey: config.groqApiKey,
    })
  }

  /**
   * Scan a directory and collect file information
   */
  async scanDirectory(path: string, pattern: string = '**/*'): Promise<FileInfo[]> {
    console.log(`📂 Scanning directory: ${path}`)

    if (!existsSync(path)) {
      throw new Error(`Directory does not exist: ${path}`)
    }

    const files = await glob(pattern, {
      cwd: path,
      absolute: true,
      onlyFiles: true,
      ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'],
    })

    const fileInfos: FileInfo[] = []

    for (const filePath of files) {
      try {
        const stats = statSync(filePath)
        const fileInfo: FileInfo = {
          path: filePath,
          name: basename(filePath),
          extension: extname(filePath).slice(1).toLowerCase(),
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        }
        fileInfos.push(fileInfo)
      } catch (error) {
        console.warn(`⚠️  Could not stat file: ${filePath}`)
      }
    }

    console.log(`✅ Found ${fileInfos.length} files`)
    return fileInfos
  }

  /**
   * Categorize files using Groq AI
   */
  async categorizeFiles(files: FileInfo[]): Promise<FileInfo[]> {
    console.log(`🧠 Categorizing ${files.length} files with Groq...`)

    // Create summary of files for AI
    const fileSummary = files.map(f => ({
      name: f.name,
      extension: f.extension,
      size: f.size,
    }))

    const prompt = `You are a file organization expert. Analyze these files and categorize them intelligently.

Files to categorize:
${JSON.stringify(fileSummary, null, 2)}

Create logical categories based on:
1. File type (documents, images, videos, code, etc.)
2. File extension patterns
3. Common naming conventions
4. File size (e.g., large media vs small configs)

Return a JSON array with this structure:
[
  {
    "filename": "example.jpg",
    "category": "Images",
    "subcategory": "Photos",
    "confidence": 0.95,
    "reasoning": "JPEG image file"
  }
]

Be practical and user-friendly. Create 3-7 main categories maximum.`

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a file organization assistant. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        temperature: 0.3,
        max_tokens: 4000,
      })

      const content = response.choices[0]?.message?.content || '[]'

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\[[\s\S]*\]/)
      const categorizedFiles = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content)

      // Merge AI categories back to file info
      const result = files.map(file => {
        const aiCategory = categorizedFiles.find((c: any) => c.filename === file.name)
        return {
          ...file,
          category: aiCategory?.category,
          subcategory: aiCategory?.subcategory,
          confidence: aiCategory?.confidence,
        }
      })

      console.log(`✅ Categorization complete!`)
      return result
    } catch (error) {
      console.error('❌ Groq categorization failed:', error)

      // Fallback: Basic categorization by extension
      return this.fallbackCategorize(files)
    }
  }

  /**
   * Fallback categorization (extension-based)
   */
  private fallbackCategorize(files: FileInfo[]): FileInfo[] {
    console.log('⚠️  Using fallback categorization...')

    const extensionMap: Record<string, { category: string; subcategory: string }> = {
      // Documents
      pdf: { category: 'Documents', subcategory: 'PDFs' },
      doc: { category: 'Documents', subcategory: 'Word' },
      docx: { category: 'Documents', subcategory: 'Word' },
      txt: { category: 'Documents', subcategory: 'Text Files' },
      md: { category: 'Documents', subcategory: 'Markdown' },

      // Images
      jpg: { category: 'Images', subcategory: 'Photos' },
      jpeg: { category: 'Images', subcategory: 'Photos' },
      png: { category: 'Images', subcategory: 'Graphics' },
      gif: { category: 'Images', subcategory: 'Animations' },
      svg: { category: 'Images', subcategory: 'Vector' },

      // Videos
      mp4: { category: 'Videos', subcategory: 'MP4' },
      avi: { category: 'Videos', subcategory: 'AVI' },
      mkv: { category: 'Videos', subcategory: 'MKV' },

      // Audio
      mp3: { category: 'Audio', subcategory: 'Music' },
      wav: { category: 'Audio', subcategory: 'WAV' },
      flac: { category: 'Audio', subcategory: 'Lossless' },

      // Code
      js: { category: 'Code', subcategory: 'JavaScript' },
      ts: { category: 'Code', subcategory: 'TypeScript' },
      py: { category: 'Code', subcategory: 'Python' },
      java: { category: 'Code', subcategory: 'Java' },

      // Archives
      zip: { category: 'Archives', subcategory: 'ZIP' },
      rar: { category: 'Archives', subcategory: 'RAR' },
      '7z': { category: 'Archives', subcategory: '7-Zip' },
    }

    return files.map(file => ({
      ...file,
      category: extensionMap[file.extension]?.category || 'Other',
      subcategory: extensionMap[file.extension]?.subcategory || 'Misc',
      confidence: 0.7,
    }))
  }

  /**
   * Create organization plan (preview before executing)
   */
  async createOrganizationPlan(path: string, files: FileInfo[]): Promise<OrganizationPlan> {
    console.log(`📋 Creating organization plan...`)

    const categorized = await this.categorizeFiles(files)

    // Group files by category
    const structure: Record<string, string[]> = {}
    for (const file of categorized) {
      const category = file.category || 'Other'
      if (!structure[category]) {
        structure[category] = []
      }
      structure[category].push(file.path)
    }

    // Generate reasoning with Groq
    const categoryStats = Object.entries(structure).map(([cat, files]) =>
      `${cat}: ${files.length} files`
    ).join('\n')

    const reasoning = `Organized ${files.length} files into ${Object.keys(structure).length} categories:\n${categoryStats}`

    const plan: OrganizationPlan = {
      id: nanoid(),
      files: categorized,
      structure,
      reasoning,
      created: new Date(),
    }

    return plan
  }

  /**
   * Execute organization plan (move files to folders)
   */
  async executePlan(basePath: string, plan: OrganizationPlan, dryRun: boolean = false): Promise<void> {
    console.log(`${dryRun ? '🔍 [DRY RUN]' : '⚡'} Executing organization plan...`)

    for (const [category, filePaths] of Object.entries(plan.structure)) {
      const categoryPath = join(basePath, category)

      if (!dryRun && !existsSync(categoryPath)) {
        mkdirSync(categoryPath, { recursive: true })
        console.log(`📁 Created folder: ${category}`)
      }

      for (const filePath of filePaths) {
        const fileName = basename(filePath)
        const newPath = join(categoryPath, fileName)

        if (dryRun) {
          console.log(`   ${fileName} → ${category}/`)
        } else {
          try {
            renameSync(filePath, newPath)
            console.log(`✅ Moved: ${fileName} → ${category}/`)
          } catch (error) {
            console.error(`❌ Failed to move ${fileName}:`, error)
          }
        }
      }
    }

    if (dryRun) {
      console.log(`\n🔍 This was a dry run. Use executePlan(path, plan, false) to actually move files.`)
    } else {
      console.log(`\n✅ Organization complete!`)
    }
  }

  /**
   * All-in-one: Scan, Categorize, Organize
   */
  async organizeDirectory(path: string, dryRun: boolean = true): Promise<OrganizationPlan> {
    console.log(`🚀 Starting organization process...`)

    // 1. Scan
    const files = await this.scanDirectory(path)

    if (files.length === 0) {
      console.log('ℹ️  No files found to organize')
      throw new Error('No files found')
    }

    // 2. Create Plan
    const plan = await this.createOrganizationPlan(path, files)

    // 3. Preview
    console.log(`\n📊 Organization Plan (ID: ${plan.id})`)
    console.log(plan.reasoning)
    console.log(`\nCategories created:`)
    for (const [category, filePaths] of Object.entries(plan.structure)) {
      console.log(`  📁 ${category}: ${filePaths.length} files`)
    }

    // 4. Execute (if not dry run)
    await this.executePlan(path, plan, dryRun)

    return plan
  }

  /**
   * Watch directory for changes and auto-organize
   */
  startWatching(path: string): void {
    console.log(`👀 Watching directory: ${path}`)

    this.watcher = chokidar.watch(path, {
      ignored: ['**/node_modules/**', '**/.git/**'],
      persistent: true,
      ignoreInitial: true,
    })

    this.watcher.on('add', async (filePath) => {
      console.log(`📥 New file detected: ${basename(filePath)}`)

      if (this.config.autoOrganize) {
        console.log('🤖 Auto-organizing...')
        // TODO: Smart auto-organize (categorize single file)
      }
    })
  }

  /**
   * Stop watching
   */
  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close()
      console.log('👋 Stopped watching')
    }
  }
}

// Export convenience function
export function createFileManager(config: FileManagerConfig): AIFileManager {
  return new AIFileManager(config)
}
