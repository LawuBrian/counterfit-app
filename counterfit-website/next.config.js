/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['static.wixstatic.com', 'localhost'],
    unoptimized: true,
    // Add your production domains here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.yourdomain.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
