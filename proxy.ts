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
export async function proxy(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: request.headers,
    },
  );

  const admin = isAdmin(session?.user);
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (isDashboard) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (!admin) return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  // Signed in: redirect away from login page
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL(admin ? "/dashboard" : "/forbidden", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.redirect(new URL(admin ? "/dashboard" : "/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
