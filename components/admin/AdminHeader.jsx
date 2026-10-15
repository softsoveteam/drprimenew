"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { useAdminLogout } from "@/hooks/useAdminAuth";
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
  Sparkles,
  Command,
  Settings,
  Bell,
} from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const { admin, toggleSidebar } = useAdminStore();
  const logoutMutation = useAdminLogout();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const currentAdmin = admin;

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const crumbs = [];

    if (parts.length > 1) {
      const section = parts[1];
      const sectionName =
        section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, " ");
      crumbs.push({ name: sectionName, href: `/auth-cp/${section}` });

      if (parts.length > 2) {
        const sub = parts[2];
        const subName = decodeURIComponent(sub).replace(/-/g, " ");
        const formattedName = subName.charAt(0).toUpperCase() + subName.slice(1);
        crumbs.push({ name: formattedName, href: pathname });
      }
    } else {
      crumbs.push({ name: "Dashboard", href: "/auth-cp/dashboard" });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all shadow-xs">
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
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors shrink-0"
          >
            <Home className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline font-semibold">Admin</span>
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
              <Link
                href={crumb.href}
                className={
                  idx === breadcrumbs.length - 1
                    ? "px-2 py-1 rounded-lg bg-indigo-50/80 text-indigo-700 font-bold truncate border border-indigo-100"
                    : "px-1.5 py-0.5 rounded text-slate-600 hover:text-slate-900 transition-colors truncate"
                }
              >
                {crumb.name}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Right side: Live indicator, Store Link & Admin Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* System Health Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Store Live</span>
        </div>

        {/* View Live Store */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-all shadow-xs group"
          title="Open public website in a new tab"
        >
          <span>View Store</span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer select-none ring-1 ring-transparent hover:ring-slate-200"
          >
            <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentAdmin?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {currentAdmin?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {currentAdmin?.role?.toUpperCase() || "ADMIN"}
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
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl text-slate-900 shadow-2xl z-50 p-2 animate-in fade-in-50 zoom-in-95">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {currentAdmin?.name?.charAt(0) || "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentAdmin?.name || "Administrator"}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentAdmin?.email || "admin@mydrprime.com"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Verified Authenticated Session</span>
                  </div>
                </div>

                <Link
                  href="/auth-cp/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Account Profile</span>
                </Link>

                <Link
                  href="/auth-cp/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>System Settings</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logoutMutation.mutate();
                  }}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold disabled:opacity-50 cursor-pointer"
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
