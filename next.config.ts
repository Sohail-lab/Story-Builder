import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // domains: ['your-image-domain.com'], // Add if using external images
  },
};

export default nextConfig;
