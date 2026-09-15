"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Inbox,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
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
        title: "Areas Management",
        href: "/auth-cp/areas",
        icon: FolderTree,
      },
      {
        title: "FAQs & Knowledge",
        href: "/auth-cp/faqs",
        icon: HelpCircle,
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
      {
        title: "Contact Form Fields",
        href: "/auth-cp/contact-fields",
        icon: FileText,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, admin } = useAdminStore();

  const currentAdmin = admin;
  const initials = currentAdmin?.name
    ? currentAdmin.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  // Close sidebar on mobile when a nav item is clicked
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out select-none",
          "bg-[#09090f] border-r border-white/[0.06]",
          isSidebarOpen ? "w-60" : "w-[68px] max-lg:-translate-x-full"
        )}
        style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div
          className={cn(
            "h-[60px] shrink-0 flex items-center border-b border-white/[0.06] px-3.5 gap-3",
            !isSidebarOpen && "justify-center px-0"
          )}
        >
          {/* Logo Mark */}
          <Link
            href="/auth-cp/dashboard"
            className="flex items-center gap-3 min-w-0 overflow-hidden"
          >
            <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40 ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-white tracking-tight leading-none truncate">
                  Dr.Prime
                </span>
                <span className="text-[9px] text-white/30 font-medium tracking-[0.12em] uppercase mt-0.5">
                  Admin Panel
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle */}
          {isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md text-white/25 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer ml-auto"
              title="Collapse"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 py-3 scrollbar-thin">
          <nav className={cn("flex flex-col gap-2", isSidebarOpen ? "px-2.5" : "px-1.5")}>
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx}>
                {/* Group Label */}
                {isSidebarOpen && (
                  <div className="px-2 mb-1.5 text-[9px] font-bold tracking-[0.14em] uppercase text-white/20">
                    {group.label}
                  </div>
                )}

                {/* Group Items */}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/auth-cp/dashboard" &&
                        pathname.startsWith(item.href));

                    return (
                      /* Tooltip wrapper — only active when collapsed */
                      <div
                        key={item.href}
                        className={cn(
                          "relative group/tooltip",
                          !isSidebarOpen && "flex justify-center"
                        )}
                      >
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          className={cn(
                            "relative flex items-center gap-3 rounded-lg text-xs font-medium transition-all duration-150 group w-full",
                            isSidebarOpen ? "px-2.5 py-2" : "justify-center py-2",
                            isActive
                              ? "bg-white/[0.08] text-white"
                              : "text-white/35 hover:text-white/75 hover:bg-white/[0.04]"
                          )}
                        >
                          {/* Active left indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-violet-400" />
                          )}

                          {/* Icon wrapper */}
                          <span
                            className={cn(
                              "flex items-center justify-center shrink-0 h-7 w-7 rounded-md transition-all",
                              isActive
                                ? "bg-violet-600/20 text-violet-300"
                                : "text-white/30 group-hover:text-white/60 group-hover:bg-white/5"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>

                          {/* Label */}
                          {isSidebarOpen && (
                            <span className="flex-1 truncate leading-none">{item.title}</span>
                          )}

                          {/* Active dot on collapsed */}
                          {!isSidebarOpen && isActive && (
                            <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-violet-400" />
                          )}
                        </Link>

                        {/* Tooltip — only shown when collapsed */}
                        {!isSidebarOpen && (
                          <div
                            className={cn(
                              "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50",
                              "opacity-0 translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0",
                              "transition-all duration-150 ease-out"
                            )}
                          >
                            {/* Arrow */}
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1e1d30] rotate-45 border-l border-t border-white/[0.08]" />
                            {/* Bubble */}
                            <span className="relative block whitespace-nowrap rounded-lg bg-[#1e1d30] border border-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-white/80 shadow-xl shadow-black/40">
                              {item.title}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className={cn(
          "shrink-0 border-t border-white/[0.06] p-2.5 flex flex-col gap-1.5",
          !isSidebarOpen && "items-center"
        )}>
          {/* View Site */}
          <div className="relative group/tooltip">
            <Link
              href="/"
              target="_blank"
              className={cn(
                "flex items-center gap-2.5 rounded-lg text-[11px] font-medium text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all group w-full",
                isSidebarOpen ? "px-2.5 py-2" : "justify-center p-2"
              )}
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              {isSidebarOpen && <span>View Live Site</span>}
            </Link>
            {/* Tooltip for View Site when collapsed */}
            {!isSidebarOpen && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 transition-all duration-150 ease-out">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1e1d30] rotate-45 border-l border-t border-white/[0.08]" />
                <span className="relative block whitespace-nowrap rounded-lg bg-[#1e1d30] border border-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-white/80 shadow-xl shadow-black/40">
                  View Live Site
                </span>
              </div>
            )}
          </div>

          {/* User Avatar */}
          {isSidebarOpen ? (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-all cursor-default mt-0.5 border-t border-white/[0.04] pt-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600/40 to-indigo-600/40 border border-violet-500/20 flex items-center justify-center text-[11px] font-bold text-violet-200 shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-white/80 truncate leading-none">
                  {currentAdmin?.name || "Administrator"}
                </span>
                <span className="text-[9px] text-white/25 truncate mt-0.5 tracking-wide uppercase">
                  {currentAdmin?.role || "Admin"}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative group/tooltip flex flex-col items-center gap-1.5 mt-0.5 border-t border-white/[0.04] pt-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600/40 to-indigo-600/40 border border-violet-500/20 flex items-center justify-center text-[11px] font-bold text-violet-200">
                {initials}
              </div>
              <button
                onClick={toggleSidebar}
                className="h-6 w-6 flex items-center justify-center rounded-md text-white/25 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="h-3.5 w-3.5" />
              </button>
              {/* Avatar tooltip when collapsed */}
              <div className="pointer-events-none absolute left-full top-0 ml-3 z-50 opacity-0 translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 transition-all duration-150 ease-out">
                <div className="absolute -left-1 top-3.5 -translate-y-1/2 w-2 h-2 bg-[#1e1d30] rotate-45 border-l border-t border-white/[0.08]" />
                <span className="relative block whitespace-nowrap rounded-lg bg-[#1e1d30] border border-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-white/80 shadow-xl shadow-black/40">
                  {currentAdmin?.name || "Administrator"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
