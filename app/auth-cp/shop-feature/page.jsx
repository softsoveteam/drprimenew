"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Store, RefreshCw, CheckCircle2, Package, ExternalLink } from "lucide-react";
import { useAdminShopFeature } from "@/hooks/useAdminShopFeature";

function formatDateTime(isoString) {
  if (!isoString) return "Never synced";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return isoString;
  }
}

export default function ShopFeaturePage() {
  const {
    shopEnabled,
    lastSyncedAt,
    totalProducts,
    totalStock,
    isLoading,
    isError,
    isUpdating,
    isSyncingAmazon,
    refetch,
    setShopEnabled,
    syncAmazon,
  } = useAdminShopFeature();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shop Feature & Amazon Sync</h1>
        <p className="text-xs text-slate-500 mt-1">
          Control your storefront status and sync real-time products & FBA inventory from Amazon.
        </p>
      </div>

      {/* 1. Shop Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Shop Feature</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              When this is off, the store, cart, checkout, orders, and customer accounts stay hidden.
              The Amazon Buy Now button stays on the site.
            </p>
            {isError && (
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Could not load this setting. Try again.
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={shopEnabled}
          disabled={isLoading || isUpdating}
          onClick={() => setShopEnabled(!shopEnabled)}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
            shopEnabled ? "bg-indigo-600" : "bg-slate-300"
          }`}
        >
          <span className="sr-only">{shopEnabled ? "Turn shop off" : "Turn shop on"}</span>
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin text-white absolute top-2 left-5" />
          ) : (
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                shopEnabled ? "left-7" : "left-1"
              }`}
            />
          )}
        </button>
      </div>

      {/* 2. Amazon SP-API Sync Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Amazon SP-API Inventory Sync</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SP-API Connected
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                Fetches products, high-res photos, pricing, and live FBA inventory quantities
                directly from your Amazon Seller Central account into the website database.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSyncingAmazon || isLoading}
            onClick={() => syncAmazon()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAmazon ? "animate-spin text-slate-900" : ""}`} />
            {isSyncingAmazon ? "Syncing from Amazon..." : "Sync from Amazon"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Last Synced
            </span>
            <span className="text-sm font-bold text-slate-800">
              {formatDateTime(lastSyncedAt)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Active Store Products
            </span>
            <span className="text-sm font-bold text-slate-800">
              {totalProducts} product{totalProducts === 1 ? "" : "s"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Total FBA Inventory
            </span>
            <span className="text-sm font-bold text-emerald-700">
              {totalStock} units available
            </span>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 border-t border-slate-100">
          <span>Quick actions:</span>
          <Link
            href="/auth-cp/products"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
          >
            Manage Products
          </Link>
          <span>·</span>
          <Link
            href="/shop"
            target="_blank"
            className="font-semibold text-slate-700 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
          >
            Preview Public Shop <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
