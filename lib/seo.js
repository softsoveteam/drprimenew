import {
  FAQS,
  GALLERY_IMAGES,
  PRODUCT_FAQS,
  PRODUCT_PAGE_REVIEWS,
  TESTIMONIAL_REVIEWS,
  faqAnswerText,
} from "@/lib/content";

export const SITE_URL = "https://mydrprime.com";
export const SITE_NAME = "Dr.Prime Pillow";
export const SITE_EMAIL = "info@mydrprime.com";
export const SUPPORT_EMAIL = "support@mydrprime.com";
export const BRAND_COLOR = "#1d1c50";
export const OG_IMAGE = "/assets/slider-pillow.png";
export const LOGO_PATH = "/assets/logo.png";
export const AMAZON_URL = "https://www.amazon.com/dp/B0GX59F5BG";
export const AMAZON_ASIN = "B0GX59F5BG";
export const PRODUCT_PRICE = "39.99";
export const PRODUCT_CURRENCY = "USD";

export const SOCIAL_LINKS = [
  "https://www.instagram.com/drprime.store/",
  "https://www.linkedin.com/company/mydrprime/",
  "https://www.pinterest.com/mydrprime/",
  "https://x.com/mydrprime/",
  "https://www.trustpilot.com/review/mydrprime.com",
  AMAZON_URL,
];

export const pages = {
  home: {
    path: "/",
    title: "Dr.Prime Pillow | Orthopedic Pillow for Neck Pain Relief",
    description:
      "Sleep on the PrimeHeal orthopedic memory foam pillow. Cervical neck support, cooling cover, CertiPUR-US foam, and a 30-night trial. Wake up without the ache.",
    keywords: [
      "orthopedic pillow for neck pain",
      "best pillow for neck pain",
      "memory foam orthopedic pillow",
      "cervical neck support",
      "Dr.Prime Pillow",
    ],
    ogType: "website",
    changeFrequency: "weekly",
    priority: 1,
    summary:
      "Dr.Prime Pillow homepage for the PrimeHeal orthopedic memory foam pillow and neck pain relief.",
  },
  product: {
    path: "/product",
    title: "PrimeHeal Cervical Neck Support Pillow | Dr.Prime Pillow",
    description:
      "Buy the PrimeHeal cervical pillow: 60D memory foam, shoulder cutouts, cooling washable cover. For side and back sleepers. CertiPUR-US and OEKO-TEX. Shop on Amazon.",
    keywords: [
      "cervical neck support pillow",
      "memory foam cervical pillow",
      "side sleeper pillow for neck pain",
      "contour orthopedic pillow",
      "PrimeHeal",
    ],
    ogType: "website",
    changeFrequency: "weekly",
    priority: 1,
    summary:
      "Product page for the PrimeHeal cervical neck support pillow, specs, colors, and Amazon checkout.",
  },
  testimonials: {
    path: "/testimonials",
    title: "PrimeHeal Pillow Reviews from Real Sleepers | Dr.Prime Pillow",
    description:
      "Read customer reviews of the Dr.Prime Pillow PrimeHeal orthopedic pillow — neck support, cooling cover, and all-night alignment for side and back sleepers.",
    keywords: [
      "orthopedic pillow reviews",
      "PrimeHeal reviews",
      "Dr.Prime Pillow reviews",
      "cervical pillow customer reviews",
    ],
    ogType: "website",
    changeFrequency: "weekly",
    priority: 0.7,
    summary: "Verified-buyer style reviews of the PrimeHeal orthopedic pillow.",
  },
  gallery: {
    path: "/image-gallery",
    title: "PrimeHeal Pillow Photo Gallery | Dr.Prime Pillow",
    description:
      "See the PrimeHeal orthopedic cervical pillow in Sky Blue and Cool Gray — contour, cooling cover, and real sleep setups.",
    keywords: [
      "Dr.Prime Pillow photos",
      "PrimeHeal gallery",
      "cervical pillow Sky Blue",
      "cervical pillow Cool Gray",
    ],
    ogType: "website",
    changeFrequency: "monthly",
    priority: 0.6,
    summary: "Photo gallery of PrimeHeal in Sky Blue and Cool Gray.",
  },
  faqs: {
    path: "/faqs",
    title: "Cervical Pillow FAQs, Care & Sleep Tips | Dr.Prime Pillow",
    description:
      "Answers on 60D foam, CertiPUR-US, OEKO-TEX, washing the cover, first-week soreness, and how to use the Dr.Prime Pillow cervical pillow.",
    keywords: [
      "how to use a cervical pillow",
      "how to wash memory foam pillow cover",
      "CertiPUR-US pillow",
      "Dr.Prime Pillow FAQs",
    ],
    ogType: "website",
    changeFrequency: "monthly",
    priority: 0.8,
    summary:
      "FAQs covering foam density, certifications, care instructions, and first-week adjustment.",
  },
  contact: {
    path: "/contact",
    title: "Contact Dr.Prime Pillow | Pillow Support in 24 Hours",
    description:
      "Questions about neck pain, sleep position, or your PrimeHeal pillow? Email the Dr.Prime Pillow team — we reply within 24 hours.",
    keywords: [
      "contact Dr.Prime Pillow",
      "Dr.Prime Pillow support",
      "PrimeHeal customer care",
      "orthopedic pillow help",
    ],
    ogType: "website",
    changeFrequency: "yearly",
    priority: 0.5,
    summary: "Contact form and support email for Dr.Prime Pillow questions.",
  },
  sleepGuide: {
    path: "/sleep-guide",
    title: "The Ultimate Sleep Posture & Pillow Guide | Dr.Prime Pillow",
    description:
      "Learn sleep posture, PrimeHeal pillow unboxing, cooling tips, care instructions, and daily cervical habits for better nights without neck pain.",
    keywords: [
      "sleep posture guide",
      "cervical pillow how to use",
      "pillow care instructions",
      "side sleeper pillow guide",
      "Dr.Prime Sleep Guide",
    ],
    ogType: "article",
    changeFrequency: "monthly",
    priority: 0.7,
    summary:
      "Sleep guide covering unboxing, sleep positions, temperature, pillow care, and cervical habits.",
  },
  notFound: {
    path: "/404",
    title: "Page Not Found | Dr.Prime Pillow",
    description: "This Dr.Prime Pillow page does not exist. Return home to shop the PrimeHeal orthopedic pillow.",
    keywords: ["Dr.Prime Pillow 404"],
    ogType: "website",
  },
};

