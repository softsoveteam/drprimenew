"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const AMAZON_BLUE = "https://www.amazon.com/dp/B0GX59F5BG";

export default function StickyBuyButton() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
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
  }, [pathname]);

  return (
    <div className={`dp-sticky-buy${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <a
        href={AMAZON_BLUE}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
      >
        <span className="dp-sticky-buy-info">
          <span className="dp-sticky-buy-name">The PrimeHeal</span>
          <span className="dp-sticky-buy-price">$39.99</span>
        </span>
        <span className="dp-sticky-buy-label">
          <i className="fa-brands fa-amazon"></i>
          Buy Now
        </span>
      </a>
    </div>
  );
}
