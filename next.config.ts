// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash:8][ext]',
      },
    });

    return config;
  },
  
  // Tambahkan konfigurasi Turbopack kosong untuk menghilangkan peringatan
  experimental: {
    turbo: {}
  }
};

export default nextConfig;