import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'guillermo1999.blob.core.windows.net',
        port: '',
        pathname: '/million-images/**',
      },
    ],
  },
};

export default nextConfig;