export const sitemapEntries = [
  pages.home,
  pages.product,
  pages.faqs,
  pages.testimonials,
  pages.gallery,
  pages.contact,
  pages.sleepGuide,
];

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata(key) {
  const page = pages[key];
  const url = absoluteUrl(page.path);
  const images = [
    {
      url: OG_IMAGE,
      width: 1200,
      height: 630,
      alt: "Dr.Prime Pillow PrimeHeal orthopedic cervical pillow",
    },
  ];

  return {
    title: { absolute: page.title },
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: page.ogType || "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [OG_IMAGE],
    },
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(LOGO_PATH),
    },
    email: SUPPORT_EMAIL,
    sameAs: SOCIAL_LINKS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: SUPPORT_EMAIL,
        contactType: "customer service",
        availableLanguage: "English",
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: pages.home.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

export function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function reviewNodes(reviews, itemUrl) {
  return reviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.name,
    },
    name: review.title || `Review by ${review.name}`,
    reviewBody: review.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    itemReviewed: {
      "@type": "Product",
      name: "Dr.Prime Pillow PrimeHeal Orthopedic Pillow",
      url: itemUrl,
    },
  }));
}

function faqEntities(faqs) {
  return faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faqAnswerText(faq),
    },
  }));
}

export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: pages.home.title,
        description: pages.home.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
      breadcrumbSchema([{ name: "Home", path: "/" }]),
    ],
  };
}

export function productSchema() {
  const productUrl = absoluteUrl(pages.product.path);
  const images = [
    absoluteUrl("/assets/slider-pillow.png"),
    absoluteUrl("/assets/sky-blue/01.jpg"),
    absoluteUrl("/assets/cool-gray/01.jpeg"),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: "Dr.Prime Pillow PrimeHeal Orthopedic Pillow",
        image: images,
        description: pages.product.description,
        sku: AMAZON_ASIN,
        mpn: AMAZON_ASIN,
        asin: AMAZON_ASIN,
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
        material: "60D CertiPUR-US certified memory foam",
        color: ["Sky Blue", "Cool Gray"],
        size: "63 x 36 x 12 cm",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Foam density",
            value: "60D",
          },
          {
            "@type": "PropertyValue",
            name: "Fill weight",
            value: "1259g",
          },
          {
            "@type": "PropertyValue",
            name: "Certifications",
            value: "CertiPUR-US, OEKO-TEX Standard 100",
          },
        ],
        offers: {
          "@type": "Offer",
          url: AMAZON_URL,
          priceCurrency: PRODUCT_CURRENCY,
          price: PRODUCT_PRICE,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        },
        review: reviewNodes(PRODUCT_PAGE_REVIEWS, productUrl),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqEntities(PRODUCT_FAQS),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Pillow", path: pages.product.path },
      ]),
    ],
  };
}

