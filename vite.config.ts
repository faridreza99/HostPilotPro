// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: "esbuild",
    target: "esnext",
  },
  server: {
    host: true,
    port: Number(process.env.VITE_PORT || 5173),
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "hostpilotpro.onrender.com",
      process.env.RENDER_EXTERNAL_HOSTNAME || "hostpilotpro.onrender.com",
    ].filter(Boolean),
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
