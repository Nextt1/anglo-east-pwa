const withPWA = require("next-pwa")({
  dest: "public",
  buildExcludes: [/app-build-manifest\.json$/], // ⬅ remove from precache
  cacheStartUrl: true,
  // disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^blob:/,
      handler: "CacheFirst",
      options: { cacheName: "captures" },
    },
    {
      /* every HTML navigation after the first load */
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: { cacheName: "pages", networkTimeoutSeconds: 3 },
    },
  ],
});

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  reactStrictMode: true,
});
