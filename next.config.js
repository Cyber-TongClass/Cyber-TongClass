/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a standalone build output so Docker can copy the standalone server
  // into the final image (creates `.next/standalone`).
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
  typescript: {
    // Ignore TypeScript errors in production builds
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
