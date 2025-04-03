import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrablob.uberinternal.com',
      },
      {
        protocol: 'https',
        hostname: 'terrablob-gateway.uberinternal.com',
      },
      {
        protocol: 'http',
        hostname: '172.19.10.51'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ],
  },
};

export default nextConfig;