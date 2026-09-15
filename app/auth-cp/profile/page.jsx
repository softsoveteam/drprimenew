"use client";

import { useAdminProfile, useAdminLogout } from "@/hooks/useAdminAuth";
import { useAdminStore } from "@/lib/store/useAdminStore";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Clock,
  KeyRound,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminProfilePage() {
  const { admin } = useAdminStore();
  const { data: profile, isLoading, isRefetching, refetch } = useAdminProfile();
  const logoutMutation = useAdminLogout();

  const user = profile || admin;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#1d1c50] to-[#3b38a0] text-white flex items-center justify-center font-extrabold text-2xl shadow-md ring-4 ring-indigo-50">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user?.name || "Administrator"}</h1>
              <Badge className="bg-[#1d1c50] text-white text-[10px] font-semibold">
                {user?.role?.toUpperCase() || "ADMIN"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{user?.email || "admin@mydrprime.com"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isRefetching ? "animate-spin text-[#1d1c50]" : ""}`}
            />
            <span>{isRefetching ? "Refreshing..." : "Refresh Profile"}</span>
          </Button>

          <Button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            variant="destructive"
            size="sm"
            className="rounded-xl text-xs font-semibold cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
          </Button>
        </div>
      </div>

      {/* Main Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <Card className="md:col-span-2 border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/40 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#1d1c50]" />
              <CardTitle className="text-base font-bold text-slate-900">
                Administrator Account Details
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Account identity information retrieved from `/api/admin/me`
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Full Name
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.name || "N/A"}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.email || "N/A"}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Assigned Role
                </span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-bold text-slate-900">
                    {user?.role?.toUpperCase() || "ADMINISTRATOR"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Account Status
                </span>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {user?.is_active !== false ? "Active & Verified" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Member Since</span>
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {formatDate(user?.created_at)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Last Updated</span>
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {formatDate(user?.updated_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Session Info */}
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/40 p-5">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-[#1d1c50]" />
              <CardTitle className="text-base font-bold text-slate-900">
                Security & Session
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Active authentication session
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Server className="h-3 w-3" />
                <span>Backend API Host</span>
              </span>
              <p className="text-xs font-mono text-slate-800 break-all">
                {process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.61:8002/api"}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Auth Mechanism</span>
                <span className="font-semibold text-slate-900">Sanctum Bearer Token</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Session Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Authenticated
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">User ID</span>
                <span className="font-mono font-bold text-slate-900">#{user?.id || "1"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
