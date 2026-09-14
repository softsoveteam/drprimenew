"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1400));
    const pageReady =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener("load", resolve, { once: true })
          );

    Promise.all([minDelay, pageReady]).then(() => setDone(true));

    const fallback = setTimeout(() => setDone(true), 4000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div
      className={`preloader${done ? " is-done" : ""}`}
      aria-hidden={done}
      aria-busy={!done}
      role="status"
    >
      <div className="dp-loader">
        <div className="dp-loader-orbit" aria-hidden="true">
          <span className="dp-loader-sparkle">✦</span>
          <span className="dp-loader-sparkle">✦</span>
          <span className="dp-loader-sparkle">✦</span>
        </div>

        <div className="dp-loader-stage" aria-hidden="true">
          <svg
            className="dp-loader-moon"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30.5 8.2A16.5 16.5 0 1 0 39.8 30.4 13.2 13.2 0 0 1 30.5 8.2Z"
              fill="#c9b896"
            />
          </svg>

          <svg
            className="dp-loader-pillow"
            viewBox="0 0 180 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 48C22 24 48 14 72 26C80 12 100 12 108 26C132 14 158 24 158 48C158 70 134 78 110 68C102 80 78 80 70 68C46 78 22 70 22 48Z"
              fill="#1d1c50"
            />
            <path
              d="M38 46C40 32 58 26 76 34C84 24 96 24 104 34C122 26 140 32 142 46C144 60 126 66 110 60C102 68 78 68 70 60C54 66 36 60 38 46Z"
              fill="#2a286a"
            />
            <path
              d="M62 44C70 36 90 34 110 42"
              stroke="#c9b896"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="dp-loader-kicker">PrimeHeal</p>
        <h2 className="dp-loader-title">Better sleep is loading</h2>
        <div className="dp-loader-bar" aria-hidden="true">
          <span></span>
        </div>
      </div>
    </div>
  );
}
