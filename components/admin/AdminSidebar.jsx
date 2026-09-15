"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/lib/store/useAdminStore";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Inbox,
  Image as ImageIcon,
  Settings,
  ChevronLeft,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/auth-cp/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Content & Catalog",
    items: [
      {
        title: "Articles & Blog",
        href: "/auth-cp/articles",
        icon: FileText,
      },
      {
        title: "Taxonomy & Categories",
        href: "/auth-cp/categories",
        icon: FolderTree,
      },
      {
        title: "Media Assets",
        href: "/auth-cp/media",
        icon: ImageIcon,
      },
    ],
  },
  {
    label: "Customer & Leads",
    items: [
      {
        title: "Contact Inquiries",
        href: "/auth-cp/inquiries",
        icon: Inbox,
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "System Settings",
        href: "/auth-cp/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, admin, logout } = useAdminStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-[#0f0e26] text-slate-200 border-r border-[#1e1d44] transition-all duration-300 ease-in-out flex flex-col shadow-2xl",
          isSidebarOpen ? "w-64" : "w-20 max-lg:-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e1d44] bg-[#0c0b20]">
          <Link
            href="/auth-cp/dashboard"
            className={cn(
              "flex items-center gap-3 transition-opacity overflow-hidden",
              !isSidebarOpen && "lg:justify-center w-full"
            )}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#3b38a0] to-[#5b57d9] flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-950/50 shrink-0 ring-1 ring-white/10">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base tracking-tight text-white truncate">
                  Dr.Prime
                </span>
                <span className="text-[10px] text-indigo-300/70 font-semibold tracking-wider uppercase">
                  Control Center
                </span>
              </div>
            )}
          </Link>

          {isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Grouped Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-5 scrollbar-thin">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {isSidebarOpen && (
                <div className="px-3 text-[11px] font-bold tracking-wider text-slate-400/80 uppercase mb-1.5">
                  {group.label}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/auth-cp/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative",
                      isActive
                        ? "bg-gradient-to-r from-[#2a2868] to-[#363380] text-white shadow-md shadow-indigo-950/40 border border-indigo-500/30"
                        : "text-slate-300/80 hover:text-white hover:bg-white/5",
                      !isSidebarOpen && "justify-center px-2 py-3"
                    )}
                    title={!isSidebarOpen ? item.title : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-400 rounded-r-full" />
                    )}

                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110",
                        isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-white"
                      )}
                    />

                    {isSidebarOpen && (
                      <span className="truncate flex-1">{item.title}</span>
                    )}

                    {isSidebarOpen && isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-indigo-300/60 shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer (User info & View Store) */}
        <div className="p-3 border-t border-[#1e1d44] bg-[#0c0b20] space-y-2">
          <Link
            href="/"
            target="_blank"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors group",
              !isSidebarOpen && "justify-center px-2"
            )}
            title="Open Live Website in New Tab"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-300" />
            {isSidebarOpen && <span className="truncate">View Public Store</span>}
          </Link>

          {isSidebarOpen && (
            <div className="pt-2 border-t border-[#1e1d44]/60 flex items-center justify-between px-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-7 w-7 rounded-lg bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-xs font-bold text-indigo-200 shrink-0">
                  {admin?.name?.charAt(0) || "A"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    {admin?.name || "Administrator"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {admin?.role?.toUpperCase() || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
