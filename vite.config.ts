// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  // allow passing a comma-separated list via VITE_ALLOWED_HOSTS or let Render inject RENDER_EXTERNAL_HOSTNAME
  const extraHosts = (process.env.VITE_ALLOWED_HOSTS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const renderHost = process.env.RENDER_EXTERNAL_HOSTNAME || "hostpilotpro.onrender.com";
  const allowedHosts = [
    "localhost",
    "127.0.0.1",
    ...extraHosts,
    ...(renderHost ? [renderHost] : []),
  ];

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      // only import replit plugin in non-production and when REPL_ID exists
      ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID
        ? [
            // dynamic import is inside the async function so await is safe
            (await import("@replit/vite-plugin-cartographer")).cartographer(),
          ]
        : []),
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
      // allow Vite dev-server to accept requests from your Render hostname
      allowedHosts,
      // when deploying inside containers (Render), host true lets Vite bind to 0.0.0.0
      host: true,
      // Keep strict fs to avoid reading dotfiles; change only if you need it.
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      // helpful HMR settings inside containers (optional)
      hmr: {
        protocol: "ws",
        host: renderHost || "localhost",
      },
    },
    // preview server uses same host rules
    preview: {
      host: true,
    },
  };
});
