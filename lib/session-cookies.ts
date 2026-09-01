/**
 * Handling for the stale `better-auth.session_data` cookie.
 *
 * better-auth only *writes* this cookie when `session.cookieCache.enabled` is
 * set, which we deliberately leave off - caching the session in a cookie would
 * also cache `user.roles`, letting a demoted admin keep dashboard access until
 * the cache expired. But `getSession()` still *reads* and JSON-parses the
 * cookie unconditionally, and when the parse fails it never expires it:
 *
 *     const parsed = safeJSONParse(...);
 *     if (parsed)
 *       if (await verify(...)) sessionDataPayload = parsed;
 *       else expireCookie(...);   // <- only reached when `parsed` is truthy
 *
 * So a leftover cookie logs "[Better Auth]: Error parsing JSON" on every
 * request, forever. We strip it from anything we hand to better-auth and drop
 * it from the browser in `proxy.ts`.
 *
 * Kept free of Node-only imports so `proxy.ts` can use it.
 */

export const SESSION_DATA_COOKIE = "better-auth.session_data";

export function isSessionDataCookie(name: string): boolean {
  return name === SESSION_DATA_COOKIE || name.startsWith(`${SESSION_DATA_COOKIE}.`);
}

/** In serverless deployments, session_data cookie carries the signed session across lambdas */
export function stripSessionDataCookies(headers: Headers): Headers {
  return headers;
}
