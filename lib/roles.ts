/**
 * Role helpers shared by the proxy, server components and route handlers.
 *
 * This module must stay free of Node-only imports (no `better-sqlite3`, no
 * `next/server`) so `proxy.ts` can import it without pulling in the database.
 */

export const ADMIN_ROLE = "ADMIN";

/** Collapse Keycloak realm roles into the comma-separated `user.roles` column. */
export function serializeRoles(roles: string[]): string {
  return Array.from(
    new Set(roles.map((role) => role.trim()).filter(Boolean)),
  ).join(",");
}

export function parseRoles(roles?: string | null): string[] {
  if (!roles) return [];
  return roles
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export function hasRole(roles: string | null | undefined, role: string): boolean {
  const wanted = role.toUpperCase();
  return parseRoles(roles).some((granted) => granted.toUpperCase() === wanted);
}

/** True only when the user carries the Keycloak realm role `ADMIN`. */
export function isAdmin(user?: { roles?: string | null } | null): boolean {
  return hasRole(user?.roles, ADMIN_ROLE);
}
