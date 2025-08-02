import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/pages": resolve(__dirname, "./src/pages"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/store": resolve(__dirname, "./src/store"),
      "@/utils": resolve(__dirname, "./src/utils"),
      "@/types": resolve(__dirname, "./src/types"),
      "@/constants": resolve(__dirname, "./src/constants"),
    },
  },
})
