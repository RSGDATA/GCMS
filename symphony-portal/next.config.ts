import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/GCMS' : '',
  images: {
    unoptimized: true,
  },
  // This is needed for GitHub Pages to work correctly
  trailingSlash: true,
};

export default nextConfig;
