import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

import { isAdmin } from "@/lib/roles";

type Session = typeof auth.$Infer.Session;

function decodeJwtPayload(token?: string): Record<string, unknown> {
  const payload = token?.split(".")[1];
  if (!payload) return {};

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function isTokenExpired(token?: string): boolean {
  if (!token) return true;
  const claims = decodeJwtPayload(token);
  if (!claims.exp || typeof claims.exp !== "number") return false;
  return Date.now() >= (claims.exp * 1000 - 30000);
}

/**
 * Evict the stale `better-auth.session_data` cookie. better-auth reads and
 * parses it on every request but only clears it when it parses successfully,
 * so an unparseable one logs an error forever unless we delete it ourselves.
 */
export async function proxy(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = request.nextUrl.pathname === "/login";
  const hasLoggedOutParam = request.nextUrl.searchParams.has("logged_out");

  if (!cookie) {
    if (isDashboard) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // If user is explicitly on login page after logging out, do not redirect to dashboard
  if (isLoginPage && hasLoggedOutParam) {
    const response = NextResponse.next();
    response.cookies.delete("better-auth.session_token");
    response.cookies.delete("better-auth.session_data");
    response.cookies.delete("better-auth.account_data");
    response.cookies.delete("better-auth.state");
    return response;
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
  const userToken = (session?.user as any)?.accessToken;
  const hasExpiredToken = userToken ? isTokenExpired(userToken) : false;

  if (isDashboard) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (!admin) return NextResponse.redirect(new URL("/forbidden", request.url));
    // Let request proceed so DashboardLayout can refresh token if needed
  }

  // On login page: redirect away ONLY if session exists AND token is not expired
  if (isLoginPage && session) {
    if (!hasExpiredToken) {
      return NextResponse.redirect(new URL(admin ? "/dashboard" : "/forbidden", request.url));
    }
    // If token is expired, stay on login page!
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") {
    if (!session || hasExpiredToken) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.redirect(new URL(admin ? "/dashboard" : "/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
