"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/product.service";
import { useAddToCart } from "@/hooks/useCart";
import { ArrowLeft, Loader2, Package, ExternalLink } from "lucide-react";

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

function galleryUrls(product) {
  const fromGallery = Array.isArray(product?.images)
    ? product.images
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img) => img.url || img.image_url)
        .filter(Boolean)
    : [];
  if (fromGallery.length) return fromGallery;
  if (product?.image_url) return [product.image_url];
  return [];
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;
  const addMutation = useAddToCart();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const product = data?.product || data?.data?.product || data;
  const images = useMemo(() => galleryUrls(product), [product]);
  const mainSrc = images[activeIndex] || images[0] || "";

  if (isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
      </main>
    );
  }

  if (error || !product?.id) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed]">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 text-center border border-[#1d1c50]/10">
          <h1 className="text-xl font-bold text-[#1d1c50]">Product not found</h1>
          <p className="text-sm text-[#4a4a6a] mt-2 mb-6">
            {error?.message || "This product is unavailable or inactive."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d1c50]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const inStock = product.in_stock && product.stock_quantity > 0;

  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl border border-[#1d1c50]/10 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 space-y-3 bg-[#f0ebe3]/60">
            <div className="aspect-square bg-[#f0ebe3] relative rounded-2xl overflow-hidden">
              {mainSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainSrc}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-[#1d1c50]/20" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === activeIndex
                        ? "border-[#1d1c50]"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 flex flex-col">
            {product.sku && (
              <p className="text-xs font-mono text-[#1d1c50]/40 mb-2">{product.sku}</p>
            )}
            <h1 className="text-3xl font-bold text-[#1d1c50] font-serif tracking-tight">
              {product.title}
            </h1>
            <p className="text-2xl font-bold text-[#1d1c50] mt-4">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className={`text-sm mt-2 ${inStock ? "text-emerald-700" : "text-rose-600"}`}>
              {inStock ? `${product.stock_quantity} in stock` : "Out of stock"}
            </p>

            <div className="mt-auto pt-8 space-y-3">
              <button
                type="button"
                disabled={!inStock || addMutation.isPending}
                onClick={() =>
                  addMutation.mutate({ product_id: product.id, quantity: 1 })
                }
                className="w-full py-3 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold hover:bg-[#2c2b6e] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {addMutation.isPending ? (
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
              {product.amazon_url && (
                <a
                  href={product.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl border border-[#1d1c50]/15 text-[#1d1c50] text-sm font-semibold hover:bg-[#f8f5ed] transition-colors flex items-center justify-center gap-2"
                >
                  View on Amazon <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {product.description ? (
          <section className="mt-8 bg-white rounded-3xl border border-[#1d1c50]/10 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#1d1c50] font-serif mb-4">Description</h2>
            <div
              className="product-description text-[#4a4a6a] text-sm sm:text-base leading-relaxed
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#1d1c50] [&_h1]:font-serif [&_h1]:mb-3
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1d1c50] [&_h2]:font-serif [&_h2]:mt-5 [&_h2]:mb-2
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#1d1c50] [&_h3]:mt-4 [&_h3]:mb-2
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_a]:text-[#1d1c50] [&_a]:font-semibold [&_a]:underline
                [&_strong]:text-[#1d1c50] [&_strong]:font-bold
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                [&_li]:my-1"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        ) : null}
      </div>
    </main>
  );
}
