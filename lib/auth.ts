import { betterAuth } from "better-auth";
import type { User } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import Database from "better-sqlite3";
import { NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";

import { isAdmin, serializeRoles } from "@/lib/roles";
import { stripSessionDataCookies } from "@/lib/session-cookies";

// Initialize a local SQLite database for session storage, using os.tmpdir() on Vercel
function initDatabase() {
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  let dbFile = path.join(process.cwd(), ".better-auth.db");

  if (isServerless) {
    const tmpDir = os.tmpdir();
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    const tmpDb = path.join(tmpDir, ".better-auth.db");
    if (!fs.existsSync(tmpDb) && fs.existsSync(dbFile)) {
      try {
        fs.copyFileSync(dbFile, tmpDb);
      } catch (e) {
        console.warn("Could not copy initial .better-auth.db to tmp:", e);
      }
    }
    dbFile = tmpDb;
  }

  const dbDir = path.dirname(dbFile);
  if (!fs.existsSync(dbDir)) {
    try {
      fs.mkdirSync(dbDir, { recursive: true });
    } catch {}
  }

  const database = new Database(dbFile);

  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text not null primary key,
        "name" text not null,
        "email" text not null unique,
        "emailVerified" integer not null,
        "image" text,
        "createdAt" date not null,
        "updatedAt" date not null,
        "roles" text default '',
        "accessToken" text default '',
        "idToken" text default ''
      );
      CREATE TABLE IF NOT EXISTS "session" (
        "id" text not null primary key,
        "expiresAt" date not null,
        "token" text not null unique,
        "createdAt" date not null,
        "updatedAt" date not null,
        "ipAddress" text,
        "userAgent" text,
        "userId" text not null references "user" ("id") on delete cascade
      );
      CREATE TABLE IF NOT EXISTS "account" (
        "id" text not null primary key,
        "accountId" text not null,
        "providerId" text not null,
        "userId" text not null references "user" ("id") on delete cascade,
        "accessToken" text,
        "refreshToken" text,
        "idToken" text,
        "accessTokenExpiresAt" date,
        "refreshTokenExpiresAt" date,
        "scope" text,
        "password" text,
        "createdAt" date not null,
        "updatedAt" date not null
      );
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text not null primary key,
        "identifier" text not null,
        "value" text not null,
        "expiresAt" date not null,
        "createdAt" date not null,
        "updatedAt" date not null
      );
    `);

    // Ensure columns exist on existing databases
    try {
      database.exec(`ALTER TABLE "user" ADD COLUMN "roles" text default ''`);
    } catch {}
    try {
      database.exec(`ALTER TABLE "user" ADD COLUMN "accessToken" text default ''`);
    } catch {}
    try {
      database.exec(`ALTER TABLE "user" ADD COLUMN "idToken" text default ''`);
    } catch {}
  } catch (err) {
    console.error("Database schema init error:", err);
  }

  return database;
}

const db = initDatabase();

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

function isTokenExpired(token?: string): boolean {
  if (!token) return true;
  const claims = decodeJwtPayload(token);
  if (!claims.exp || typeof claims.exp !== "number") return false;
  return Date.now() >= (claims.exp * 1000 - 30000);
}

function getBaseUrl(): string {
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  const envUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (isServerless) {
    // If envUrl is missing or accidentally set to localhost in Vercel environment variables, override it
    if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
      if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
      }
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      return process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://admin.phasardigital.com";
    }
  }

  return envUrl || "http://localhost:3000";
}

const currentBaseUrl = getBaseUrl();

export const auth = betterAuth({
  database: db,
  baseURL: currentBaseUrl,
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "pWGg2GuYg9Xgc6GnGwBONAUmnhyyOqio6+qwFymZfgQ=",
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://admin.phasardigital.com",
    "https://admin.phsardigital.com",
    "https://phasardigital.com",
    "https://phsardigital.com",
    "https://phsardigital-final-admin.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
  ],
  user: {
    additionalFields: {
      // Comma-separated Keycloak realm roles, e.g. "ADMIN,SELLER".
      roles: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
      },
      accessToken: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false,
      },
      idToken: {
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
          redirectURI: `${currentBaseUrl}/api/auth/oauth2/callback/keycloak`,
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
              accessToken: tokens.accessToken || "",
              idToken: tokens.idToken || "",
              roles: serializeRoles([
                ...extractRealmRoles(accessClaims),
                ...extractRealmRoles(idClaims),
              ]),
            };

            return profile;
          },
          mapProfileToUser: (profile) => {
            const p = profile as Record<string, unknown>;
            const mapped: Partial<User> & {
              roles: string;
              accessToken?: string;
              idToken?: string;
            } = {
              roles: typeof p.roles === "string" ? p.roles : "",
              accessToken: typeof p.accessToken === "string" ? p.accessToken : "",
              idToken: typeof p.idToken === "string" ? p.idToken : "",
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
 */
export async function getKeycloakIdToken(userId: string, headers?: Headers): Promise<string | null> {
  if (headers) {
    try {
      const session = await getServerSession(headers);
      const user = session?.user as (User & { idToken?: string }) | undefined;
      if (user?.idToken) return user.idToken;
    } catch {
      // fallback to DB
    }
  }

  try {
    const row = db
      .prepare(
        "select idToken from account where userId = ? and providerId = 'keycloak' order by updatedAt desc limit 1",
      )
      .get(userId) as { idToken: string | null } | undefined;

    return row?.idToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Perform server-side backchannel logout and token revocation with Keycloak.
 * Avoids browser redirect crashes when external IdPs (like Google) fail Single Logout.
 */
export async function backchannelKeycloakLogout(userId: string): Promise<void> {
  const issuer = process.env.KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  if (!issuer || !clientId) return;

  try {
    const row = db
      .prepare(
        "select accessToken, refreshToken from account where userId = ? and providerId = 'keycloak' order by updatedAt desc limit 1",
      )
      .get(userId) as { accessToken: string | null; refreshToken: string | null } | undefined;

    const tokenEndpoint = `${issuer.replace(/\/$/, "")}/protocol/openid-connect/logout`;
    const revokeEndpoint = `${issuer.replace(/\/$/, "")}/protocol/openid-connect/revoke`;

    if (row?.refreshToken) {
      try {
        const body = new URLSearchParams({
          client_id: clientId,
          ...(clientSecret ? { client_secret: clientSecret } : {}),
          refresh_token: row.refreshToken,
        });
        await fetch(tokenEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
          cache: "no-store",
        });
      } catch (err) {
        console.warn("[auth] Keycloak backchannel logout error:", err);
      }

      try {
        const body = new URLSearchParams({
          client_id: clientId,
          ...(clientSecret ? { client_secret: clientSecret } : {}),
          token: row.refreshToken,
          token_type_hint: "refresh_token",
        });
        await fetch(revokeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
          cache: "no-store",
        });
      } catch (err) {
        console.warn("[auth] Keycloak refresh token revoke error:", err);
      }
    }

    if (row?.accessToken) {
      try {
        const body = new URLSearchParams({
          client_id: clientId,
          ...(clientSecret ? { client_secret: clientSecret } : {}),
          token: row.accessToken,
          token_type_hint: "access_token",
        });
        await fetch(revokeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
          cache: "no-store",
        });
      } catch (err) {
        console.warn("[auth] Keycloak access token revoke error:", err);
      }
    }

    // Clear stored tokens in SQLite for this user
    try {
      db.prepare(`
        UPDATE account
        SET accessToken = null,
            refreshToken = null,
            idToken = null,
            accessTokenExpiresAt = null,
            updatedAt = ?
        WHERE userId = ? AND providerId = 'keycloak'
      `).run(new Date().toISOString(), userId);

      db.prepare(`
        UPDATE "user"
        SET accessToken = '',
            idToken = '',
            updatedAt = ?
        WHERE id = ?
      `).run(new Date().toISOString(), userId);
    } catch (dbErr) {
      console.warn("[auth] Error clearing account tokens in SQLite:", dbErr);
    }
  } catch (err) {
    console.error("[auth] Error during backchannel Keycloak logout:", err);
  }
}

/**
 * Refreshes an expired Keycloak access token using the stored refresh token.
 * Updates both the `account` and `user` tables upon successful refresh.
 */
export async function refreshKeycloakAccessToken(
  userId: string,
  refreshToken: string,
): Promise<string | null> {
  const issuer = process.env.KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  if (!issuer || !clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const tokenEndpoint = `${issuer.replace(/\/$/, "")}/protocol/openid-connect/token`;

  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });

    const res = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[auth] Keycloak token refresh failed (${res.status}):`, errText);
      return null;
    }

    const data = (await res.json()) as {
      access_token?: string;
      refresh_token?: string;
      id_token?: string;
      expires_in?: number;
    };

    if (!data.access_token) {
      return null;
    }

    const now = new Date();
    const expiresAt = typeof data.expires_in === "number"
      ? new Date(now.getTime() + data.expires_in * 1000).toISOString()
      : null;

    try {
      db.prepare(`
        UPDATE account
        SET accessToken = ?,
            refreshToken = coalesce(?, refreshToken),
            idToken = coalesce(?, idToken),
            accessTokenExpiresAt = coalesce(?, accessTokenExpiresAt),
            updatedAt = ?
        WHERE userId = ? AND providerId = 'keycloak'
      `).run(
        data.access_token,
        data.refresh_token ?? null,
        data.id_token ?? null,
        expiresAt,
        now.toISOString(),
        userId,
      );

      db.prepare(`
        UPDATE "user"
        SET accessToken = ?,
            idToken = coalesce(?, idToken),
            updatedAt = ?
        WHERE id = ?
      `).run(
        data.access_token,
        data.id_token ?? null,
        now.toISOString(),
        userId,
      );
    } catch (dbErr) {
      console.error("[auth] Failed to persist refreshed Keycloak tokens:", dbErr);
    }

    return data.access_token;
  } catch (err) {
    console.error("[auth] Error refreshing Keycloak access token:", err);
    return null;
  }
}

