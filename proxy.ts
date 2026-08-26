import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

import { isAdmin } from "@/lib/roles";
import { isSessionDataCookie, stripSessionDataCookies } from "@/lib/session-cookies";

type Session = typeof auth.$Infer.Session;

/**
 * Evict the stale `better-auth.session_data` cookie. better-auth reads and
 * parses it on every request but only clears it when it parses successfully,
 * so an unparseable one logs an error forever unless we delete it ourselves.
 */
function dropStaleSessionData(request: NextRequest, response: NextResponse) {
  for (const cookie of request.cookies.getAll()) {
    if (isSessionDataCookie(cookie.name)) {
      response.cookies.delete(cookie.name);
    }
  }
  return response;
}

/**
 * Optimistic access check only. The Next.js docs are explicit that Proxy must
 * not be the authorization solution, so the real gate lives in
 * `app/dashboard/layout.tsx` and in `requireAdmin()` on the route handlers.
 * This just avoids rendering a dashboard shell the user cannot use.
 */
export async function proxy(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: stripSessionDataCookies(request.headers),
    },
  );

  const admin = isAdmin(session?.user);
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = request.nextUrl.pathname === "/login";
  const to = (path: string) =>
    dropStaleSessionData(request, NextResponse.redirect(new URL(path, request.url)));

  if (isDashboard) {
    if (!session) return to("/login");
    if (!admin) return to("/forbidden");
  }

  // Signed in but not an admin: send them to the denial page rather than
  // bouncing them into /dashboard only to be rejected there.
  if (isLoginPage && session) {
    return to(admin ? "/dashboard" : "/forbidden");
  }

  if (request.nextUrl.pathname === "/") {
    if (!session) return to("/login");
    return to(admin ? "/dashboard" : "/forbidden");
  }

  return dropStaleSessionData(request, NextResponse.next());
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
