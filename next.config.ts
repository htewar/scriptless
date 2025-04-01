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
        hostname: '192.168.68.102'
      },
      {
        protocol: 'http',
        hostname: '172.19.2.209'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ],
  },
};

export default nextConfig;