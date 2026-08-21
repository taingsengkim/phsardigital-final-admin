import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

import { stripSessionDataCookies } from "@/lib/session-cookies";

const handler = toNextJsHandler(auth);

/**
 * `useSession()` on the client calls GET /api/auth/get-session, which reaches
 * better-auth directly rather than through `getServerSession()`. Strip the
 * stale `better-auth.session_data` cookie here too, or that path keeps logging
 * "Error parsing JSON". See lib/session-cookies.ts for the full explanation.
 *
 * Only GET is wrapped: rebuilding a Request is free when there is no body, but
 * re-wrapping a POST body would mean buffering it and passing `duplex`, which
 * is not worth the risk on the sign-in and sign-out endpoints. The proxy clears
 * the cookie from the browser anyway, so POSTs never see it twice.
 */
export const GET = (request: Request) => {
  const headers = stripSessionDataCookies(request.headers);
  return handler.GET(headers === request.headers ? request : new Request(request, { headers }));
};

export const POST = handler.POST;
