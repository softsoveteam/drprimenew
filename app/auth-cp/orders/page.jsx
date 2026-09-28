"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOrders,
  getAdminOrderById,
  deleteAdminOrder,
  downloadAdminOrderInvoice,
} from "@/services/admin-order.service";
import { extractPaginated } from "@/lib/axios";
import { downloadBlob, orderHasInvoice } from "@/lib/utils";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { Select } from "@/components/ui/select";
import { Eye, Trash2, Loader2, ShoppingBag, FileDown } from "lucide-react";
import toast from "react-hot-toast";

function formatPrice(price, currency = "USD") {
  const amount = Number(price);
  if (Number.isNaN(amount)) return String(price ?? "—");
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
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

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

  const queryClient = useQueryClient();

  const handleDownloadInvoice = async (order) => {
    if (!order?.id) return;
    setDownloadingInvoiceId(order.id);
    try {
      const blob = await downloadAdminOrderInvoice(order.id);
      await downloadBlob(
        blob,
        `${order.invoice_number || order.order_number || `order-${order.id}`}.pdf`
      );
      toast.success("Invoice downloaded");
    } catch (err) {
      toast.error(err?.message || "Could not download invoice");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders", { page, limit, search, status }],
    queryFn: () => {
      const params = { page, per_page: limit };
      if (search) params.search = search;
      if (status) params.status = status;
      return getAdminOrders(params);
    },
  });

  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-order-detail", selectedOrderId],
    queryFn: () => getAdminOrderById(selectedOrderId),
    enabled: !!selectedOrderId,
  });

  const { list: ordersList, total: totalItems } = extractPaginated(data);

  const orderDetail =
    detailData?.order || detailData?.data?.order || detailData?.data || null;

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminOrder(id),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries(["admin-orders"]);
      setDeletingOrder(null);
      if (selectedOrderId === deletingOrder?.id) setSelectedOrderId(null);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete order");
    },
  });

  const columns = [
    {
      header: "Order",
      id: "order",
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs font-mono block leading-tight">
            {row.order_number}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
            {row.created_at ? new Date(row.created_at).toLocaleString() : "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      id: "user",
      className: "min-w-[180px]",
      render: (row) => (
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="font-medium text-slate-900 text-xs leading-tight truncate block">
            {row.user?.name || "—"}
          </span>
          <span className="text-[11px] text-slate-500 leading-tight truncate block">
            {row.user?.email || ""}
          </span>
        </div>
      ),
    },
    {
      header: "Total",
      id: "subtotal",
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">
          {formatPrice(row.subtotal, row.currency)}
        </span>
      ),
    },
    {
      header: "Status",
      id: "status",
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize ${
            STATUS_STYLES[row.status] || STATUS_STYLES.pending
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Items",
      id: "items",
      render: (row) => (
        <span className="text-xs text-slate-600">
          {Array.isArray(row.items) ? row.items.length : "—"}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedOrderId(row.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            title="View order"
          >
            <Eye className="w-4 h-4" />
          </button>
          {orderHasInvoice(row) && (
            <button
              onClick={() => handleDownloadInvoice(row)}
              disabled={downloadingInvoiceId === row.id}
              className="p-1.5 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer disabled:opacity-50"
              title="Download invoice"
            >
              {downloadingInvoiceId === row.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={() => setDeletingOrder(row)}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            Customer orders from checkout. Delete does not refund Stripe or restore stock.
          </p>
        </div>
        <div className="w-full sm:w-44">
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="canceled">Canceled</option>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error.message || "Failed to load orders"}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={ordersList}
          totalItems={totalItems}
          isLoading={isLoading}
          page={page}
          limit={limit}
          searchQuery={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          onRefetch={refetch}
          placeholderText="Search order #, name, email..."
          emptyStateText="No orders found"
        />
      </div>

      <Modal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        title="Order details"
        description={orderDetail?.order_number || "View customer order"}
      >
        {isLoadingDetail ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : !orderDetail ? (
          <p className="text-sm text-slate-500 py-6 text-center">Order not found</p>
        ) : (
          <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <span
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize ${
                  STATUS_STYLES[orderDetail.status] || STATUS_STYLES.pending
                }`}
              >
                {orderDetail.status}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {formatPrice(orderDetail.subtotal, orderDetail.currency)}
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs space-y-1.5">
              <p>
                <span className="text-slate-500">Customer: </span>
                <span className="font-medium text-slate-900">
                  {orderDetail.user?.name || "—"}
                </span>
              </p>
              <p>
                <span className="text-slate-500">Email: </span>
                <span className="font-medium text-slate-900">
                  {orderDetail.user?.email || "—"}
                </span>
              </p>
              {orderDetail.paid_at && (
                <p>
                  <span className="text-slate-500">Paid at: </span>
                  {new Date(orderDetail.paid_at).toLocaleString()}
                </p>
              )}
              {orderDetail.stripe_payment_intent_id && (
                <p className="font-mono text-[10px] text-slate-500 break-all">
                  PI: {orderDetail.stripe_payment_intent_id}
                </p>
              )}
              {orderDetail.invoice_number && (
                <p>
                  <span className="text-slate-500">Invoice: </span>
                  <span className="font-medium text-slate-900 font-mono">
                    {orderDetail.invoice_number}
                  </span>
                </p>
              )}
              {orderDetail.payment_error && (
                <p className="text-rose-600">{orderDetail.payment_error}</p>
              )}
            </div>

            {orderHasInvoice(orderDetail) && (
              <button
                type="button"
                onClick={() => handleDownloadInvoice(orderDetail)}
                disabled={downloadingInvoiceId === orderDetail.id}
                className="w-full py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {downloadingInvoiceId === orderDetail.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                Download invoice PDF
              </button>
            )}

            <div>
              <h3 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Line items
              </h3>
              {Array.isArray(orderDetail.items) && orderDetail.items.length > 0 ? (
                <ul className="space-y-2">
                  {orderDetail.items.map((line) => (
                    <li
                      key={line.id || `${line.sku}-${line.title}`}
                      className="flex justify-between gap-3 text-xs border border-slate-100 rounded-lg p-2.5"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{line.title}</p>
                        <p className="text-slate-500 font-mono text-[10px] mt-0.5">
                          {line.sku} · qty {line.quantity} · @{" "}
                          {formatPrice(line.price_at_purchase || line.price, orderDetail.currency)}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-800 shrink-0">
                        {formatPrice(line.line_total, orderDetail.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">No line items</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirm={() => deleteMutation.mutate(deletingOrder?.id)}
        title="Delete Order"
        description="Deletes the order and line items. Does not refund Stripe or restore stock."
        itemName={deletingOrder?.order_number}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
