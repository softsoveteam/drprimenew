export const DEFAULT_PRODUCT_DESCRIPTION =
  "Experience the ultimate in neck support and spinal alignment. The PrimeHeal is engineered with premium memory foam to relieve pressure, reduce morning stiffness, and ensure a deep, restorative sleep.";

export const DEFAULT_PRICE_BADGE = "Lowest price in 30 days";

export const DEFAULT_PRODUCT_DETAILS = {
  custom_text: DEFAULT_PRICE_BADGE,
  original_price: "49.99",
  discounted_price: "39.99",
  discount_percentage: 20,
  in_stock: true,
};

export function hasPrice(value) {
  if (value === null || value === undefined || value === "") return false;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0;
}

export function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/** Whole-number percent off, matching the storefront “-20%” label. */
export function discountPercent(original, discounted) {
  if (!hasPrice(original) || !hasPrice(discounted)) return null;
  const originalAmount = Number(original);
  if (originalAmount <= 0) return null;
  return Math.round(((originalAmount - Number(discounted)) / originalAmount) * 100);
}

export function isInStock(value) {
  return !(value === false || value === 0 || value === "0" || value === "false");
}

export function badgeText(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || text === DEFAULT_PRODUCT_DESCRIPTION) return DEFAULT_PRICE_BADGE;
  return text;
}

export function resolveProductOffer(details) {
  const source = details && typeof details === "object" ? details : DEFAULT_PRODUCT_DETAILS;
  const percent = discountPercent(source.original_price, source.discounted_price);

  return {
    badge: badgeText(source.custom_text),
    percent: percent != null && percent > 0 ? percent : null,
    priceLabel: hasPrice(source.discounted_price)
      ? formatMoney(source.discounted_price)
      : hasPrice(source.original_price)
      ? formatMoney(source.original_price)
      : null,
    typicalLabel:
      hasPrice(source.discounted_price) && hasPrice(source.original_price)
        ? formatMoney(source.original_price)
        : null,
    description: DEFAULT_PRODUCT_DESCRIPTION,
    inStock: isInStock(source.in_stock),
  };
}
