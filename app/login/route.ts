import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const res = await auth.api.signInWithOAuth2({
      body: {
        providerId: "keycloak",
        callbackURL: "/dashboard",
      },
      asResponse: true,
      headers: request.headers,
    });

    const data = await res.json();
    if (data?.url) {
      const response = NextResponse.redirect(data.url, { status: 302 });

      // Copy set-cookie headers (PKCE verifier, OAuth state) to browser response
      const setCookies = res.headers.getSetCookie();
      for (const cookie of setCookies) {
        response.headers.append("Set-Cookie", cookie);
      }

      return response;
    }
  } catch (error) {
    console.error("Error initiating Keycloak OAuth flow:", error);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
