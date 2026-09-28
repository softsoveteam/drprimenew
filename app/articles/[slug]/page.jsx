import ArticleDetailClient from "@/components/articles/ArticleDetailClient";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

async function getArticle(slug) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.30:8002/api";
  const res = await fetch(`${base}/articles/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.article || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  const title = article?.seo_title?.trim() || article?.title || "Article";
  const description =
    article?.seo_description?.trim() || article?.short_description?.trim() || "";
  const keywords = (article?.focus_keyword || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const url = `${SITE_URL}/articles/${article?.slug || slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  return <ArticleDetailClient slug={slug} />;
}
