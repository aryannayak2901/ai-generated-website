import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const generations = await payload.find({
      collection: 'ai-generations',
      where: {
        user: {
          equals: user.id,
        },
      },
      sort: '-createdAt',
      limit: 50,
    })

    return NextResponse.json({ success: true, data: generations.docs })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('[AI History GET] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const { prompt, mode, provider, model, blocks } = body

    if (!prompt || !blocks) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const newGeneration = await payload.create({
      collection: 'ai-generations',
      data: {
        user: user.id,
        prompt,
        mode,
        provider,
        model,
        blocks,
      },
    })

    return NextResponse.json({ success: true, data: newGeneration })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('[AI History POST] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Since access control limits delete to owner, we can just call delete
    // Or we can explicitly check if it belongs to user
    const doc = await payload.findByID({
      collection: 'ai-generations',
      id,
    })

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    const ownerId = typeof doc.user === 'object' ? doc.user?.id : doc.user
    
    if (ownerId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await payload.delete({
      collection: 'ai-generations',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('[AI History DELETE] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
