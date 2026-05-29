import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to homepage
  return NextResponse.redirect(new URL('/', request.url));
}
