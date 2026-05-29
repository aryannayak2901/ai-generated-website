import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Check if secret is valid
  if (secret !== process.env.PREVIEW_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the slug
  if (slug) {
    return NextResponse.redirect(new URL(`/${slug}`, request.url));
  }

  return NextResponse.redirect(new URL('/', request.url));
}
