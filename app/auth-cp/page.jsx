"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AuthCpRootPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAdminStore();

  useEffect(() => {
    const storedToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null);

    if (storedToken) {
      router.replace("/auth-cp/dashboard");
    } else {
      router.replace("/auth-cp/login");
    }
  }, [isAuthenticated, token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg animate-pulse">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Routing to Admin Panel...</span>
        </div>
      </div>
    </div>
  );
}
