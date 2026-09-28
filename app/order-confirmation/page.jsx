"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import { getOrderById, downloadOrderInvoice } from "@/services/order.service";
import { downloadBlob, orderHasInvoice } from "@/lib/utils";
import { CheckCircle2, FileDown, Loader2, XCircle } from "lucide-react";
import { Suspense } from "react";
import toast from "react-hot-toast";

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

async function waitUntilPaid(orderId) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const data = await getOrderById(orderId);
    const order = data?.order || data?.data?.order || data;

    if (order?.status === "paid") return order;
    if (order?.status === "failed" || order?.status === "canceled") {
      const err = new Error(order.payment_error || "Payment was not completed.");
      err.order = order;
      throw err;
    }

    await new Promise((r) => setTimeout(r, 1500));
  }
  return null;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, token } = useUserStore();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [shipping, setShipping] = useState(null);

  useEffect(() => {
    if (!orderId || typeof window === "undefined") return;
    const raw = sessionStorage.getItem(`checkout_shipping_${orderId}`);
    if (!raw) return;
    try {
      setShipping(JSON.parse(raw));
    } catch {
      setShipping(null);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/order-confirmation?order=${orderId || ""}`)}`
      );
    }
  }, [isAuthenticated, token, router, orderId]);

  useEffect(() => {
    if (!orderId || (!isAuthenticated && !token)) return;

    let cancelled = false;

    (async () => {
      try {
        const result = await waitUntilPaid(orderId);
        if (cancelled) return;
        if (!result) {
          setError(
            "Payment is still processing. Check My orders in a moment, or refresh this page."
          );
          setPolling(false);
          return;
        }
        setOrder(result);
        setPolling(false);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Payment was not completed.");
        setOrder(err?.order || null);
        setPolling(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, isAuthenticated, token, queryClient]);

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center border border-[#1d1c50]/10">
        <p className="text-[#1d1c50] font-semibold">Missing order id</p>
        <Link href="/orders" className="text-sm font-semibold text-[#1d1c50] underline mt-4 inline-block">
          My orders
        </Link>
      </div>
    );
  }

  if (polling) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
        <p className="text-sm text-[#4a4a6a]">Confirming payment…</p>
      </div>
    );
  }

  if (error && order?.status !== "paid") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center border border-[#1d1c50]/10 space-y-4">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h1 className="text-xl font-bold text-[#1d1c50]">Payment issue</h1>
        <p className="text-sm text-[#4a4a6a]">{error}</p>
        <div className="flex flex-col gap-2">
          <Link
            href="/orders"
            className="py-2.5 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold"
          >
            My orders
          </Link>
          <Link href="/cart" className="text-sm font-semibold text-[#1d1c50]">
            Back to cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl border border-[#1d1c50]/10 p-8 shadow-sm space-y-6">
      <div className="text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-[#1d1c50] font-serif">Payment confirmed</h1>
        <p className="text-sm text-[#4a4a6a] mt-1">Thank you for your order.</p>
      </div>

      <div className="rounded-2xl bg-[#f8f5ed] p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#4a4a6a]">Order</span>
          <span className="font-semibold text-[#1d1c50]">{order.order_number}</span>
        </div>
        {order.invoice_number && (
          <div className="flex justify-between">
            <span className="text-[#4a4a6a]">Invoice</span>
            <span className="font-semibold text-[#1d1c50] font-mono text-xs">
              {order.invoice_number}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#4a4a6a]">Status</span>
          <span className="font-semibold text-emerald-700 capitalize">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#4a4a6a]">Total</span>
          <span className="font-bold text-[#1d1c50]">
            {formatPrice(order.subtotal, order.currency)}
          </span>
        </div>
      </div>

      {(order.shipping?.name || shipping?.shipping_name || shipping?.name) && (
        <div className="text-sm border-t border-[#1d1c50]/10 pt-4 space-y-1">
          <p className="font-semibold text-[#1d1c50]">Shipping to</p>
          <p className="text-[#4a4a6a]">
            {order.shipping?.name || shipping?.shipping_name || shipping?.name}
          </p>
          <p className="text-[#4a4a6a]">
            {order.shipping?.address_line1 || shipping?.shipping_address_line1 || shipping?.address_line1}
            {(order.shipping?.address_line2 || shipping?.shipping_address_line2 || shipping?.address_line2)
              ? `, ${order.shipping?.address_line2 || shipping?.shipping_address_line2 || shipping?.address_line2}`
              : ""}
          </p>
          <p className="text-[#4a4a6a]">
            {[
              order.shipping?.city || shipping?.shipping_city || shipping?.city,
              order.shipping?.state || shipping?.shipping_state || shipping?.state,
              order.shipping?.postal_code || shipping?.shipping_postal_code || shipping?.postal_code,
            ]
              .filter(Boolean)
              .join(", ")}{" "}
            {order.shipping?.country || shipping?.shipping_country || shipping?.country}
          </p>
          {(order.shipping?.phone || shipping?.shipping_phone || shipping?.phone) && (
            <p className="text-[#4a4a6a]">
              {order.shipping?.phone || shipping?.shipping_phone || shipping?.phone}
            </p>
          )}
        </div>
      )}

      {Array.isArray(order.items) && order.items.length > 0 && (
        <ul className="space-y-2 text-sm border-t border-[#1d1c50]/10 pt-4">
          {order.items.map((line, idx) => (
            <li key={idx} className="flex justify-between gap-3">
              <span className="text-[#4a4a6a]">
                {line.title} × {line.quantity}
              </span>
              <span className="font-medium text-[#1d1c50]">
                {formatPrice(line.line_total, order.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {orderHasInvoice(order) && (
        <button
          type="button"
          onClick={async () => {
            setDownloading(true);
            try {
              const blob = await downloadOrderInvoice(order.id);
              await downloadBlob(
                blob,
                `${order.invoice_number || order.order_number || `order-${order.id}`}.pdf`
              );
              toast.success("Invoice downloaded");
            } catch (err) {
              toast.error(err?.message || "Could not download invoice");
            } finally {
              setDownloading(false);
            }
          }}
          disabled={downloading}
          className="w-full py-2.5 rounded-xl border border-[#1d1c50]/15 text-[#1d1c50] text-sm font-semibold hover:bg-[#f8f5ed] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          Download invoice
        </button>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/shop"
          className="flex-1 text-center py-2.5 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold"
        >
          Continue shopping
        </Link>
        <Link
          href="/orders"
          className="flex-1 text-center py-2.5 rounded-xl border border-[#1d1c50]/15 text-[#1d1c50] text-sm font-semibold"
        >
          My orders
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          </div>
        }
      >
        <OrderConfirmationContent />
      </Suspense>
    </main>
  );
}
