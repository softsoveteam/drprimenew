"use client";

import { use } from "react";
import Link from "next/link";
import { usePublicArticle } from "@/hooks/usePublicArticles";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowLeft, Loader2, BookOpen, AlertCircle } from "lucide-react";

export default function ArticleDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params?.slug;

  const { data: article, isLoading, isError, error } = usePublicArticle(slug);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#1d1c50]" />
          <p className="text-sm font-medium text-[#4a4a6a]">Loading article...</p>
        </div>
      </main>
    );
  }

  if (isError || !article) {
    return (
      <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] flex flex-col justify-center items-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-lg border border-[#1d1c50]/10">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1d1c50] font-serif">Article Not Found</h1>
          <p className="text-sm text-[#4a4a6a] mt-2 mb-6">
            The article you are looking for does not exist, is in draft status, or has been removed.
          </p>
          <Link href="/articles">
            <Button className="bg-[#1d1c50] text-white hover:bg-[#1d1c50]/90 px-6 py-2.5 rounded-xl inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>
        </div>

        {/* Article Header */}
        <header className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#1d1c50]/10 space-y-6">
          <div className="flex items-center gap-3 flex-wrap text-xs">
            {article.focus_keyword && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8f5ed] text-[#1d1c50] font-bold border border-[#1d1c50]/10">
                <Tag className="w-3.5 h-3.5 text-[#c9b896]" />
                {article.focus_keyword}
              </span>
            )}
            {formattedDate && (
              <span className="inline-flex items-center gap-1 text-[#4a4a6a]/70 font-medium">
                <Calendar className="w-4 h-4 text-[#1d1c50]" />
                {formattedDate}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1d1c50] font-serif leading-tight">
            {article.title}
          </h1>

          {article.short_description && (
            <p className="text-lg text-[#4a4a6a] leading-relaxed border-l-4 border-[#c9b896] pl-4 italic">
              {article.short_description}
            </p>
          )}
        </header>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#1d1c50]/10">
          <div
            className="prose prose-lg max-w-none text-[#4a4a6a] leading-relaxed
              prose-headings:font-serif prose-headings:text-[#1d1c50] prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:mb-5 prose-p:leading-relaxed
              prose-a:text-[#1d1c50] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#c9b896]
              prose-strong:text-[#1d1c50] prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-5
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-5
              prose-blockquote:border-l-4 prose-blockquote:border-[#c9b896] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#1d1c50]
              prose-img:rounded-2xl prose-img:shadow-md prose-img:my-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/articles">
            <Button variant="outline" className="rounded-xl border-[#1d1c50]/20 text-[#1d1c50]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Articles
            </Button>
          </Link>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-xs font-semibold text-[#1d1c50] hover:text-[#c9b896] transition-colors"
          >
            Back to Top &uarr;
          </a>
        </div>
      </div>
    </main>
  );
}
