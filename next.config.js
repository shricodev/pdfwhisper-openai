/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.encoding = false;
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
