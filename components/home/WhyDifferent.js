"use client";

import { useRef, useState } from "react";
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
    body: "Ergonomic contours target pressure points to help reduce stiffness and support your posture.",
  },
  {
    icon: "fa-solid fa-award",
    title: "CertiPUR-US® Certified Foam",
    body: "High-density orthopedic memory foam provides durable, toxin-free support that lasts.",
  },
];

export default function WhyDifferent() {
  useScrollReveal();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

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

        <div className="dp-why-content-wrapper dp-reveal dp-reveal-up">
          {/* Video Demonstration Column */}
          <div className="dp-why-video-box">
            <div className="dp-why-video-container">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/video/why-choose-us-poster.jpg"
              >
                <source src="/assets/video/why-choose-us.mp4" type="video/mp4" />
              </video>
              <div className="dp-why-video-overlay">
                <div className="dp-why-video-badge">
                  <span className="dp-badge-pulse"></span>
                  <span>PrimeHeal in Action</span>
                </div>
                <div className="dp-why-video-controls">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="dp-why-ctrl-btn"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    <i className={isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"}></i>
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="dp-why-ctrl-btn"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    <i className={isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high"}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Benefit Cards Column */}
          <div className="dp-why-cards-list dp-reveal-stagger">
            {WHY_GRID.map((item, idx) => (
              <div className="dp-why-benefit-card" key={item.title}>
                <div className="dp-why-benefit-icon">
                  <i className={item.icon}></i>
                </div>
                <div className="dp-why-benefit-info">
                  <div className="dp-why-card-top">
                    <h3>{item.title}</h3>
                    <span className="dp-why-num">0{idx + 1}</span>
                  </div>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
