/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Set the base path for the application when deployed to GitHub Pages
  basePath: '',
  // Set the asset prefix for the application using the custom domain
  assetPrefix: 'https://cdn.zenyhosting.cloud',
  // This is important for GitHub Pages
  images: {
    unoptimized: true,
  },
  // Disable server components for static export
  experimental: {
    appDir: true,
  },
  // Trailing slash is recommended for static sites
  trailingSlash: true,
  // Ensure we're not generating sourcemaps in production for better performance
  productionBrowserSourceMaps: false,
  // Configure headers to improve security and caching
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
};

export default nextConfig; 