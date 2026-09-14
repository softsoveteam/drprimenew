"use client";

import { useState } from "react";
import PageTicker from "@/components/PageTicker";
import {
  CUSTOMER_SAY_REVIEWS,
  PRODUCT_FAQS,
  TESTIMONIALS_BLUE,
  TESTIMONIALS_GREY,
} from "@/lib/content";

const BLUE_THUMBS = [
  { src: "/assets/sky-blue/01.jpg", alt: "Sky Blue Pillow 1" },
  { src: "/assets/sky-blue/02.jpg", alt: "Sky Blue Pillow 2" },
  { src: "/assets/sky-blue/03-1.jpeg", alt: "Sky Blue Pillow 3" },
  { src: "/assets/sky-blue/04-1.jpeg", alt: "Sky Blue Pillow 4" },
  { src: "/assets/sky-blue/05.jpeg", alt: "Sky Blue Pillow 5" },
  { src: "/assets/sky-blue/06.jpeg", alt: "Sky Blue Pillow 6" },
  { src: "/assets/sky-blue/07-1.jpeg", alt: "Sky Blue Pillow 7" },
  { src: "/assets/sky-blue/08-1.jpeg", alt: "Sky Blue Pillow 8" },
  { src: "/assets/sky-blue/09.jpeg", alt: "Sky Blue Pillow 9" },
  { src: "/assets/sky-blue/10.jpeg", alt: "Sky Blue Pillow 10" },
  { src: "/assets/sky-blue/11.jpeg", alt: "Sky Blue Pillow 11" },
];

const GRAY_THUMBS = [
  { src: "/assets/cool-gray/01.jpeg", alt: "Cool Gray Pillow 1" },
  { src: "/assets/cool-gray/02.jpeg", alt: "Cool Gray Pillow 2" },
  { src: "/assets/cool-gray/03.jpeg", alt: "Cool Gray Pillow 3" },
  { src: "/assets/cool-gray/04.jpeg", alt: "Cool Gray Pillow 4" },
  { src: "/assets/cool-gray/05.jpeg", alt: "Cool Gray Pillow 5" },
  { src: "/assets/cool-gray/06.jpeg", alt: "Cool Gray Pillow 6" },
  { src: "/assets/cool-gray/07.jpeg", alt: "Cool Gray Pillow 7" },
  { src: "/assets/cool-gray/08.jpeg", alt: "Cool Gray Pillow 8" },
  { src: "/assets/cool-gray/09.jpeg", alt: "Cool Gray Pillow 9" },
  { src: "/assets/cool-gray/10.jpeg", alt: "Cool Gray Pillow 10" },
  { src: "/assets/cool-gray/11.jpeg", alt: "Cool Gray Pillow 11" },
];

const FEATURES = [
  { icon: "/assets/design.svg", text: "Built for every sleep position" },
  { icon: "/assets/foam.svg", text: "Slow-rebound 60D memory foam core" },
  { icon: "/assets/scoliosis.svg", text: "Shoulder relief cutouts on both sides" },
  { icon: "/assets/cooling.svg", text: "Cooling, breathable cover fabric" },
  { icon: "/assets/adjust.svg", text: "Removable, machine-washable cover" },
  { icon: "/assets/footer-1-image.jpeg", text: "CertiPUR-US certified foam" },
  { icon: "/assets/footer-2-image.jpeg", text: "OEKO-TEX certified base fabric" },
];

const BODY_FEATURES = [
  {
    title: "No More Stiff Mornings",
    body: "Your neck stays in natural alignment all night. Wake up loose, not locked up.",
  },
  {
    title: "Built for How You Actually Sleep",
    body: "Side, back, or stomach. The contour adapts to your position every time you move.",
  },
  {
    title: "Stays Cool. You Stay Asleep.",
    body: "Advanced airflow channels and a breathable cover designed to dissipate heat and keep you cool all night.",
  },
  {
    title: "Support That Does Not Quit",
    body: "60D memory foam holds its shape from the first night to the five hundredth. No flattening. No sagging.",
  },
  {
    title: "Clean in Minutes",
    body: "Zip off the cover. Toss it in the wash. Back on in seconds. Fresh pillow every time without the effort.",
  },
];

