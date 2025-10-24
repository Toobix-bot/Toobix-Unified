import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), '..', '..', 'data', 'evolution-session-2025-10-24.json')
    const data = await readFile(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error('Failed to read evolution session:', error)
    return NextResponse.json({ error: 'Failed to load evolution session' }, { status: 500 })
  }
}
