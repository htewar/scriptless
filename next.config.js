/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'terrablob.uberinternal.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7777',
      }
    ],
  },
}

module.exports = nextConfig 