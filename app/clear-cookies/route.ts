import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(`${origin}/login?logged_out=true`, { status: 302 });

  // Clear-Site-Data header tells browsers to clear all stored cookies and local storage
  response.headers.set("Clear-Site-Data", '"cookies", "storage"');

  // Explicitly expire every cookie received in the request
  for (const cookie of request.cookies.getAll()) {
    response.cookies.delete(cookie.name);
    response.cookies.set(cookie.name, "", { maxAge: 0, path: "/", expires: new Date(0) });
  }

  // Common Better-Auth, Next.js, and session cookie names including chunked variations
  const cookiePrefixes = [
    "better-auth.session_token",
    "better-auth.session_data",
    "better-auth.account_data",
    "better-auth.state",
    "better-auth.pkce_code_verifier",
    "__Secure-better-auth.session_token",
    "__Secure-better-auth.session_data",
    "__Secure-better-auth.account_data",
    "__Secure-better-auth.state",
    "__Host-better-auth.session_token",
  ];

  for (const prefix of cookiePrefixes) {
    response.cookies.set(prefix, "", { maxAge: 0, path: "/", expires: new Date(0) });
    for (let i = 0; i < 10; i++) {
      response.cookies.set(`${prefix}.${i}`, "", { maxAge: 0, path: "/", expires: new Date(0) });
    }
  }

  return response;
}
