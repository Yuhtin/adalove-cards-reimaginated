/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Configure the development server to run on port 3001
  async rewrites() {
    return []
  },
}

module.exports = nextConfig