const GALLERY = [
  {
    heading: "The Problem",
    desc: "Every morning starts with the same stiffness. The same ache. The same promise to fix it someday.",
  },
  {
    heading: "The Solution",
    desc: "One pillow designed around your cervical spine. Not comfort for comfort's sake. Actual support.",
  },
  {
    heading: "The Result",
    desc: "Someday is tonight. Wake up without the ache you stopped noticing was optional.",
  },
];

function galleryImage(heading, color) {
  if (heading === "The Problem") {
    return color === "grey"
      ? "/assets/cool-gray/the-problem-cool-gray-1.jpg"
      : "/assets/sky-blue/the-problem-sky-blue-1.jpg";
  }
  if (heading === "The Solution") {
    return color === "grey"
      ? "/assets/cool-gray/the-solution-cool-gray-2.jpg"
      : "/assets/sky-blue/the-solution-sky-blue-2.jpg";
  }
  return color === "grey"
    ? "/assets/cool-gray/the-result-cool-gray-2.jpg"
    : "/assets/sky-blue/the-result-sky-blue-2.jpg";
}

export default function ProductPage() {
  const [color, setColor] = useState("blue");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(0);
  const thumbs = color === "grey" ? GRAY_THUMBS : BLUE_THUMBS;
  const amazon =
    color === "grey"
      ? "https://www.amazon.com/dp/B0GX61KHFF"
      : "https://www.amazon.com/dp/B0GX59F5BG";
  const stories = color === "grey" ? TESTIMONIALS_GREY : TESTIMONIALS_BLUE;

  const onColor = (next) => {
    setColor(next);
    setActive(0);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  The PrimeHeal
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Pillow
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTicker />

      <section className="dp-product dp-product-page">
        <div className="container">
          <div className="dp-prod-grid">
            <div className="dp-prod-gallery">
              <div className="dp-prod-main">
                <button
                  type="button"
                  className="dp-prod-arrow left"
                  onClick={() => setActive((i) => (i - 1 + thumbs.length) % thumbs.length)}
                  aria-label="Previous image"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <img src={thumbs[active].src} alt="The PrimeHeal Pillow" />
                <button
                  type="button"
                  className="dp-prod-arrow right"
                  onClick={() => setActive((i) => (i + 1) % thumbs.length)}
                  aria-label="Next image"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
              <div className="dp-prod-thumbs">
                {thumbs.map((thumb, i) => (
                  <button
                    key={thumb.src}
                    type="button"
                    className={i === active ? "is-active" : ""}
                    onClick={() => setActive(i)}
                  >
                    <img src={thumb.src} alt={thumb.alt} />
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
                <button type="button" className={color === "blue" ? "is-active" : ""} onClick={() => onColor("blue")}>
                  <span className="dp-swatch blue"></span>
                  Sky Blue
                </button>
                <button type="button" className={color === "grey" ? "is-active" : ""} onClick={() => onColor("grey")}>
                  <span className="dp-swatch grey"></span>
                  Cool Grey
                </button>
              </div>
              <a href={amazon} target="_blank" rel="noopener noreferrer" className="btn-default">
                <i className="fa-brands fa-amazon"></i> Buy Now
              </a>
              <ul className="dp-prod-features">
                {FEATURES.map((feature) => (
                  <li key={feature.text}>
                    <img src={feature.icon} alt={feature.text} />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-exp">
        <div className="container">
          <div className="dp-exp-head">
            <h3>The PrimeHeal</h3>
            <h2>The Dr.Prime Pillow Experience</h2>
          </div>
          <div className="dp-exp-grid">
            {stories.map((story) => (
              <article className="dp-exp-card" key={story.name}>
                <div className="dp-exp-photo">
                  <img src={story.img} alt={story.name} />
                </div>
                <div className="dp-exp-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p>&ldquo;{story.quote}&rdquo;</p>
                <div className="dp-review-author">
                  <div className="dp-review-avatar">{story.name.charAt(0)}</div>
                  <div className="dp-review-author-info">
                    <span className="dp-review-name">{story.name}</span>
                    <span className="dp-review-verified">
                      <i className="fa-solid fa-circle-check"></i> Verified Buyer
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-body-features">
        <div className="container">
          <div className="dp-stats">
            <div>
              <h2>24/7</h2>
              <h3>Cooling Cover</h3>
              <p>Breathable, moisture-wicking fabric that stays cool all night for undisturbed sleep.</p>
            </div>
            <img
              src={color === "grey" ? "/assets/gray-pillow.png" : "/assets/blue-pillow.png"}
              alt={color === "grey" ? "Pillow - Grey" : "Pillow - Blue"}
            />
            <div>
              <h2>100%</h2>
              <h3>CertiPUR-US Certified Foam.</h3>
              <p>Tested for harmful chemicals so the only thing touching your neck is clean, safe memory foam.</p>
            </div>
          </div>
          <p className="dp-stats-line">Cervical support engineered for the way you actually sleep.</p>
          <div className="dp-body-grid">
            {BODY_FEATURES.map((item) => (
              <article key={item.title}>
                <i className="fa-solid fa-star"></i>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-sleep-pos">
        <div className="container">
          <div className="dp-sleep-pos-head">
            <h3>Ideal Sleep Type</h3>
            <h2>Engineered for every type of sleeper.</h2>
            <p>
              One cervical contour, designed to support your natural alignment whether you sleep on your back, side, or stomach.
            </p>
          </div>
          <div className="dp-polaroid-grid">
            <article className="rotated-left">
              <span>Sleep like this...</span>
              <div>
                <img
                  src={color === "grey" ? "/assets/cool-gray/back-cool-gray-2.jpg" : "/assets/sky-blue/back-sky-blue-2.jpg"}
                  alt="Back Sleep Position"
                />
                <em>Back</em>
              </div>
            </article>
            <article className="rotated-right">
              <span>...this...</span>
              <div>
                <img
                  src={color === "grey" ? "/assets/cool-gray/stomach-cool-gray-2.jpg" : "/assets/sky-blue/stomach-sky-blue-2.jpg"}
                  alt="Stomach Sleep Position"
                />
                <em>Stomach</em>
              </div>
            </article>
            <article>
              <span>...or this.</span>
              <div>
                <img
                  src={color === "grey" ? "/assets/cool-gray/side-cool-gray-2.jpg" : "/assets/sky-blue/side-sky-blue-2.jpg"}
                  alt="Side Sleep Position"
                />
                <em>Side</em>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="dp-comfort">
        <div className="container">
          <h2>Experience The Comfort</h2>
          <div className="dp-comfort-grid">
            {GALLERY.map((item) => (
              <article key={item.heading}>
                <div>
                  <h3>{item.heading}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={galleryImage(item.heading, color)} alt={item.heading} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-say">
        <div className="container">
          <h2>What Customers Say About the Dr.Prime Pillow Experience</h2>
          <div className="dp-say-grid">
            {CUSTOMER_SAY_REVIEWS.map((review) => (
              <article key={review.title + review.name}>
                <div className="dp-review-author">
                  <div className="dp-review-avatar">{review.name.charAt(0)}</div>
                  <div className="dp-review-author-info">
                    <span className="dp-review-name">{review.name}</span>
                    <span className="dp-review-verified">
                      <i className="fa-solid fa-circle-check"></i> Verified Buyer
                    </span>
                  </div>
                </div>
                <div className="dp-exp-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <h3>{review.title}</h3>
                <p>&ldquo;{review.quote}&rdquo;</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-prod-faqs">
        <div className="container">
          <div className="dp-prod-faqs-head">
            <h2>Frequently asked Questions</h2>
            <p>
              Got questions about upgrading your sleep? Find answers about our
              ergonomic design, materials, and how Dr.Prime Pillow helps you wake up
              feeling refreshed and ready for the day.
            </p>
          </div>
          <div className="dp-faq-list">
            {PRODUCT_FAQS.map((faq, i) => (
              <article key={faq.q} className={`dp-faq-item${open === i ? " is-open" : ""}`}>
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                  <h3>{faq.q}</h3>
                  <i className={`fa-solid fa-chevron-${open === i ? "up" : "down"}`}></i>
                </button>
                {open === i ? <p>{faq.a}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-prod-cta">
        <div className="container">
          <h2>
            Sleep like you mean it.
            <br />
            Wake like you own it.
          </h2>
          <img
            src={color === "grey" ? "/assets/sleep-like-2.png" : "/assets/sleep-like-1.png"}
            alt="Pillow"
          />
          <p>Your neck has waited long enough.</p>
          <a href={amazon} target="_blank" rel="noopener noreferrer" className="btn-default">
            Shop The Pillow
          </a>
        </div>
      </section>
    </>
  );
}
