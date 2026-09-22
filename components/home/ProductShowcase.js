"use client";

import { useEffect, useRef } from "react";

export default function ProductShowcase() {
  const spacerRef = useRef(null);
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const section = sectionRef.current;
    const path = pathRef.current;
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    if (!spacer || !section || !path || !p1 || !p2) return;

    const interactive = path.closest(".dp-product-interactive");
    if (!interactive) return;

    const isMobile = () => window.innerWidth <= 768;
    const getScrollExtra = () =>
      isMobile() ? window.innerHeight * 0.5 : window.innerHeight * 1.5;

    const setSpacer = () => {
      spacer.style.height = section.offsetHeight + getScrollExtra() + "px";
    };
    setSpacer();

    // Pin callout dots onto the SVG curve on mobile only — keep desktop CSS positions
    const placePointersOnCurve = () => {
      if (!isMobile()) {
        p1.style.left = "";
        p1.style.top = "";
        p2.style.left = "";
        p2.style.top = "";
        return;
      }

      const svg = path.ownerSVGElement;
      const ctm = path.getScreenCTM();
      if (!svg || !ctm) return;

      const len = path.getTotalLength();
      let peak = null;
      let trough = null;
      let minY = Infinity;
      let maxY = -Infinity;

      for (let i = 0; i <= 500; i++) {
        const pt = path.getPointAtLength((i / 500) * len);
        if (pt.x >= 80 && pt.x <= 400 && pt.y < minY) {
          minY = pt.y;
          peak = pt;
        }
        if (pt.x >= 700 && pt.x <= 1120 && pt.y > maxY) {
          maxY = pt.y;
          trough = pt;
        }
      }

      const toLocal = (pt) => {
        const sp = svg.createSVGPoint();
        sp.x = pt.x;
        sp.y = pt.y;
        const screen = sp.matrixTransform(ctm);
        const box = interactive.getBoundingClientRect();
        return { x: screen.x - box.left, y: screen.y - box.top };
      };

      if (peak) {
        const loc = toLocal(peak);
        p1.style.left = `${loc.x}px`;
        p1.style.top = `${loc.y}px`;
      }
      if (trough) {
        const loc = toLocal(trough);
        p2.style.left = `${loc.x}px`;
        p2.style.top = `${loc.y}px`;
      }
    };

    const DOT1_END = isMobile() ? 0.05 : 0.45;
    const DOT2_END = isMobile() ? 0.15 : 0.75;
    const SCROLL_OFFSET = isMobile() ? 0 : 200;
    const TOL = 0.02;

    let target = 0;
    let current = 0;
    const LERP = isMobile() ? 0.2 : 0.08;
    let running = false;

    const update = (progress) => {
      path.style.strokeDashoffset = String(100 - progress * 100);
      if (progress < DOT1_END - TOL) p1.classList.remove("pointer-arrived");
      else p1.classList.add("pointer-arrived");
      if (progress < DOT2_END - TOL) p2.classList.remove("pointer-arrived");
      else p2.classList.add("pointer-arrived");
    };

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) > 0.0001) {
        current += diff * LERP;
        update(current);
        requestAnimationFrame(tick);
      } else {
        current = target;
        update(current);
        running = false;
      }
    };

    const onScroll = () => {
      const rect = spacer.getBoundingClientRect();
      let scrolled = -rect.top - SCROLL_OFFSET;
      let progress = Math.max(0, Math.min(1, scrolled / getScrollExtra()));

      if (isMobile()) {
        const sr = section.getBoundingClientRect();
        const inView =
          sr.top < window.innerHeight * 0.8 && sr.bottom > window.innerHeight * 0.2;
        if (inView) progress = Math.max(progress, 1);
      }

      target = progress;
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      setSpacer();
      placePointersOnCurve();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => {
      placePointersOnCurve();
      setSpacer();
    });
    ro.observe(interactive);

    requestAnimationFrame(() => {
      placePointersOnCurve();
      onScroll();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="dp-showcase-spacer" ref={spacerRef}>
      <section className="dp-product-showcase" ref={sectionRef}>
        <span className="dp-spark dp-s1">✦</span>
        <span className="dp-spark dp-s2">✦</span>
        <span className="dp-spark dp-s3">✦</span>

        <div className="container dp-showcase-container text-center">
          <h2 className="dp-showcase-title">
            Built For Better Recovery,
            <br />
            Every Night.
          </h2>
          <p className="dp-showcase-lead">
            Better sleep is not just about feeling rested. It is about waking up
            with more energy, better posture, and fewer mornings where your body
            feels completely exhausted.
          </p>

          <div className="dp-product-interactive">
            <div className="dp-curve-container">
              <svg viewBox="0 80 1200 240" preserveAspectRatio="none">
                <path
                  ref={pathRef}
                  d="M -1200,238 C -600,20 -596,456 0,238 C 596,20 587,459 1200,226 C 1813,-7 1800,459 2400,226"
                  className="dp-curve-path"
                  pathLength="100"
                />
              </svg>
            </div>

            <div className="dp-main-pillow-wrap">
              <img
                src="/assets/built-for-section.png"
                alt="PrimeHeal pillow"
                className="dp-main-pillow"
              />
            </div>

            <div ref={p1Ref} className="dp-pointer dp-p1">
              <div className="dp-pointer-box">
                <h4>Healthy Alignment</h4>
                <p>Supports natural neck and spine alignment.</p>
              </div>
              <div className="dp-pointer-line"></div>
              <div className="dp-dot"></div>
            </div>

            <div ref={p2Ref} className="dp-pointer dp-p2">
              <div className="dp-dot"></div>
              <div className="dp-pointer-line"></div>
              <div className="dp-pointer-box">
                <h4>Deeper Sleep</h4>
                <p>Helps your body relax faster and sleep longer.</p>
              </div>
            </div>

            <div className="dp-invest-text">
              <h2>RIGHT</h2>
              <h2>WAY TO</h2>
              <h2>SLEEP</h2>
              <h2 className="dp-text-white">BETTER</h2>
            </div>
          </div>

          <div className="dp-product-details">
            <p>
              From long workdays to late-night scrolling, your body goes through
              enough already. Thoughtful support and everyday comfort help you
              recharge properly so you can wake up feeling more refreshed,
              focused, and ready for the day ahead.
            </p>
          </div>
        </div>

        <div className="dp-mobile-two-text">
          <div className="dp-invest-text-mobile">
            <h2>RIGHT</h2>
            <h2>WAY TO</h2>
            <h2>SLEEP</h2>
            <h2 className="dp-text-white">BETTER</h2>
          </div>
          <div className="dp-product-details-mobile">
            <p>
              From long workdays to late-night scrolling, your body goes through
              enough already. Thoughtful support and everyday comfort help you
              recharge properly so you can wake up feeling more refreshed,
              focused, and ready for the day ahead.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
