"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useUserProfile, useUserLogout } from "@/hooks/useUserAuth";
import { Button } from "@/components/ui/button";
import { User, Mail, ShieldCheck, LogOut, Loader2, ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user: storeUser } = useUserStore();
  const { data: profileUser, isLoading, error } = useUserProfile();
  const logoutMutation = useUserLogout();

  const user = profileUser || storeUser;

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading && !user) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          <p className="text-sm font-medium text-[#4a4a6a]">Loading user profile...</p>
        </div>
      </main>
    );
  }

  if (!user && !isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex flex-col justify-center items-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-[#1d1c50]/10">
          <h2 className="text-2xl font-bold text-[#1d1c50]">Access Denied</h2>
          <p className="text-sm text-[#4a4a6a] mt-2 mb-6">Please log in to view your profile page.</p>
          <Link href="/login">
            <Button className="bg-[#1d1c50] text-white hover:bg-[#1d1c50]/90 px-6 py-2.5 rounded-xl">
              Go to Login
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl flex items-center gap-2"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Profile Overview Banner */}
        <div className="bg-gradient-to-r from-[#1d1c50] to-[#2c2b6e] rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-[#1d1c50]/15 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#c9b896]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-[#c9b896] text-[#1d1c50] flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-white/10 shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
            </div>

            <div className="text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight font-serif">{user?.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Account
                </span>
              </div>
              <p className="text-white/70 text-sm">{user?.email}</p>
              <div className="pt-2 text-xs text-[#c9b896] font-medium tracking-wide uppercase">
                Customer Portal &bull; Role: {user?.role || "user"}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1d1c50]/10 space-y-6">
            <h2 className="text-xl font-bold text-[#1d1c50] font-serif border-b border-[#1d1c50]/10 pb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#c9b896]" />
              Personal Details
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider block">Full Name</span>
                <p className="font-semibold text-[#1d1c50] text-base mt-1">{user?.name}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider block">Email Address</span>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-[#4a4a6a]" />
                  <p className="font-semibold text-[#1d1c50] text-base">{user?.email}</p>
                </div>
              </div>

              {user?.created_at && (
                <div>
                  <span className="text-xs font-semibold text-[#4a4a6a]/60 uppercase tracking-wider block">Member Since</span>
                  <div className="flex items-center gap-2 mt-1 text-[#4a4a6a]">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account & Security */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1d1c50]/10 space-y-6">
            <h2 className="text-xl font-bold text-[#1d1c50] font-serif border-b border-[#1d1c50]/10 pb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#c9b896]" />
              Account Status & Security
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8f5ed]/70 border border-[#1d1c50]/5">
                <div>
                  <p className="font-semibold text-[#1d1c50]">Account Security</p>
                  <p className="text-xs text-[#4a4a6a]">Password and access session authenticated</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Secure
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8f5ed]/70 border border-[#1d1c50]/5">
                <div>
                  <p className="font-semibold text-[#1d1c50]">Account Role</p>
                  <p className="text-xs text-[#4a4a6a]">Access privilege level</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1d1c50]/10 text-[#1d1c50] capitalize">
                  {user?.role || "user"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
