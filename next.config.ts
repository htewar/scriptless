import type {NextConfig} from 'next';

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
      },
      {
        protocol: 'http',
        hostname: '172.19.10.55'
      }
    ],
  },
};

export default nextConfig;