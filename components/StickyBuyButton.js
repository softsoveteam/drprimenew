"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AMAZON_URL, PRODUCT_PRICE } from "@/lib/seo";

export default function StickyBuyButton() {
  const [visible, setVisible] = useState(false);
  const [buyLink, setBuyLink] = useState(AMAZON_URL);
  const pathname = usePathname();

  useEffect(() => {
    const onBuyLink = (event) => {
      if (event.detail) setBuyLink(event.detail);
    };
    window.addEventListener("dp-buy-link", onBuyLink);
    return () => window.removeEventListener("dp-buy-link", onBuyLink);
  }, []);

  const hideOn =
    pathname?.startsWith("/cart") ||
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/shop") ||
    pathname?.startsWith("/orders") ||
    pathname?.startsWith("/order-confirmation") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/profile");

  useEffect(() => {
    if (hideOn) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setVisible(progress >= 0.3);
    };

    setVisible(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, hideOn]);

  if (hideOn) return null;

  return (
    <div className={`dp-sticky-buy${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <a href={buyLink} target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1}>
        <span className="dp-sticky-buy-meta">
          <span className="dp-sticky-buy-name">PrimeHeal Pillow</span>
          <span className="dp-sticky-buy-price">${PRODUCT_PRICE}</span>
        </span>
        <span className="dp-sticky-buy-label">Buy Now</span>
      </a>
    </div>
  );
}
