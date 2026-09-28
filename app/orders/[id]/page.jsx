"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import { getOrderById, downloadOrderInvoice } from "@/services/order.service";
import { downloadBlob, orderHasInvoice } from "@/lib/utils";
import { ArrowLeft, FileDown, Loader2 } from "lucide-react";
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

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { isAuthenticated, token } = useUserStore();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.replace(`/login?redirect=${encodeURIComponent(`/orders/${id}`)}`);
    }
  }, [isAuthenticated, token, router, id]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id && !!(isAuthenticated || token),
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

  if (!isAuthenticated && !token) {
    return (
      <main className="min-h-screen pt-36 pb-20 px-4 bg-[#f8f5ed] flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-36 pb-24 px-4 bg-[#f8f5ed]">
      <div className="max-w-lg mx-auto space-y-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50]"
        >
          <ArrowLeft className="w-4 h-4" /> All orders
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          </div>
        ) : error || !order?.id ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#1d1c50]/10">
            <span className="font-semibold text-[#1d1c50]">
              {error?.message || "Order not found"}
            </span>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#1d1c50]/10 p-6 sm:p-8 space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-[#1d1c50] !mb-0">
                {order.order_number}
              </h1>
              <span className="text-sm text-[#4a4a6a] mt-1 capitalize block">
                Status: <span className="font-semibold">{order.status}</span>
              </span>
              {order.invoice_number && (
                <span className="text-xs text-[#4a4a6a] mt-1 block font-mono">
                  Invoice {order.invoice_number}
                </span>
              )}
            </div>

            <div className="flex justify-between text-base font-bold text-[#1d1c50] border-y border-[#1d1c50]/10 py-4">
              <span>Total</span>
              <span>{formatPrice(order.subtotal, order.currency)}</span>
            </div>

            {order.shipping?.name && (
              <div className="text-sm space-y-1">
                <p className="font-semibold text-[#1d1c50]">Shipping to</p>
                <p className="text-[#4a4a6a]">{order.shipping.name}</p>
                <p className="text-[#4a4a6a]">
                  {order.shipping.address_line1}
                  {order.shipping.address_line2 ? `, ${order.shipping.address_line2}` : ""}
                </p>
                <p className="text-[#4a4a6a]">
                  {[order.shipping.city, order.shipping.state, order.shipping.postal_code]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  {order.shipping.country}
                </p>
              </div>
            )}

            {Array.isArray(order.items) && (
              <ul className="space-y-2 text-sm">
                {order.items.map((line, idx) => (
                  <li key={idx} className="flex justify-between gap-3">
                    <span className="text-[#4a4a6a]">
                      {line.title} × {line.quantity}
                      {line.price_at_purchase != null && (
                        <span className="block text-[11px] text-[#4a4a6a]/70">
                          @ {formatPrice(line.price_at_purchase, order.currency)}
                        </span>
                      )}
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
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="w-full py-3 rounded-xl border border-[#1d1c50]/15 text-[#1d1c50] text-sm font-semibold hover:bg-[#f8f5ed] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                Download invoice
              </button>
            )}

            {order.status === "pending" && payment?.client_secret && (
              <Link
                href="/checkout"
                className="block w-full text-center py-3 rounded-xl bg-[#1d1c50] text-white text-sm font-semibold"
              >
                Complete payment
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
