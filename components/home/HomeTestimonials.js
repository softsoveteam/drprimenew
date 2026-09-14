"use client";

import { useRef } from "react";

const HOME_REVIEWS = [
  {
    name: "D.Marie",
    title: "Great Pillow for Better Sleep",
    quote:
      "Great pillow for anybody with neck or shoulder problems. It helps me get comfortable at night and wake up without my neck already feeling aggravated from the way I slept.",
  },
  {
    name: "seco",
    title: "Supportive Without Feeling Hard",
    quote:
      "My neck and I both love this pillow. The cover is incredibly silky and smooth, while the pillow feels soft but still holds its shape and provides excellent support.",
  },
  {
    name: "Bertbert",
    title: "Cooling and Supportive",
    quote:
      "This pillow is comfortable and helps keep my neck aligned while sleeping on my side or back. The cooling feel is similar to an ice silk pillowcase, while the foam stays supportive.",
  },
  {
    name: "Amanda",
    title: "Comfortable in Every Sleep Position",
    quote:
      "The pillow is made of a dense, comfortable material that feels firm but soft. It stays cool at night and works well for side, belly, and back sleeping.",
  },
  {
    name: "Mark H.",
    title: "Mad I Didn't Switch Sooner",
    quote:
      "I bought this because my neck was hurting every morning. Now I'm mad I didn't switch sooner.",
  },
  {
    name: "Sarah J.",
    title: "Soft and Supportive",
    quote:
      "Somehow soft and supportive at the same time. Feels like my sleep schedule finally got its life together.",
  },
  {
    name: "Johnson L.",
    title: "Stopped Fixing My Pillow",
    quote:
      "I stopped waking up in the middle of the night trying to fix my pillow every five minutes. That alone deserves five stars.",
  },
  {
    name: "Liam O.",
    title: "Hotel Sleep at Home",
    quote:
      "Honestly feels like hotel sleep without paying hotel prices. My bed has never felt this comfortable.",
  },
];

export default function HomeTestimonials() {
  const scrollRef = useRef(null);

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector(".dp-review-card");
    if (!card) return;
    scrollRef.current.scrollBy({
      left: direction * (card.offsetWidth + 20),
      behavior: "smooth",
    });
  };

  return (
    <section className="dp-reviews">
      <div className="dp-reviews-wrapper">
        <div className="dp-reviews-left">
          <h2>Sleepers Speak</h2>
          <p>
            5-star reviews from customers who made Dr.Prime Pillow part of their nightly
            routine.
          </p>
          <div className="dp-reviews-nav">
            <button
              type="button"
              className="dp-reviews-nav-btn"
              onClick={() => scrollByAmount(-1)}
              aria-label="Previous review"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="dp-reviews-nav-btn"
              onClick={() => scrollByAmount(1)}
              aria-label="Next review"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="dp-reviews-right">
          <div className="dp-reviews-track" ref={scrollRef}>
            {HOME_REVIEWS.map((review) => (
              <div className="dp-review-card" key={review.name + review.title}>
                <div className="dp-review-quote-icon">
                  <i className="fa-solid fa-quote-right"></i>
                </div>
                <div className="dp-review-top">
                  <div className="dp-review-stars">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <h3>{review.title}</h3>
                  <p>&ldquo;{review.quote}&rdquo;</p>
                </div>
                <div className="dp-review-bottom">
                  <div className="dp-review-author">
                    <div className="dp-review-avatar">{review.name.charAt(0)}</div>
                    <div className="dp-review-author-info">
                      <span className="dp-review-name">{review.name}</span>
                      <span className="dp-review-verified">
                        <i className="fa-solid fa-circle-check"></i> Verified Buyer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
