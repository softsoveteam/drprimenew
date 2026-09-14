"use client";

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

  return (
    <section className="dp-what-you-get" id="what-you-get">
      <div className="container">
        <div className="dp-wyg-header dp-reveal dp-reveal-up">
          <h3>what you get</h3>
          <h2>Sleep support designed around how you actually rest</h2>
        </div>

        <div className="dp-wyg-grid dp-reveal dp-reveal-stagger">
          {ITEMS.map((item, i) => (
            <article className="dp-wyg-card" key={item.title}>
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
          ))}
        </div>

        <div className="dp-wyg-footer dp-reveal">
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
