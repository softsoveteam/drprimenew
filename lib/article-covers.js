/** Format published date like "SEP 14, 2026" */
export function formatArticleDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

/** Gold cover used on every article card (logo ring, badge, and Read button). */
export const ARTICLE_COVER_THEME = {
  glow: "#c9b896",
  glow2: "#4a4580",
};

export function getArticleCoverTheme() {
  return ARTICLE_COVER_THEME;
}
