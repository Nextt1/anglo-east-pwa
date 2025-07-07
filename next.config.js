const withPWA = require("next-pwa")({
  dest: "public",
  buildExcludes: [/app-build-manifest\.json$/],
  cacheStartUrl: true,
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^blob:/,
      handler: "CacheFirst",
      options: { cacheName: "captures" },
    },
    {
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
