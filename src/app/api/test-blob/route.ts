import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await put('test.txt', 'Hello World!', {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ success: true, url: result.url, token_exists: !!process.env.BLOB_READ_WRITE_TOKEN });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error), stack: error instanceof Error ? error.stack : undefined, token_exists: !!process.env.BLOB_READ_WRITE_TOKEN }, { status: 500 });
  }
}
