import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
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
