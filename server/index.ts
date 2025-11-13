// server/index.ts
import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { serveStatic, setupVite, log as viteLog } from "./vite";
import { storage } from "./storage";
import { registerRoutes } from "./routes";

// ESM-safe __filename / __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  const app = express();
  const server = http.createServer(app);

  // common middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // IMPORTANT: Add no-cache middleware for API routes early so conditional requests
  // won't return 304 for JSON endpoints. This applies to all routes beginning with /api.
  app.use("/api", (req, res, next) => {
    // Strong no-cache that prevents browser / proxy from returning 304.
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  });

  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    // DEV: register app routes first (so /api routes are resolved before Vite middleware),
    // then mount Vite middleware. This prevents dev middleware from intercepting API calls.
    try {
      await registerRoutes(app);
      viteLog?.("[startup] API routes registered (dev).");

      // dynamic import so bundlers won't include Vite in prod build
      const viteModule = await import("./vite");
      await viteModule.setupVite(app as any, server as any);
      viteModule.log("[startup] Running in DEV mode — Vite middleware mounted.");
    } catch (err) {
      console.error("[startup] DEV startup error:", (err as Error).message);
    }
  } else {
    // PROD: register API routes first, then serve the built static client.
    try {
      const root = path.resolve(process.cwd());
      console.log("[startup] cwd:", root);

      // register routes before static serving — prevents static middleware from
      // intercepting /api/* and introducing caching/304 behavior.
      await registerRoutes(app);
      console.log("[startup] API routes registered");

      // serve built client (throws if build assets can't be found)
      await serveStatic(app);
      console.log("[startup] Running in PROD mode — serving static build.");
    } catch (err) {
      console.error("[startup] Failed to start (prod):", (err as Error).message);
      // Re-throw so the process exits (so Render shows a failed deploy) — comment out
      // if you prefer to continue in API-only mode when static build is missing.
      throw err;
    }
  }

  // start http server
  server.listen(PORT, () => {
    console.log(`[startup] Server listening on port ${PORT} (dev=${isDev})`);
  });

  // graceful shutdown handlers
  process.on("SIGINT", () => process.exit(0));
  process.on("SIGTERM", () => process.exit(0));
}

start().catch((err) => {
  console.error("[startup] Fatal error:", err);
  process.exit(1);
});
