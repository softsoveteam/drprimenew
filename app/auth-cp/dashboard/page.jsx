"use client";

import React from "react";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { LayoutDashboard, Clock, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { admin } = useAdminStore();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {admin?.name || "Administrator"} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dr.Prime Control Center Overview & System Analytics
          </p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white rounded-2xl p-12 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="max-w-md space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">
            Dashboard Coming Soon
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Analytics and overview widgets are currently under development. Please use the navigation sidebar to manage Articles, Areas, Form Fields, FAQs, and Inquiries.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mt-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Under Active Development</span>
        </div>
      </div>
    </div>
  );
}
