import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import Database from "better-sqlite3";
import path from "path";

// Initialize a local SQLite database for session storage
const db = new Database(path.join(process.cwd(), ".better-auth.db"));

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KEYCLOAK_CLIENT_ID || "",
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
          discoveryUrl: `${process.env.KEYCLOAK_ISSUER}/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email"],
          prompt: "login",
          pkce: true,
        },
      ],
    }),
  ],
});

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
