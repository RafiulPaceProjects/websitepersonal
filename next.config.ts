import type { NextConfig } from "next";

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;

// GitHub Pages build (GITHUB_PAGES=true, set by .github/workflows/pages.yml):
// static export under /websitepersonal. Pages has no image server, so images
// ship as-is; local dev and other hosts keep the optimizer.
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/websitepersonal" : "";

const nextConfig: NextConfig = {
  ...(pages
    ? { output: "export" as const, basePath, trailingSlash: true }
    : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Fingerprinted delivery assets can be cached safely; Pages owns its headers.
  ...(!pages
    ? {
        headers: async () => [
          {
            source: "/media/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
        ],
      }
    : {}),
  images: {
    unoptimized: pages,
    formats: ["image/avif", "image/webp"],
    // 90 is for the hero card photo (4K upscale); everything else stays at 75.
    qualities: [75, 90],
    // Allow next/image to optimize stills served from the media CDN.
    remotePatterns: mediaBase
      ? [new URL(`${mediaBase.replace(/\/+$/, "")}/**`)]
      : [],
  },
};

export default nextConfig;
