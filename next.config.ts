import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Disable server-side file operations in strict mode for uploads
  serverExternalPackages: [],
};

export default nextConfig;
