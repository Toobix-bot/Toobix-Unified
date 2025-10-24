import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), '..', '..', 'data', 'claude-monitor.json')
    const data = await readFile(filePath, 'utf-8')
    const parsed = JSON.parse(data)

    // Transform data for frontend
    return NextResponse.json({
      shifts: parsed.shifts || [],
      currentCycle: parsed.currentCycle || 0,
      currentConscious: parsed.currentConscious || 0,
      totalProcesses: 14,
      startTime: parsed.startTime || new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to read consciousness monitor:', error)
    return NextResponse.json({ error: 'Failed to load monitor data' }, { status: 500 })
  }
}
