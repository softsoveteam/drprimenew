"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { useAdminLogout } from "@/hooks/useAdminAuth";
import { useAdminShopFeature } from "@/hooks/useAdminShopFeature";
import { isAdminShopPath } from "@/lib/shop-paths";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Tag,
  LogOut,
  Sparkles,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/auth-cp/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Commerce & Sales",
    items: [
      {
        title: "Products Catalog",
        href: "/auth-cp/products",
        icon: Package,
      },
      {
        title: "Store Orders",
        href: "/auth-cp/orders",
        icon: ShoppingBag,
      },
      {
        title: "Amazon SP-API Sales",
        href: "/auth-cp/amazon-sales",
        icon: TrendingUp,
        badge: "Live",
      },
      {
        title: "Customer Users",
        href: "/auth-cp/users",
        icon: Users,
      },
    ],
  },
  {
    label: "Content & SEO",
    items: [
      {
        title: "Product Landing Copy",
        href: "/auth-cp/product-details",
        icon: Tag,
      },
      {
        title: "Articles & Blog",
        href: "/auth-cp/articles",
        icon: FileText,
      },
      {
        title: "Knowledge Base FAQs",
        href: "/auth-cp/faqs",
        icon: HelpCircle,
      },
      {
        title: "Chat Bot Assistant",
        href: "/auth-cp/bot-questions",
        icon: MessageCircle,
      },
    ],
  },
  {
    label: "Leads & Inquiries",
    items: [
      {
        title: "Contact Inquiries",
        href: "/auth-cp/inquiries",
        icon: Inbox,
      },
      {
        title: "Custom Form Fields",
        href: "/auth-cp/contact-fields",
        icon: FileText,
      },
    ],
  },
  {
    label: "System Settings",
    items: [
      {
        title: "Store Feature Toggle",
        href: "/auth-cp/shop-feature",
        icon: Store,
      },
      {
        title: "Admin Settings",
        href: "/auth-cp/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, admin } = useAdminStore();
  const { shopEnabled } = useAdminShopFeature();
  const logoutMutation = useAdminLogout();

  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => shopEnabled || !isAdminShopPath(item.href)),
  })).filter((group) => group.items.length > 0);

  const currentAdmin = admin;
  const initials = currentAdmin?.name
    ? currentAdmin.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "DP";

  const handleNavClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out select-none",
          "bg-[#0b0f19] border-r border-slate-800/80 text-slate-300",
          isSidebarOpen ? "w-64" : "w-[72px] max-lg:-translate-x-full"
        )}
        style={{
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Header / Brand */}
        <div
          className={cn(
            "h-16 shrink-0 flex items-center border-b border-slate-800/80 px-4 gap-2",
            !isSidebarOpen && "justify-center px-0"
          )}
        >
          <Link
            href="/auth-cp/dashboard"
            className="flex items-center gap-2.5 min-w-0 overflow-hidden group flex-1"
          >
            {isSidebarOpen ? (
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/assets/drprimelogo.png"
                  alt="Dr.Prime"
                  className="h-5 w-auto max-w-[115px] object-contain transition-opacity group-hover:opacity-90 shrink-0"
                />
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-semibold border border-slate-700 uppercase tracking-wider shrink-0">
                  ADMIN
                </span>
              </div>
            ) : (
              <div className="relative h-9 w-9 shrink-0 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-200 shadow-md transition-all group-hover:border-slate-600 group-hover:text-white">
                <ShieldCheck className="h-4.5 w-4.5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0b0f19]"></span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle */}
          {isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer ml-auto"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          <nav className={cn("flex flex-col gap-2.5", isSidebarOpen ? "px-3" : "px-2")}>
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {/* Group Label */}
                {isSidebarOpen && (
                  <div className="px-3 pt-2 pb-0.5 text-[10px] font-bold tracking-[0.14em] uppercase text-slate-500">
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
                            "relative flex items-center gap-3 rounded-xl text-xs font-medium transition-all duration-150 group w-full",
                            isSidebarOpen ? "px-3 py-2.5" : "justify-center p-2.5",
                            isActive
                              ? "bg-white/[0.08] text-white font-semibold shadow-xs"
                              : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                          )}
                        >
                          {/* Left Accent Bar when Active */}
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-indigo-500" />
                          )}

                          {/* Icon Container - Uniform slate transitioning to bright white on active */}
                          <span
                            className={cn(
                              "flex items-center justify-center shrink-0 h-5 w-5 transition-colors duration-150",
                              isActive
                                ? "text-indigo-400"
                                : "text-slate-400 group-hover:text-slate-200"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>

                          {/* Label & Optional Badge */}
                          {isSidebarOpen && (
                            <div className="flex-1 flex items-center justify-between min-w-0">
                              <span className="truncate leading-none">{item.title}</span>
                              {item.badge && (
                                <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>{item.badge}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Collapsed dot */}
                          {!isSidebarOpen && isActive && (
                            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          )}
                        </Link>

                        {/* Collapsed Tooltip */}
                        {!isSidebarOpen && (
                          <div
                            className={cn(
                              "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50",
                              "opacity-0 translate-x-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0",
                              "transition-all duration-150 ease-out"
                            )}
                          >
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-slate-700" />
                            <span className="relative flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-2xl">
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-400">
                                  {item.badge}
                                </span>
                              )}
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

        {/* Bottom Dock / User Profile */}
        <div
          className={cn(
            "shrink-0 border-t border-slate-800/80 p-3 bg-slate-950/60 flex flex-col gap-1.5",
            !isSidebarOpen && "items-center px-2"
          )}
        >
          {/* Quick External Store Link */}
          <Link
            href="/"
            target="_blank"
            className={cn(
              "flex items-center gap-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all group w-full",
              isSidebarOpen ? "px-3 py-2" : "justify-center p-2"
            )}
            title="Open Live Website"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors" />
            {isSidebarOpen && <span>View Public Store</span>}
          </Link>

          {/* User Profile Card */}
          {isSidebarOpen ? (
            <div className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800/80 transition-all mt-0.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shadow-sm shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate leading-none">
                    {currentAdmin?.name || "Administrator"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Admin Session</span>
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 mt-0.5">
              <div
                className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shadow-sm cursor-pointer"
                title={currentAdmin?.name || "Admin"}
              >
                {initials}
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Expand Navigation"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
