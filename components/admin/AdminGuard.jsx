"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAdminStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check local storage token as fallback
    const storedToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null);

    if (!storedToken) {
      router.replace(`/auth-cp/login?redirect=${encodeURIComponent(pathname || "/auth-cp/dashboard")}`);
    } else {
      setIsChecking(false);
    }
  }, [token, isAuthenticated, router, pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Authenticating Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
