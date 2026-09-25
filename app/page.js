import HomeFaqs from "@/components/home/HomeFaqs";
import HomeFeature from "@/components/home/HomeFeature";
import HomeProduct from "@/components/home/HomeProduct";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import ProductShowcase from "@/components/home/ProductShowcase";
import QualityExperience from "@/components/home/QualityExperience";
import SleepBenefits from "@/components/home/SleepBenefits";
import WhatYouGet from "@/components/home/WhatYouGet";
import WhyDifferent from "@/components/home/WhyDifferent";
import JsonLd from "@/components/JsonLd";
import { homeSchema, pageMetadata } from "@/lib/seo";
import { GALLERY_IMAGES } from "@/lib/content";

export const metadata = pageMetadata("home");

const AMAZON_BLUE = "https://www.amazon.com/dp/B0GX59F5BG";

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeSchema()} />
{/* Hero Section Start */}
      <div className="hero hero-bg-image hero-video dark-section">
        <div className="hero-bg-video">
          <video autoPlay muted loop playsInline id="myvideo">
            <source src="/assets/video/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container">
          <div className="dp-hero-content">
            <h1>Your Bed Called.</h1>
            <h1 className="dp-hero-accent">It Wants an Upgrade.</h1>
            <div className="dp-hero-line">
              <span>✦</span>
              <div></div>
            </div>
            <p>
              Expertly designed orthopedic pillow that aligns your spine, eases
              pressure, and helps you wake up refreshed.
            </p>
            <div className="dp-hero-btns">
              <a
                href={AMAZON_BLUE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-default"
              >
                Get Better Sleep
              </a>
              <a href="/#why-choose-us" className="dp-hero-outline">
                Why Dr.Prime Pillow?
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section End */}

      <div className="our-scrolling-ticker hero-scrolling-ticker">
        <div className="scrolling-ticker-box">
          <div className="scrolling-content">
            <span><img src="/images/icon-sparkle.svg" alt="" />30-Night Trial</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Cooling Fabric</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Spine Alignment Support</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Neck Pain Relief</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />CertiPUR-US Foam</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />30-Night Trial</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Cooling Fabric</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Spine Alignment Support</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Neck Pain Relief</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />CertiPUR-US Foam</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />30-Night Trial</span>
          </div>
          <div className="scrolling-content">
            <span><img src="/images/icon-sparkle.svg" alt="" />30-Night Trial</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Cooling Fabric</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Spine Alignment Support</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Neck Pain Relief</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />CertiPUR-US Foam</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />30-Night Trial</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Cooling Fabric</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Spine Alignment Support</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />Neck Pain Relief</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />CertiPUR-US Foam</span>
            <span><img src="/images/icon-sparkle.svg" alt="" />30-Night Trial</span>
          </div>
        </div>
      </div>

      <WhatYouGet />

      <ProductShowcase />

{/* About Us Section Start */}
      <div className="about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-us-images">
                <div className="about-image-box">
                  <div className="about-image-1">
                    <figure className="image-anime">
                      <img src="/assets/DSC06980.jpg" alt="Deeper sleep with Dr.Prime Pillow" />
                    </figure>
                  </div>
                  <div className="about-us-circle">
                    <a href="/product" aria-label="The PrimeHeal">
                      <img src="/images/primeheal-circle.svg" alt="The PrimeHeal" />
                    </a>
                  </div>
                </div>
                <div className="about-image-2">
                  <figure className="image-anime">
                    <img src="/assets/DSC07277-1.jpg" alt="Neck support pillow" />
                  </figure>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-us-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">About us</h3>
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    Change your mornings.
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    Better sleep is not about sleeping more. It is about sleeping
                    right. That is what the PrimeHeal was built for — real sleep,
                    real comfort, and mornings that feel a little more human.
                  </p>
                </div>

                <div className="about-us-body">
                  <div className="about-us-list wow fadeInUp" data-wow-delay="0.4s">
                    <h3>Our Mission:</h3>
                    <ul>
                      <li>Help people wake up less tired and less stiff.</li>
                      <li>Support healthy neck and spine alignment every night.</li>
                      <li>Build a pillow people actually look forward to using.</li>
                    </ul>
                  </div>
                  <div className="years-experience-box">
                    <h2>
                      <span className="counter">30</span>
                    </h2>
                    <p>Night Free Trial</p>
                  </div>
                </div>

                <div className="about-item-box wow fadeInUp" data-wow-delay="0.6s">
                  <div className="about-us-item">
                    <div className="icon-box">
                      <i className="fa-solid fa-bed"></i>
                    </div>
                    <div className="about-us-item-content">
                      <h3>Designed for deeper, more supportive sleep</h3>
                    </div>
                  </div>
                  <div className="about-us-item">
                    <div className="icon-box">
                      <i className="fa-solid fa-certificate"></i>
                    </div>
                    <div className="about-us-item-content">
                      <h3>CertiPUR-US and OEKO-TEX certified materials</h3>
                    </div>
                  </div>
                </div>

                <div className="about-us-btn wow fadeInUp" data-wow-delay="0.8s">
                  <a href="/#why-choose-us" className="btn-default">
                    Why Dr.Prime Pillow?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Us Section End */}

      <HomeTestimonials />

      <QualityExperience />



      <WhyDifferent />

      <SleepBenefits />



