import { BRAND_COLOR, pages } from "@/lib/seo";

export default function manifest() {
  return {
    name: "Dr.Prime Pillow",
    short_name: "Dr.Prime Pillow",
    description: pages.home.description,
    start_url: "/",
    display: "standalone",
    background_color: BRAND_COLOR,
    theme_color: BRAND_COLOR,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
