import { auth, getKeycloakIdToken, getServerSession } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let idToken: string | null = null;

  try {
    const session = await getServerSession(request.headers);
    if (session?.user?.id) {
      idToken = await getKeycloakIdToken(session.user.id, request.headers);
    }
  } catch (error) {
    console.error("Error reading session before logout:", error);
  }

  // Clear the local session in better-auth
  try {
    await auth.api.signOut({
      headers: request.headers,
    });
  } catch (error) {
    console.error("Error signing out better-auth session:", error);
  }

  const keycloakIssuer = process.env.KEYCLOAK_ISSUER || "https://auth.quizzy.it.com/realms/phsardigital";
  const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "phsardigital-admin";
  const postLogoutRedirectUri = `${request.nextUrl.origin}/login`;

  const logoutUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set("client_id", keycloakClientId);
  logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

  if (idToken) {
    logoutUrl.searchParams.set("id_token_hint", idToken);
  }

  const response = NextResponse.redirect(logoutUrl.toString(), { status: 302 });

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

