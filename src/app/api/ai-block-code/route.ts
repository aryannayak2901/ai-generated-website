import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name') ?? ''

  // Sanitize: only allow PascalCase alphanumeric
  if (!/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
    return NextResponse.json({ error: 'Invalid component name' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'src', 'components', 'blocks', `${name}.tsx`)

  try {
    const code = await fs.readFile(filePath, 'utf-8')
    return NextResponse.json({ code })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
