"use client";

import { useEffect, useState } from "react";
import useScrollReveal from "./useScrollReveal";
import ProductOffer from "@/components/product/ProductOffer";
import StoreBuyLink from "@/components/product/StoreBuyLink";
import { useProductDetails } from "@/hooks/useProductDetails";

const BLUE_THUMBS = [
  "/assets/product/blue/0.jpg",
  "/assets/product/blue/01.jpg",
  "/assets/product/blue/1.jpg",
  "/assets/product/blue/2.jpg",
  "/assets/product/blue/3.jpg",
  "/assets/product/blue/4.jpg",
  "/assets/product/blue/5.jpg",
  "/assets/product/blue/6.jpg",
  "/assets/product/blue/7.jpg",
  "/assets/product/blue/8.jpg",
  "/assets/product/blue/9.jpg",
  "/assets/product/blue/10.jpg",
  "/assets/product/blue/12.jpg",
];

const GRAY_THUMBS = [
  "/assets/product/grey/0.jpg",
  "/assets/product/grey/1.jpg",
  "/assets/product/grey/2.jpg",
  "/assets/product/grey/3.jpg",
  "/assets/product/grey/4.jpg",
  "/assets/product/grey/5.jpg",
  "/assets/product/grey/6.jpg",
  "/assets/product/grey/7.jpg",
  "/assets/product/grey/8.jpg",
  "/assets/product/grey/09.jpg",
  "/assets/product/grey/9.jpg",
  "/assets/product/grey/10.jpg",
  "/assets/product/grey/11.jpg",
  "/assets/product/grey/12.jpg",
  "/assets/product/grey/13.jpg",
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
  const { offer } = useProductDetails();
  const amazon =
    color === "grey"
      ? "https://www.amazon.com/dp/B0GX61KHFF"
      : "https://www.amazon.com/dp/B0GX59F5BG";

  const onColor = (c) => {
    setColor(c);
    setActive(0);
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("dp-buy-link", { detail: amazon }));
  }, [amazon]);

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
            <ProductOffer offer={offer} />

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

            <StoreBuyLink href={amazon} inStock={offer.inStock}>
              Buy Now
            </StoreBuyLink>

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
