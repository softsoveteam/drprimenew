import ContactForm from "@/components/ContactForm";
import PageTicker from "@/components/PageTicker";
import JsonLd from "@/components/JsonLd";
import { contactSchema, pageMetadata } from "@/lib/seo";
import { publicContactFormService } from "@/services/public-contact-form.service";

export const metadata = pageMetadata("contact");

export default async function ContactPage() {
  let initialFields = [];
  try {
    const res = await publicContactFormService.getFields();
    const fields = res?.data?.fields || res?.fields || res?.data || [];
    initialFields = [...fields].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  } catch (err) {
    console.error("Failed to fetch contact form fields on server:", err?.message);
  }

  return (
    <>
      <JsonLd data={contactSchema()} />
      <div className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  Contact us
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      contact us
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTicker />

      <div className="page-contact-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="contact-us-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">contact us</h3>
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    Still Awake? So Are We.
                  </h2>
                  <p>
                    Contact us 7 days a week for anything. From neck pain and sleep
                    positions to why your alarm feels personally offensive every morning.
                  </p>
                  <p>We respond to every email within 24 hours. Seven days a week.</p>
                </div>
                <div className="contact-info-box">
                  <div className="contact-info-list">
                    <div className="contact-info-item wow fadeInUp" data-wow-delay="0.2s">
                      <div className="icon-box">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div className="contact-item-content">
                        <h3>Email Us</h3>
                        <p>
                          <a href="mailto:support@mydrprime.com">support@mydrprime.com</a>
                        </p>
                      </div>
                    </div>
                    <div className="contact-info-item wow fadeInUp" data-wow-delay="0.4s">
                      <div className="icon-box">
                        <i className="fa-solid fa-clock"></i>
                      </div>
                      <div className="contact-item-content">
                        <h3>We Actually Read Every Message.</h3>
                        <p>
                          Send us your question and we will get back to you within 24
                          hours. Whether you bought yesterday or are still thinking about
                          it, we are here either way.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="contact-social-links wow fadeInUp" data-wow-delay="0.8s">
                    <h3>Social Network</h3>
                    <ul>
                      <li>
                        <a href="https://www.instagram.com/drprime.store/" target="_blank" rel="noreferrer" aria-label="Instagram">
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.linkedin.com/company/mydrprime/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.pinterest.com/mydrprime/" target="_blank" rel="noreferrer" aria-label="Pinterest">
                          <i className="fa-brands fa-pinterest-p"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://x.com/mydrprime/" target="_blank" rel="noreferrer" aria-label="X">
                          <i className="fa-brands fa-x-twitter"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="contact-us-form dark-section">
                <div className="section-title">
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    Get in Touch
                  </h2>
                </div>
                <div className="contact-form">
                  <ContactForm initialFields={initialFields} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="dp-trustpilot">
        <div className="container">
          <h2>Share Your Experience</h2>
          <p>
            Your feedback helps us continuously improve and helps others find their perfect night&apos;s sleep. We&apos;d appreciate it if you could take a moment to review us on Trustpilot.
          </p>
          <a
            href="https://www.trustpilot.com/review/mydrprime.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-default"
          >
            Review us on Trustpilot
          </a>
        </div>
      </section>
    </>
  );
}
