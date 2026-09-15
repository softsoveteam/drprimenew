"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import Link from "next/link";
import {
  Menu,
  LogOut,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Home,
} from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, logout, toggleSidebar } = useAdminStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Logout mutation via TanStack Query and Axios Interceptor
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.post("/admin/logout");
      } catch (err) {
        console.warn("Backend logout notification failed:", err);
      }
    },
    onSettled: () => {
      logout();
      router.replace("/auth-cp/login");
    },
  });

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const crumbs = [];

    if (parts.length > 1) {
      const section = parts[1];
      const sectionName =
        section.charAt(0).toUpperCase() + section.slice(1).replace("-", " ");
      crumbs.push({ name: sectionName, href: `/auth-cp/${section}` });

      if (parts.length > 2) {
        const sub = parts[2];
        const subName = sub.charAt(0).toUpperCase() + sub.slice(1).replace("-", " ");
        crumbs.push({ name: subName, href: pathname });
      }
    } else {
      crumbs.push({ name: "Dashboard", href: "/auth-cp/dashboard" });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between transition-all shadow-xs">
      {/* Left side: Sidebar Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs Trail */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-hidden">
          <Link
            href="/auth-cp/dashboard"
            className="flex items-center gap-1 hover:text-[#1d1c50] transition-colors shrink-0"
          >
            <Home className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Admin</span>
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "font-semibold text-slate-900 truncate"
                    : "hover:text-slate-900 transition-colors truncate"
                }
              >
                {crumb.name}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right side: Quick Store Link & Admin User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all shadow-2xs"
          title="Open public website in a new tab"
        >
          <span>View Store</span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer select-none"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#1d1c50] to-[#363380] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {admin?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {admin?.role?.toUpperCase() || "ADMIN"}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl z-50 p-2 animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {admin?.name || "Administrator"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {admin?.email || "admin@mydrprime.com"}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Verified Session</span>
                  </div>
                </div>

                <Link
                  href="/auth-cp/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Account Settings</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logoutMutation.mutate();
                  }}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LogOut className="h-3.5 w-3.5" />
                  )}
                  <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
