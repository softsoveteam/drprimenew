"use client";

import useScrollReveal from "./useScrollReveal";

const FEATURES = [
  {
    icon: "fa-solid fa-moon",
    title: "30-Night Free Trial",
    body: "Love your sleep guarantee.",
  },
  {
    icon: "fa-solid fa-snowflake",
    title: "Stays Cool All Night",
    body: "Breathable cooling fabric draws heat away.",
  },
  {
    icon: "fa-solid fa-user",
    title: "Posture Correction",
    body: "Ergonomic shape supports healthy posture.",
  },
];

export default function HomeFeature() {
  useScrollReveal();

  return (
    <section className="dp-why-different" id="our-feature">
      <div className="container">
        <div className="dp-why-header dp-reveal dp-reveal-up">
          <h3>our feature</h3>
          <h2>Designed For Deeper Sleep</h2>
          <p>
            Because waking up tired every day should not feel normal. Our
            ergonomic comfort design helps support your neck and posture while
            creating the kind of sleep experience your body actually looks
            forward to at night.
          </p>
        </div>
        <div className="dp-premium-grid dp-reveal dp-reveal-stagger">
          {FEATURES.map((item) => (
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
