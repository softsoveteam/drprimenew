"use client";

import { useEffect, useRef } from "react";
import useScrollReveal from "./useScrollReveal";

const AMAZON_BLUE = "https://www.amazon.com/dp/B0GX59F5BG";

const ITEMS = [
  {
    icon: "/assets/slumber.svg",
    image: "/assets/DSC07140-2.jpg",
    alt: "Sleep better feel better",
    title: "30-Night Free Trial",
    body: "Love your sleep guarantee. Try PrimeHeal at home and feel the difference in how you wake up.",
  },
  {
    icon: "/assets/cooling.svg",
    image: "/assets/couple-pillow-2.png",
    alt: "Couples sleep better",
    title: "Stays Cool All Night",
    body: "Breathable cooling fabric draws heat away so you spend more time in deep sleep, not waking up warm.",
  },
  {
    icon: "/assets/scoliosis.svg",
    image: "/assets/slider-pillow.png",
    alt: "PrimeHeal pillow upgrade",
    title: "Posture Correction",
    body: "Ergonomic shape supports healthy posture and keeps your neck aligned whether you sleep on your side, back, or stomach.",
  },
];

export default function WhatYouGet() {
  useScrollReveal();
  const stackRef = useRef(null);
  const footerRef = useRef(null);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const stack = stackRef.current;
    const footer = footerRef.current;
    if (!stack || !footer) return;

    const items = Array.from(stack.querySelectorAll(".dp-wyg-stack-item"));
    if (!items.length) return;

    let observer = null;
    let placeholder = placeholderRef.current;

    const isMobileStack = () => window.matchMedia("(max-width: 991px)").matches;

    const unpinFooter = () => {
      footer.classList.remove("is-fixed-below-card");
      footer.style.top = "";
      footer.style.left = "";
      footer.style.width = "";
      if (placeholder) placeholder.style.height = "0";
    };

    const ensurePlaceholder = () => {
      if (placeholder) return;
      placeholder = document.createElement("div");
      placeholder.className = "dp-wyg-footer-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      footer.parentElement.insertBefore(placeholder, footer.nextSibling);
      placeholderRef.current = placeholder;
    };

    const updatePinnedFooter = () => {
      if (!isMobileStack()) {
        unpinFooter();
        return;
      }

      const lastItem = items[items.length - 1];
      const card = lastItem?.querySelector(".dp-wyg-card");
      if (!card) return;

      const stickyTop = parseFloat(getComputedStyle(lastItem).top) || 120;
      const cardRect = card.getBoundingClientRect();
      const stackRect = stack.getBoundingClientRect();
      const footerHeight = footer.offsetHeight;
      const footerTop = cardRect.bottom + 10;
      const sectionBottom = stackRect.bottom;

      const lastCardStacked =
        cardRect.top <= stickyTop + 10 &&
        sectionBottom > footerTop + footerHeight;

      if (lastCardStacked && footerTop + footerHeight < window.innerHeight + 40) {
        ensurePlaceholder();
        placeholder.style.height = `${footerHeight}px`;
        footer.classList.add("is-fixed-below-card");

        const container = stack.closest(".container");
        const containerRect = container
          ? container.getBoundingClientRect()
          : { left: 0, width: window.innerWidth };

        footer.style.top = `${footerTop}px`;
        footer.style.left = `${containerRect.left}px`;
        footer.style.width = `${containerRect.width}px`;
        return;
      }

      unpinFooter();
    };

    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (!isMobileStack()) {
        items.forEach((item) => item.classList.remove("is-passed"));
        unpinFooter();
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("is-passed", !entry.isIntersecting);
          });
          updatePinnedFooter();
        },
        {
          root: null,
          rootMargin: "-45% 0px -40% 0px",
          threshold: 0,
        }
      );

      items.forEach((item) => observer.observe(item));
      updatePinnedFooter();
    };

    setupObserver();
    window.addEventListener("resize", setupObserver);
    window.addEventListener("scroll", updatePinnedFooter, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", setupObserver);
      window.removeEventListener("scroll", updatePinnedFooter);
      unpinFooter();
      if (placeholder?.parentElement) placeholder.remove();
      placeholderRef.current = null;
    };
  }, []);

  return (
    <section className="dp-what-you-get" id="what-you-get">
      <div className="container">
        <div className="dp-wyg-header dp-reveal dp-reveal-up">
          <h3>what you get</h3>
          <h2>Sleep support designed around how you actually rest</h2>
        </div>

        <div className="dp-wyg-grid dp-wyg-stack dp-reveal dp-reveal-stagger" ref={stackRef}>
          {ITEMS.map((item, i) => (
            <div className="dp-wyg-stack-item" key={item.title}>
              <article className="dp-wyg-card">
                <div className="dp-wyg-photo">
                  <img src={item.image} alt={item.alt} />
                  <span className="dp-wyg-index">0{i + 1}</span>
                </div>
                <div className="dp-wyg-body">
                  <div className="dp-wyg-icon">
                    <img src={item.icon} alt={item.title} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="dp-wyg-footer dp-reveal" ref={footerRef}>
          <p>
            <span>Sleep</span>
            Ready to change your mornings?{" "}
            <a href={AMAZON_BLUE} target="_blank" rel="noopener noreferrer">
              Get Better Sleep
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
