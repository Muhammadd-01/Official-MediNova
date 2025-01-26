import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import compression from "vite-plugin-compression"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import ViteSitemapPlugin  from "vite-plugin-sitemap"

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    ViteImageOptimizer({
      jpg: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 80,
      },
    }),
    ViteSitemapPlugin({
      hostname: "https://www.medicare.com",
      routes: [
        "/",
        "/medicine-suggestion",
        "/consultation",
        "/feedback",
        "/contact",
        "/articles",
        "/news",
        // Add more routes as needed
      ],
    }),
  ],
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})

