import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Read user session from cookie
  const authCookie = request.cookies.get('truthpulse_auth')?.value;
  let userRole = 'READER';

  if (authCookie) {
    try {
      const decoded = decodeURIComponent(authCookie);
      const parsed = JSON.parse(decoded);
      userRole = parsed.role || 'READER';
    } catch {
      try {
        const parsed = JSON.parse(authCookie);
        userRole = parsed.role || 'READER';
      } catch {
        // Fallback
      }
    }
  }

  const isEditor = userRole === 'EDITOR' || userRole === 'CHIEF_EDITOR' || userRole === 'ADMIN';

  // 2. Route Protection: Non-editor attempts to access /studio:
  // Redirect to homepage with a prompt to authenticate as an editor
  if (pathname.startsWith('/studio')) {
    if (!isEditor) {
      return NextResponse.redirect(new URL('/?auth=editor_required', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match studio routes for role-based protection
     */
    '/studio/:path*'
  ],
};
