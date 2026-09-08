import {
  auth,
  backchannelKeycloakLogout,
  getServerSession,
  getKeycloakIdToken,
  getKeycloakRefreshToken,
} from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "better-auth";

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

async function handleLogout(request: NextRequest) {
  let sessionUser: (User & { idToken?: string; accessToken?: string; refreshToken?: string }) | null = null;

  try {
    const session = await getServerSession(request.headers);
    sessionUser = (session?.user as (User & { idToken?: string; accessToken?: string; refreshToken?: string })) ?? null;
  } catch (err) {
    console.error("Error reading session before logout:", err);
  }

  // Retrieve Keycloak ID token for id_token_hint
  let idToken = sessionUser?.idToken || null;
  if (!idToken && sessionUser?.id) {
    idToken = await getKeycloakIdToken(sessionUser.id, request.headers);
  }

  // Retrieve refresh token for backchannel revocation
  let refreshToken = sessionUser?.refreshToken || null;
  if (!refreshToken && sessionUser?.id) {
    refreshToken = await getKeycloakRefreshToken(sessionUser.id, request.headers);
  }

  const accessToken = sessionUser?.accessToken || null;

  // 1. Perform server-side backchannel logout and token revocation with Keycloak
  // This invalidates the user's session on the Keycloak server immediately.
  try {
    await backchannelKeycloakLogout(sessionUser?.id, {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error performing backchannel logout:", error);
  }

  // 2. Clear the local session in better-auth
  try {
    await auth.api.signOut({
      headers: request.headers,
    });
  } catch (error) {
    console.error("Error signing out better-auth session:", error);
  }

  const keycloakIssuer = process.env.KEYCLOAK_ISSUER || "https://auth.quizzy.it.com/realms/phsardigital";
  const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "phsardigital-admin";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin;
  const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1");

  const postLogoutRedirectUri = `${origin}/login`;

  let redirectTarget = `${origin}/login?logged_out=true`;

  const cleanIssuer = keycloakIssuer.replace(/\/$/, "");

  // On production domains (registered in Keycloak: admin.phasardigital.com, phsardigital-final-admin.vercel.app),
  // or when explicitly enabled on localhost, redirect through Keycloak's logout endpoint
  // so Keycloak terminates its browser session cookies and redirects back to /login.
  const allowKeycloakRedirect =
    !isLocalhost ||
    process.env.KEYCLOAK_LOGOUT_LOCALHOST === "true" ||
    request.nextUrl.searchParams.get("kc") === "1";

  if (allowKeycloakRedirect) {
    const logoutUrl = new URL(`${cleanIssuer}/protocol/openid-connect/logout`);
    logoutUrl.searchParams.set("client_id", keycloakClientId);
    logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

    if (idToken) {
      logoutUrl.searchParams.set("id_token_hint", idToken);
    }

    redirectTarget = logoutUrl.toString();
  }

  const response = NextResponse.redirect(redirectTarget, { status: 302 });

  // Explicitly expire and delete all session and auth cookies
  for (const cookie of request.cookies.getAll()) {
    response.cookies.delete(cookie.name);
    response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
  }

  const sessionCookieNames = [
    "better-auth.session_token",
    "better-auth.session_data",
    "better-auth.account_data",
    "better-auth.state",
    "__Secure-better-auth.session_token",
    "__Secure-better-auth.session_data",
    "__Secure-better-auth.account_data",
    "__Secure-better-auth.state",
    "__Host-better-auth.session_token",
  ];

  for (const name of sessionCookieNames) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }

  // Set logged_out indicator cookie for 60 seconds so login page shows signout message
  response.cookies.set("logged_out", "1", { maxAge: 60, path: "/" });

  return response;
}
