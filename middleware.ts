// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  // Detect access to riot.txt
  if (pathname === '/riot.txt') {
    console.log('riot.txt accessed by:', request.headers.get('user-agent'));
    // Redirect to the actual file in public/
    return NextResponse.redirect(new URL('/real-riot.txt', request.url));
  }

  return NextResponse.next();
}
