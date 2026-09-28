"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "@/hooks/useCart";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

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

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useUserStore();
  const loggedIn = isAuthenticated || !!token;
  const { data, isLoading, error, refetch } = useCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();

  const items = data?.items || data?.data?.items || [];
  const summary = data?.summary || data?.data?.summary || {};
  const currency =
    summary.currency ||
    items[0]?.product?.currency ||
    items[0]?.currency ||
    "USD";

  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Continue shopping
            </Link>
            <h1 className="text-3xl font-bold text-[#1d1c50] font-serif !mb-0">Your Cart</h1>
            {!loggedIn && items.length > 0 && (
              <span className="text-xs text-[#4a4a6a] mt-2 block">
                Guest cart —{" "}
                <Link
                  href={`/login?redirect=${encodeURIComponent("/checkout")}`}
                  className="font-semibold text-[#1d1c50] underline"
                >
                  log in
                </Link>{" "}
                to checkout
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
              className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
            >
              Clear cart
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error.message}
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-3 underline font-semibold"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-[#1d1c50]/25 mx-auto mb-3" />
            <span className="font-semibold text-[#1d1c50] block">Your cart is empty</span>
            <Link
              href="/shop"
              className="inline-block mt-4 text-sm font-semibold text-[#1d1c50] underline"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            <ul className="space-y-4">
              {items.map((item) => {
                const product = item.product || item;
                const updating =
                  updateMutation.isPending && updateMutation.variables?.id === item.id;

                return (
                  <li
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#1d1c50]/10 p-4 flex gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl bg-[#f0ebe3] overflow-hidden shrink-0">
                      {(product.image_url || item.image_url) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url || item.image_url}
                          alt={product.title || item.title || ""}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-[#1d1c50] truncate !mb-0 text-base">
                        {product.title || item.title || `Product #${item.product_id}`}
                      </h2>
                      <span className="text-sm text-[#4a4a6a] mt-0.5 block">
                        {formatPrice(product.price || item.price, product.currency || currency)}{" "}
                        each
                      </span>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="inline-flex items-center border border-[#1d1c50]/15 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            disabled={item.quantity <= 1 || updating}
                            onClick={() =>
                              updateMutation.mutate({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            }
                            className="p-2 hover:bg-[#f8f5ed] disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-semibold tabular-nums min-w-[2rem] text-center">
                            {updating ? "…" : item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() =>
                              updateMutation.mutate({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                            className="p-2 hover:bg-[#f8f5ed] disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMutation.mutate(item.id)}
                          disabled={removeMutation.isPending}
                          className="p-2 text-slate-400 hover:text-rose-600"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#1d1c50] block">
                        {formatPrice(item.line_total, currency)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="bg-white rounded-2xl border border-[#1d1c50]/10 p-5 h-fit sticky top-28">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1d1c50]/50 !mb-4">
                Summary
              </h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#4a4a6a]">Items</span>
                <span className="font-medium text-[#1d1c50]">
                  {summary.item_count ?? items.reduce((n, i) => n + i.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1d1c50] pt-3 border-t border-[#1d1c50]/10 mb-5">
                <span>Subtotal</span>
                <span>{formatPrice(summary.subtotal || 0, currency)}</span>
              </div>
              {loggedIn ? (
                <Link
                  href="/checkout"
                  className="block w-full text-center py-3 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] transition-colors"
                >
                  Proceed to checkout
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/login?redirect=${encodeURIComponent("/checkout")}`)
                  }
                  className="block w-full text-center py-3 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] transition-colors"
                >
                  Log in to checkout
                </button>
              )}
              {loggedIn && (
                <Link
                  href="/orders"
                  className="block w-full text-center mt-3 text-xs font-semibold text-[#1d1c50]/60 hover:text-[#1d1c50]"
                >
                  My orders
                </Link>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
