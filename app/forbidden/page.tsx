import Image from "next/image";
import { headers } from "next/headers";
import { ShieldAlertIcon, LogOutIcon } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { ADMIN_ROLE, parseRoles } from "@/lib/roles";

export default async function ForbiddenPage() {
  const session = await getServerSession(await headers());
  const user = session?.user;
  const roles = parseRoles(user?.roles).filter(
    (role) => !role.startsWith("default-roles-") && role !== "offline_access" && role !== "uma_authorization",
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative z-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="size-20 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-rose-100">
            <ShieldAlertIcon className="size-9 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Access denied</h1>
          <p className="text-gray-500 font-medium">
            The Phsar Digital admin panel is restricted to accounts holding the{" "}
            <span className="font-bold text-gray-700">{ADMIN_ROLE}</span> role.
          </p>
        </div>

        {user && (
          <div className="bg-[#f8f7ff] rounded-2xl p-5 border border-purple-100/50 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Signed in as
            </p>
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 mb-3">{user.email}</p>
            <div className="flex flex-wrap gap-1.5">
              {roles.length > 0 ? (
                roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-600 border border-gray-200"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-[11px] font-medium text-gray-400">No roles assigned</span>
              )}
            </div>
          </div>
        )}

        <a
          href="/logout"
          className="w-full h-14 bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl font-bold text-base transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
        >
          <LogOutIcon size={18} />
          Sign in with a different account
        </a>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
          <Image
            src="/Phsar Digital purple-light.png"
            alt="Phsar Digital"
            width={18}
            height={18}
            className="object-contain"
          />
          <p className="text-xs text-gray-400 font-medium">
            Contact an administrator if you believe this is a mistake.
          </p>
        </div>
      </div>
    </div>
  );
}
