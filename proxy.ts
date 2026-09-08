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

function cleanCookieHeader(cookieHeader: string): string {
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .filter(
      (c) =>
        !c.startsWith("better-auth.session_data") &&
        !c.startsWith("better-auth.account_data") &&
        !c.startsWith("__Secure-better-auth.session_data") &&
        !c.startsWith("__Secure-better-auth.account_data"),
    )
    .join("; ");
}

function expireStaleBloatedCookies(response: NextResponse, request: NextRequest) {
  for (const cookie of request.cookies.getAll()) {
    if (
      cookie.name.startsWith("better-auth.session_data") ||
      cookie.name.startsWith("better-auth.account_data") ||
      cookie.name.startsWith("__Secure-better-auth.session_data") ||
      cookie.name.startsWith("__Secure-better-auth.account_data")
    ) {
      response.cookies.delete(cookie.name);
      response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }
}

/**
 * Evict the stale `better-auth.session_data` and `better-auth.account_data` cookies.
 */
export async function proxy(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = request.nextUrl.pathname === "/login";
  const hasLoggedOutParam = request.nextUrl.searchParams.has("logged_out");

  if (!cookie) {
    if (isDashboard) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      expireStaleBloatedCookies(response, request);
      return response;
    }
    return NextResponse.next();
  }

  // If user is explicitly on login page after logging out, do not redirect to dashboard
  if (isLoginPage && hasLoggedOutParam) {
    const response = NextResponse.next();
    expireStaleBloatedCookies(response, request);
    for (const cookie of request.cookies.getAll()) {
      if (cookie.name.includes("better-auth")) {
        response.cookies.delete(cookie.name);
        response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
      }
    }
    return response;
  }

  let session: Session | null = null;
  const cleanCookie = cleanCookieHeader(cookie);
  try {
    const res = await betterFetch<Session>("/api/auth/get-session", {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: cleanCookie,
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

  function withCookieCleanup(res: NextResponse): NextResponse {
    expireStaleBloatedCookies(res, request);
    return res;
  }

  if (isDashboard) {
    if (!session) return withCookieCleanup(NextResponse.redirect(new URL("/login", request.url)));
    if (!admin) return withCookieCleanup(NextResponse.redirect(new URL("/forbidden", request.url)));
    // Let request proceed so DashboardLayout can refresh token if needed
  }

  // On login page: redirect away ONLY if session exists AND token is not expired
  if (isLoginPage && session) {
    if (!hasExpiredToken) {
      return withCookieCleanup(NextResponse.redirect(new URL(admin ? "/dashboard" : "/forbidden", request.url)));
    }
    // If token is expired, stay on login page!
    return withCookieCleanup(NextResponse.next());
  }

  if (request.nextUrl.pathname === "/") {
    if (!session || hasExpiredToken) return withCookieCleanup(NextResponse.redirect(new URL("/login", request.url)));
    return withCookieCleanup(NextResponse.redirect(new URL(admin ? "/dashboard" : "/forbidden", request.url)));
  }

  return withCookieCleanup(NextResponse.next());
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
