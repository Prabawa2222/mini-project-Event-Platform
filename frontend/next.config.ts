import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    domains: ["vufsmvgbcvvegtgdefit.supabase.co"],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "vufsmvgbcvvegtgdefit.supabase.co",
      port: "",
      pathname: "/storage/v1/object/**",
    },
  ],
};

export default nextConfig;
