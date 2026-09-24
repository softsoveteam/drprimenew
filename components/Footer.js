export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dp-footer">
      <div className="container">
        <div className="dp-footer-grid">
          <article className="dp-footer-card dp-footer-brand">
            <img src="/assets/logo-dark.png" alt="Dr.Prime Pillow" />
            <p>
              Better sleep starts with better support. Helping people sleep
              better, wake up happier, and stop fighting their pillow every
              single night.
            </p>
            <div className="dp-footer-chips">
              <a href="mailto:info@mydrprime.com">
                <i className="fa-solid fa-envelope"></i>
                info@mydrprime.com
              </a>
              <span>
                <i className="fa-solid fa-clock"></i>
                Replies within 24 hours
              </span>
            </div>
          </article>

          <article className="dp-footer-card">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/product">Pillow</a>
              </li>
              <li>
                <a href="/testimonials">Testimonials</a>
              </li>
              <li>
                <a href="/service-area">Service Areas</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </article>

          <article className="dp-footer-card">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="/faqs">FAQs</a>
              </li>
              <li>
                <a href="/sleep-guide">Sleep Guide</a>
              </li>
              <li>
                <a href="/image-gallery">Gallery</a>
              </li>
              <li>
                <a href="/product">The PrimeHeal</a>
              </li>
              <li>
                <a href="/contact">Customer Support</a>
              </li>
            </ul>
          </article>

          <article className="dp-footer-card">
            <h3>Stay in the Loop</h3>
            <p>Join our newsletter and be first to know about better sleep.</p>
            <form className="dp-footer-form" action="#" method="POST">
              <input
                type="email"
                name="mail"
                placeholder="Email address"
                required
                aria-label="Email address"
              />
              <button type="submit" aria-label="Subscribe">
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            </form>
            <div className="dp-footer-social">
              <a href="https://www.instagram.com/drprime.store/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/mydrprime/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://x.com/mydrprime/" target="_blank" rel="noreferrer" aria-label="X">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://www.pinterest.com/mydrprime/" target="_blank" rel="noreferrer" aria-label="Pinterest">
                <i className="fa-brands fa-pinterest-p"></i>
              </a>
            </div>
          </article>
        </div>

        <div className="dp-footer-bottom">
          <p>Copyright © {year} Dr.Prime Pillow | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
