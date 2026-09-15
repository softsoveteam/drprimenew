"use client";

import { useState } from "react";
import Link from "next/link";
import { usePublicArticles } from "@/hooks/usePublicArticles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Tag, ArrowRight, BookOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ArticlesListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = usePublicArticles({
    search: searchQuery,
    page,
    per_page: 9,
  });

  const articles = data?.data || [];
  const totalPages = data?.last_page || 1;
  const currentPage = data?.current_page || 1;
  const totalArticles = data?.total || 0;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed]">
      {/* Hero Header Section */}
      <section className="px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1d1c50]/5 border border-[#1d1c50]/10 text-xs font-bold uppercase tracking-widest text-[#1d1c50]">
            <BookOpen className="w-3.5 h-3.5 text-[#c9b896]" />
            Dr.Prime Health & Sleep Journal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1d1c50] tracking-tight font-serif">
            Articles & Insights
          </h1>
          <p className="text-lg text-[#4a4a6a] max-w-2xl mx-auto">
            Discover expert advice on orthopedic health, sleep ergonomics, spinal alignment, and wellness tips.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles by title, keyword, or topic..."
                value={searchQuery}
                onChange={handleSearchChange}
                icon={Search}
                className="h-14 bg-white border-[#1d1c50]/15 focus-visible:ring-[#1d1c50] text-[#1d1c50] rounded-2xl shadow-sm text-base placeholder:text-[#4a4a6a]/50"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4a4a6a] hover:text-[#1d1c50] bg-[#f8f5ed] px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-4 max-w-7xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
            <p className="text-sm font-medium text-[#4a4a6a]">Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-red-100 shadow-sm">
            <p className="text-red-500 font-semibold mb-2">Failed to load articles</p>
            <p className="text-sm text-[#4a4a6a]">{error?.message || "Something went wrong while fetching articles."}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && articles.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#1d1c50]/10 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#f8f5ed] text-[#1d1c50] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[#c9b896]" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1c50] font-serif">No Articles Found</h3>
            <p className="text-sm text-[#4a4a6a] mt-2">
              {searchQuery
                ? `No published articles matched "${searchQuery}". Try searching with different keywords.`
                : "Check back soon for new articles and insights!"}
            </p>
            {searchQuery && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="mt-6 bg-[#1d1c50] text-white hover:bg-[#1d1c50]/90 rounded-xl"
              >
                View All Articles
              </Button>
            )}
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && !isError && articles.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4a4a6a]">
                Showing {articles.length} of {totalArticles} article{totalArticles !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const formattedDate = article.published_at
                  ? new Date(article.published_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null;

                return (
                  <article
                    key={article.id}
                    className="bg-white rounded-3xl p-7 border border-[#1d1c50]/10 shadow-sm hover:shadow-xl hover:shadow-[#1d1c50]/5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges / Meta */}
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        {article.focus_keyword && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8f5ed] text-[#1d1c50] font-semibold border border-[#1d1c50]/10">
                            <Tag className="w-3 h-3 text-[#c9b896]" />
                            {article.focus_keyword}
                          </span>
                        )}

                        {formattedDate && (
                          <span className="inline-flex items-center gap-1 text-[#4a4a6a]/70 font-medium ml-auto">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-[#1d1c50] group-hover:text-[#c9b896] transition-colors leading-snug font-serif">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {/* Short Description */}
                      <p className="text-sm text-[#4a4a6a] line-clamp-3 leading-relaxed">
                        {article.short_description}
                      </p>
                    </div>

                    {/* Footer / Read More Button */}
                    <div className="pt-6 mt-6 border-t border-[#1d1c50]/5 flex items-center justify-between">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d1c50] group-hover:text-[#c9b896] transition-colors"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-[#1d1c50]/15 text-[#1d1c50] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span className="text-sm font-medium text-[#1d1c50] px-3">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-[#1d1c50]/15 text-[#1d1c50] disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
