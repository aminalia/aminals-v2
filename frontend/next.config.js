/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // Handle ES modules in workers
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      type: 'javascript/auto',
    });

    // Configure optimization to exclude worker files from Terser
    config.optimization.minimizer = config.optimization.minimizer.map(
      (plugin) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.exclude = /HeartbeatWorker\.js$/;
        }
        return plugin;
      }
    );

    return config;
  },
};

module.exports = nextConfig;
