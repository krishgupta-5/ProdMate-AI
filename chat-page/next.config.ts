/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*"],
  experimental: {
    // Enables unauthorized() and app/unauthorized.tsx: signed-out visits to protected pages get
    // the custom 401 page (with a real 401 status) instead of a silent redirect.
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
      {
        protocol: "https",
        hostname: "cloud.gmelius.com",
      }
    ],
  },
};

module.exports = nextConfig;
