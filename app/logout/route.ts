import { auth, backchannelKeycloakLogout, getServerSession, isTokenExpired } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let tokens: { accessToken?: string; refreshToken?: string; idToken?: string } | null = null;
  let sessionUser: { id?: string } | null = null;

  try {
    const session = await getServerSession(request.headers);
    sessionUser = session?.user ?? null;
  } catch (err) {
    console.error("Error reading session before logout:", err);
  }

  try {
    tokens = await auth.api.getAccessToken({
      headers: request.headers,
      body: { providerId: "keycloak" },
    });
  } catch {
    // ignore if account tokens cannot be retrieved
  }

  // 1. Perform server-side backchannel logout and token revocation with Keycloak
  try {
    await backchannelKeycloakLogout(sessionUser?.id, {
      accessToken: tokens?.accessToken,
      refreshToken: tokens?.refreshToken,
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
  const postLogoutRedirectUri = `${origin}/login?logged_out=true`;

  const isLocalhost = origin.includes("localhost") || origin.includes("127.0.0.1");

  let redirectTarget = postLogoutRedirectUri;

  // On production domains registered in Keycloak, redirect through Keycloak's logout endpoint
  // so Keycloak terminates its browser session cookies and forces re-authentication on next login.
  if (!isLocalhost) {
    const logoutUrl = new URL(`${keycloakIssuer.replace(/\/$/, "")}/protocol/openid-connect/logout`);
    logoutUrl.searchParams.set("client_id", keycloakClientId);
    logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

    if (tokens?.idToken && !isTokenExpired(tokens.idToken)) {
      logoutUrl.searchParams.set("id_token_hint", tokens.idToken);
    }

    redirectTarget = logoutUrl.toString();
  }

  const response = NextResponse.redirect(redirectTarget, { status: 302 });

  // Explicitly expire and delete all session and auth cookies
  for (const cookie of request.cookies.getAll()) {
    response.cookies.delete(cookie.name);
  }

  response.cookies.set("better-auth.session_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("better-auth.session_data", "", { maxAge: 0, path: "/" });
  response.cookies.set("better-auth.account_data", "", { maxAge: 0, path: "/" });
  response.cookies.set("better-auth.state", "", { maxAge: 0, path: "/" });

  return response;
}
