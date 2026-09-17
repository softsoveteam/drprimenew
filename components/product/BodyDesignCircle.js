"use client";

import { useEffect, useRef } from "react";

const STEP = Math.PI / 4;

function shortestFromRight(angle) {
  const twoPi = Math.PI * 2;
  const n = ((angle % twoPi) + twoPi) % twoPi;
  return Math.min(n, twoPi - n);
}

export default function BodyDesignCircle({ color = "blue", features = [] }) {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const items = itemRefs.current.filter(Boolean);
    if (!section || !items.length) return;

    let target = 0;
    let current = 0;
    let running = false;
    const isMobile = window.innerWidth <= 600;
    const LERP = isMobile ? 0.12 : 0.08;

    const radiusFor = () => {
      const w = window.innerWidth;
      if (w <= 400) return 150;
      if (w <= 600) return 180;
      if (w <= 991) return 240;
      return 350;
    };

    const update = (p) => {
      const maxTurn = Math.max(0, features.length - 1) * STEP;
      const rotation = -p * maxTurn;
      const radius = radiusFor();
      let active = 0;
      let minDist = Infinity;

      const angles = features.map((_, i) => rotation + i * STEP);
      angles.forEach((angle, i) => {
        const dist = shortestFromRight(angle);
        if (dist < minDist) {
          minDist = dist;
          active = i;
        }
      });

      items.forEach((el, i) => {
        const x = Math.cos(angles[i]) * radius;
        const y = Math.sin(angles[i]) * radius;
        const dist = shortestFromRight(angles[i]);
        el.style.transform = `translate(${x}px, calc(-50% + ${y}px))`;
        el.classList.toggle("is-active", i === active);
        el.classList.toggle(
          "is-adjacent",
          !isMobile && i !== active && dist < STEP + 0.2
        );
      });
    };

    const tick = () => {
      const d = target - current;
      if (Math.abs(d) > 0.0004) {
        current += d * LERP;
        update(current);
        requestAnimationFrame(tick);
      } else {
        current = target;
        update(current);
        running = false;
      }
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      target = Math.max(0, Math.min(1, -rect.top / scrollable));
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [features]);

  const pillowSrc = color === "grey" ? "/assets/gray-pillow.png" : "/assets/blue-pillow.png";

  return (
    <section className="dp-body-circle" ref={sectionRef} id="body-design">
      <div className="dp-body-circle-sticky">
        <div className="dp-body-circle-glow" aria-hidden="true"></div>
        <div className="dp-body-circle-ring" aria-hidden="true"></div>
        <div className="dp-body-circle-image">
          <img src={pillowSrc} alt="PrimeHeal pillow" />
        </div>
        <div className="dp-body-circle-features">
          {features.map((item, i) => {
            const x = Math.cos(i * STEP) * 350;
            const y = Math.sin(i * STEP) * 350;
            const cls =
              i === 0
                ? "dp-body-circle-item is-active"
                : i === 1
                  ? "dp-body-circle-item is-adjacent"
                  : "dp-body-circle-item";
            return (
              <div
                className={cls}
                key={item.title}
                style={{ transform: `translate(${x}px, calc(-50% + ${y}px))` }}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
              >
                <div className="dp-body-circle-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="dp-body-circle-copy">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
