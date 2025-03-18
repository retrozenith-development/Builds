/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Use standalone output for Docker deployment
   */
  output: 'standalone',

  /**
   * Disable server-based image optimization
   */
  images: {
    unoptimized: true,
  },

  /**
   * Disable source maps in production for better performance
   */
  productionBrowserSourceMaps: false,
};

export default nextConfig; 