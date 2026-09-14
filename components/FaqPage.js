"use client";

import { useState } from "react";
import PageTicker from "@/components/PageTicker";
import { FAQ_CATEGORIES, FAQS } from "@/lib/content";

export default function FaqPage() {
  const [cat, setCat] = useState("quality");
  const [open, setOpen] = useState(0);
  const items = FAQS.filter((faq) => faq.cat === cat);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  Frequently asked questions
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      FAQs
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTicker />

      <section className="dp-faq-page">
        <div className="container">
          <div className="dp-faq-intro">
            <h3>Support & FAQs</h3>
            <h2>Find answers to memory foam care instructions, sleep positions, and cleaning guidelines for your Dr.Prime Pillow cervical pillow.</h2>
          </div>
          <div className="dp-faq-cats">
            {FAQ_CATEGORIES.map((item) => (
              <button
                key={item.key}
                type="button"
                className={cat === item.key ? "is-active" : ""}
                onClick={() => {
                  setCat(item.key);
                  setOpen(0);
                }}
              >
                <img src={item.icon} alt={item.label} />
                {item.label}
              </button>
            ))}
          </div>
          <div className="dp-faq-list">
            {items.map((faq, i) => (
              <article key={faq.q} className={`dp-faq-item${open === i ? " is-open" : ""}`}>
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                  <h3>{faq.q}</h3>
                  <i className={`fa-solid fa-chevron-${open === i ? "up" : "down"}`}></i>
                </button>
                {open === i ? (
                  faq.bullets ? (
                    <div className="dp-faq-answer">
                      <p>{faq.intro}</p>
                      <ul>
                        {faq.bullets.map((bullet) => (
                          <li key={bullet.title}>
                            <strong>{bullet.title}:</strong> {bullet.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>{faq.a}</p>
                  )
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
