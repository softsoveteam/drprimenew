import PageTicker from "@/components/PageTicker";
import JsonLd from "@/components/JsonLd";
import { GALLERY_IMAGES } from "@/lib/content";
import { gallerySchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("gallery");

export default function ImageGalleryPage() {
  return (
    <>
      <JsonLd data={gallerySchema()} />
      <div className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  Image Gallery
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Gallery
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTicker />
      <div className="page-gallery">
        <div className="container">
          <div className="row gallery-items page-gallery-box">
            {GALLERY_IMAGES.map((image, index) => (
              <div className="col-lg-4 col-6" key={image.src}>
                <div className="photo-gallery wow fadeInUp">
                  <a href={image.src} data-cursor-text="View">
                    <figure className="image-anime">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index < 3 ? "high" : "low"}
                      />
                    </figure>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
