import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function originFrom(value, fallback) {
  try {
    return new URL(value).origin;
  } catch {
    return fallback;
  }
}

const apiOrigin = originFrom(process.env.NEXT_PUBLIC_API_URL, "http://192.168.1.30:8000");
const mediaOrigin = originFrom(process.env.NEXT_PUBLIC_MEDIA_URL, "http://192.168.1.30:8000");
const corsOrigins = [...new Set([apiOrigin, mediaOrigin])];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: [...new Set(corsOrigins.map((origin) => new URL(origin).hostname))],
  images: {
    unoptimized: true,
  },
  async headers() {
    const corsHeaders = [
      { key: "Access-Control-Allow-Origin", value: apiOrigin },
      { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS" },
      { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Accept" },
      { key: "Access-Control-Allow-Credentials", value: "true" },
    ];

    return [
      {
        source: "/:path*",
        headers: corsHeaders,
      },
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
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/images/favicon.png" }];
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
