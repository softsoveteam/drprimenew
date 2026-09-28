"use client";

import Link from "next/link";
import { usePublicArticle } from "@/hooks/usePublicArticles";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { getArticleCoverTheme } from "@/lib/article-covers";
import ArticleCoverArt from "@/components/articles/ArticleCoverArt";

function headingId(text) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "section";
}

function decodeHeading(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function prepareArticle(html) {
  if (!html) return { html: "", headings: [] };
  const headings = [];
  const used = new Map();
  const next = html.replace(/<(h[1-3])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attrs = "", inner) => {
    const text = decodeHeading(inner);
    if (!text) return match;
    let id = headingId(text);
    const count = used.get(id) || 0;
    used.set(id, count + 1);
    if (count) id = `${id}-${count + 1}`;
    headings.push({ id, text, level: tag.toLowerCase() });
    const cleanAttrs = attrs.replace(/\sid=(["']).*?\1/i, "");
    return `<${tag}${cleanAttrs} id="${id}">${inner}</${tag}>`;
  });
  return { html: next, headings };
}

export default function ArticleDetailClient({ slug }) {
  const { data: article, isLoading, isError } = usePublicArticle(slug);

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
  const theme = getArticleCoverTheme(article.id);
  const { html: articleHtml, headings } = prepareArticle(article.content);

  return (
    <main className="min-h-screen pt-36 pb-24 bg-[#f8f5ed] px-4">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/70 hover:text-[#1d1c50] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Articles
        </Link>

        <div className="mt-8">
          <h1 className="max-w-3xl text-3xl sm:text-4xl font-bold text-[#1d1c50] font-serif leading-tight">
            {article.title}
          </h1>

          <div className="mt-6 w-full overflow-hidden rounded-2xl">
            <ArticleCoverArt
              title={article.title}
              description={article.short_description}
              glow={theme.glow}
              glow2={theme.glow2}
              short
              className="block h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start">
          <article className="min-w-0 w-full max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap text-sm text-[#4a4a6a]">
              {article.focus_keyword && (
                <span className="inline-flex items-center gap-1.5 font-medium text-[#1d1c50]">
                  <Tag className="w-3.5 h-3.5 text-[#c9b896]" />
                  {article.focus_keyword}
                </span>
              )}
              {formattedDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#1d1c50]" />
                  {formattedDate}
                </span>
              )}
            </div>

            {article.short_description && (
              <p className="mt-5 text-lg text-[#4a4a6a] leading-relaxed">
                {article.short_description}
              </p>
            )}

            <div
              className="article-body mt-6 text-[#4a4a6a] text-base sm:text-lg leading-relaxed
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#1d1c50] [&_h1]:font-serif [&_h1]:mb-4 [&_h1]:scroll-mt-36
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1d1c50] [&_h2]:font-serif [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:scroll-mt-36
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1d1c50] [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:scroll-mt-36
                [&_p]:mb-5 [&_p]:leading-relaxed
                [&_a]:text-[#1d1c50] [&_a]:font-semibold [&_a]:underline
                [&_strong]:text-[#1d1c50] [&_strong]:font-bold
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#c9b896] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#1d1c50]
                [&_img]:rounded-2xl [&_img]:my-6"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />
          </article>

          {headings.length > 0 && (
            <aside className="w-full shrink-0 lg:sticky lg:top-32 lg:w-80">
              <nav className="rounded-3xl border border-[#1d1c50]/10 bg-white p-5 shadow-sm">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c9b896]">
                  On this page
                </p>
                <ul className="space-y-2.5">
                  {headings.map((heading) => {
                    const nested = heading.level === "h3";
                    return (
                      <li key={heading.id} className="list-none">
                        <a
                          href={`#${heading.id}`}
                          className={`flex items-start gap-2 text-sm leading-snug no-underline hover:!text-[#c9b896] ${
                            nested ? "pl-3 !text-[#4a4a6a]" : "!text-[#1d1c50]"
                          }`}
                        >
                          {nested ? (
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9b896]" />
                          ) : null}
                          <span>{heading.text}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          )}
        </div>

        <div className="mt-12 flex max-w-3xl items-center justify-between">
          <Link href="/articles">
            <Button variant="outline" className="rounded-xl border-[#1d1c50]/20 text-[#1d1c50]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Articles
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-semibold text-[#1d1c50] hover:text-[#c9b896] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </main>
  );
}
