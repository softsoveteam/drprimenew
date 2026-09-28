const PUBLIC_SHOP_PREFIXES = [
  "/shop",
  "/cart",
  "/checkout",
  "/orders",
  "/order-confirmation",
  "/login",
  "/register",
  "/profile",
];

const ADMIN_SHOP_PREFIXES = [
  "/auth-cp/products",
  "/auth-cp/orders",
  "/auth-cp/users",
  "/auth-cp/settings",
];

function matchesPrefix(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isPublicShopPath(pathname) {
  if (!pathname) return false;
  return PUBLIC_SHOP_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export function isAdminShopPath(pathname) {
  if (!pathname) return false;
  return ADMIN_SHOP_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}

export const SHOP_DISABLED_EVENT = "dp-shop-disabled";
