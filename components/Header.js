export default function Header() {
  return (
    <header className="main-header dp-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="/">
              <img src="/assets/logo-dark.png" alt="Dr.Prime Pillow Logo" />
            </a>

            <div className="collapse navbar-collapse main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <a className="nav-link" href="/">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/product">
                      Pillow
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/testimonials">
                      Testimonials
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/image-gallery">
                      Gallery
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/faqs">
                      FAQs
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/contact">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              <div className="header-btn">
                <a
                  href="https://www.amazon.com/dp/B0GX59F5BG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-default"
                >
                  Buy Now
                </a>
              </div>
            </div>
            <div className="navbar-toggle"></div>
          </div>
        </nav>
        <div className="responsive-menu"></div>
      </div>
    </header>
  );
}
