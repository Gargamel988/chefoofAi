import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 1080, 2048],
    imageSizes: [32, 64, 96, 256],
    minimumCacheTTL: 14400,
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,

          framework: {
            name: "framework",
            chunks: "all",
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            enforce: true,
          },

          ai: {
            name: "ai-sdk",
            chunks: "async",
            test: /[\\/]node_modules[\\/](@ai-sdk|ai)[\\/]/,
            priority: 30,
          },

          ui: {
            name: "ui-libs",
            chunks: "all",
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority)[\\/]/,
            priority: 25,
          },

          graphics: {
            name: "graphics",
            chunks: "async",
            test: /[\\/]node_modules[\\/](ogl|three|@react-three)[\\/]/,
            priority: 22,
          },

          query: {
            name: "react-query",
            chunks: "all",
            test: /[\\/]node_modules[\\/](@tanstack)[\\/]/,
            priority: 21,
          },

          vendor: {
            name: "vendor",
            chunks: "all",
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },

          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            // 1 yıl cache, immutable çünkü fontlar hash ile versionlanmalı
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            // Statik dosyalar da 1 yıl cachelenir, hash ile yönetilir
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            // Resimler için 1 gün önbellek, sonra revalidate edilir
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            // API yanıtları için kısa önbellek süresi + stale-while-revalidate
            value: "public, s-maxage=60, stale-while-revalidate=120",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
