import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "51.79.146.203",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "51.79.146.203",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "51.79.146.203",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "51.79.146.203",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.quizzy.it.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*.quizzy.it.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
