"use client";

import { useState } from "react";
import useScrollReveal from "./useScrollReveal";

const BLUE_THUMBS = [
  "/assets/sky-blue/01.jpg",
  "/assets/sky-blue/02.jpg",
  "/assets/sky-blue/03-1.jpeg",
  "/assets/sky-blue/04-1.jpeg",
  "/assets/sky-blue/05.jpeg",
];

const GRAY_THUMBS = [
  "/assets/cool-gray/01.jpeg",
  "/assets/cool-gray/02.jpeg",
  "/assets/cool-gray/03.jpeg",
  "/assets/cool-gray/04.jpeg",
  "/assets/cool-gray/05.jpeg",
];

const FEATURES = [
  { icon: "/assets/design.svg", text: "Built for every sleep position" },
  { icon: "/assets/foam.svg", text: "Slow-rebound 60D memory foam core" },
  { icon: "/assets/scoliosis.svg", text: "Shoulder relief cutouts on both sides" },
  { icon: "/assets/cooling.svg", text: "Cooling, breathable cover fabric" },
  { icon: "/assets/adjust.svg", text: "Removable, machine-washable cover" },
];

export default function HomeProduct() {
  useScrollReveal();
  const [color, setColor] = useState("blue");
  const [active, setActive] = useState(0);
  const thumbs = color === "grey" ? GRAY_THUMBS : BLUE_THUMBS;
  const amazon =
    color === "grey"
      ? "https://www.amazon.com/dp/B0GX61KHFF"
      : "https://www.amazon.com/dp/B0GX59F5BG";

  const onColor = (c) => {
    setColor(c);
    setActive(0);
  };

  return (
    <section className="dp-product">
      <div className="container">
        <div className="dp-prod-header dp-reveal dp-reveal-up">
          <h3>Our Product</h3>
          <h2>The PrimeHeal</h2>
          <p>Shaped for you. Out of the box.</p>
        </div>

        <div className="dp-prod-grid dp-reveal">
          <div className="dp-prod-gallery">
            <div className="dp-prod-main">
              <button type="button" className="dp-prod-arrow left" onClick={() => setActive((i) => (i - 1 + thumbs.length) % thumbs.length)} aria-label="Previous image">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <img src={thumbs[active]} alt="The PrimeHeal Pillow" />
              <button type="button" className="dp-prod-arrow right" onClick={() => setActive((i) => (i + 1) % thumbs.length)} aria-label="Next image">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="dp-prod-thumbs">
              {thumbs.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === active ? "is-active" : ""}
                  onClick={() => setActive(i)}
                >
                  <img src={src} alt={`PrimeHeal thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="dp-prod-info">
            <div className="dp-prod-rating">
              <span>4.6</span>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star-half-stroke"></i>
            </div>
            <h2>The PrimeHeal</h2>
            <p className="dp-prod-sub">Shaped for you. Out of the box.</p>
            <div className="dp-prod-price">$54.99</div>
            <p className="dp-prod-desc">
              Experience the ultimate in neck support and spinal alignment.
              The PrimeHeal is engineered with premium memory foam to relieve
              pressure, reduce morning stiffness, and ensure a deep, restorative
              sleep.
            </p>

            <div className="dp-prod-colors">
              <button
                type="button"
                className={color === "blue" ? "is-active" : ""}
                onClick={() => onColor("blue")}
              >
                <span className="dp-swatch blue"></span>
                Sky Blue
              </button>
              <button
                type="button"
                className={color === "grey" ? "is-active" : ""}
                onClick={() => onColor("grey")}
              >
                <span className="dp-swatch grey"></span>
                Cool Grey
              </button>
            </div>

            <a href={amazon} target="_blank" rel="noopener noreferrer" className="btn-default">
              Buy Now
            </a>

            <ul className="dp-prod-features">
              {FEATURES.map((f) => (
                <li key={f.text}>
                  <img src={f.icon} alt={f.text} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
