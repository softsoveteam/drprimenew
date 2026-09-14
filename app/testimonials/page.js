import PageTicker from "@/components/PageTicker";
import JsonLd from "@/components/JsonLd";
import { TESTIMONIAL_REVIEWS } from "@/lib/content";
import { pageMetadata, testimonialsSchema } from "@/lib/seo";

export const metadata = pageMetadata("testimonials");

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd data={testimonialsSchema()} />
      <div className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  Testimonials
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Testimonials
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTicker />
      <section className="dp-reviews-page">
        <div className="container">
          <div className="section-title">
            <h3 className="wow fadeInUp">Sleepers Speak</h3>
            <h2 className="text-anime-style-3" data-cursor="-opaque">
              5-star reviews from customers who made Dr.Prime Pillow part of their nightly routine.
            </h2>
          </div>
          <div className="dp-reviews-grid">
            {TESTIMONIAL_REVIEWS.map((review, index) => (
              <article className="dp-review-card" key={`${review.name}-${review.title}-${index}`}>
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
                  {review.title ? <h3>{review.title}</h3> : null}
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
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