{/* Product Benefits Section Start */}
      <div className="product-benefits">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="product-benefits-box">
                <div className="product-benefit-item wow fadeInUp">
                  <div className="icon-box">
                    <i className="fa-solid fa-snowflake"></i>
                  </div>
                  <div className="product-benefits-item-content">
                    <h3>Stay Cool All Night</h3>
                    <p>Advanced cooling fabric channels heat away for deeper, uninterrupted sleep.</p>
                  </div>
                </div>
                <div className="product-benefit-item wow fadeInUp" data-wow-delay="0.2s">
                  <div className="icon-box">
                    <i className="fa-solid fa-spa"></i>
                  </div>
                  <div className="product-benefits-item-content">
                    <h3>Relieve Neck &amp; Shoulder Pain</h3>
                    <p>Ergonomic contours target pressure points and support healthy posture.</p>
                  </div>
                </div>
                <div className="product-benefit-item wow fadeInUp" data-wow-delay="0.4s">
                  <div className="icon-box">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="product-benefits-item-content">
                    <h3>CertiPUR-US Certified Foam</h3>
                    <p>High-density orthopedic memory foam provides durable, toxin-free support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product Benefits Section End */}

{/* Our Facts Section Start */}
      <div className="our-facts">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="facts-image">
                <figure className="image-anime reveal">
                  <img src="/assets/DSC07101.jpg" alt="PrimeHeal sleep support" />
                </figure>
                <div className="facts-cta-box">
                  <div className="icon-box">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  <div className="facts-cta-content">
                    <p>Need Answers? Let&apos;s Clear Things Up for You!</p>
                    <h3>
                      <a href="mailto:info@mydrprime.com">info@mydrprime.com</a>
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="facts-content dark-section">
                <div className="section-title">
                  <h3 className="wow fadeInUp">Our Fun Facts</h3>
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    Built for people who are serious about how they rest
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    The PrimeHeal is a premium orthopedic sleep pillow designed
                    to support your head, neck, and shoulders with 60D high
                    density memory foam and an ergonomic cervical contour.
                  </p>
                </div>
                <div className="our-facts-list wow fadeInUp" data-wow-delay="0.4s">
                  <div className="facts-item">
                    <div className="icon-box">
                      <i className="fa-solid fa-moon"></i>
                    </div>
                    <div className="facts-item-content">
                      <h3>
                        <span className="counter">30</span>
                      </h3>
                      <p>Night free trial so you can feel the difference at home.</p>
                    </div>
                  </div>
                  <div className="facts-item">
                    <div className="icon-box">
                      <i className="fa-solid fa-layer-group"></i>
                    </div>
                    <div className="facts-item-content">
                      <h3>
                        <span className="counter">60</span>D
                      </h3>
                      <p>High-density memory foam — denser support than typical 40D and 50D pillows.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our Facts Section End */}

      <HomeProduct />



      <HomeFeature />



{/* Our FAQs Section Start */}
      <div className="our-faqs dark-section">
        <div className="dp-faq-video">
          <video autoPlay muted loop playsInline>
            <source src="/assets/video/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="dp-faq-left">
                <div className="dp-faq-left-photo">
                  <img src="/assets/slider-pillow.png" alt="PrimeHeal pillow" />
                </div>
                <h3>Our Mission</h3>
                <h2>Change your mornings.</h2>
                <p>
                  Better sleep is not about sleeping more. It is about sleeping
                  right. That is what the PrimeHeal was built for.
                </p>
                <a
                  href={AMAZON_BLUE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-default"
                >
                  Get Better Sleep
                </a>
              </div>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="our-faqs-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">Frequently asked questions</h3>
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    Everything you need to know about PrimeHeal
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    Got questions about upgrading your sleep? Find answers about
                    our ergonomic design, materials, and how Dr.Prime Pillow helps you
                    wake up feeling refreshed.
                  </p>
                </div>
                <HomeFaqs />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our FAQs Section End */}

{/* Image Gallery Preview Start */}
      <div className="our-blog">
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-lg-6">
              <div className="section-title">
                <h3 className="wow fadeInUp">Image Gallery</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Real sleep. Real comfort.
                </h2>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-btn wow fadeInUp" data-wow-delay="0.2s">
                <a href="/image-gallery" className="btn-default">
                  View Gallery
                </a>
              </div>
            </div>
          </div>

          <div className="row gallery-items">
            {GALLERY_IMAGES.map((image, index) => (
              <div className="col-lg-4 col-md-6" key={image.src}>
                <div className="post-item wow fadeInUp" data-wow-delay={`${(index % 3) * 0.2}s`}>
                  <div className="post-featured-image">
                    <a href={image.src} data-cursor-text="View">
                      <figure className="image-anime">
                        <img src={image.thumb} alt={image.alt} loading="lazy" decoding="async" />
                      </figure>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Image Gallery Preview End */}
    </>
  );
}
