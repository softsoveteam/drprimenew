"use client";

import { useId } from "react";

/**
 * Static designed SVG cover for blog cards (no photos).
 * Title + short description are rendered inside the artwork.
 */
export default function ArticleCoverArt({
  title = "",
  description = "",
  glow = "#c9b896",
  glow2 = "#4a4580",
  short = false,
  className = "",
}) {
  const uid = useId().replace(/:/g, "");
  const height = short ? 380 : 450;
  const lineY = short ? 312 : 370;
  const metaY = short ? 348 : 408;
  const buttonY = short ? 326 : 386;
  const buttonTextY = short ? 349 : 409;
  const textY = short ? 78 : 88;
  const textH = short ? 214 : 270;

  return (
    <svg
      viewBox={`0 0 800 ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title || "Article cover"}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#12122e" />
          <stop offset="45%" stopColor="#1d1c50" />
          <stop offset="100%" stopColor="#0e0e24" />
        </linearGradient>
        <radialGradient id={`${uid}-g1`} cx="78%" cy="28%" r="45%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.45" />
          <stop offset="55%" stopColor={glow} stopOpacity="0.12" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-g2`} cx="18%" cy="85%" r="40%">
          <stop offset="0%" stopColor={glow2} stopOpacity="0.5" />
          <stop offset="60%" stopColor={glow2} stopOpacity="0.15" />
          <stop offset="100%" stopColor={glow2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-g3`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>

      <rect width="800" height={height} fill={`url(#${uid}-bg)`} />

      <circle cx="640" cy="110" r="160" fill={`url(#${uid}-g1)`} filter={`url(#${uid}-blur)`} />
      <circle cx="120" cy="380" r="140" fill={`url(#${uid}-g2)`} filter={`url(#${uid}-blur)`} />
      <circle cx="400" cy="220" r="200" fill={`url(#${uid}-g3)`} />

      <g opacity="0.06" stroke="#ffffff" strokeWidth="1">
        <path d="M0 112 H800 M0 225 H800 M0 338 H800" />
        <path d={`M200 0 V${height} M400 0 V${height} M600 0 V${height}`} />
      </g>

      <circle cx="46" cy="44" r="20" fill="none" stroke={glow} strokeWidth="1.5" />
      <image href="/assets/drprime-logo.svg" x="28" y="26" width="36" height="36" />
      <text x="72" y="44" fill="#ffffff" fontSize="18" fontWeight="700" fontFamily="system-ui,Segoe UI,sans-serif">
        Dr.Prime
      </text>
      <text x="72" y="62" fill="#c9b896" fillOpacity="0.85" fontSize="11" fontFamily="system-ui,Segoe UI,sans-serif">
        Articles · Sleep &amp; wellness
      </text>

      <rect x="668" y="32" width="100" height="28" rx="14" fill="none" stroke={glow} strokeOpacity="0.55" strokeWidth="1.5" />
      <text
        x="718"
        y="51"
        textAnchor="middle"
        fill={glow}
        fontSize="10"
        fontWeight="700"
        letterSpacing="1.6"
        fontFamily="system-ui,Segoe UI,sans-serif"
      >
        ARTICLE
      </text>

      <foreignObject x="40" y={textY} width="720" height={textH}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            color: "#fff",
            fontFamily: "Georgia, 'Times New Roman', serif",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            textAlign: "left",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                fontFamily: "system-ui, Segoe UI, sans-serif",
                fontSize: "14px",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.72)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>
      </foreignObject>

      <line x1="40" y1={lineY} x2="760" y2={lineY} stroke="#ffffff" strokeOpacity="0.14" />

      <text x="40" y={metaY} fill="#ffffff" fillOpacity="0.45" fontSize="12" fontFamily="system-ui,Segoe UI,sans-serif">
        mydrprime.com
      </text>

      <rect x="578" y={buttonY} width="182" height="36" rx="10" fill={glow} />
      <text
        x="669"
        y={buttonTextY}
        textAnchor="middle"
        fill="#1d1c50"
        fontSize="13"
        fontWeight="700"
        fontFamily="system-ui,Segoe UI,sans-serif"
      >
        Read article →
      </text>
    </svg>
  );
}
