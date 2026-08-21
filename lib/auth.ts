import { betterAuth } from "better-auth";
import type { User } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import Database from "better-sqlite3";
import { NextResponse } from "next/server";
import path from "path";

import { isAdmin, serializeRoles } from "@/lib/roles";
import { stripSessionDataCookies } from "@/lib/session-cookies";

// Initialize a local SQLite database for session storage
const db = new Database(path.join(process.cwd(), ".better-auth.db"));

/**
 * Read the claims out of a JWT without verifying the signature. Keycloak handed
 * us these tokens directly over TLS on the back channel, so we only need to read
 * them - we are not accepting them from an untrusted caller.
 */
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

/** Keycloak exposes realm roles as `realm_access.roles` on the access token. */
function extractRealmRoles(claims: Record<string, unknown>): string[] {
  const realmAccess = claims.realm_access as { roles?: unknown } | undefined;
  if (!realmAccess || !Array.isArray(realmAccess.roles)) return [];
  return realmAccess.roles.filter(
    (role): role is string => typeof role === "string",
  );
}

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  user: {
    additionalFields: {
      // Comma-separated Keycloak realm roles, e.g. "ADMIN,SELLER".
      roles: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KEYCLOAK_CLIENT_ID || "",
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
          discoveryUrl: `${process.env.KEYCLOAK_ISSUER}/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email"],
          pkce: true,
          // Re-read the profile on every sign-in so role changes in Keycloak
          // take effect on the next login instead of sticking at first sign-up.
          overrideUserInfo: true,
          /**
           * Build the profile from the tokens rather than the /userinfo endpoint.
           * Keycloak only ships `realm_access.roles` on the access token - the
           * userinfo response omits it unless the realm role mapper is
           * explicitly configured to include it.
           */
          getUserInfo: async (tokens) => {
            const accessClaims = decodeJwtPayload(tokens.accessToken);
            const idClaims = decodeJwtPayload(tokens.idToken);
            const claims = { ...accessClaims, ...idClaims };

            const sub = typeof claims.sub === "string" ? claims.sub : null;
            if (!sub) return null;

            const name =
              (typeof claims.name === "string" && claims.name) ||
              (typeof claims.preferred_username === "string" && claims.preferred_username) ||
              (typeof claims.email === "string" && claims.email) ||
              sub;

            const profile = {
              id: sub,
              name,
              email: typeof claims.email === "string" ? claims.email : undefined,
              emailVerified: claims.email_verified === true,
              image: typeof claims.picture === "string" ? claims.picture : undefined,
              roles: serializeRoles([
                ...extractRealmRoles(accessClaims),
                ...extractRealmRoles(idClaims),
              ]),
            };

            return profile;
          },
          mapProfileToUser: (profile) => {
            // Partial<User> is a weak type, so widen it to carry the extra
            // `roles` field declared in user.additionalFields above.
            const mapped: Partial<User> & { roles: string } = {
              roles: typeof profile.roles === "string" ? profile.roles : "",
            };
            return mapped;
          },
        },
      ],
    }),
  ],
});

/**
 * Look up the Keycloak id_token for a user so logout can send id_token_hint.
 * Without it, Keycloak 18+ renders a "Do you want to log out?" interstitial and,
 * if the user never confirms, the SSO cookie survives. The next sign-in then
 * becomes a re-authentication, where Keycloak sets usernameHidden and the login
 * theme renders a password-only form.
 */
export function getKeycloakIdToken(userId: string): string | null {
  const row = db
    .prepare(
      "select idToken from account where userId = ? and providerId = 'keycloak' order by updatedAt desc limit 1",
    )
    .get(userId) as { idToken: string | null } | undefined;

  return row?.idToken ?? null;
}

/**
 * Gate a route handler on the Keycloak ADMIN realm role.
 *
 * Returns an error `Response` to short-circuit with, or `null` when the caller
 * is an administrator and the handler should continue.
 */
/**
 * Resolve the session, dropping the stale `better-auth.session_data` cookie
 * first. See lib/session-cookies.ts for why that cookie has to go.
 */
export async function getServerSession(headers: Headers) {
  return auth.api.getSession({ headers: stripSessionDataCookies(headers) });
}

export async function requireAdmin(request: Request): Promise<Response | null> {
  const session = await getServerSession(request.headers);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(session.user)) {
    return NextResponse.json(
      { message: "Forbidden: administrator role required." },
      { status: 403 },
    );
  }

  return null;
}

export async function getAuthHeader(request: Request): Promise<Record<string, string>> {
  const incomingAuth = request.headers.get("authorization");
  if (incomingAuth) {
    return { Authorization: incomingAuth };
  }

  try {
    const token = await auth.api.getAccessToken({
      headers: request.headers,
      body: { providerId: "keycloak" },
    });

    if (token.accessToken) {
      return { Authorization: `Bearer ${token.accessToken}` };
    }
  } catch (err) {
    console.error("Error retrieving or refreshing the Keycloak access token:", err);
  }

  return {};
}
