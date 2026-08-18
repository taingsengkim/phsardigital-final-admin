import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Clear the local session in better-auth & delete session cookies
  try {
    await auth.api.signOut({
      headers: request.headers,
    });
  } catch (error) {
    console.error("Error signing out better-auth session:", error);
  }

  const keycloakIssuer = process.env.KEYCLOAK_ISSUER || "https://auth.quizzy.it.com/realms/phsardigital";
  const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "phsardigital-client";
  const postLogoutRedirectUri = `${request.nextUrl.origin}/login`;

  const logoutUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set("client_id", keycloakClientId);
  logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);

  return NextResponse.redirect(logoutUrl.toString(), { status: 302 });
}
