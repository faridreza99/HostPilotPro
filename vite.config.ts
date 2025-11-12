// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  // Allow Render + local domains
  const renderHost = process.env.RENDER_EXTERNAL_HOSTNAME || "hostpilotpro.onrender.com";
  const allowedHosts = [
    "localhost",
    "127.0.0.1",
    "hostpilotpro.onrender.com",
    renderHost,
  ];

  // Optional: dynamically import Replit plugin only if needed
  const replitPlugin =
    process.env.NODE_ENV !== "production" && process.env.REPL_ID
      ? [(await import("@replit/vite-plugin-cartographer")).cartographer()]
      : [];

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...replitPlugin,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            utils: ["lodash", "date-fns"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      minify: "esbuild",
      target: "esnext",
    },
    server: {
      host: true, // allow external connections in container
      allowedHosts, // ✅ fix for Render
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      hmr: {
        protocol: "ws",
        host: renderHost,
      },
    },
    preview: {
      host: true,
      allowedHosts,
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
    envPrefix: "VITE_",
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
  };
});
