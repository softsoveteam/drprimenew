"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import { getOrderById, downloadOrderInvoice, syncOrderTracking } from "@/services/order.service";
import { downloadBlob, orderHasInvoice } from "@/lib/utils";
import { CheckCircle2, FileDown, Loader2, XCircle, Package, ExternalLink, RefreshCw } from "lucide-react";
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
  const [isRefreshingTracking, setIsRefreshingTracking] = useState(false);

  const handleRefreshTracking = async () => {
    if (!order?.id) return;
    setIsRefreshingTracking(true);
    try {
      const res = await syncOrderTracking(order.id);
      const updated = res?.order || res?.data?.order || res;
      setOrder(updated);
      toast.success("Amazon tracking refreshed");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Could not refresh tracking");
    } finally {
      setIsRefreshingTracking(false);
    }
  };

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

      {/* Amazon FBA Fulfillment & Tracking Card */}
      {(order?.fulfillment?.status || order?.fulfillment?.amazon_order_id) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Amazon FBA Delivery
              </span>
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                order.fulfillment.status === "FAILED"
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-amber-100 text-amber-900 border-amber-200"
              }`}
            >
              {order.fulfillment.status || "Processing"}
            </span>
          </div>

          {order.fulfillment.amazon_order_id && (
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="text-slate-500">Amazon Order ID:</span>
              <span className="font-mono font-semibold">{order.fulfillment.amazon_order_id}</span>
            </div>
          )}

          {order.fulfillment.status === "FAILED" ? (
            <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3 space-y-1">
              <p className="font-semibold">Amazon Fulfillment Status: Failed</p>
              <p className="text-[11px] leading-relaxed text-rose-600">
                {order.fulfillment.error ||
                  "Amazon was unable to dispatch with the provided shipping address. Address review required."}
              </p>
            </div>
          ) : order.fulfillment.tracking_number ? (
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Carrier:</span>
                <span className="font-semibold">{order.fulfillment.carrier || "Amazon Logistics"}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-mono font-semibold">{order.fulfillment.tracking_number}</span>
              </div>
              {order.fulfillment.estimated_delivery_at && (
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <span className="font-semibold">
                    {new Date(order.fulfillment.estimated_delivery_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {order.fulfillment.tracking_url && (
                <a
                  href={order.fulfillment.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Track Shipment on {order.fulfillment.carrier || "Carrier Site"} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-2 pt-1">
              <p className="leading-relaxed">
                Order sent to Amazon FBA warehouse. Tracking details will appear as soon as Amazon dispatches your package.
              </p>
              <button
                type="button"
                disabled={isRefreshingTracking}
                onClick={handleRefreshTracking}
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingTracking ? "animate-spin" : ""}`} />
                {isRefreshingTracking ? "Checking Amazon..." : "Check for Tracking Update"}
              </button>
            </div>
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
