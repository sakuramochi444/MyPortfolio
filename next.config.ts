import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true, // Cloudflare Pages Image Optimization or just unoptimized for simplicity
  },
};

export default nextConfig;
