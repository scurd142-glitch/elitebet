import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {},
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
