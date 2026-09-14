import PageTicker from "@/components/PageTicker";
import { pages } from "@/lib/seo";

export const metadata = {
  title: { absolute: pages.notFound.title },
  description: pages.notFound.description,
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  Page not found
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      404 Error page
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTicker />
      <div className="error-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="error-page-image wow fadeInUp">
                <img src="/images/404-error-img.png" alt="Page not found" />
              </div>
              <div className="error-page-content">
                <div className="section-title">
                  <h2 className="text-anime-style-3" data-cursor="-opaque">
                    Oops! page not found
                  </h2>
                </div>
                <div className="error-page-content-body">
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    The page you are looking for does not exist.
                  </p>
                  <a className="btn-default wow fadeInUp" data-wow-delay="0.4s" href="/">
                    back to homepage
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
