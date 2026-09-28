"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useUserLogout } from "@/hooks/useUserAuth";
import { useCart } from "@/hooks/useCart";
import { useShopFeature } from "@/hooks/useShopFeature";
import { AMAZON_URL } from "@/lib/seo";
import {
  ShoppingBag,
  User,
  ChevronDown,
  Package,
  ClipboardList,
  LogOut,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Pillow" },
  { href: "/shop", label: "Shop", shop: true },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/image-gallery", label: "Gallery" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
  { href: "/articles", label: "Articles" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { isAuthenticated, token, user } = useUserStore();
  const logoutMutation = useUserLogout();
  const loggedIn = isAuthenticated || !!token;
  const { shopEnabled } = useShopFeature();
  const { data: cartData } = useCart({ enabled: shopEnabled });
  const navLinks = NAV_LINKS.filter((item) => shopEnabled || !item.shop);
  const summary = cartData?.summary || cartData?.data?.summary;
  const cartCount = summary?.item_count ?? 0;
  const firstName = user?.name?.split(" ")[0] || "Account";

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("dp-nav-lock", open);
    return () => document.body.classList.remove("dp-nav-lock");
  }, [open]);

  useEffect(() => {
    if (!accountOpen) return;

    const onPointerDown = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

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
                  {navLinks.map((item) => (
                    <li className="nav-item" key={item.href}>
                      <Link className="nav-link" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="header-btn">
                {shopEnabled && (
                <Link href="/cart" className="header-cart-link" aria-label="Cart">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#1d1c50] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                )}

                {shopEnabled && loggedIn ? (
                  <div className="header-account" ref={accountRef}>
                    <button
                      type="button"
                      className={`header-account-trigger${accountOpen ? " is-open" : ""}`}
                      aria-haspopup="menu"
                      aria-expanded={accountOpen}
                      onClick={() => setAccountOpen((v) => !v)}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <span className="header-account-name">{firstName}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          accountOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {accountOpen && (
                      <div className="header-account-menu" role="menu">
                        <Link
                          href="/profile"
                          role="menuitem"
                          className="header-account-item"
                          onClick={() => setAccountOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          role="menuitem"
                          className="header-account-item"
                          onClick={() => setAccountOpen(false)}
                        >
                          <ClipboardList className="w-4 h-4" />
                          Orders
                        </Link>
                        <Link
                          href="/cart"
                          role="menuitem"
                          className="header-account-item"
                          onClick={() => setAccountOpen(false)}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Cart
                          {cartCount > 0 ? ` (${cartCount})` : ""}
                        </Link>
                        <Link
                          href="/shop"
                          role="menuitem"
                          className="header-account-item"
                          onClick={() => setAccountOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          Shop
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          className="header-account-item is-danger"
                          onClick={() => {
                            setAccountOpen(false);
                            logoutMutation.mutate();
                          }}
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut className="w-4 h-4" />
                          {logoutMutation.isPending ? "Signing out…" : "Sign out"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : shopEnabled ? (
                  <>
                    <Link href="/login" className="header-auth-link">
                      Log in
                    </Link>
                    <Link href="/register" className="header-auth-link is-muted">
                      Register
                    </Link>
                  </>
                ) : null}

                <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="btn-default">
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
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={AMAZON_URL}
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