export function testimonialsSchema() {
  const url = absoluteUrl(pages.testimonials.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: pages.testimonials.title,
        description: pages.testimonials.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      ...reviewNodes(TESTIMONIAL_REVIEWS, absoluteUrl(pages.product.path)),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Testimonials", path: pages.testimonials.path },
      ]),
    ],
  };
}

export function gallerySchema() {
  const url = absoluteUrl(pages.gallery.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageGallery",
        "@id": `${url}#gallery`,
        url,
        name: pages.gallery.title,
        description: pages.gallery.description,
        image: GALLERY_IMAGES.map((image) => ({
          "@type": "ImageObject",
          contentUrl: absoluteUrl(image.src),
          url: absoluteUrl(image.src),
          name: image.alt,
          description: image.alt,
        })),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Gallery", path: pages.gallery.path },
      ]),
    ],
  };
}

export function faqsSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqEntities(FAQS),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "FAQs", path: pages.faqs.path },
      ]),
    ],
  };
}

export function contactSchema() {
  const url = absoluteUrl(pages.contact.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${url}#contact`,
        url,
        name: pages.contact.title,
        description: pages.contact.description,
        mainEntity: organizationSchema(),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: pages.contact.path },
      ]),
    ],
  };
}

export function sleepGuideSchema() {
  const url = absoluteUrl(pages.sleepGuide.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        headline: pages.sleepGuide.title,
        name: pages.sleepGuide.title,
        description: pages.sleepGuide.description,
        author: organizationSchema(),
        publisher: organizationSchema(),
        mainEntityOfPage: url,
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Sleep Guide", path: pages.sleepGuide.path },
      ]),
    ],
  };
}

export function llmsTxt() {
  const pageList = sitemapEntries
    .map((page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.summary}`)
    .join("\n");

  return `# Dr.Prime Pillow

> Premium orthopedic memory foam pillows designed for cervical neck support, spinal alignment, and cooler sleep.

Dr.Prime Pillow makes the PrimeHeal orthopedic cervical pillow for side, back, and stomach sleepers. The brand sells direct-to-consumer and on Amazon.

## Product

- Name: PrimeHeal Orthopedic Cervical Pillow
- Brand: Dr.Prime Pillow
- Amazon ASIN: ${AMAZON_ASIN}
- Buy: ${AMAZON_URL}
- Price: $${PRODUCT_PRICE} USD
- Size: 63 x 36 x 12 cm
- Foam fill weight: about 1259g
- Core: 60D high-density CertiPUR-US memory foam
- Cover: 90% nylon / 10% spandex cooling stretch top, 100% polyester base, zipper, machine-washable
- Certifications: CertiPUR-US foam, OEKO-TEX Standard 100 cover, ISPA recognition
- Colors: Sky Blue, Cool Gray
- Trial: 30-night free trial
- Features: shoulder relief cutouts, cooling breathable cover, contour for all sleep positions

## Pages

${pageList}

## Contact

- Support: ${SUPPORT_EMAIL}
- Info: ${SITE_EMAIL}
- Reply time: within 24 hours, 7 days a week
- Instagram: https://www.instagram.com/drprime.store/
- LinkedIn: https://www.linkedin.com/company/mydrprime/
- Pinterest: https://www.pinterest.com/mydrprime/
- X: https://x.com/mydrprime/

## Optional

- Full FAQ and review excerpts: ${SITE_URL}/llms-full.txt
`;
}

export function llmsFullTxt() {
  const faqBlock = FAQS.map(
    (faq) => `### ${faq.q}\n\n${faqAnswerText(faq)}`
  ).join("\n\n");
  const productFaqBlock = PRODUCT_FAQS.map(
    (faq) => `### ${faq.q}\n\n${faq.a}`
  ).join("\n\n");

  return `${llmsTxt()}

## Product FAQs

${productFaqBlock}

## Site FAQs

${faqBlock}
`;
}
