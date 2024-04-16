/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.encoding = false;
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      // Allow images from the googleusercontent.com domain and all its subdomains.
      // This is for rendering user google profile images.
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

module.exports = nextConfig;
