"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getOrderById,
  downloadOrderInvoice,
  syncOrderTracking,
} from "@/services/order.service";
import { downloadBlob, orderHasInvoice } from "@/lib/utils";
import {
  ArrowLeft,
  FileDown,
  Loader2,
  Package,
  Truck,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  MapPin,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

function formatPrice(price, currency = "USD") {
  const amount = Number(price);
  if (Number.isNaN(amount)) return String(price ?? "—");
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  failed: {
    label: "Failed",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  canceled: {
    label: "Canceled",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { isAuthenticated, token } = useUserStore();
  const [downloading, setDownloading] = useState(false);
  const [isRefreshingTracking, setIsRefreshingTracking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/orders/${id || ""}`)}`
      );
    }
  }, [isAuthenticated, token, router, id]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id && (isAuthenticated || token)),
  });

  const order = data?.order || data?.data?.order || data;
  const payment = data?.payment || data?.data?.payment;

  const handleDownloadInvoice = async () => {
    if (!order?.id) return;
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
  };

  const handleRefreshTracking = async () => {
    if (!order?.id) return;
    setIsRefreshingTracking(true);
    try {
      const res = await syncOrderTracking(order.id);
      toast.success(res?.message || "Amazon tracking refreshed");
      refetch();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Could not refresh tracking"
      );
    } finally {
      setIsRefreshingTracking(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (!order?.order_number) return;
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    toast.success("Order number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated && !token) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
      </main>
    );
  }

  const statusCfg = STATUS_CONFIG[order?.status] || STATUS_CONFIG.pending;
  const hasAmazonFulfillment = Boolean(
    order?.fulfillment?.status || order?.fulfillment?.amazon_order_id
  );
  const isAmazonFailed = order?.fulfillment?.status === "FAILED";

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#f8f5ed]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-[#1d1c50]/70 hover:text-[#1d1c50] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All orders
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
            <p className="text-sm font-medium text-[#4a4a6a]">Loading order details…</p>
          </div>
        ) : error || !order?.id ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#1d1c50]/10 max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h2 className="text-lg font-bold text-[#1d1c50]">Order not found</h2>
            <p className="text-xs text-[#4a4a6a]">{error?.message || "Please check the order ID."}</p>
            <Link
              href="/orders"
              className="inline-block px-4 py-2 rounded-xl bg-[#1d1c50] text-white text-xs font-semibold"
            >
              Back to orders
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1c50] font-mono !mb-0 tracking-tight">
                    {order.order_number}
                  </h1>
                  <button
                    type="button"
                    onClick={handleCopyOrderNumber}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Copy order number"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4a4a6a]">
                  <span>
                    Placed on:{" "}
                    <strong>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "—"}
                    </strong>
                  </span>
                  {order.invoice_number && (
                    <span>
                      Invoice:{" "}
                      <strong className="font-mono">{order.invoice_number}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                  {statusCfg.label}
                </span>

                {orderHasInvoice(order) && (
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    disabled={downloading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {downloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1d1c50]" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5 text-[#1d1c50]" />
                    )}
                    <span>Invoice PDF</span>
                  </button>
                )}
              </div>
            </div>

            {/* Amazon FBA Delivery Card */}
            {hasAmazonFulfillment && (
              <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider !mb-0">
                        Amazon FBA Multi-Channel Delivery
                      </h2>
                      <span className="text-[11px] text-slate-500 block">
                        Fulfilled directly from Amazon warehouse inventory
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                        isAmazonFailed
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : order.fulfillment?.status === "SHIPPED" ||
                            order.fulfillment?.status === "COMPLETE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {order.fulfillment?.status || "Processing"}
                    </span>

                    {order.fulfillment?.amazon_order_id && (
                      <button
                        type="button"
                        disabled={isRefreshingTracking}
                        onClick={handleRefreshTracking}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
                        title="Query live Amazon tracking details"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${isRefreshingTracking ? "animate-spin" : ""}`}
                        />
                        <span>Sync Tracking</span>
                      </button>
                    )}
                  </div>
                </div>

                {isAmazonFailed ? (
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Amazon Delivery Notice</span>
                    </div>
                    <p className="text-[11px] text-rose-700 leading-relaxed pl-6">
                      {order.fulfillment?.error ||
                        "Amazon was unable to fulfill with the provided shipping address. Our customer service team is reviewing it."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                        Carrier
                      </span>
                      <span className="font-semibold text-slate-800 text-sm block">
                        {order.fulfillment?.carrier || "Amazon Logistics"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                        Tracking Number
                      </span>
                      {order.fulfillment?.tracking_number ? (
                        <span className="font-mono font-bold text-slate-900 text-sm block">
                          {order.fulfillment.tracking_number}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic block">
                          Pending dispatch scan
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                        Estimated Arrival
                      </span>
                      <span className="font-semibold text-slate-800 text-sm block">
                        {order.fulfillment?.estimated_delivery_at
                          ? new Date(
                              order.fulfillment.estimated_delivery_at
                            ).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })
                          : "Calculating…"}
                      </span>
                    </div>
                  </div>
                )}

                {order.fulfillment?.tracking_url && (
                  <div className="pt-2">
                    <a
                      href={order.fulfillment.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-xs"
                    >
                      <span>Track Shipment on {order.fulfillment?.carrier || "Carrier Site"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Two-Column Grid: Order Items & Shipping Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Items (Left 2 Columns) */}
              <div className="md:col-span-2 bg-white rounded-3xl border border-[#1d1c50]/10 p-6 sm:p-7 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 !mb-0">
                  <Package className="w-4 h-4 text-[#1d1c50]" />
                  <span>Purchased Items</span>
                </h2>

                <div className="divide-y divide-slate-100">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="py-4 first:pt-2 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-16 h-16 rounded-2xl border border-slate-100 bg-[#f8f5ed]/50 shrink-0 overflow-hidden flex items-center justify-center p-1">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-slate-900 truncate">
                              {item.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                              {item.sku && (
                                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                  {item.sku}
                                </span>
                              )}
                              <span>Qty: {item.quantity}</span>
                              <span>·</span>
                              <span>
                                {formatPrice(
                                  item.price_at_purchase || item.price,
                                  order.currency
                                )}{" "}
                                each
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="font-bold text-slate-900 text-sm shrink-0">
                          {formatPrice(
                            item.line_total || item.price * item.quantity,
                            order.currency
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 py-4">No item details</p>
                  )}
                </div>
              </div>

              {/* Order Summary & Shipping (Right 1 Column) */}
              <div className="space-y-6">
                {/* Shipping Destination */}
                <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-6 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 !mb-0">
                    <MapPin className="w-3.5 h-3.5 text-[#1d1c50]" />
                    <span>Shipping Destination</span>
                  </h3>

                  {order.shipping?.name ? (
                    <div className="text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900 text-sm">
                        {order.shipping.name}
                      </p>
                      <p>{order.shipping.address_line1}</p>
                      {order.shipping.address_line2 && (
                        <p>{order.shipping.address_line2}</p>
                      )}
                      <p>
                        {[
                          order.shipping.city,
                          order.shipping.state,
                          order.shipping.postal_code,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="font-semibold text-[#1d1c50]">
                        {order.shipping.country}
                      </p>
                      {order.shipping.phone && (
                        <p className="text-slate-500 pt-1">
                          Phone: {order.shipping.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No shipping address recorded
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-6 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 !mb-0">
                    Payment Summary
                  </h3>

                  <div className="space-y-2 text-xs border-b border-slate-100 pb-3">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal, order.currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-emerald-700">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1">
                    <span>Total Paid</span>
                    <span className="text-base text-[#1d1c50]">
                      {formatPrice(order.subtotal, order.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
