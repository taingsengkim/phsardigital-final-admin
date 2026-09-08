import { auth, backchannelKeycloakLogout, getServerSession } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request.headers);
    if (session?.user?.id) {
      await backchannelKeycloakLogout(session.user.id);
    }
  } catch (error) {
    console.error("Error performing backchannel logout:", error);
  }

  // Clear the local session in better-auth
  try {
    await auth.api.signOut({
      headers: request.headers,
    });
  } catch (error) {
    console.error("Error signing out better-auth session:", error);
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin;
  const loginUrl = `${origin}/login?logged_out=true`;

  const response = NextResponse.redirect(loginUrl, { status: 302 });

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
