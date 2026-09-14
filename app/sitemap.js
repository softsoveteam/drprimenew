import { SITE_URL, sitemapEntries } from "@/lib/seo";

export default function sitemap() {
  const lastModified = new Date();

  return sitemapEntries.map((page) => ({
    url: page.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
