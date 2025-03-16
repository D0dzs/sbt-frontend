/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sbt-backend-development.up.railway.app',
        port: '8080',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
  },
  env: {
    BACKEND_URL: 'https://sbt-backend-development.up.railway.app',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
