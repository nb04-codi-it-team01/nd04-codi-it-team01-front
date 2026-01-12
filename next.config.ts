import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "codiit-team1-images.s3.ap-northeast-2.amazonaws.com", // S3 버킷의 정확한 호스트네임
        port: "",
        pathname: "/**", // 버킷 내 모든 경로 허용
      },
      {
        protocol: "http",
        hostname: "**", // 이미지 테스트를 위한 임시 이미지 도메인 허용
        port: "3001",
      },
    ],
  },
};

export default nextConfig;
