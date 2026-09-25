"use client";

import { useEffect, useRef } from "react";

export default function QualityExperience() {
  const spacerRef = useRef(null);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
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
    const stage = stageRef.current;
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

    /** Pin each side label to the center of its pillow layer */
    const alignHeadingsToLayers = () => {
      if (!stage || !center) return;

      const phoneLayout = window.innerWidth < 992;
      const stageRect = stage.getBoundingClientRect();
      const pillowRect = center.getBoundingClientRect();
      const all = [
        { layer: img1, point: l1, side: "left" },
        { layer: img2, point: l2, side: "right" },
        { layer: img3, point: l3, side: "left" },
        { layer: img4, point: l4, side: "right" },
      ];

      all.forEach(({ point }) => {
        if (!point) return;
        if (!(phoneLayout && (point === l1 || point === l4))) return;
        point.style.top = "";
        point.style.bottom = "";
        point.style.transform = "";
        point.style.left = "";
        point.style.right = "";
        const line = point.querySelector(".dp-lp-line");
        if (line) line.style.width = "";
      });

      if (pillowRect.width < 2) return;

      const pairs = phoneLayout
        ? [
            { layer: img2, point: l2, side: "right" },
            { layer: img3, point: l3, side: "left" },
          ]
        : all;

      pairs.forEach(({ layer, point, side }) => {
        if (!layer || !point) return;
        const img = layer.querySelector("img") || layer;
        const layerRect = img.getBoundingClientRect();
        if (layerRect.height < 2) return;

        const anchorY = layerRect.top - stageRect.top + layerRect.height * 0.5;
        point.style.top = `${Math.round(anchorY)}px`;
        point.style.bottom = "auto";
        point.style.transform = "translateY(-50%)";
        if (side === "left") {
          point.style.left = "0px";
          point.style.right = "auto";
        } else {
          point.style.right = "0px";
          point.style.left = "auto";
        }

        const line = point.querySelector(".dp-lp-line");
        const content = point.querySelector(".dp-lp-content");
        if (!line || !content) return;
        line.style.width = "0px";
        const contentRect = content.getBoundingClientRect();
        const hit = pillowRect.width * (side === "right" ? 0.3 : 0.16);
        const lineW =
          side === "left"
            ? pillowRect.left - stageRect.left + hit - (contentRect.right - stageRect.left)
            : contentRect.left - stageRect.left - (pillowRect.right - stageRect.left - hit);
        line.style.width = `${Math.max(24, Math.round(lineW))}px`;
      });
    };

    const phone = window.innerWidth < 992;
    const scrollExtra = () => window.innerHeight * (window.innerWidth < 992 ? 1 : 1.5);
    let scrollDistance = scrollExtra();
    const setSpacer = () => {
      scrollDistance = scrollExtra();
      spacer.style.height = section.offsetHeight + scrollDistance + "px";
    };
    setSpacer();

    const SHOW_PILLOW = phone ? 0.02 : 0.05;
    const SHOW_L1 = phone ? 0.06 : 0.15;
    const SHOW_L2 = phone ? 0.14 : 0.3;
    const SHOW_L3 = phone ? 0.24 : 0.45;
    const SHOW_L4 = phone ? 0.36 : 0.6;
    const SHOW_STAT1 = phone ? 0.58 : 0.85;
    const SHOW_STAT2 = phone ? 0.74 : 0.95;

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
    const LERP = 0.08;
    let running = false;

    const update = (p) => {
      if (img1) img1.classList.toggle("layer-visible", p >= (phone ? 0.01 : 0.02));
      if (img2) img2.classList.toggle("layer-visible", p >= (phone ? 0.08 : 0.15));
      if (img3) img3.classList.toggle("layer-visible", p >= (phone ? 0.18 : 0.3));
      if (img4) img4.classList.toggle("layer-visible", p >= (phone ? 0.3 : 0.45));
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

      // Re-align after layers finish transitioning into place
      requestAnimationFrame(alignHeadingsToLayers);
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

    const imgs = [img1, img2, img3, img4]
      .map((el) => el?.querySelector("img"))
      .filter(Boolean);
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", alignHeadingsToLayers, { once: true });
    });

    const onScroll = () => {
      const rect = spacer.getBoundingClientRect();
      const scrolled = -rect.top;
      target = Math.max(0, Math.min(1, scrolled / scrollDistance));
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    };
    const onResize = () => {
      setSpacer();
      onScroll();
      alignHeadingsToLayers();
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
          <div className="dp-fab-stage" ref={stageRef}>
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
              <h2 ref={num1Ref}>0%</h2>
              <h4>of adults</h4>
              <p>experience neck pain from poor sleep posture</p>
            </div>
            <div className="dp-fab-stat" ref={stat2Ref}>
              <h2 ref={num2Ref}>0 in 3</h2>
              <h4>adults</h4>
              <p>don&apos;t get the sleep their body needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
