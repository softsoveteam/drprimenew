export default function ProductOffer({ offer }) {
  if (!offer) return null;

  return (
    <>
      <div className="dp-prod-pricing">
        {offer.badge ? <span className="dp-prod-price-low">{offer.badge}</span> : null}
        <div className="dp-prod-price-row">
          {offer.percent != null && offer.percent > 0 ? (
            <span className="dp-prod-price-off">-{offer.percent}%</span>
          ) : null}
          {offer.priceLabel ? <span className="dp-prod-price">{offer.priceLabel}</span> : null}
        </div>
        {offer.typicalLabel ? (
          <p className="dp-prod-price-typical">Typical price: {offer.typicalLabel}</p>
        ) : null}
      </div>
      {offer.description ? <p className="dp-prod-desc">{offer.description}</p> : null}
      {!offer.inStock ? <p className="dp-prod-stock is-out">Out of stock</p> : null}
    </>
  );
}
