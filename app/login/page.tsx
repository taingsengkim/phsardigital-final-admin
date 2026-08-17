"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShieldIcon, KeyIcon } from "lucide-react";

export default function LoginPage() {
  const hasStartedLogin = useRef(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);

    try {
      const result = await signIn.oauth2({
        providerId: "keycloak",
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        setLoginError(result.error.message || "Unable to connect to Keycloak.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to connect to Keycloak.";
      console.error("Keycloak login error:", err);
      setLoginError(message);
    }
  };

  useEffect(() => {
    if (hasStartedLogin.current) return;

    hasStartedLogin.current = true;
    void handleLogin();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative z-10 border border-gray-100">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="size-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-100">
            <Image
              src="/Phsar Digital purple-light.png"
              alt="Phsar Digital Logo"
              width={50}
              height={50}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Log in to Phsar Digital Admin Panel</p>
          <p className="mt-2 text-sm text-gray-400">Redirecting to Keycloak...</p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#f8f7ff] rounded-2xl p-6 border border-purple-100/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#6338f6]">
                <ShieldIcon size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">Enterprise Security</p>
                <p className="text-xs text-gray-500">Secured by Keycloak</p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full h-14 bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl font-bold text-base transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 group"
            >
              <KeyIcon size={18} className="group-hover:rotate-12 transition-transform" />
              Sign in with Keycloak
            </Button>
            {loginError && (
              <p className="mt-3 text-center text-sm font-medium text-red-600">
                {loginError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 font-medium">
            Authorized personnel only. All access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
