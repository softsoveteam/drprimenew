"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/lib/store/useAdminStore";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Toaster } from "react-hot-toast";

export default function AuthCpLayout({ children }) {
  const pathname = usePathname();
  const { isSidebarOpen } = useAdminStore();

  // If on login or root redirect page, do not render sidebar/header
  const isAuthPage = pathname === "/auth-cp/login" || pathname === "/auth-cp";

  if (isAuthPage) {
    return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
        {/* Admin Navigation Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "lg:ml-60" : "lg:ml-[68px]"
          )}
        >
          {/* Top Admin Header */}
          <AdminHeader />

          {/* Page Content Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 space-y-6">
            {children}
          </main>

          {/* Admin Footer */}
          <footer className="border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-400 bg-white/60">
            &copy; {new Date().getFullYear()} Dr.Prime Control Panel &bull; Enterprise Management System
          </footer>
        </div>
      </div>
      <Toaster position="top-right" />
    </AdminGuard>
  );
}
