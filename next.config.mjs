import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/faqs",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mydrprime.com" }],
        destination: "https://mydrprime.com/:path*",
        permanent: true,
      },
      { source: "/pillow", destination: "/product", permanent: true },
      { source: "/faq", destination: "/faqs", permanent: true },
      { source: "/pages/pillow", destination: "/product", permanent: true },
      { source: "/pages/faq", destination: "/faqs", permanent: true },
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/pages/sleep-guide", destination: "/sleep-guide", permanent: true },
    ];
  },
};

export default nextConfig;
