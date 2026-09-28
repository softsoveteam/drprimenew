"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useUserProfile, useUserLogout } from "@/hooks/useUserAuth";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Loader2,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ShoppingBag,
  Package,
  ClipboardList,
} from "lucide-react";
import AddressBook from "@/components/account/AddressBook";

export default function UserProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user: storeUser } = useUserStore();
  const { data: profileUser, isLoading } = useUserProfile();
  const logoutMutation = useUserLogout();

  const user = profileUser || storeUser;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

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
          <span className="text-sm font-medium text-[#4a4a6a]">Loading user profile...</span>
        </div>
      </main>
    );
  }

  if (!user && !isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex flex-col justify-center items-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-[#1d1c50]/10">
          <h2 className="text-2xl font-bold text-[#1d1c50] !mb-0">Access Denied</h2>
          <span className="text-sm text-[#4a4a6a] mt-2 mb-6 block">
            Please log in to view your profile page.
          </span>
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
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

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#1d1c50] to-[#2c2b6e] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#1d1c50]/15 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#c9b896]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#c9b896] text-[#1d1c50] flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg ring-4 ring-white/10 shrink-0 leading-none">
              {initials}
            </div>

            <div className="flex flex-col items-start gap-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight !mb-0 leading-tight !text-white">
                  {user?.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </span>
              </div>
              <span className="text-white/70 text-sm leading-tight">{user?.email}</span>
              <span className="text-[#c9b896] text-[11px] font-medium tracking-wide uppercase leading-tight">
                Customer account
              </span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/shop"
            className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-[#1d1c50]/10 p-4 text-[#1d1c50] hover:border-[#1d1c50]/25 hover:shadow-sm transition-all"
          >
            <Package className="w-5 h-5 text-[#c9b896]" />
            <span className="text-xs font-semibold">Shop</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-[#1d1c50]/10 p-4 text-[#1d1c50] hover:border-[#1d1c50]/25 hover:shadow-sm transition-all"
          >
            <ShoppingBag className="w-5 h-5 text-[#c9b896]" />
            <span className="text-xs font-semibold">Cart</span>
          </Link>
          <Link
            href="/orders"
            className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-[#1d1c50]/10 p-4 text-[#1d1c50] hover:border-[#1d1c50]/25 hover:shadow-sm transition-all"
          >
            <ClipboardList className="w-5 h-5 text-[#c9b896]" />
            <span className="text-xs font-semibold">Orders</span>
          </Link>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1d1c50]/10">
            <h2 className="text-lg font-bold text-[#1d1c50] !mb-0 pb-3 mb-4 border-b border-[#1d1c50]/10 flex items-center gap-2">
              <User className="w-4 h-4 text-[#c9b896]" />
              Personal Details
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-semibold text-[#4a4a6a]/60 uppercase tracking-wider block">
                  Full Name
                </span>
                <span className="font-semibold text-[#1d1c50] text-sm mt-1 block leading-tight">
                  {user?.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[#4a4a6a]/60 uppercase tracking-wider block">
                  Email Address
                </span>
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  <Mail className="w-4 h-4 text-[#4a4a6a] shrink-0" />
                  <span className="font-semibold text-[#1d1c50] text-sm leading-tight truncate">
                    {user?.email}
                  </span>
                </div>
              </div>

              {user?.created_at && (
                <div>
                  <span className="text-[10px] font-semibold text-[#4a4a6a]/60 uppercase tracking-wider block">
                    Member Since
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[#4a4a6a]">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="text-sm leading-tight">
                      {new Date(user.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1d1c50]/10">
            <h2 className="text-lg font-bold text-[#1d1c50] !mb-0 pb-3 mb-4 border-b border-[#1d1c50]/10 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c9b896]" />
              Account Status
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f8f5ed] border border-[#1d1c50]/5">
                <div className="min-w-0">
                  <span className="font-semibold text-[#1d1c50] text-sm block leading-tight">
                    Account Security
                  </span>
                  <span className="text-[11px] text-[#4a4a6a] block mt-0.5 leading-tight">
                    Session authenticated
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                  Secure
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f8f5ed] border border-[#1d1c50]/5">
                <div className="min-w-0">
                  <span className="font-semibold text-[#1d1c50] text-sm block leading-tight">
                    Account Role
                  </span>
                  <span className="text-[11px] text-[#4a4a6a] block mt-0.5 leading-tight">
                    Shop customer
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#1d1c50]/10 text-[#1d1c50] capitalize shrink-0">
                  {user?.role || "user"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <AddressBook />
      </div>
    </main>
  );
}
