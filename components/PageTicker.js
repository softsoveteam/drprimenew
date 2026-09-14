const ITEMS = [
  "30-Night Trial",
  "Cooling Fabric",
  "Spine Alignment Support",
  "Neck Pain Relief",
  "CertiPUR-US Foam",
];

export default function PageTicker() {
  const row = ITEMS.map((item) => (
    <span key={item}>
      <img src="/images/icon-sparkle.svg" alt="" />
      {item}
    </span>
  ));

  return (
    <div className="our-scrolling-ticker">
      <div className="scrolling-ticker-box">
        <div className="scrolling-content">
          {row}
          {row}
        </div>
        <div className="scrolling-content">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
