const CATEGORY_MARKER = /^\[\[cat:(quality|care|sleep)\]\]\n?/;

export function splitFaqCategory(answer = "") {
  const text = String(answer ?? "");
  const match = text.match(CATEGORY_MARKER);
  return {
    category: match?.[1] || "quality",
    answer: text.replace(CATEGORY_MARKER, ""),
  };
}

export function joinFaqCategory(answer, category) {
  const key = category === "care" || category === "sleep" ? category : "quality";
  const clean = String(answer ?? "").replace(CATEGORY_MARKER, "").replace(/^\s+/, "");
  return `[[cat:${key}]]\n${clean}`;
}
