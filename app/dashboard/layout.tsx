import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";

/**
 * Authoritative gate for every /dashboard route. `proxy.ts` performs the same
 * check optimistically, but this server layout is what actually enforces it -
 * it runs on the server for each request and cannot be bypassed by a client.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(await headers());

  if (!session?.user) {
    redirect("/login");
  }

  if (!isAdmin(session.user)) {
    redirect("/forbidden");
  }

  return <>{children}</>;
}
