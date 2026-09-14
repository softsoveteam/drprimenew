"use client";

import { useEffect } from "react";

const SCRIPTS = [
  "/js/jquery-3.7.1.min.js",
  "/js/bootstrap.min.js",
  "/js/validator.min.js",
  "/js/jquery.slicknav.js",
  "/js/swiper-bundle.min.js",
  "/js/jquery.waypoints.min.js",
  "/js/jquery.counterup.min.js",
  "/js/jquery.magnific-popup.min.js",
  "/js/SmoothScroll.js",
  "/js/parallaxie.js",
  "/js/gsap.min.js",
  "/js/SplitText.js",
  "/js/ScrollTrigger.min.js",
  "/js/jquery.mb.YTPlayer.min.js",
  "/js/wow.min.js",
  "/js/function.js",
];

function loadScript(src) {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[data-tpl-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.tplSrc = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

export default function TemplateScripts() {
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      for (const src of SCRIPTS) {
        if (cancelled) return;
        await loadScript(src);
      }
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
