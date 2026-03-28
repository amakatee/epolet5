// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
          port: '',
          pathname: '/images/**',
        },
      ],
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\/sanity\//,
        loader: 'ignore-loader',
      });
      return config;
    },
  }
  
  module.exports = nextConfig