/**
 * Ensures a valid (non-expired) Keycloak access token is available for the given user,
 * automatically performing a refresh against Keycloak if needed.
 */
export async function getValidKeycloakTokenForUser(
  userId: string,
  userAccessToken?: string,
): Promise<string | null> {
  // 1. Check user token in memory / session
  if (userAccessToken && !isTokenExpired(userAccessToken)) {
    return userAccessToken;
  }

  // 2. Query account table
  try {
    const row = db
      .prepare(
        "select accessToken, refreshToken from account where userId = ? and providerId = 'keycloak' order by updatedAt desc limit 1",
      )
      .get(userId) as { accessToken: string | null; refreshToken: string | null } | undefined;

    if (row?.accessToken && !isTokenExpired(row.accessToken)) {
      return row.accessToken;
    }

    // 3. If accessToken is expired but refreshToken exists, refresh it
    if (row?.refreshToken) {
      const refreshedToken = await refreshKeycloakAccessToken(userId, row.refreshToken);
      if (refreshedToken && !isTokenExpired(refreshedToken)) {
        return refreshedToken;
      }
    }
  } catch (err) {
    console.error("[auth] Error querying account for token:", err);
  }

  return null;
}

/**
 * Gate a route handler on the Keycloak ADMIN realm role.
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

  // Verify that the user has an active, valid Keycloak token or can refresh it
  const authHeaders = await getAuthHeader(request);
  if (!authHeaders.Authorization) {
    return NextResponse.json(
      {
        message: "Your session has expired. Please sign in again.",
        code: "SESSION_EXPIRED",
      },
      { status: 401 },
    );
  }

  return null;
}

export async function getAuthHeader(request: Request): Promise<Record<string, string>> {
  const incomingAuth = request.headers.get("authorization");
  if (incomingAuth) {
    const token = incomingAuth.startsWith("Bearer ")
      ? incomingAuth.slice(7).trim()
      : incomingAuth;
    if (!isTokenExpired(token)) {
      return { Authorization: incomingAuth };
    }
    console.warn("[auth] Incoming Authorization header token is expired. Falling back to session token...");
  }

  try {
    const session = await getServerSession(request.headers);
    const user = session?.user as (User & { accessToken?: string; id?: string }) | undefined;

    if (!user?.id) {
      return {};
    }

    const validToken = await getValidKeycloakTokenForUser(user.id, user.accessToken);
    if (validToken) {
      return { Authorization: `Bearer ${validToken}` };
    }
  } catch (err) {
    console.error("Error retrieving or refreshing the Keycloak access token:", err);
  }

  return {};
}
