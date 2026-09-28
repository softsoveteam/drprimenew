"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import { useAddToCart } from "@/hooks/useCart";
import { Loader2, ShoppingBag, Package } from "lucide-react";

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

export default function ShopPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const addMutation = useAddToCart();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["products", { page, search }],
    queryFn: () =>
      getProducts({
        page,
        per_page: 12,
        search: search || undefined,
        in_stock: 1,
      }),
    keepPreviousData: true,
  });

  const products = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : [];
  const lastPage = data?.last_page || data?.data?.last_page || 1;
  const total = data?.total || data?.data?.total || products.length;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1d1c50]/50 mb-2">
              Shop
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1c50] font-serif tracking-tight">
              Products
            </h1>
            <p className="text-sm text-[#4a4a6a] mt-2 max-w-xl">
              Prices and stock come from the server. Guests can add to cart; log in to checkout with Stripe.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            View Cart
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="flex-1 rounded-xl border border-[#1d1c50]/15 bg-white px-4 py-2.5 text-sm text-[#1d1c50] outline-none focus:ring-2 focus:ring-[#1d1c50]/20"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl border border-[#1d1c50]/15 bg-white text-sm font-semibold text-[#1d1c50] hover:bg-[#1d1c50]/5 transition-colors"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error.message || "Failed to load products."}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
            <p className="text-sm text-[#4a4a6a]">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-[#1d1c50]/10 bg-white p-12 text-center">
            <Package className="w-10 h-10 text-[#1d1c50]/30 mx-auto mb-3" />
            <p className="text-[#1d1c50] font-semibold">No products found</p>
            <p className="text-sm text-[#4a4a6a] mt-1">
              {search ? "Try a different search." : "Check back soon — catalog is managed in admin."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#4a4a6a]">
              {total} product{total === 1 ? "" : "s"}
              {isFetching && !isLoading ? " · Updating…" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const inStock = product.in_stock && product.stock_quantity > 0;
                const adding =
                  addMutation.isPending &&
                  addMutation.variables?.product_id === product.id;

                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-3xl border border-[#1d1c50]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <Link href={`/shop/${product.id}`} className="block aspect-[4/3] bg-[#f0ebe3] relative">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-[#1d1c50]/20" />
                        </div>
                      )}
                      {!inStock && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide bg-slate-900/80 text-white px-2.5 py-1 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </Link>
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <div className="flex-1">
                        {product.sku && (
                          <p className="text-[10px] font-mono text-[#1d1c50]/40 mb-1">
                            {product.sku}
                          </p>
                        )}
                        <Link href={`/shop/${product.id}`}>
                          <h2 className="text-lg font-semibold text-[#1d1c50] leading-snug hover:underline">
                            {product.title}
                          </h2>
                        </Link>
                        <p className="text-xl font-bold text-[#1d1c50] mt-2">
                          {formatPrice(product.price, product.currency)}
                        </p>
                        {inStock && (
                          <p className="text-xs text-emerald-700 mt-1">
                            {product.stock_quantity} in stock
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={!inStock || adding}
                        onClick={() =>
                          addMutation.mutate({ product_id: product.id, quantity: 1 })
                        }
                        className="w-full py-2.5 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {adding ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding…
                          </>
                        ) : !inStock ? (
                          "Out of stock"
                        ) : (
                          "Add to cart"
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-[#1d1c50]/15 text-sm font-semibold text-[#1d1c50] disabled:opacity-40"
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
                  className="px-4 py-2 rounded-xl border border-[#1d1c50]/15 text-sm font-semibold text-[#1d1c50] disabled:opacity-40"
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
