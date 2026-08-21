import { auth, getKeycloakIdToken, getServerSession } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Read the session before signing out so we can still resolve the id_token.
  let idToken: string | null = null;
  try {
    const session = await getServerSession(request.headers);
    if (session?.user?.id) {
      idToken = getKeycloakIdToken(session.user.id);
    }
  } catch (error) {
    console.error("Error reading session before logout:", error);
  }

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

  // id_token_hint lets Keycloak end the SSO session without the confirmation
  // interstitial. Skipping it leaves the KEYCLOAK_IDENTITY cookie alive, which
  // makes the next sign-in a re-auth and hides the username field.
  if (idToken) {
    logoutUrl.searchParams.set("id_token_hint", idToken);
  }

  return NextResponse.redirect(logoutUrl.toString(), { status: 302 });
}
