"use client";

import { useEffect, useRef } from "react";

export default function QualityExperience() {
  const spacerRef = useRef(null);
  const sectionRef = useRef(null);
  const centerRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);
  const layerImg1Ref = useRef(null);
  const layerImg2Ref = useRef(null);
  const layerImg3Ref = useRef(null);
  const layerImg4Ref = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const section = sectionRef.current;
    const center = centerRef.current;
    const l1 = layer1Ref.current;
    const l2 = layer2Ref.current;
    const l3 = layer3Ref.current;
    const l4 = layer4Ref.current;
    const s1 = stat1Ref.current;
    const s2 = stat2Ref.current;
    const n1 = num1Ref.current;
    const n2 = num2Ref.current;
    const img1 = layerImg1Ref.current;
    const img2 = layerImg2Ref.current;
    const img3 = layerImg3Ref.current;
    const img4 = layerImg4Ref.current;
    if (!spacer || !section) return;

    const isMobile = window.innerWidth <= 768;
    const SCROLL_EXTRA = isMobile ? 0 : window.innerHeight * 1.5;
    const setSpacer = () => {
      if (isMobile) spacer.style.height = "auto";
      else spacer.style.height = section.offsetHeight + SCROLL_EXTRA + "px";
    };
    setSpacer();

    const SHOW_PILLOW = 0.05;
    const SHOW_L1 = 0.15;
    const SHOW_L2 = 0.3;
    const SHOW_L3 = 0.45;
    const SHOW_L4 = 0.6;
    const SHOW_STAT1 = 0.85;
    const SHOW_STAT2 = 0.95;

    const animateCount = (el, target, suffix, dur = 1500) => {
      if (el.dataset.animated === "true") return;
      el.dataset.animated = "true";
      const start = performance.now();
      const tick = (now) => {
        if (el.dataset.animated !== "true") return;
        const elapsed = now - start;
        const p = Math.min(elapsed / dur, 1);
        const ease = p * (2 - p);
        el.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    };
    const resetCount = (el, suffix) => {
      el.dataset.animated = "false";
      el.textContent = "0" + suffix;
    };

    let target = 0;
    let current = 0;
    const LERP = isMobile ? 0.015 : 0.08;
    let running = false;

    const update = (p) => {
      if (img1) img1.classList.toggle("layer-visible", p >= 0.02);
      if (img2) img2.classList.toggle("layer-visible", p >= 0.15);
      if (img3) img3.classList.toggle("layer-visible", p >= 0.3);
      if (img4) img4.classList.toggle("layer-visible", p >= 0.45);
      if (center) center.classList.toggle("is-visible", p >= SHOW_PILLOW);
      if (l1) l1.classList.toggle("is-visible", p >= SHOW_L1);
      if (l2) l2.classList.toggle("is-visible", p >= SHOW_L2);
      if (l3) l3.classList.toggle("is-visible", p >= SHOW_L3);
      if (l4) l4.classList.toggle("is-visible", p >= SHOW_L4);

      if (s1 && n1) {
        if (p >= SHOW_STAT1 && !s1.classList.contains("is-visible")) {
          s1.classList.add("is-visible");
          animateCount(n1, 80, "%");
        } else if (p < SHOW_STAT1 && s1.classList.contains("is-visible")) {
          s1.classList.remove("is-visible");
          resetCount(n1, "%");
        }
      }
      if (s2 && n2) {
        if (p >= SHOW_STAT2 && !s2.classList.contains("is-visible")) {
          s2.classList.add("is-visible");
          animateCount(n2, 1, " in 3", 400);
        } else if (p < SHOW_STAT2 && s2.classList.contains("is-visible")) {
          s2.classList.remove("is-visible");
          resetCount(n2, " in 3");
        }
      }
    };

    const tick = () => {
      const d = target - current;
      if (Math.abs(d) > 0.0001) {
        current += d * LERP;
        update(current);
        requestAnimationFrame(tick);
      } else {
        current = target;
        update(current);
        running = false;
      }
    };

    if (isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            target = 1;
            if (!running) {
              running = true;
              requestAnimationFrame(tick);
            }
            observer.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
      );
      observer.observe(section);
      return () => observer.disconnect();
    }

    const onScroll = () => {
      const rect = spacer.getBoundingClientRect();
      const scrolled = -rect.top;
      target = Math.max(0, Math.min(1, scrolled / SCROLL_EXTRA));
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    };
    const onResize = () => {
      setSpacer();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="dp-fab-spacer" ref={spacerRef}>
      <section className="dp-fab-detail" ref={sectionRef}>
        <div className="dp-fab-arcs" aria-hidden="true">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <circle cx="150" cy="900" r="500" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <circle cx="150" cy="900" r="750" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <circle cx="1200" cy="400" r="280" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <circle cx="1200" cy="400" r="480" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </svg>
        </div>
        <div className="container">
          <div className="dp-fab-stage">
            <div className="dp-fab-pillow" ref={centerRef}>
              <div className="dp-fab-layer dp-fab-img4" ref={layerImg4Ref}>
                <img src="/assets/febric-layer/Layer-4.png" alt="Bottom Fabric" />
              </div>
              <div className="dp-fab-layer dp-fab-img3" ref={layerImg3Ref}>
                <img src="/assets/febric-layer/Layer-3.png" alt="Memory Foam Core" />
              </div>
              <div className="dp-fab-layer dp-fab-img2" ref={layerImg2Ref}>
                <img src="/assets/febric-layer/Layer-2.png" alt="Breathable Inner Layer" />
              </div>
              <div className="dp-fab-layer dp-fab-img1" ref={layerImg1Ref}>
                <img src="/assets/febric-layer/Layer-1.png" alt="Top Cooling Cover" />
              </div>
            </div>

            <div className="dp-fab-points">
              <div className="dp-fab-point dp-lp1" ref={layer1Ref}>
                <div className="dp-lp-content">
                  <div className="dp-lp-icon"><i className="fa-solid fa-snowflake"></i></div>
                  <h3>Top Cooling Cover</h3>
                </div>
                <div className="dp-lp-line-wrap"><div className="dp-lp-line"></div><div className="dp-lp-dot"></div></div>
              </div>
              <div className="dp-fab-point dp-lp2" ref={layer2Ref}>
                <div className="dp-lp-content">
                  <div className="dp-lp-icon"><i className="fa-solid fa-wind"></i></div>
                  <h3>Breathable Inner Layer</h3>
                </div>
                <div className="dp-lp-line-wrap"><div className="dp-lp-line"></div><div className="dp-lp-dot"></div></div>
              </div>
              <div className="dp-fab-point dp-lp3" ref={layer3Ref}>
                <div className="dp-lp-content">
                  <div className="dp-lp-icon"><i className="fa-solid fa-layer-group"></i></div>
                  <h3>Memory Foam Core</h3>
                </div>
                <div className="dp-lp-line-wrap"><div className="dp-lp-line"></div><div className="dp-lp-dot"></div></div>
              </div>
              <div className="dp-fab-point dp-lp4" ref={layer4Ref}>
                <div className="dp-lp-content">
                  <div className="dp-lp-icon"><i className="fa-solid fa-border-all"></i></div>
                  <h3>Bottom Fabric</h3>
                </div>
                <div className="dp-lp-line-wrap"><div className="dp-lp-line"></div><div className="dp-lp-dot"></div></div>
              </div>
            </div>
          </div>

          <div className="dp-fab-stats">
            <div className="dp-fab-stat" ref={stat1Ref}>
              <h2 ref={num1Ref}>80%</h2>
              <h4>of adults</h4>
              <p>experience neck pain from poor sleep posture</p>
            </div>
            <div className="dp-fab-stat" ref={stat2Ref}>
              <h2 ref={num2Ref}>1 in 3</h2>
              <h4>adults</h4>
              <p>don&apos;t get the sleep their body needs</p>
            </div>
          </div>
          <div className="dp-fab-mark">Dr.Prime Pillow<sup>TM</sup></div>
        </div>
      </section>
    </div>
  );
}
