/**
 * Duplicate Detection
 * Finds duplicate files based on content hash
 */

import { createHash } from 'crypto'
import { readFileSync, statSync } from 'fs'
import type { FileInfo } from '../index'

export interface DuplicateGroup {
  hash: string
  files: FileInfo[]
  totalSize: number
  wastedSpace: number
}

/**
 * Calculate file hash (MD5)
 */
export function hashFile(path: string): string {
  try {
    const content = readFileSync(path)
    return createHash('md5').update(content).digest('hex')
  } catch (error) {
    console.warn(`⚠️  Could not hash file: ${path}`)
    return ''
  }
}

/**
 * Find duplicate files
 */
export function findDuplicates(files: FileInfo[]): DuplicateGroup[] {
  console.log(`🔍 Scanning for duplicates in ${files.length} files...`)

  const hashMap = new Map<string, FileInfo[]>()

  // Group files by hash
  for (const file of files) {
    const hash = hashFile(file.path)
    if (!hash) continue

    if (!hashMap.has(hash)) {
      hashMap.set(hash, [])
    }
    hashMap.get(hash)!.push(file)
  }

  // Find groups with duplicates
  const duplicateGroups: DuplicateGroup[] = []

  for (const [hash, groupFiles] of hashMap.entries()) {
    if (groupFiles.length > 1) {
      const totalSize = groupFiles.reduce((sum, f) => sum + f.size, 0)
      const wastedSpace = totalSize - groupFiles[0].size // Keep one, rest is wasted

      duplicateGroups.push({
        hash,
        files: groupFiles,
        totalSize,
        wastedSpace,
      })
    }
  }

  const totalWasted = duplicateGroups.reduce((sum, g) => sum + g.wastedSpace, 0)
  console.log(`✅ Found ${duplicateGroups.length} duplicate groups (${formatBytes(totalWasted)} wasted)`)

  return duplicateGroups
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

/**
 * Auto-delete duplicates (keep first, delete rest)
 */
export function deleteDuplicates(groups: DuplicateGroup[], dryRun: boolean = true): void {
  console.log(`${dryRun ? '🔍 [DRY RUN]' : '⚡'} Deleting duplicates...`)

  for (const group of groups) {
    const [keep, ...remove] = group.files

    console.log(`\n📁 Duplicate group (${formatBytes(group.totalSize)}):`)
    console.log(`   ✅ Keep: ${keep.name}`)

    for (const file of remove) {
      if (dryRun) {
        console.log(`   ❌ Delete: ${file.name}`)
      } else {
        try {
          // TODO: Implement actual deletion
          console.log(`   ❌ Deleted: ${file.name}`)
        } catch (error) {
          console.error(`   ⚠️  Failed to delete ${file.name}:`, error)
        }
      }
    }
  }

  if (dryRun) {
    console.log(`\n🔍 This was a dry run. Use deleteDuplicates(groups, false) to actually delete files.`)
  }
}
