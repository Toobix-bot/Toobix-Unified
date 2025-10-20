/**
 * Content-based File Analysis
 * Reads file contents to categorize more intelligently
 */

import { readFileSync } from 'fs'
import Groq from 'groq-sdk'
import type { FileInfo } from '../index'

export interface ContentAnalysis {
  fileType: string
  contentType: string
  summary: string
  keywords: string[]
  language?: string
  category: string
  subcategory: string
  confidence: number
}

/**
 * Content Analyzer
 */
export class ContentAnalyzer {
  private groq: Groq
  private model: string
  private maxFileSize: number = 1024 * 1024 // 1 MB max

  constructor(groqApiKey: string) {
    this.groq = new Groq({ apiKey: groqApiKey })
    this.model = 'llama-3.3-70b-versatile'
  }

  /**
   * Analyze file content
   */
  async analyzeFile(file: FileInfo): Promise<ContentAnalysis | null> {
    console.log(`📄 Analyzing content of: ${file.name}`)

    // Check file size
    if (file.size > this.maxFileSize) {
      console.log(`⚠️  File too large (${formatBytes(file.size)}), skipping content analysis`)
      return null
    }

    // Read file content
    const content = this.readFileContent(file)
    if (!content) return null

    // Analyze with Groq
    try {
      const analysis = await this.analyzeContent(file.name, file.extension, content)
      return analysis
    } catch (error) {
      console.error(`❌ Failed to analyze ${file.name}:`, error)
      return null
    }
  }

  /**
   * Read file content (text only)
   */
  private readFileContent(file: FileInfo): string | null {
    // Text-based file extensions
    const textExtensions = [
      'txt',
      'md',
      'js',
      'ts',
      'jsx',
      'tsx',
      'py',
      'java',
      'c',
      'cpp',
      'cs',
      'go',
      'rs',
      'php',
      'rb',
      'html',
      'css',
      'scss',
      'json',
      'xml',
      'yaml',
      'yml',
      'toml',
      'ini',
      'cfg',
      'log',
      'csv',
    ]

    if (!textExtensions.includes(file.extension.toLowerCase())) {
      console.log(`⚠️  Non-text file (${file.extension}), skipping content read`)
      return null
    }

    try {
      const content = readFileSync(file.path, 'utf-8')

      // Truncate if too long
      const maxLength = 4000
      if (content.length > maxLength) {
        return content.substring(0, maxLength) + '\n...[truncated]'
      }

      return content
    } catch (error) {
      console.warn(`⚠️  Could not read ${file.name}:`, error)
      return null
    }
  }

  /**
   * Analyze content with Groq
   */
  private async analyzeContent(
    filename: string,
    extension: string,
    content: string
  ): Promise<ContentAnalysis> {
    const prompt = `Analyze this file and categorize it intelligently.

Filename: ${filename}
Extension: ${extension}

Content (first 4000 chars):
${content}

Return JSON:
{
  "fileType": "code|document|data|config|log|other",
  "contentType": "specific type (e.g., 'JavaScript React Component', 'Python Script', 'Meeting Notes')",
  "summary": "Brief summary of file purpose",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "language": "programming language or natural language (if applicable)",
  "category": "main category (e.g., 'Code', 'Documents', 'Data')",
  "subcategory": "specific subcategory (e.g., 'React Components', 'Meeting Notes', 'CSV Data')",
  "confidence": 0-100
}

Be specific and useful. Return ONLY JSON.`

    const response = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a file content analyzer. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: this.model,
      temperature: 0.2,
      max_tokens: 500,
    })

    const responseContent = response.choices[0]?.message?.content || '{}'
    const jsonMatch =
      responseContent.match(/```json\n?([\s\S]*?)\n?```/) ||
      responseContent.match(/\{[\s\S]*\}/)
    const analysis = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseContent)

    console.log(`✅ Content analysis: ${analysis.contentType} (${analysis.confidence}% confidence)`)

    return analysis
  }

  /**
   * Batch analyze files
   */
  async analyzeFiles(files: FileInfo[]): Promise<Map<string, ContentAnalysis>> {
    console.log(`📚 Analyzing content of ${files.length} files...`)

    const analyses = new Map<string, ContentAnalysis>()

    for (const file of files) {
      const analysis = await this.analyzeFile(file)
      if (analysis) {
        analyses.set(file.path, analysis)
      }

      // Rate limiting: Wait a bit between requests
      await sleep(200)
    }

    console.log(`✅ Analyzed ${analyses.size} files`)
    return analyses
  }

  /**
   * Smart categorization combining filename + content
   */
  async smartCategorize(file: FileInfo): Promise<{
    category: string
    subcategory: string
    confidence: number
    reasoning: string
  }> {
    // First try content analysis
    const contentAnalysis = await this.analyzeFile(file)

    if (contentAnalysis && contentAnalysis.confidence > 70) {
      return {
        category: contentAnalysis.category,
        subcategory: contentAnalysis.subcategory,
        confidence: contentAnalysis.confidence / 100,
        reasoning: `Content analysis: ${contentAnalysis.summary}`,
      }
    }

    // Fallback to extension-based
    return this.fallbackCategorize(file)
  }

  /**
   * Fallback categorization
   */
  private fallbackCategorize(file: FileInfo) {
    const extensionMap: Record<
      string,
      { category: string; subcategory: string }
    > = {
      // Documents
      pdf: { category: 'Documents', subcategory: 'PDFs' },
      doc: { category: 'Documents', subcategory: 'Word' },
      docx: { category: 'Documents', subcategory: 'Word' },
      txt: { category: 'Documents', subcategory: 'Text Files' },
      md: { category: 'Documents', subcategory: 'Markdown' },

      // Code
      js: { category: 'Code', subcategory: 'JavaScript' },
      ts: { category: 'Code', subcategory: 'TypeScript' },
      py: { category: 'Code', subcategory: 'Python' },
      java: { category: 'Code', subcategory: 'Java' },

      // Images
      jpg: { category: 'Images', subcategory: 'Photos' },
      png: { category: 'Images', subcategory: 'Graphics' },
      gif: { category: 'Images', subcategory: 'Animations' },

      // Media
      mp4: { category: 'Videos', subcategory: 'MP4' },
      mp3: { category: 'Audio', subcategory: 'Music' },
    }

    const mapping = extensionMap[file.extension] || {
      category: 'Other',
      subcategory: 'Misc',
    }

    return {
      category: mapping.category,
      subcategory: mapping.subcategory,
      confidence: 0.6,
      reasoning: `Extension-based categorization (${file.extension})`,
    }
  }
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Format bytes
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}
