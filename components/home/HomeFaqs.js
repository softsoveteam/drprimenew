"use client";

import { useEffect, useState } from "react";

const FAQS = [
  {
    q: "What is the Dr.Prime Pillow?",
    img: "/assets/slider-pillow.png",
    alt: "PrimeHeal pillow",
    a: "The Dr.Prime Pillow is a premium orthopedic sleep pillow designed to support your head, neck, and shoulders. It is built with 60D high density memory foam and an ergonomic cervical contour that keeps your spine in proper alignment — whether you sleep on your side, back, or stomach.",
  },
  {
    q: "Will it help with my neck, shoulder, and back pain from sleeping?",
    img: "/assets/DSC07277-1.jpg",
    alt: "Neck support",
    a: "Yes. PrimeHeal is designed to address the root cause of sleep related neck and shoulder pain — poor spinal alignment. Most customers who switch from a flat pillow report noticeable reduction in morning stiffness within the first 1 to 2 weeks. Results vary by individual.",
  },
  {
    q: "Will it improve my sleep quality?",
    img: "/assets/DSC06980.jpg",
    alt: "Deeper sleep",
    a: "When your body is properly supported, you spend more time in deep restorative sleep and less time shifting and waking. Add cooling fabric that prevents heat buildup and the result is a pillow that actively contributes to better sleep quality, not just comfort.",
  },
  {
    q: "How is Dr.Prime Pillow different from other cervical pillows?",
    img: "/assets/built-for-section.png",
    alt: "PrimeHeal difference",
    a: "Most cervical pillows use low density uncertified foam. Dr.Prime Pillow uses 60D high density foam, CertiPUR-US certified foam, OEKO-TEX Standard 100 fabric, and ISPA recognition. Most pillows you find online have none of these. Dr.Prime Pillow has all three.",
  },
];

function FaqList({ openIndex, onToggle }) {
  return (
    <div className="dp-home-faqs" data-faq-version="closed-default-v5">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={faq.q}
            className="dp-home-faq-item"
            data-open={isOpen ? "true" : "false"}
          >
            <button
              type="button"
              className="dp-home-faq-btn"
              aria-expanded={isOpen}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!e.isTrusted) return;
                onToggle(i);
              }}
            >
              <span className="dp-home-faq-q">{faq.q}</span>
              <span
                className="dp-home-faq-icon"
                aria-hidden="true"
                data-state={isOpen ? "open" : "closed"}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen ? (
              <div className="dp-home-faq-answer">
                <figure>
                  <img src={faq.img} alt={faq.alt} />
                </figure>
                <p>{faq.a}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    setOpenIndex(-1);
    const closeAll = () => setOpenIndex(-1);
    window.addEventListener("pageshow", closeAll);
    return () => window.removeEventListener("pageshow", closeAll);
  }, []);

  return (
    <FaqList
      openIndex={openIndex}
      onToggle={(i) => setOpenIndex((prev) => (prev === i ? -1 : i))}
    />
  );
}

export default function HomeFaqs() {
  // Remount accordion on every full page load so nothing can restore an open panel
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    setLoadKey(Date.now());

    // Drop any stale service worker / Cache Storage that could serve old FAQ HTML
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
    }
    if (typeof caches !== "undefined") {
      caches.keys?.().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }, []);

  if (!loadKey) {
    return <FaqList openIndex={-1} onToggle={() => {}} />;
  }

  return <FaqAccordion key={loadKey} />;
}
