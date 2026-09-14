"use client";

import useScrollReveal from "./useScrollReveal";

const WHY_GRID = [
  {
    icon: "fa-solid fa-snowflake",
    title: "Stay Cool All Night",
    body: "Advanced cooling fabric channels heat away for deeper, uninterrupted sleep.",
  },
  {
    icon: "fa-solid fa-spa",
    title: "Relieve Neck & Shoulder Pain",
    body: "Ergonomic contours target pressure points to eliminate stiffness and support your posture.",
  },
  {
    icon: "fa-solid fa-award",
    title: "CertiPUR-US® Certified Foam",
    body: "High-density orthopedic memory foam provides durable, toxin-free support that lasts.",
  },
];

export default function WhyDifferent() {
  useScrollReveal();

  return (
    <section className="dp-why-different" id="why-choose-us">
      <div className="container">
        <div className="dp-why-header dp-reveal dp-reveal-up">
          <h3>Why Choose Us</h3>
          <h2>What Makes Dr.Prime Pillow Different</h2>
          <p>
            Because better sleep is not just about comfort anymore. It is about
            waking up feeling less tired, less stiff, and a little more ready
            for whatever life throws at you.
          </p>
        </div>
        <div className="dp-premium-grid dp-reveal dp-reveal-stagger">
          {WHY_GRID.map((item) => (
            <div className="dp-premium-card" key={item.title}>
              <div className="dp-premium-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
