"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
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

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
  canceled: "bg-slate-100 text-slate-600 border-slate-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}

function inquiryName(row) {
  const formData = row?.data || {};
  return formData.full_name || formData.name || row?.user?.name || "Anonymous";
}

function inquiryEmail(row) {
  const formData = row?.data || {};
  return formData.email || row?.user?.email || "";
}

function StatCard({ href, label, value, hint, icon: Icon, loading, error }) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs px-4 py-3 hover:border-indigo-200 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 leading-none">
            {label}
          </div>
          <div className="mt-1.5 text-xl font-bold text-slate-900 tabular-nums leading-none">
            {loading ? (
              <span className="inline-block h-5 w-10 rounded bg-slate-100 animate-pulse" />
            ) : error ? (
              "—"
            ) : (
              value
            )}
          </div>
        </div>
        <span className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 leading-none">
        {hint}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function Panel({ title, href, action, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col min-h-[280px]">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <Link href={href} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          {action}
        </Link>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function EmptyRow({ text }) {
  return <p className="px-5 py-10 text-center text-xs text-slate-400">{text}</p>;
}

function LoadingRows() {
  return (
    <div className="divide-y divide-slate-100">
      {[0, 1, 2].map((row) => (
        <div key={row} className="px-5 py-4">
          <div className="h-3 w-40 rounded bg-slate-100 animate-pulse" />
          <div className="mt-2 h-2.5 w-24 rounded bg-slate-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { admin } = useAdminStore();
  const { shopEnabled, isFetched: shopFetched } = useAdminShopFeature();

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

  const inquiries = extractPaginated(inquiriesQuery.data);
  const articles = extractPaginated(articlesQuery.data);
  const faqs = extractPaginated(faqsQuery.data);
  const bots = extractPaginated(botQuery.data);
  const orders = extractPaginated(ordersQuery.data);
  const pending = extractPaginated(pendingQuery.data);
  const products = extractPaginated(productsQuery.data);
  const users = extractPaginated(usersQuery.data);

  const firstName = admin?.name?.split(" ")[0] || "Administrator";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Welcome back, {firstName}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Content, customer inquiries, and store activity in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {shopFetched && (
            <Link
              href="/auth-cp/shop-feature"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                shopEnabled
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              {shopEnabled ? "Shop is on" : "Shop is off"}
            </Link>
          )}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          href="/auth-cp/inquiries"
          label="Inquiries"
          value={inquiries.total}
          hint="Open inbox"
          icon={Inbox}
          loading={inquiriesQuery.isLoading}
          error={inquiriesQuery.isError}
        />
        <StatCard
          href="/auth-cp/articles"
          label="Articles"
          value={articles.total}
          hint="Manage articles"
          icon={FileText}
          loading={articlesQuery.isLoading}
          error={articlesQuery.isError}
        />
        <StatCard
          href="/auth-cp/faqs"
          label="FAQs"
          value={faqs.total}
          hint="Edit answers"
          icon={HelpCircle}
          loading={faqsQuery.isLoading}
          error={faqsQuery.isError}
        />
        <StatCard
          href="/auth-cp/bot-questions"
          label="Chat questions"
          value={bots.total}
          hint="Update the bot"
          icon={MessageCircle}
          loading={botQuery.isLoading}
          error={botQuery.isError}
        />
      </div>

      {shopEnabled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard
            href="/auth-cp/orders"
            label="Orders"
            value={orders.total}
            hint="View orders"
            icon={ShoppingBag}
            loading={ordersQuery.isLoading}
            error={ordersQuery.isError}
          />
          <StatCard
            href="/auth-cp/orders"
            label="Pending"
            value={pending.total}
            hint="Needs a look"
            icon={ShoppingBag}
            loading={pendingQuery.isLoading}
            error={pendingQuery.isError}
          />
          <StatCard
            href="/auth-cp/products"
            label="Products"
            value={products.total}
            hint="Manage catalog"
            icon={Package}
            loading={productsQuery.isLoading}
            error={productsQuery.isError}
          />
          <StatCard
            href="/auth-cp/users"
            label="Customers"
            value={users.total}
            hint="View customers"
            icon={Users}
            loading={usersQuery.isLoading}
            error={usersQuery.isError}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Latest inquiries" href="/auth-cp/inquiries" action="View all">
          {inquiriesQuery.isLoading ? (
            <LoadingRows />
          ) : inquiriesQuery.isError ? (
            <EmptyRow text="Inquiries could not be loaded." />
          ) : inquiries.list.length === 0 ? (
            <EmptyRow text="No contact inquiries yet." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {inquiries.list.map((row) => (
                <li key={row.id}>
                  <Link
                    href="/auth-cp/inquiries"
                    className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate leading-tight">
                        {inquiryName(row)}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight">
                        {inquiryEmail(row) || "No email"}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatWhen(row.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {shopEnabled ? (
          <Panel title="Recent orders" href="/auth-cp/orders" action="View all">
            {ordersQuery.isLoading ? (
              <LoadingRows />
            ) : ordersQuery.isError ? (
              <EmptyRow text="Orders could not be loaded." />
            ) : orders.list.length === 0 ? (
              <EmptyRow text="No orders yet." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {orders.list.map((row) => (
                  <li key={row.id}>
                    <Link
                      href="/auth-cp/orders"
                      className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate font-mono leading-tight">
                          {row.order_number || `#${row.id}`}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight">
                          {row.user?.name || "Customer"} · {formatMoney(row.subtotal, row.currency)}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border capitalize shrink-0 ${
                          STATUS_STYLES[row.status] || STATUS_STYLES.pending
                        }`}
                      >
                        {row.status || "pending"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        ) : (
          <Panel title="Recent articles" href="/auth-cp/articles" action="View all">
            {articlesQuery.isLoading ? (
              <LoadingRows />
            ) : articlesQuery.isError ? (
              <EmptyRow text="Articles could not be loaded." />
            ) : articles.list.length === 0 ? (
              <EmptyRow text="No articles yet." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {articles.list.map((row) => (
                  <li key={row.id}>
                    <Link
                      href={`/auth-cp/articles/${row.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate leading-tight">{row.title}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight">
                          {formatWhen(row.published_at || row.created_at)}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border capitalize shrink-0 ${
                          STATUS_STYLES[row.status] || STATUS_STYLES.draft
                        }`}
                      >
                        {row.status || "draft"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}
      </div>
    </div>
  );
}
