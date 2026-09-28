"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import { getOrders } from "@/services/order.service";
import { ArrowLeft, Loader2, Package } from "lucide-react";

function formatPrice(price, currency = "USD") {
  const amount = Number(price);
  if (Number.isNaN(amount)) return String(price ?? "");
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
  canceled: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useUserStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.replace(`/login?redirect=${encodeURIComponent("/orders")}`);
    }
  }, [isAuthenticated, token, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", { page }],
    queryFn: () => getOrders({ page, per_page: 15 }),
    enabled: !!(isAuthenticated || token),
    keepPreviousData: true,
  });

  const orders = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];
  const lastPage = data?.last_page || data?.data?.last_page || 1;

  if (!isAuthenticated && !token) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </Link>
          <h1 className="text-3xl font-bold text-[#1d1c50] font-serif">My Orders</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error.message}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-12 text-center">
            <Package className="w-10 h-10 text-[#1d1c50]/25 mx-auto mb-3" />
            <p className="font-semibold text-[#1d1c50]">No orders yet</p>
            <Link href="/shop" className="text-sm font-semibold text-[#1d1c50] underline mt-3 inline-block">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="block bg-white rounded-2xl border border-[#1d1c50]/10 p-4 hover:border-[#1d1c50]/25 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-semibold text-[#1d1c50] block">
                          {order.order_number}
                        </span>
                        <span className="text-xs text-[#4a4a6a] mt-1 block">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString()
                            : ""}
                        </span>
                        {order.invoice_number && (
                          <span className="text-[11px] text-[#1d1c50]/60 mt-1 font-mono block">
                            Invoice {order.invoice_number}
                          </span>
                        )}
                      </div>
                      <div className="text-right space-y-2 shrink-0">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize ${
                            STATUS_STYLES[order.status] || STATUS_STYLES.pending
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-bold text-[#1d1c50] text-sm block">
                          {formatPrice(order.subtotal, order.currency)}
                        </span>
                        {order.status === "paid" && (
                          <span className="text-[10px] font-semibold text-indigo-600 block">
                            View / invoice →
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-[#1d1c50]/15 text-sm font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-[#4a4a6a]">
                  Page {page} of {lastPage}
                </span>
                <button
                  type="button"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-[#1d1c50]/15 text-sm font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
