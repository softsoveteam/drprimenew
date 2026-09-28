"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShopFeature } from "@/hooks/useShopFeature";
import { isPublicShopPath } from "@/lib/shop-paths";

export default function ShopRouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { shopEnabled, isFetched } = useShopFeature();
  const blocked = isPublicShopPath(pathname);

  useEffect(() => {
    if (blocked && isFetched && !shopEnabled) {
      router.replace("/");
    }
  }, [blocked, isFetched, shopEnabled, router]);

  if (blocked && (!isFetched || !shopEnabled)) {
    return null;
  }

  return children;
}
