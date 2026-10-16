"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Inbox,
  MessageCircle,
  Package,
  ShoppingBag,
  Store,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { useAdminShopFeature } from "@/hooks/useAdminShopFeature";
import { extractPaginated } from "@/lib/axios";
import { getArticles } from "@/services/article.service";
import { getFaqs } from "@/services/faq.service";
import { getSubmissions } from "@/services/submission.service";
import { getBotQuestions } from "@/services/bot-question.service";
import { getAdminOrders } from "@/services/admin-order.service";
import { getAdminProducts } from "@/services/admin-product.service";
import { getAdminUsers } from "@/services/admin-user.service";
import { getAmazonSalesStats, syncAmazonSales } from "@/services/amazon-sales.service";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  pending: "bg-amber-50 text-amber-700 border-amber-200/80",
  failed: "bg-rose-50 text-rose-700 border-rose-200/80",
  canceled: "bg-slate-100 text-slate-600 border-slate-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200/80",
};

function formatMoney(price, currency = "USD") {
  const amount = Number(price);
  if (Number.isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function formatWhen(value) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "—";
  }
}

function inquiryName(row) {
  const formData = row?.data || {};
  return formData.full_name || formData.name || row?.user?.name || "Customer Lead";
}

function inquiryEmail(row) {
  const formData = row?.data || {};
  return formData.email || row?.user?.email || "";
}

