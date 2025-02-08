import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import compression from "vite-plugin-compression"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import ViteSitemapPlugin from "vite-plugin-sitemap"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    define: {
      "process.env.VITE_GEMINI_API_KEY": JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
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
        dynamicRoutes: ["/", "/medicine-suggestion", "/consultation", "/feedback", "/contact", "/articles", "/news"],
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
  }
})

