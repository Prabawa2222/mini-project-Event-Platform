import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
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