function StatCard({
  href,
  label,
  value,
  hint,
  icon: Icon,
  loading,
  error,
  badge = null,
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {loading ? (
              <span className="inline-block h-7 w-16 rounded-lg bg-slate-100 animate-pulse" />
            ) : error ? (
              "—"
            ) : (
              value
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center shrink-0 shadow-xs transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100">
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
          {hint}
        </span>
        <div className="flex items-center gap-1 font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function Panel({ title, subtitle, href, action, icon: Icon, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">{title}</h2>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 px-2.5 py-1 rounded-lg transition-colors shrink-0"
          >
            <span>{action || "View all"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function EmptyRow({ text, icon: Icon = AlertCircle }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-slate-400">{text}</p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="divide-y divide-slate-100">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-3.5 w-44 rounded-md bg-slate-100 animate-pulse" />
            <div className="h-2.5 w-28 rounded-md bg-slate-100 animate-pulse" />
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-100 animate-pulse shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { admin } = useAdminStore();
  const { shopEnabled, isFetched: shopFetched } = useAdminShopFeature();
  const [isSyncing, setIsSyncing] = useState(false);

  // Core Content Queries
  const [inquiriesQuery, articlesQuery, faqsQuery, botQuery] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "inquiries"],
        queryFn: () => getSubmissions({ page: 1, per_page: 5 }),
      },
      {
        queryKey: ["dashboard", "articles"],
        queryFn: () => getArticles({ page: 1, per_page: 5 }),
      },
      {
        queryKey: ["dashboard", "faqs"],
        queryFn: () => getFaqs({ page: 1, per_page: 1 }),
      },
      {
        queryKey: ["dashboard", "bot-questions"],
        queryFn: () => getBotQuestions({ page: 1, per_page: 1 }),
      },
    ],
  });

  // Shop Queries
  const [ordersQuery, pendingQuery, productsQuery, usersQuery] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "orders"],
        queryFn: () => getAdminOrders({ page: 1, per_page: 5 }),
        enabled: shopEnabled,
      },
      {
        queryKey: ["dashboard", "orders-pending"],
        queryFn: () => getAdminOrders({ page: 1, per_page: 1, status: "pending" }),
        enabled: shopEnabled,
      },
      {
        queryKey: ["dashboard", "products"],
        queryFn: () => getAdminProducts({ page: 1, per_page: 1 }),
        enabled: shopEnabled,
      },
      {
        queryKey: ["dashboard", "users"],
        queryFn: () => getAdminUsers({ page: 1, per_page: 1, role: "user" }),
        enabled: shopEnabled,
      },
    ],
  });

  // Amazon Live Stats Query
  const {
    data: amazonStatsData,
    isLoading: isAmazonLoading,
    refetch: refetchAmazon,
  } = useQuery({
    queryKey: ["dashboard", "amazon-stats"],
    queryFn: () => getAmazonSalesStats(),
  });

  const rawAmazonStats =
    amazonStatsData?.data?.metrics
      ? amazonStatsData.data
      : amazonStatsData?.metrics
      ? amazonStatsData
      : amazonStatsData?.data || {};

  const amazonMetrics = rawAmazonStats.metrics || {};
  const topProducts = rawAmazonStats.top_products || [];

  const inquiries = extractPaginated(inquiriesQuery.data);
  const articles = extractPaginated(articlesQuery.data);
  const faqs = extractPaginated(faqsQuery.data);
  const bots = extractPaginated(botQuery.data);
  const orders = extractPaginated(ordersQuery.data);
  const pending = extractPaginated(pendingQuery.data);
  const products = extractPaginated(productsQuery.data);
  const users = extractPaginated(usersQuery.data);

  const firstName = admin?.name?.split(" ")[0] || "Administrator";

  const handleQuickSyncAmazon = async () => {
    setIsSyncing(true);
    try {
      const res = await syncAmazonSales({ days: 90, max_pages: 5 });
      toast.success(res?.message || "Amazon sales data synced!");
      refetchAmazon();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          Hero Executive Welcome Banner
          ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1022] via-[#141b38] to-[#1f2654] p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-white/10">
        {/* Ambient background glowing orbs */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-200">
              <Calendar className="w-3.5 h-3.5 text-indigo-300" />
              <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Admin Session</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">{firstName}</span> 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Real-time monitoring across direct store orders, Amazon SP-API operations, customer leads, and digital brand content.
            </p>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleQuickSyncAmazon}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Amazon"}</span>
            </button>

            <Link
              href="/auth-cp/articles"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Article</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Top Row: Commerce & Amazon SP-API Revenue Metrics
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. Amazon Gross Revenue */}
        <StatCard
          href="/auth-cp/amazon-sales"
          label="Total Amazon Revenue"
          value={formatMoney(amazonMetrics.total_revenue || 0)}
          hint="Live SP-API Sync"
          icon={DollarSign}
          badge="Amazon SP-API"
          loading={isAmazonLoading}
        />

        {/* 2. Amazon + Store Orders */}
        <StatCard
          href="/auth-cp/amazon-sales"
          label="Amazon Orders"
          value={amazonMetrics.total_orders || 0}
          hint={`${amazonMetrics.completed_orders || 0} Shipped · ${amazonMetrics.pending_orders || 0} Pending`}
          icon={ShoppingBag}
          badge="FBA & MFN"
          loading={isAmazonLoading}
        />

        {/* 3. Direct Store Orders */}
        <StatCard
          href="/auth-cp/orders"
          label="Direct Store Orders"
          value={orders.total}
          hint={`${pending.total} Pending fulfillments`}
          icon={Package}
          badge={shopEnabled ? "Active" : "Disabled"}
          loading={ordersQuery.isLoading}
          error={ordersQuery.isError}
        />

        {/* 4. Customer Inquiries & Leads */}
        <StatCard
          href="/auth-cp/inquiries"
          label="Customer Inquiries"
          value={inquiries.total}
          hint="Review contact leads"
          icon={Inbox}
          badge="Inbox"
          loading={inquiriesQuery.isLoading}
          error={inquiriesQuery.isError}
        />
      </div>

      {/* =========================================================================
          Second Row: Catalog & Operational Metrics
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          href="/auth-cp/products"
          label="Products Catalog"
          value={products.total}
          hint="Manage SKU & inventory"
          icon={Package}
          loading={productsQuery.isLoading}
          error={productsQuery.isError}
        />

        <StatCard
          href="/auth-cp/articles"
          label="Published Articles"
          value={articles.total}
          hint="Blog & SEO content"
          icon={FileText}
          loading={articlesQuery.isLoading}
          error={articlesQuery.isError}
        />

        <StatCard
          href="/auth-cp/faqs"
          label="Knowledge Base FAQs"
          value={faqs.total}
          hint="Customer questions"
          icon={HelpCircle}
          loading={faqsQuery.isLoading}
          error={faqsQuery.isError}
        />

        <StatCard
          href="/auth-cp/bot-questions"
          label="Chatbot Q&A"
          value={bots.total}
          hint="Interactive assistance"
          icon={MessageCircle}
          loading={botQuery.isLoading}
          error={botQuery.isError}
        />
      </div>

      {/* =========================================================================
          Main Interactive Feeds & Activity Grid
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column 1: Recent Store Orders */}
        <Panel
          title="Recent Store Orders"
          subtitle="Direct website customer checkouts"
          href="/auth-cp/orders"
          action="All Orders"
          icon={ShoppingBag}
        >
          {ordersQuery.isLoading ? (
            <LoadingRows />
          ) : ordersQuery.isError ? (
            <EmptyRow text="Store orders could not be loaded." />
          ) : orders.list.length === 0 ? (
            <EmptyRow text="No website customer orders yet." icon={ShoppingBag} />
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.list.map((row) => (
                <Link
                  key={row.id}
                  href="/auth-cp/orders"
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 font-mono shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      #
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate font-mono">
                        {row.order_number || `Order #${row.id}`}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {row.user?.name || "Customer"} &bull; {formatWhen(row.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatMoney(row.subtotal, row.currency)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border capitalize ${
                        STATUS_STYLES[row.status] || STATUS_STYLES.pending
                      }`}
                    >
                      {row.status || "pending"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        {/* Right Column 1: Recent Customer Inquiries */}
        <Panel
          title="Customer Inquiries & Leads"
          subtitle="Form submissions from website contact page"
          href="/auth-cp/inquiries"
          action="Open Inbox"
          icon={Inbox}
        >
          {inquiriesQuery.isLoading ? (
            <LoadingRows />
          ) : inquiriesQuery.isError ? (
            <EmptyRow text="Inquiries could not be loaded." />
          ) : inquiries.list.length === 0 ? (
            <EmptyRow text="No inquiries received yet." icon={Inbox} />
          ) : (
            <div className="divide-y divide-slate-100">
              {inquiries.list.map((row) => {
                const name = inquiryName(row);
                const email = inquiryEmail(row);
                return (
                  <Link
                    key={row.id}
                    href="/auth-cp/inquiries"
                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors group"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {email || "No email provided"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">
                        {formatWhen(row.created_at)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* =========================================================================
          Bottom Row: Amazon SP-API Highlights & System Management
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Amazon Live Spotlight (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Amazon SP-API Sales Spotlight</h3>
                  <p className="text-[11px] text-slate-500">Live performance synced from Amazon Seller Central</p>
                </div>
              </div>

              <Link
                href="/auth-cp/amazon-sales"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Analytics Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Product Quick Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-700 border border-slate-300 mb-1">
                    Sky Blue Pillow
                  </span>
                  <p className="text-xs font-semibold text-slate-800">Dr.Prime Cervical Pillow</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">B0GX59F5BG</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 block">54 Units</span>
                  <span className="text-xs font-bold text-slate-700">$3,149.37</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-700 border border-slate-300 mb-1">
                    Cool Gray Pillow
                  </span>
                  <p className="text-xs font-semibold text-slate-800">Dr.Prime Cervical Pillow</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">B0GX61KHFF</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 block">45 Units</span>
                  <span className="text-xs font-bold text-slate-700">$2,444.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Full order tracking & SP-API reporting available</span>
            </span>
            <Link
              href="/auth-cp/amazon-sales"
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Explore full data</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Launchpad (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Control Shortcuts</h3>
            </div>

            <div className="space-y-2">
              <Link
                href="/auth-cp/product-details"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-indigo-600">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Product Landing Copy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/auth-cp/shop-feature"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-emerald-600">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Store Feature Mode</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/auth-cp/settings"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-indigo-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Security & Credentials</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">Dr.Prime Management Ecosystem</span>
          </div>
        </div>
      </div>
    </div>
  );
}
