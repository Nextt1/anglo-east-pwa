const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',   // dev server skips SW
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^blob:.*/,             // cache captured images
      handler: 'CacheFirst',
      options: { cacheName: 'captures' },
    },
  ],
});

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  reactStrictMode: true,
});
