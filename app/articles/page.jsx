"use client";

import { useState } from "react";
import Link from "next/link";
import { usePublicArticles } from "@/hooks/usePublicArticles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { formatArticleDate, getArticleCoverTheme } from "@/lib/article-covers";
import ArticleCoverArt from "@/components/articles/ArticleCoverArt";

function ArticleCard({ article, index }) {
  const theme = getArticleCoverTheme(article.id, index);
  const dateLabel = formatArticleDate(article.published_at);
  const href = `/articles/${article.slug}`;

  return (
    <article className="group bg-[#f8f5ed] rounded-3xl border border-[#1d1c50]/10 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1d1c50]/8 transition-shadow duration-300 flex flex-col h-full">
      <Link href={href} className="block">
        <ArticleCoverArt
          title={article.title}
          description={article.short_description}
          glow={theme.glow}
          glow2={theme.glow2}
          className="w-full h-auto block"
        />
      </Link>

      <div className="p-6 sm:p-7 flex flex-col flex-1 bg-white">
        {dateLabel && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4a4a6a]/55 mb-3">
            {dateLabel}
          </p>
        )}

        <h2 className="text-xl font-bold text-[#1d1c50] font-serif leading-snug group-hover:text-[#2c2b6e] transition-colors">
          <Link href={href}>{article.title}</Link>
        </h2>

        {article.short_description ? (
          <p className="text-sm text-[#4a4a6a] leading-relaxed mt-3 line-clamp-3">
            {article.short_description}
          </p>
        ) : null}

        <Link
          href={href}
          className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1d1c50] hover:text-[#c9b896] transition-colors"
        >
          Read article
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

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
    setPage(1);
  };

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed]">
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
            Expert advice on orthopedic health, sleep ergonomics, spinal alignment, and wellness.
          </p>

          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles by title, keyword, or topic..."
                value={searchQuery}
                onChange={handleSearchChange}
                icon={Search}
                className="h-14 bg-white border-[#1d1c50]/15 focus-visible:ring-[#1d1c50] focus-visible:ring-offset-0 text-[#1d1c50] rounded-2xl shadow-sm text-base placeholder:text-[#4a4a6a]/50"
              />
              {searchQuery && (
                <button
                  type="button"
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

      <section className="px-4 max-w-6xl mx-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
            <p className="text-sm font-medium text-[#4a4a6a]">Loading articles...</p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-red-100 shadow-sm">
            <p className="text-red-500 font-semibold mb-2">Failed to load articles</p>
            <p className="text-sm text-[#4a4a6a]">
              {error?.message || "Something went wrong while fetching articles."}
            </p>
          </div>
        )}

        {!isLoading && !isError && articles.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#1d1c50]/10 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#f8f5ed] text-[#1d1c50] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[#c9b896]" />
            </div>
            <h3 className="text-xl font-bold text-[#1d1c50] font-serif">No Articles Found</h3>
            <p className="text-sm text-[#4a4a6a] mt-2">
              {searchQuery
                ? `No published articles matched "${searchQuery}". Try different keywords.`
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

        {!isLoading && !isError && articles.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4a4a6a]">
                Showing {articles.length} of {totalArticles} article
                {totalArticles !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>

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
