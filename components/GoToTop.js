"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GoToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    setVisible(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scrollTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      href="#top"
      className={`dp-go-top${visible ? " is-visible" : ""}`}
      onClick={scrollTop}
      aria-label="Go to top"
      tabIndex={visible ? 0 : -1}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </a>
  );
}
