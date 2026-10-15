"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/lib/store/useAdminStore";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Toaster } from "react-hot-toast";
import { useAdminShopFeature } from "@/hooks/useAdminShopFeature";
import { isAdminShopPath } from "@/lib/shop-paths";

export default function AuthCpLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen } = useAdminStore();
  const isAuthPage = pathname === "/auth-cp/login" || pathname === "/auth-cp";
  const { shopEnabled, isFetched } = useAdminShopFeature(!isAuthPage);
  const hideShopPage = !isAuthPage && isAdminShopPath(pathname) && (!isFetched || !shopEnabled);

  useEffect(() => {
    if (!isAuthPage && isAdminShopPath(pathname) && isFetched && !shopEnabled) {
      router.replace("/auth-cp/dashboard");
    }
  }, [isAuthPage, pathname, isFetched, shopEnabled, router]);

  if (isAuthPage) {
    return <div className="admin-theme min-h-screen bg-slate-50 text-slate-900">{children}</div>;
  }

  return (
    <AdminGuard>
      <div className="admin-theme min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.07),rgba(255,255,255,0))] text-slate-900 flex antialiased selection:bg-indigo-600 selection:text-white">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "lg:ml-64" : "lg:ml-[72px]"
          )}
        >
          {/* Top Admin Header */}
          <AdminHeader />

          {/* Page Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 space-y-6">
            {hideShopPage ? null : children}
          </main>

          {/* Admin Footer */}
          <footer className="border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-400 bg-white/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-600">Dr.Prime Management Cloud</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-[11px] text-slate-400">Enterprise v2.5</span>
            </div>
            <div className="text-[11px] text-slate-400">
              &copy; {new Date().getFullYear()} Dr.Prime Pillow &bull; All Rights Reserved
            </div>
          </footer>
        </div>
      </div>
      <Toaster position="top-right" />
    </AdminGuard>
  );
}
