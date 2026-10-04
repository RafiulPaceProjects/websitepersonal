import type { NextConfig } from "next";

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow next/image to optimize stills served from the media CDN.
    remotePatterns: mediaBase ? [new URL(`${mediaBase.replace(/\/+$/, "")}/**`)] : [],
  },
};

export default nextConfig;
