"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAmazonSalesOrders,
  getAmazonSalesStats,
  syncAmazonSales,
  getAmazonOrderDetails,
} from "@/services/amazon-sales.service";
import { extractPaginated } from "@/lib/axios";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  RefreshCw,
  DollarSign,
  Package,
  TrendingUp,
  ShoppingBag,
  MapPin,
  Eye,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

function formatPrice(amount, currency = "USD") {
  const num = Number(amount);
  if (Number.isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(num);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

const STATUS_CONFIG = {
  Shipped: {
    label: "Shipped",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  Unshipped: {
    label: "Unshipped",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  PartiallyShipped: {
    label: "Partially Shipped",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Clock,
  },
  Pending: {
    label: "Pending",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  Canceled: {
    label: "Canceled",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
};

export default function AmazonSalesPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [fulfillment, setFulfillment] = useState("ALL");
  const [lookbackDays, setLookbackDays] = useState("90");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Compute from_date based on lookbackDays
  const fromDate = React.useMemo(() => {
    if (!lookbackDays || lookbackDays === "all" || Number(lookbackDays) >= 1000) {
      return null;
    }
    const d = new Date();
    d.setDate(d.getDate() - Number(lookbackDays));
    return d.toISOString().split("T")[0];
  }, [lookbackDays]);

  // 1. Fetch Aggregated Sales Stats
  const { data: statsData, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["amazon-sales-stats", { fromDate, lookbackDays }],
    queryFn: () => {
      const params = {};
      if (lookbackDays && lookbackDays !== "all") {
        params.days = lookbackDays;
      }
      if (fromDate) params.from_date = fromDate;
      return getAmazonSalesStats(params);
    },
  });

  const rawStats = statsData?.data?.metrics ? statsData.data : statsData?.metrics ? statsData : (statsData?.data || {});

  const stats = {
    metrics: {
      total_revenue: rawStats.metrics?.total_revenue ?? 0,
      total_orders: rawStats.metrics?.total_orders ?? 0,
      completed_orders: rawStats.metrics?.completed_orders ?? 0,
      pending_orders: rawStats.metrics?.pending_orders ?? 0,
      cancelled_orders: rawStats.metrics?.cancelled_orders ?? 0,
      total_units_sold: rawStats.metrics?.total_units_sold ?? 0,
      avg_order_value: rawStats.metrics?.avg_order_value ?? 0,
    },
    top_products: rawStats.top_products || [],
    last_synced_at: rawStats.last_synced_at || null,
  };

  // 2. Fetch Paginated Orders
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["amazon-sales-orders", { page, limit, search, status, fulfillment, fromDate, lookbackDays }],
    queryFn: () => {
      const params = { page, per_page: limit };
      if (search) params.search = search;
      if (status && status !== "ALL") params.status = status;
      if (fulfillment && fulfillment !== "ALL") params.fulfillment_channel = fulfillment;
      if (lookbackDays && lookbackDays !== "all") {
        params.days = lookbackDays;
      }
      if (fromDate) params.from_date = fromDate;
      return getAmazonSalesOrders(params);
    },
  });

  const { list: orders = [], total: totalOrders = 0 } = extractPaginated(ordersResponse);

  // 3. Fetch Single Order Details for Modal
  const { data: orderDetailsData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["amazon-order-detail", selectedOrderId],
    queryFn: () => getAmazonOrderDetails(selectedOrderId),
    enabled: Boolean(selectedOrderId),
  });

  const activeOrder = orderDetailsData?.data?.order || null;

  // 4. Live Sync Mutation
  const syncMutation = useMutation({
    mutationFn: (days) => {
      const parsedDays = !days || days === "all" || Number(days) >= 1000 ? 365 : Number(days);
      return syncAmazonSales({ days: parsedDays, max_pages: 10 });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Amazon sales synced successfully!");
      queryClient.invalidateQueries({ queryKey: ["amazon-sales-stats"] });
      queryClient.invalidateQueries({ queryKey: ["amazon-sales-orders"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to sync from Amazon SP-API"
      );
    },
  });

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Table Columns Definition
  const columns = [
    {
      header: "Amazon Order ID",
      accessorKey: "amazon_order_id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900">
              <span>{row.amazon_order_id}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(row.amazon_order_id);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
                title="Copy Order ID"
              >
                {copiedId === row.amazon_order_id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {row.seller_order_id && row.seller_order_id !== row.amazon_order_id && (
              <span className="text-[11px] text-slate-400">Ref: {row.seller_order_id}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Purchase Date",
      accessorKey: "purchase_date",
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-slate-800">{formatDate(row.purchase_date)}</span>
          <span className="text-[11px] text-slate-400">{row.sales_channel || "Amazon.com"}</span>
        </div>
      ),
    },
    {
      header: "Items & SKU",
      accessorKey: "items",
      render: (row) => {
        const items = row.items || [];
        if (items.length === 0) {
          const count = (row.number_of_items_shipped || 0) + (row.number_of_items_unshipped || 0);
          return (
            <span className="text-xs text-slate-500">
              {count > 0 ? `${count} item(s)` : "1 unit"}
            </span>
          );
        }

        const first = items[0];
        const isBlue = first.seller_sku?.toLowerCase().includes("blue") || first.title?.toLowerCase().includes("blue");
        const isCream = first.seller_sku?.toLowerCase().includes("cream") || first.title?.toLowerCase().includes("cream");

        return (
          <div className="flex flex-col gap-1 max-w-[260px]">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                  isBlue
                    ? "bg-sky-100 text-sky-800 border border-sky-200"
                    : isCream
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {isBlue ? "Sky Blue" : isCream ? "Cool Gray" : first.asin || "Pillow"}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Qty: {first.quantity_ordered}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 truncate" title={first.title}>
              {first.title || first.seller_sku}
            </span>
            {items.length > 1 && (
              <span className="text-[10px] text-slate-400">+{items.length - 1} more item(s)</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Destination",
      accessorKey: "shipping",
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {[row.ship_city, row.ship_state, row.ship_country].filter(Boolean).join(", ") || "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Fulfillment",
      accessorKey: "fulfillment_channel",
      render: (row) => {
        const isFba = row.fulfillment_channel === "AFN";
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
              isFba
                ? "bg-orange-50 text-orange-800 border-orange-200"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <Truck className="w-3 h-3 text-orange-600" />
            {isFba ? "Amazon FBA" : "Merchant"}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "order_status",
      render: (row) => {
        const cfg = STATUS_CONFIG[row.order_status] || {
          label: row.order_status,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          icon: Clock,
        };
        const IconComponent = cfg.icon;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg}`}
          >
            <IconComponent className="w-3 h-3" />
            {cfg.label}
          </span>
        );
      },
    },
    {
      header: "Total",
      accessorKey: "total_amount",
      className: "text-right",
      render: (row) => (
        <span className="font-bold text-slate-900 text-xs">
          {formatPrice(row.total_amount, row.currency_code)}
        </span>
      ),
    },
    {
      header: "Action",
      id: "actions",
      className: "text-center",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedOrderId(row.amazon_order_id)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="View Order Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-slate-100/60 to-transparent pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Amazon SP-API Sales Data
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time sales performance, orders, and FBA fulfillment metrics from Amazon Seller Central.
              </p>
            </div>
          </div>

        {/* Sync Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {stats.last_synced_at && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Synced: {formatDate(stats.last_synced_at)}</span>
            </span>
          )}

          <div className="w-44 shrink-0">
            <Select
              value={String(lookbackDays)}
              onChange={(e) => {
                setLookbackDays(e.target.value);
                setPage(1);
              }}
            >
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last 1 Year</option>
              <option value="all">All History</option>
            </Select>
          </div>

          <button
            type="button"
            onClick={() => syncMutation.mutate(lookbackDays)}
            disabled={syncMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 text-white ${syncMutation.isPending ? "animate-spin" : ""}`}
            />
            <span>{syncMutation.isPending ? "Syncing..." : "Sync from Amazon"}</span>
          </button>
        </div>
      </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Amazon Sales
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {formatPrice(stats.metrics?.total_revenue || 0)}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Live SP-API</span>
            <span>&bull; Gross ordered revenue</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Amazon Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {stats.metrics?.total_orders || 0}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="text-emerald-700 font-medium">
              {stats.metrics?.completed_orders || 0} Shipped
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-amber-700 font-medium">
              {stats.metrics?.pending_orders || 0} Pending
            </span>
          </div>
        </div>

        {/* Total Units Sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Units Sold
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {stats.metrics?.total_units_sold || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pillows fulfilled via Amazon FBA
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg. Order Value (AOV)
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {formatPrice(stats.metrics?.avg_order_value || 0)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Average revenue per customer order
          </p>
        </div>
      </div>

      {/* Top Selling Products Bar */}
      {stats.top_products?.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#1d1c50]" />
              <h2 className="text-sm font-bold text-slate-900">Best Performing SKUs on Amazon</h2>
            </div>
            <span className="text-xs text-slate-400">By units sold</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.top_products.map((item, idx) => {
              const isBlue = item.seller_sku?.toLowerCase().includes("blue") || item.title?.toLowerCase().includes("blue");
              return (
                <div
                  key={item.seller_sku || idx}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${isBlue ? "bg-sky-500" : "bg-amber-500"}`}
                      ></span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {isBlue ? "Dr. Prime Sky Blue" : "Dr. Prime Cool Gray"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      ASIN: <span className="font-mono text-slate-600">{item.asin}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-slate-900">
                      {item.units_sold} units
                    </span>
                    <p className="text-[11px] text-emerald-600 font-semibold">
                      {formatPrice(item.revenue)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isOrdersLoading}
          totalItems={totalOrders}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          searchQuery={search}
          onSearchChange={setSearch}
          placeholderText="Search Order ID, ASIN, SKU, City, State..."
          emptyStateText="No Amazon orders found. Click 'Sync from Amazon' to fetch live data."
          onRowClick={(row) => setSelectedOrderId(row.amazon_order_id)}
          actions={
            <div className="flex items-center gap-2">
              <div className="w-40 shrink-0">
                <Select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Pending">Pending</option>
                  <option value="Unshipped">Unshipped</option>
                  <option value="Canceled">Canceled</option>
                </Select>
              </div>

              <div className="w-44 shrink-0">
                <Select
                  value={fulfillment}
                  onChange={(e) => {
                    setFulfillment(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="ALL">All Fulfillment</option>
                  <option value="AFN">FBA (Amazon)</option>
                  <option value="MFN">Merchant (MFN)</option>
                </Select>
              </div>
            </div>
          }
        />
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={Boolean(selectedOrderId)}
        onClose={() => {
          setSelectedOrderId(null);
          setShowRawJson(false);
        }}
        title="Amazon Order Details"
        description={`Amazon Order ID: ${selectedOrderId || ""}`}
        maxWidth="max-w-2xl"
      >
        {isDetailLoading || !activeOrder ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-[#1d1c50]" />
            <span className="text-xs">Loading order from Amazon SP-API...</span>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Top Summary Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">Order Status</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      STATUS_CONFIG[activeOrder.order_status]?.bg || "bg-slate-100"
                    }`}
                  >
                    {activeOrder.order_status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Fulfillment Channel</span>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  {activeOrder.fulfillment_channel === "AFN" ? "Amazon FBA" : "Merchant (MFN)"}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Purchase Date</span>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  {formatDate(activeOrder.purchase_date)}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Total Amount</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">
                  {formatPrice(activeOrder.total_amount, activeOrder.currency_code)}
                </p>
              </div>
            </div>

            {/* Shipping Destination */}
            <div className="p-4 rounded-xl border border-slate-200/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Shipping Destination
              </h3>
              <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-400">City / State: </span>
                  <span className="font-medium text-slate-800">
                    {[activeOrder.ship_city, activeOrder.ship_state].filter(Boolean).join(", ") || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Postal / Country: </span>
                  <span className="font-medium text-slate-800">
                    {[activeOrder.ship_postal_code, activeOrder.ship_country].filter(Boolean).join(" ") || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Shipping Service: </span>
                  <span className="font-medium text-slate-800">
                    {activeOrder.ship_service_level || "Standard"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Sales Channel: </span>
                  <span className="font-medium text-slate-800">
                    {activeOrder.sales_channel || "Amazon.com"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                Items in Order ({activeOrder.items?.length || 1})
              </h3>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {activeOrder.items && activeOrder.items.length > 0 ? (
                  activeOrder.items.map((item, idx) => (
                    <div key={item.id || idx} className="p-3.5 bg-white flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {item.title || "Dr. Prime Cervical Pillow"}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span>ASIN: {item.asin || "—"}</span>
                          <span>&bull;</span>
                          <span>SKU: {item.seller_sku || "—"}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900">
                          Qty: {item.quantity_ordered}
                        </span>
                        <p className="text-xs text-emerald-600 font-semibold">
                          {formatPrice(item.item_price || activeOrder.total_amount, item.currency_code)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white text-xs text-slate-500 text-center">
                    1 unit &bull; Total: {formatPrice(activeOrder.total_amount, activeOrder.currency_code)}
                  </div>
                )}
              </div>
            </div>

            {/* Seller Central Link & Raw JSON Toggle */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <a
                href={`https://sellercentral.amazon.com/orders-v3/order/${activeOrder.amazon_order_id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>Open in Amazon Seller Central</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-slate-400 hover:text-slate-600 underline text-[11px]"
              >
                {showRawJson ? "Hide Raw Payload" : "View Raw SP-API Payload"}
              </button>
            </div>

            {/* Raw JSON Debug Box */}
            {showRawJson && (
              <pre className="p-3 bg-slate-900 text-slate-200 text-[10px] rounded-xl overflow-x-auto max-h-48">
                {JSON.stringify(activeOrder.raw_payload, null, 2)}
              </pre>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
