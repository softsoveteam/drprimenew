"use client";

import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import { useUserProfile } from "@/hooks/useUserAuth";
import { User } from "lucide-react";

export default function Header() {
  const { isAuthenticated, user: storeUser } = useUserStore();
  const { data: profileUser } = useUserProfile();

  const user = profileUser || storeUser;

  return (
    <header className="main-header dp-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" href="/">
              <img src="/assets/logo-dark.png" alt="Dr.Prime Pillow Logo" />
            </Link>

            <div className="navbar-collapse main-menu flex items-center justify-between flex-1">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <Link className="nav-link" href="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/product">
                      Pillow
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/testimonials">
                      Testimonials
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/image-gallery">
                      Gallery
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/faqs">
                      FAQs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/contact">
                      Contact Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/articles">
                      Articles
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/service-area">
                      Area
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    {isAuthenticated ? (
                      <Link className="nav-link flex items-center gap-1.5 font-semibold text-[#1d1c50]" href="/profile">
                        <User className="w-4 h-4 text-[#c9b896]" />
                        <span>{user?.name?.split(" ")[0] || "Account"}</span>
                      </Link>
                    ) : (
                      <Link className="nav-link" href="/login">
                        Sign In
                      </Link>
                    )}
                  </li> */}
                </ul>
              </div>

              <div className="header-btn">
                <a
                  href="https://www.amazon.com/dp/B0GX59F5BG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-default"
                >
                  Buy Now
                </a>
              </div>
            </div>
            <div className="navbar-toggle"></div>
          </div>
        </nav>
        <div className="responsive-menu"></div>
      </div>
    </header>
  );
}
