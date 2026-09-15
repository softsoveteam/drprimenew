"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store/useAdminStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Link from "next/link";
import {
  FileText,
  FolderTree,
  Inbox,
  Image as ImageIcon,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Sparkles,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { AsyncSelect } from "@/components/ui/async-select";

// Sample initial data for dashboard demonstration
const INITIAL_ARTICLES = [
  {
    id: 1,
    title: "10 Proven Ways to Relieve Neck Pain While Sleeping",
    category: "Health & Wellness",
    author: "Dr. Rachel Green",
    views: "1,420",
    status: "Published",
    date: "2026-09-12",
  },
  {
    id: 2,
    title: "Orthopedic vs Memory Foam: Complete Buying Guide 2026",
    category: "Buying Guides",
    author: "Mark Evans",
    views: "980",
    status: "Published",
    date: "2026-09-10",
  },
  {
    id: 3,
    title: "How Proper Spinal Alignment Boosts REM Sleep Quality",
    category: "Sleep Science",
    author: "Dr. Rachel Green",
    views: "740",
    status: "Published",
    date: "2026-09-08",
  },
  {
    id: 4,
    title: "Caring for Your Cervical Pillow: Wash & Longevity Tips",
    category: "Care & Guides",
    author: "Sarah Connor",
    views: "510",
    status: "Draft",
    date: "2026-09-05",
  },
  {
    id: 5,
    title: "The Ultimate Ergonomic Bedroom Setup for Better Posture",
    category: "Ergonomics",
    author: "Mark Evans",
    views: "320",
    status: "Review",
    date: "2026-09-02",
  },
];

const CATEGORIES_DATA = [
  { id: "cat_1", name: "Health & Wellness", slug: "health-wellness" },
  { id: "cat_2", name: "Sleep Science", slug: "sleep-science" },
  { id: "cat_3", name: "Buying Guides", slug: "buying-guides" },
  { id: "cat_4", name: "Care & Guides", slug: "care-guides" },
  { id: "cat_5", name: "Ergonomics", slug: "ergonomics" },
  { id: "cat_6", name: "Product Updates", slug: "product-updates" },
];

export default function AdminDashboardPage() {
  const { admin } = useAdminStore();

  // AsyncSelect states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([
    { id: "tag_1", name: "Spine Health" },
    { id: "tag_2", name: "Cervical Support" },
  ]);

  // DataTable states
  const [tableSearch, setTableSearch] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(5);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Fetch admin profile
  const { data: profileData } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      try {
        return await api.get("/admin/me");
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const currentUser = profileData?.data?.user || profileData?.user || admin;

  // Mock Async Options Loader
  const loadCategoryOptions = async ({ page, search }) => {
    // Simulate dynamic API delay
    await new Promise((res) => setTimeout(res, 300));
    let filtered = CATEGORIES_DATA;
    if (search) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return {
      data: filtered,
      meta: { pagination: { totalPages: 1 } },
    };
  };

  const loadTagOptions = async ({ page, search }) => {
    const TAGS = [
      { id: "tag_1", name: "Spine Health" },
      { id: "tag_2", name: "Cervical Support" },
      { id: "tag_3", name: "Orthopedic" },
      { id: "tag_4", name: "Memory Foam" },
      { id: "tag_5", name: "Pain Relief" },
      { id: "tag_6", name: "Posture Correction" },
      { id: "tag_7", name: "Sleep Hygiene" },
    ];
    await new Promise((res) => setTimeout(res, 300));
    let filtered = TAGS;
    if (search) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return {
      data: filtered,
      meta: { pagination: { totalPages: 1 } },
    };
  };

  // Filtered table data based on search and category
  const filteredArticles = INITIAL_ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      article.author.toLowerCase().includes(tableSearch.toLowerCase()) ||
      article.category.toLowerCase().includes(tableSearch.toLowerCase());

    const matchesCategory =
      !selectedCategory || article.category === selectedCategory.name;

    return matchesSearch && matchesCategory;
  });

  // Table Columns Definition
  const articleColumns = [
    {
      header: "Article Title",
      accessorKey: "title",
      render: (row) => (
        <div className="flex flex-col min-w-[220px]">
          <span className="font-semibold text-slate-900 line-clamp-1 hover:text-[#1d1c50]">
            {row.title}
          </span>
          <span className="text-[11px] text-slate-400">By {row.author}</span>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-[#1d1c50] border border-indigo-100">
          {row.category}
        </span>
      ),
    },
    {
      header: "Total Views",
      accessorKey: "views",
      className: "text-slate-600 font-medium",
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (row) => {
        const isPublished = row.status === "Published";
        const isReview = row.status === "Review";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isPublished
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : isReview
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPublished ? "bg-emerald-500" : isReview ? "bg-amber-500" : "bg-slate-400"
              }`}
            />
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Published On",
      accessorKey: "date",
      className: "text-slate-500 text-xs",
    },
    {
      header: "Action",
      id: "actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/auth-cp/articles/edit/${row.id}`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Edit Article"
          >
            <FileText className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/articles`}
            target="_blank"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Preview Article"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </div>
      ),
    },
  ];

  const STATS_CARDS = [
    {
      title: "Published Articles",
      value: "12",
      change: "+2 this month",
      icon: FileText,
      gradient: "from-[#1d1c50] to-[#363380]",
      href: "/auth-cp/articles",
    },
    {
      title: "Taxonomy Categories",
      value: "6",
      change: "Active taxonomy",
      icon: FolderTree,
      gradient: "from-indigo-600 to-violet-600",
      href: "/auth-cp/categories",
    },
    {
      title: "Customer Inquiries",
      value: "28",
      change: "+5 unread leads",
      icon: Inbox,
      gradient: "from-emerald-600 to-teal-600",
      href: "/auth-cp/inquiries",
    },
    {
      title: "Media Assets",
      value: "45",
      change: "Optimized WebP/JPG",
      icon: ImageIcon,
      gradient: "from-amber-600 to-orange-600",
      href: "/auth-cp/media",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f0e26] via-[#1d1c50] to-[#2a2868] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/10 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Dr.Prime Store Administration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name || "Administrator"}!
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl leading-relaxed">
              Manage articles, review incoming customer inquiries, and monitor Dr.Prime Pillow store activities from one unified portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/auth-cp/articles/create">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md h-10 px-4 rounded-xl cursor-pointer">
                <Plus className="h-4 w-4 mr-1.5 text-[#1d1c50]" />
                <span>New Article</span>
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-semibold h-10 px-4 rounded-xl cursor-pointer"
              >
                <span>View Store</span>
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STATS_CARDS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.href} className="group">
              <Card className="hover:border-indigo-300/80 transition-all duration-200 hover:shadow-md h-full bg-white border border-slate-200/80 rounded-2xl">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {stat.title}
                    </span>
                    <div
                      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* AsyncSelect Demonstration Section */}
      <Card className="border border-slate-200/90 bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/40 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#1d1c50]" />
            <CardTitle className="text-base font-bold text-slate-900">
              API-Driven Dynamic Dropdowns (`AsyncSelect`)
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Infinite scroll, debounced search, tag chips, and portal positioning ready for all admin forms.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Single Select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Filter Table by Category (Single Select)</span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </label>
            <AsyncSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              loadOptions={loadCategoryOptions}
              placeholder="Select article category..."
              labelKey="name"
              idKey="id"
            />
          </div>

          {/* Multi Select with Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Assigned Article Tags (Multi Select with Removable Chips)
            </label>
            <AsyncSelect
              value={selectedTags}
              onChange={setSelectedTags}
              loadOptions={loadTagOptions}
              placeholder="Search and attach tags..."
              multi={true}
              creatable={true}
              labelKey="name"
              idKey="id"
            />
          </div>
        </CardContent>
      </Card>

      {/* Common DataTable Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Articles Catalog (`DataTable`)
            </h3>
            <p className="text-xs text-slate-500">
              Demonstrating debounced search, cooldown refetch, auto serial numbers, and pagination.
            </p>
          </div>

          <Link href="/auth-cp/articles">
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5 ml-1 text-slate-400" />
            </Button>
          </Link>
        </div>

        <DataTable
          columns={articleColumns}
          data={filteredArticles}
          isLoading={isTableLoading}
          totalItems={filteredArticles.length}
          page={tablePage}
          limit={tableLimit}
          onPageChange={setTablePage}
          onLimitChange={setTableLimit}
          searchQuery={tableSearch}
          onSearchChange={setTableSearch}
          onRefetch={() => {
            setIsTableLoading(true);
            setTimeout(() => setIsTableLoading(false), 600);
          }}
          placeholderText="Search by title, author, or category..."
          emptyStateText="No articles matched your criteria"
          showSerialNumber={true}
        />
      </div>
    </div>
  );
}
