"use client";

import { useEffect, useRef, useState } from "react";
import useScrollReveal from "./useScrollReveal";

const CHALLENGE_CARDS = [
  {
    img: "/assets/DSC07140-2.jpg",
    alt: "Couple sleeping",
    title: "Sleep Better. Feel Better.",
    body: "Poor pillow support can lead to neck pain and restless nights. PrimeHeal keeps your spine aligned so you wake up comfortable, not cranky.",
  },
  {
    img: "/assets/couple-pillow-2.png",
    alt: "Couples",
    title: "Couples Sleep Better Too",
    body: "Less tossing and turning. Less fighting over comfort. More waking up rested together instead of blaming another rough night on the bed.",
  },
  {
    img: "/assets/DSC07277-1.jpg",
    alt: "Woman",
    title: "Your Neck Called. It’s Tired.",
    body: "Ergonomic support eases pressure on your neck and shoulders so mornings feel smoother, lighter, and a little less emotionally exhausting.",
  },
];

export default function SleepBenefits() {
  useScrollReveal();
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const card = track.querySelector(".dp-ben-card");
      if (!card) return;
      const w = card.offsetWidth + 20;
      const idx = Math.round(track.scrollLeft / w);
      setActiveDot(Math.min(Math.max(idx, 0), CHALLENGE_CARDS.length - 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (dir) => {
    const track = trackRef.current;
    const card = track?.querySelector(".dp-ben-card");
    if (!card) return;
    const cardWidth = card.offsetWidth + 20;
    let nextIndex = Math.round(track.scrollLeft / cardWidth) + dir;
    if (nextIndex < 0) nextIndex = CHALLENGE_CARDS.length - 1;
    else if (nextIndex >= CHALLENGE_CARDS.length) nextIndex = 0;
    track.scrollTo({ left: nextIndex * cardWidth, behavior: "smooth" });
  };

  const goToDot = (i) => {
    const track = trackRef.current;
    const card = track?.querySelector(".dp-ben-card");
    if (!card) return;
    track.scrollTo({ left: i * (card.offsetWidth + 20), behavior: "smooth" });
  };

  return (
    <section className="dp-benefits">
      <div className="container">
        <div className="dp-ben-header dp-reveal dp-reveal-up">
          <h3>Our Benefits</h3>
          <h2>Whatever Your Sleep Drama, We’re Here For It.</h2>
          <p>
            Hot sleeper? Stiff neck? Random 3AM wakeups? We cannot fix your
            life, but we can definitely help you sleep better through it.
          </p>
        </div>

        <div className="dp-ben-wrap">
          <div className="dp-ben-nav">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Next">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
          <div className="dp-ben-track dp-reveal dp-reveal-stagger" ref={trackRef}>
            {CHALLENGE_CARDS.map((c) => (
              <article className="dp-ben-card" key={c.title}>
                <div className="dp-ben-photo">
                  <img src={c.img} alt={c.alt} />
                </div>
                <div className="dp-ben-text">
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="dp-ben-dots">
            {CHALLENGE_CARDS.map((c, i) => (
              <button
                key={c.title}
                type="button"
                className={i === activeDot ? "is-active" : ""}
                onClick={() => goToDot(i)}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
