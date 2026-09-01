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
  const cookie = request.headers.get("cookie") || "";
  if (!cookie) {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let session: Session | null = null;
  try {
    const res = await betterFetch<Session>("/api/auth/get-session", {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie,
      },
    });
    session = res.data ?? null;
  } catch (err) {
    // If internal fetch fails during edge middleware, let the request proceed
    // to the page layout where getServerSession handles the authoritative check.
    return NextResponse.next();
  }

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
