"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Pillow" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/image-gallery", label: "Gallery" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
  { href: "/articles", label: "Articles" },
  { href: "/service-area", label: "Area" },
];

const BUY_URL = "https://www.amazon.com/dp/B0GX59F5BG";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("dp-nav-lock", open);
    return () => document.body.classList.remove("dp-nav-lock");
  }, [open]);

  return (
    <header className="main-header dp-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" href="/">
              <img src="/assets/logo-dark.png" alt="Dr.Prime Pillow Logo" />
            </Link>

            <div className="navbar-collapse main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  {NAV_LINKS.map((item) => (
                    <li className="nav-item" key={item.href}>
                      <Link className="nav-link" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="header-btn">
                <a
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-default"
                >
                  Buy Now
                </a>
              </div>
            </div>

            <button
              type="button"
              className={`dp-nav-toggle${open ? " is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        <div className={`dp-mobile-nav${open ? " is-open" : ""}`}>
          <ul>
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-default"
            onClick={() => setOpen(false)}
          >
            Buy Now
          </a>
        </div>
      </div>
    </header>
  );
}
