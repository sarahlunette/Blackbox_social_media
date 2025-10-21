/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'api.blackbox.ai'],
  },
  env: {
    NEXT_PUBLIC_BLACKBOX_API_URL: process.env.NEXT_PUBLIC_BLACKBOX_API_URL || 'https://api.blackbox.ai',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
