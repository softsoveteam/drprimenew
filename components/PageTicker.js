const ITEMS = [
  "OEKO-TEX® Certified",
  "Cooling Fabric",
  "Spine Alignment Support",
  "Neck Pain Relief",
  "CertiPUR-US Foam",
];

export default function PageTicker({ className = "" }) {
  const renderRow = (keyPrefix) =>
    ITEMS.map((item, index) => (
      <span key={`${keyPrefix}-${index}`}>
        <img src="/images/icon-sparkle.svg" alt="" />
        {item}
      </span>
    ));

  const wrapperClass = ["our-scrolling-ticker", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      <div className="scrolling-ticker-box">
        <div className="scrolling-content">
          {renderRow("track1-a")}
          {renderRow("track1-b")}
        </div>
        <div className="scrolling-content" aria-hidden="true">
          {renderRow("track2-a")}
          {renderRow("track2-b")}
        </div>
      </div>
    </div>
  );
}
