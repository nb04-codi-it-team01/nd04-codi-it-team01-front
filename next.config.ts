import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 이미지 테스트를 위한 외부 이미지 도메인 허용
      },
      {
        protocol: "http",
        hostname: "localhost", // 이미지 테스트를 위한 임시 이미지 도메인 허용
        port: "3001",
      },
    ],
  },
};

export default nextConfig;
