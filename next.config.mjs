import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "calm-mongoose-579.convex.cloud" }],
  },
};

export default nextConfig;
