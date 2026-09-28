"use client";

import React from "react";
import { Loader2, Store } from "lucide-react";
import { useAdminShopFeature } from "@/hooks/useAdminShopFeature";

export default function ShopFeaturePage() {
  const { shopEnabled, isLoading, isError, isUpdating, refetch, setShopEnabled } =
    useAdminShopFeature();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shop Feature</h1>
        <p className="text-xs text-slate-500 mt-1">
          Turn the online store on or off without changing the rest of the site.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Shop</h2>
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
    </div>
  );
}
