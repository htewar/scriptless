import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrablob.uberinternal.com',
      },
      {
        protocol: 'http',
        hostname: '192.168.68.109'
      }
    ],
  },
  crossOrigin: 'anonymous',
};

export default nextConfig;
