import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrablob.uberinternal.com',
      },
    ],
  },
};

export default nextConfig;
