"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import { getOrders, downloadOrderInvoice } from "@/services/order.service";
import { downloadBlob, orderHasInvoice } from "@/lib/utils";
import {
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  ExternalLink,
  FileDown,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ChevronRight,
  ShoppingBag,
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

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useUserStore();
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleCopyOrderNumber = (e, orderNumber) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(orderNumber);
    toast.success("Order number copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadInvoice = async (e, order) => {
    e.preventDefault();
    e.stopPropagation();
    if (!order?.id) return;
    setDownloadingId(order.id);
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
      setDownloadingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "paid") return order.status === "paid";
    if (activeFilter === "pending") return order.status === "pending";
    return true;
  });

  if (!isAuthenticated && !token) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#f8f5ed]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1d1c50]/10 pb-6">
          <div className="space-y-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-[#1d1c50]/70 hover:text-[#1d1c50] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to shop
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1c50] font-serif tracking-tight !mb-0">
                My Orders
              </h1>
              {orders.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#1d1c50]/10 text-[#1d1c50] text-xs font-bold">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              )}
            </div>
            <p className="text-sm text-[#4a4a6a]">
              Track your Amazon FBA shipments, view order details, and download invoices.
            </p>
          </div>

          {/* Quick Filters */}
          {orders.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#1d1c50]/10 text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#1d1c50] text-white shadow-xs"
                    : "text-[#4a4a6a] hover:text-[#1d1c50]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("paid")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === "paid"
                    ? "bg-[#1d1c50] text-white shadow-xs"
                    : "text-[#4a4a6a] hover:text-[#1d1c50]"
                }`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("pending")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === "pending"
                    ? "bg-[#1d1c50] text-white shadow-xs"
                    : "text-[#4a4a6a] hover:text-[#1d1c50]"
                }`}
              >
                Pending
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
            <p className="text-sm font-medium text-[#4a4a6a]">Loading your orders…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
            <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
            <p className="font-semibold">Unable to load orders</p>
            <p className="text-xs text-rose-600 mt-1">{error.message}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#f8f5ed] flex items-center justify-center mx-auto text-[#1d1c50]/40">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1d1c50]">No orders found</h2>
              <p className="text-sm text-[#4a4a6a] mt-1">
                {activeFilter !== "all"
                  ? `You have no ${activeFilter} orders.`
                  : "You haven't placed any orders yet. Discover our orthopedic cervical contour pillows."}
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1d1c50] hover:bg-[#2a2970] text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Explore Shop <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const hasAmazonFulfillment = Boolean(
                order.fulfillment?.status || order.fulfillment?.amazon_order_id
              );
              const isAmazonFailed = order.fulfillment?.status === "FAILED";
              const isAmazonShipped =
                order.fulfillment?.status === "SHIPPED" ||
                order.fulfillment?.status === "COMPLETE";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#1d1c50]/10 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="bg-slate-50/80 border-b border-[#1d1c50]/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                          Order Placed
                        </span>
                        <span className="font-semibold text-slate-700">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                          Total Amount
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {formatPrice(order.subtotal, order.currency)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                          Order Number
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#1d1c50]">
                            {order.order_number}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyOrderNumber(e, order.order_number)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                            title="Copy order number"
                          >
                            {copiedId === order.order_number ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status Pills */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>

                      {hasAmazonFulfillment && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                            isAmazonFailed
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : isAmazonShipped
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>FBA: {order.fulfillment.status || "Received"}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Items & Info */}
                  <div className="p-6 divide-y divide-slate-100">
                    {/* Line Items */}
                    <div className="space-y-4 pb-4">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* Product Thumbnail */}
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-slate-100 bg-[#f8f5ed]/50 shrink-0 overflow-hidden flex items-center justify-center p-1">
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

                              {/* Title & Metadata */}
                              <div className="min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base text-slate-900 truncate">
                                  {item.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                                  {item.sku && (
                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                      {item.sku}
                                    </span>
                                  )}
                                  <span>Quantity: {item.quantity}</span>
                                  <span>·</span>
                                  <span className="font-medium text-slate-700">
                                    {formatPrice(item.price || item.price_at_purchase, order.currency)} each
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right shrink-0">
                              <span className="font-bold text-slate-900 text-sm sm:text-base">
                                {formatPrice(item.line_total || (item.price * item.quantity), order.currency)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">Order item details</p>
                      )}
                    </div>

                    {/* Amazon Fulfillment Notice Banner */}
                    {hasAmazonFulfillment && (
                      <div className="pt-4">
                        {isAmazonFailed ? (
                          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-800">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5 min-w-0">
                              <span className="font-bold block">Amazon Delivery Notice</span>
                              <p className="text-rose-700 text-[11px] leading-relaxed">
                                {order.fulfillment.error ||
                                  "Amazon FBA was unable to fulfill with the provided shipping address. Our support team is reviewing it."}
                              </p>
                            </div>
                          </div>
                        ) : order.fulfillment.tracking_number ? (
                          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs">
                            <div className="flex items-center gap-2 text-emerald-900">
                              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <span className="font-bold">
                                  Shipped via {order.fulfillment.carrier || "Amazon Logistics"}
                                </span>
                                <span className="font-mono text-[11px] text-emerald-700 block">
                                  Tracking #: {order.fulfillment.tracking_number}
                                </span>
                              </div>
                            </div>
                            {order.fulfillment.tracking_url && (
                              <a
                                href={order.fulfillment.tracking_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
                              >
                                Track Package <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                            <p>
                              Order received at Amazon FBA warehouse. Tracking details will update once dispatched.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      {order.shipping?.name && (
                        <span>
                          Shipping to:{" "}
                          <strong className="text-slate-700 font-medium">
                            {order.shipping.name}
                          </strong>
                          {order.shipping.city && `, ${order.shipping.city}`}
                          {order.shipping.country && ` (${order.shipping.country})`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {orderHasInvoice(order) && (
                        <button
                          type="button"
                          onClick={(e) => handleDownloadInvoice(e, order)}
                          disabled={downloadingId === order.id}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                        >
                          {downloadingId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1d1c50]" />
                          ) : (
                            <FileDown className="w-3.5 h-3.5 text-[#1d1c50]" />
                          )}
                          <span>Download Invoice</span>
                        </button>
                      )}

                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1d1c50] hover:bg-[#2c2b6e] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                      >
                        <span>View Order Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#1d1c50]/10">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-[#1d1c50]/15 bg-white text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-[#4a4a6a]">
              Page {page} of {lastPage}
            </span>
            <button
              type="button"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-[#1d1c50]/15 bg-white text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
